import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { containsGermanMobileNumber } from './phone-privacy';

type WorkflowStep = {
  run?: string;
  uses?: string;
  with?: Record<string, unknown>;
};

type WorkflowJob = {
  needs?: string;
  permissions?: Record<string, string>;
  steps: WorkflowStep[];
};

type Workflow = {
  jobs: Record<string, WorkflowJob>;
  on: Record<string, unknown>;
  permissions: Record<string, string>;
};

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const approvedPublicBinaries = new Set([
  'public/Vittorio-Cai-CV-English.pdf',
]);

function readProjectFile(path: string): string {
  return readFileSync(`${projectRoot}/${path}`, 'utf8');
}

describe('repository maintenance contract', () => {
  it('documents the browser install required before local verification', () => {
    const readme = readProjectFile('README.md');
    const dependencyInstall = readme.indexOf('npm ci');
    const browserInstall = readme.indexOf('npx playwright install chromium');
    const verification = readme.indexOf('npm run verify');

    expect(dependencyInstall).toBeGreaterThan(-1);
    expect(browserInstall).toBeGreaterThan(dependencyInstall);
    expect(verification).toBeGreaterThan(browserInstall);
    expect(readme).toContain('npx playwright install --with-deps chromium');
  });

  it('grants Pages write and identity permissions only to deployment', () => {
    const workflow = parse(
      readProjectFile('.github/workflows/deploy.yml'),
    ) as Workflow;
    const { quality, build, deploy } = workflow.jobs;
    const actionUses = Object.values(workflow.jobs).flatMap((job) =>
      job.steps.flatMap((step) => (step.uses ? [step.uses] : [])),
    );

    expect(workflow.on).toEqual({
      push: { branches: ['main'] },
      workflow_dispatch: null,
    });
    expect(workflow.permissions).toEqual({ contents: 'read' });

    for (const job of [quality, build]) {
      expect(job.permissions?.pages).not.toBe('write');
      expect(job.permissions?.['id-token']).not.toBe('write');
    }

    expect(deploy.permissions).toEqual({
      contents: 'read',
      pages: 'write',
      'id-token': 'write',
    });
    expect(build.needs).toBe('quality');
    expect(deploy.needs).toBe('build');
    expect(actionUses).toEqual([
      'actions/checkout@v7',
      'actions/setup-node@v6',
      'actions/checkout@v7',
      'withastro/action@v6',
      'actions/deploy-pages@v5',
    ]);
    expect(JSON.stringify(workflow)).not.toContain('secrets.');
  });

  it('keeps every tracked text file free of German mobile numbers', () => {
    const trackedFiles = execFileSync('git', ['ls-files', '-z'], {
      cwd: projectRoot,
      encoding: 'utf8',
    })
      .split('\0')
      .filter(Boolean);

    for (const trackedFile of trackedFiles) {
      if (approvedPublicBinaries.has(trackedFile)) continue;

      const contents = readFileSync(join(projectRoot, trackedFile));

      if (contents.includes(0)) continue;

      expect(
        containsGermanMobileNumber(contents.toString('utf8')),
        `${trackedFile} must not contain a German mobile number`,
      ).toBe(false);
    }
  });
});
