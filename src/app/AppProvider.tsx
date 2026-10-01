import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { applyAction, type DomainAction } from '../domain/actions';
import { createInitialSnapshot } from '../domain/seeds';
import { getMission } from '../domain/selectors';
import type { ActionResult, Appearance, ConversationScope, MissionInput, OnboardingInput, Runtime, Snapshot } from '../domain/types';
import { getBrowserRepository } from '../data/localStorageRepository';
import type { Repository, StorageState } from '../data/repository';
import type { View } from './navigation';

export interface AppActions {
  completeOnboarding(input: OnboardingInput): Promise<ActionResult<{ companionId: string }>>;
  createCompanion(input: { name: string; appearance: Appearance }): Promise<ActionResult<{ companionId: string }>>;
  renameCompanion(companionId: string, name: string): Promise<ActionResult>;
  setCompanionAppearance(companionId: string, appearance: Appearance): Promise<ActionResult>;
  createMission(companionId: string, input: MissionInput): Promise<ActionResult<{ missionId: string }>>;
  sendMessage(scope: ConversationScope, text: string): Promise<ActionResult>;
  pauseMission(companionId: string, missionId: string): Promise<ActionResult>;
  resumeMission(companionId: string, missionId: string): Promise<ActionResult>;
  editMissionGoal(companionId: string, missionId: string, objective: string): Promise<ActionResult>;
  decidePermission(companionId: string, missionId: string, gateId: string, decision: 'approve' | 'decline'): Promise<ActionResult>;
  confirmCompletion(companionId: string, missionId: string): Promise<ActionResult>;
  requestCorrections(companionId: string, missionId: string, text: string): Promise<ActionResult>;
  advanceDemo(companionId: string, missionId: string): Promise<ActionResult>;
  retryPersistence(): Promise<ActionResult>;
  resetDemo(): Promise<ActionResult>;
}
interface AppContextValue { snapshot: Snapshot; storage: StorageState; actions: AppActions; view: View; navigate(view: View): void; initializing: boolean }
interface AppProviderProps { children: ReactNode; repository?: Repository; runtime?: Runtime }
const Context = createContext<AppContextValue | null>(null);
const defaultRuntime: Runtime = {
  now: () => new Date().toISOString(),
  id: () => typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
};
const messageForUnavailable = 'Browser storage is unavailable. Changes can stay in memory for now.';
const makeMemoryState = (reason: 'unavailable' | 'save_failed', message: string): StorageState => ({ mode: 'memory', reason, message });
const failure = (code: 'invalid_transition' | 'storage_error', message: string): ActionResult => ({ ok: false, error: { code, message } });
const actionFailure = (result: Extract<ActionResult<Snapshot>, { ok: false }>): ActionResult => ({ ok: false, error: result.error });

