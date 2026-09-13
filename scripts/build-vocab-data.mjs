import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const dir = new URL('./public/deutsch-woerter/', `file://${process.cwd()}/`);
const parts = Array.from({ length: 8 }, (_, i) =>
  readFileSync(new URL(`cards-mini-${String(i).padStart(2, '0')}.txt`, dir), 'utf8').trim(),
);
const compressed = Buffer.from(parts.join(''), 'base64');
const rows = JSON.parse(gunzipSync(compressed).toString('utf8'));
if (!Array.isArray(rows) || rows.length !== 5452) {
  throw new Error(`Vocabulary build failed: expected 5452 rows, got ${Array.isArray(rows) ? rows.length : 'invalid data'}`);
}
writeFileSync(new URL('cards.json', dir), JSON.stringify(rows));
console.log(`Generated public/deutsch-woerter/cards.json with ${rows.length} rows.`);

// Inject the spelling wrong-book feature at build time so the source learning module
// stays readable and the deployed PWA receives the feature as one same-origin script.
const learnUrl = new URL('learn.js', dir);
let learn = readFileSync(learnUrl, 'utf8');
if (!learn.includes('WRONGBOOK_ADDON_V1')) {
  const addon = readFileSync(new URL('wrongbook-addon.js', dir), 'utf8').trim();
  const replaceOnce = (source, from, to, label) => {
    if (!source.includes(from)) throw new Error(`Wrong-book patch failed: ${label}`);
    return source.replace(from, to);
  };

  learn = replaceOnce(
    learn,
    'const ok=!show&&LspellAccepted(c,v);Lrecord(c,ok,"spell")',
    'const ok=!show&&LspellAccepted(c,v);LwrongSpellResult(c,v,show,ok);Lrecord(c,ok,"spell")',
    'spelling hook',
  );
  learn = replaceOnce(
    learn,
    '{version:3,exportedAt:new Date().toISOString(),quizProgress:progress,learnProgress}',
    '{version:4,exportedAt:new Date().toISOString(),quizProgress:progress,learnProgress,spellingWrongBook:wrongBook}',
    'backup export',
  );
  learn = replaceOnce(
    learn,
    'learnProgress=d.learnProgress||{}}else{',
    'learnProgress=d.learnProgress||{};if(d.spellingWrongBook&&typeof d.spellingWrongBook==="object")wrongBook=d.spellingWrongBook}else{',
    'backup import',
  );
  learn = replaceOnce(
    learn,
    'localStorage.setItem(LEARN_KEY,JSON.stringify(learnProgress));stats();',
    'localStorage.setItem(LEARN_KEY,JSON.stringify(learnProgress));localStorage.setItem(WRONG_KEY,JSON.stringify(wrongBook));stats();',
    'wrong-book persistence after import',
  );
  learn = replaceOnce(
    learn,
    'LbuildShell();Lready();',
    `${addon}\nLbuildShell();LinitWrongBookUI();Lready();`,
    'module initialization',
  );
  writeFileSync(learnUrl, learn);
  console.log('Injected spelling wrong-book into public/deutsch-woerter/learn.js.');
}
