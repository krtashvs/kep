/**
 * Browser storage can throw (private mode, blocked site data) or be empty.
 * Every access goes through these helpers so the page never breaks on it.
 */
const PREFIX = "rizz-academy:";

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — state simply won't persist */
  }
}