export function AppProvider({ children, repository, runtime = defaultRuntime }: AppProviderProps) {
  const snapshotRef = useRef<Snapshot>(createInitialSnapshot());
  const storageRef = useRef<StorageState>(makeMemoryState('unavailable', messageForUnavailable));
  const initializingRef = useRef(true);
  const [snapshot, setSnapshot] = useState<Snapshot>(snapshotRef.current);
  const [storage, setStorage] = useState<StorageState>(storageRef.current);
  const [initializing, setInitializing] = useState(true);
  const [view, setView] = useState<View>({ kind: 'home' });
  const loadRef = useRef<Promise<void> | null>(null);
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());
  const repositoryRef = useRef(repository);
  const getRepository = useCallback(() => repositoryRef.current ?? getBrowserRepository(), []);
  const changeStorage = useCallback((next: StorageState) => { storageRef.current = next; setStorage(next); }, []);

  useEffect(() => {
    if (loadRef.current) return;
    loadRef.current = (async () => {
      let result;
      try { result = await getRepository().load(); }
      catch { result = { kind: 'unavailable' as const, message: messageForUnavailable }; }
      if (result.kind === 'loaded') {
        snapshotRef.current = result.snapshot;
        setSnapshot(result.snapshot);
        changeStorage({ mode: 'ready' });
      } else if (result.kind === 'empty') {
        const fresh = createInitialSnapshot();
        snapshotRef.current = fresh;
        setSnapshot(fresh);
        changeStorage({ mode: 'ready' });
      } else if (result.kind === 'unavailable') changeStorage(makeMemoryState('unavailable', result.message));
      else changeStorage({ mode: 'blocked', reason: result.kind, message: result.message });
      initializingRef.current = false;
      setInitializing(false);
    })();
  }, [changeStorage, getRepository]);

  const enqueue = useCallback(<T,>(operation: () => Promise<T>): Promise<T> => {
    const queued = queueRef.current.then(operation);
    queueRef.current = queued.then(() => undefined, () => undefined);
    return queued;
  }, []);

  const perform = useCallback((action: DomainAction): Promise<ActionResult> => enqueue(async () => {
    if (initializingRef.current) return failure('invalid_transition', 'The demo is still loading.');
    const result = applyAction(snapshotRef.current, action, runtime);
    if (!result.ok) return actionFailure(result);
    snapshotRef.current = result.value;
    setSnapshot(result.value);
    if (storageRef.current.mode === 'blocked') return { ok: true, value: undefined };
    let saved;
    try { saved = await getRepository().save(result.value); }
    catch { saved = { ok: false as const, message: 'Could not save in browser storage.' }; }
    changeStorage(saved.ok ? { mode: 'ready' } : makeMemoryState('save_failed', saved.message));
    return { ok: true, value: undefined };
  }), [changeStorage, enqueue, getRepository, runtime]);

  const actions = useMemo<AppActions>(() => ({
    completeOnboarding: async (input) => {
      const companionId = runtime.id();
      const result = await perform({ type: 'completeOnboarding', input, companionId });
      return result.ok ? { ok: true, value: { companionId } } : result;
    },
    createCompanion: async (input) => {
      const companionId = runtime.id();
      const result = await perform({ type: 'createCompanion', companion: { ...input, companionId } });
      return result.ok ? { ok: true, value: { companionId } } : result;
    },
    renameCompanion: (companionId, name) => perform({ type: 'renameCompanion', companionId, name }),
    setCompanionAppearance: (companionId, appearance) => perform({ type: 'setCompanionAppearance', companionId, appearance }),
    createMission: async (companionId, input) => {
      const missionId = runtime.id();
      const result = await perform({ type: 'createMission', mission: { companionId, missionId, input } });
      return result.ok ? { ok: true, value: { missionId } } : result;
    },
    sendMessage: (scope, text) => perform({ type: 'sendMessage', scope, text }),
    pauseMission: (companionId, missionId) => perform({ type: 'pauseMission', companionId, missionId }),
    resumeMission: (companionId, missionId) => perform({ type: 'resumeMission', companionId, missionId }),
    editMissionGoal: (companionId, missionId, objective) => perform({ type: 'editMissionGoal', companionId, missionId, objective }),
    decidePermission: (companionId, missionId, gateId, decision) => perform({ type: 'decidePermission', companionId, missionId, gateId, decision }),
    confirmCompletion: (companionId, missionId) => perform({ type: 'confirmCompletion', companionId, missionId }),
    requestCorrections: (companionId, missionId, text) => perform({ type: 'requestCorrections', companionId, missionId, text }),
    advanceDemo: (companionId, missionId) => perform({ type: 'advanceDemo', companionId, missionId }),
    retryPersistence: () => enqueue(async () => {
      if (initializingRef.current) return failure('invalid_transition', 'The demo is still loading.');
      if (storageRef.current.mode === 'blocked') return failure('storage_error', 'Reset the invalid saved data before retrying storage.');
      let saved;
      try { saved = await getRepository().save(snapshotRef.current); }
      catch { saved = { ok: false as const, message: 'Could not save in browser storage.' }; }
      if (!saved.ok) { changeStorage(makeMemoryState('save_failed', saved.message)); return failure('storage_error', saved.message); }
      changeStorage({ mode: 'ready' });
      return { ok: true, value: undefined };
    }),
    resetDemo: () => enqueue(async () => {
      if (initializingRef.current) return failure('invalid_transition', 'The demo is still loading.');
      let cleared;
      try { cleared = await getRepository().reset(); }
      catch { cleared = { ok: false as const, message: 'Could not remove saved demo data.' }; }
      if (!cleared.ok) {
        if (storageRef.current.mode !== 'blocked') changeStorage(makeMemoryState('save_failed', cleared.message));
        return failure('storage_error', cleared.message);
      }
      const fresh = createInitialSnapshot();
      snapshotRef.current = fresh;
      setSnapshot(fresh);
      changeStorage({ mode: 'ready' });
      setView({ kind: 'home' });
      return { ok: true, value: undefined };
    })
  }), [changeStorage, enqueue, getRepository, perform, runtime]);

  const navigate = useCallback((next: View) => {
    if (next.kind === 'home') { setView(next); return; }
    if (!snapshotRef.current.companions.some((item) => item.id === next.companionId)) { setView({ kind: 'home' }); return; }
    if (next.missionId && !getMission(snapshotRef.current, next.companionId, next.missionId)) { setView({ kind: 'home' }); return; }
    setView(next);
  }, []);
  const value = useMemo(() => ({ snapshot, storage, actions, view, navigate, initializing }), [snapshot, storage, actions, view, navigate, initializing]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(Context);
  if (!value) throw new Error('useApp must be used inside AppProvider.');
  return value;
}
