export function getSafeExternalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length === 0) return undefined;
  if (value.trim() !== value) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(value)) return undefined;
  if (!/^https?:\/\/[^/]/i.test(value)) return undefined;

  try {
    const url = new URL(value);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return undefined;
    }
    if (!url.hostname || url.username || url.password) return undefined;

    return value;
  } catch {
    return undefined;
  }
}

type ExternalProjectAction = 'demo' | 'source';

type ProjectActions = Partial<Record<ExternalProjectAction, unknown>>;

export function getSafeProjectAction(
  actions: ProjectActions,
  action: ExternalProjectAction,
): string | undefined {
  return getSafeExternalUrl(actions[action]);
}
