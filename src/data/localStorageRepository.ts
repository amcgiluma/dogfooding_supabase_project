import { isSnapshot } from './validation';
import type { LoadResult, Repository, StorageResult } from './repository';
import type { Snapshot } from '../domain/types';

export const STORAGE_KEY = 'companions-prototype:v1';
type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export function decodeSnapshot(raw: string): LoadResult {
  let value: unknown;
  try { value = JSON.parse(raw) as unknown; }
  catch { return { kind: 'invalid', message: 'Saved demo data is not valid JSON. Reset the demo to start over.' }; }
  if (typeof value === 'object' && value !== null && 'schemaVersion' in value) {
    const version: unknown = Reflect.get(value, 'schemaVersion');
    if (typeof version === 'number' && version !== 1) return { kind: 'unsupported_version', message: 'Saved demo data uses an unsupported version. Reset the demo to continue.' };
  }
  return isSnapshot(value) ? { kind: 'loaded', snapshot: value } : { kind: 'invalid', message: 'Saved demo data is incomplete or malformed. Reset the demo to start over.' };
}

export function createLocalStorageRepository(storage: StoragePort): Repository {
  return {
    async load() {
      try {
        const raw = storage.getItem(STORAGE_KEY);
        return raw === null ? { kind: 'empty' } : decodeSnapshot(raw);
      } catch {
        return { kind: 'unavailable', message: 'Browser storage is unavailable. Changes can stay in memory for now.' };
      }
    },
    async save(snapshot: Snapshot): Promise<StorageResult> {
      try { storage.setItem(STORAGE_KEY, JSON.stringify(snapshot)); return { ok: true }; }
      catch { return { ok: false, message: 'Could not save in browser storage. Your latest changes are still available in memory.' }; }
    },
    async reset(): Promise<StorageResult> {
      try { storage.removeItem(STORAGE_KEY); return { ok: true }; }
      catch { return { ok: false, message: 'Could not remove saved demo data.' }; }
    }
  };
}

export function createUnavailableRepository(): Repository {
  const unavailable = (): LoadResult => ({ kind: 'unavailable', message: 'Browser storage is unavailable. Changes can stay in memory for now.' });
  return {
    async load() { return unavailable(); },
    async save() { return { ok: false, message: 'Browser storage is unavailable. Changes can stay in memory for now.' }; },
    async reset() { return { ok: false, message: 'Browser storage is unavailable.' }; }
  };
}

export function getBrowserRepository(): Repository {
  try {
    if (typeof window === 'undefined') return createUnavailableRepository();
    const storage = window.localStorage;
    return createLocalStorageRepository(storage);
  } catch { return createUnavailableRepository(); }
}
