import type { Snapshot } from '../domain/types';

export type LoadResult = { kind: 'loaded'; snapshot: Snapshot } | { kind: 'empty' }
  | { kind: 'invalid' | 'unsupported_version' | 'unavailable'; message: string };
export type StorageResult = { ok: true } | { ok: false; message: string };
export interface Repository {
  load(): Promise<LoadResult>;
  save(snapshot: Snapshot): Promise<StorageResult>;
  reset(): Promise<StorageResult>;
}
export type StorageState = { mode: 'ready' }
  | { mode: 'memory' | 'blocked'; reason: 'unavailable' | 'save_failed' | 'invalid' | 'unsupported_version'; message: string };
