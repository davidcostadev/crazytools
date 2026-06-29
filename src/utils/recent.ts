const RECENT_KEY = 'commandPalette.recent';
const RECENT_MAX = 8;

export const readRecent = (): string[] => {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p === 'string') : [];
  } catch {
    return [];
  }
};

export const writeRecent = (paths: string[]) => {
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(paths));
};

export const pushRecent = (path: string): string[] => {
  const next = [path, ...readRecent().filter((p) => p !== path)].slice(0, RECENT_MAX);
  writeRecent(next);
  return next;
};
