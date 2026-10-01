import { useEffect, useRef, useState, type RefObject } from 'react';
import { getCompanion, getCompanionMissions } from '../domain/selectors';
import type { Mission } from '../domain/types';
import { Home } from '../features/home/Home';
import { MissionDetail } from '../features/mission/MissionDetail';
import { Onboarding } from '../features/onboarding/Onboarding';
import { Workspace } from '../features/workspace/Workspace';
import './app.css';
import { useApp } from './AppProvider';

function statusLabel(mission: Mission): string {
  switch (mission.status) {
    case 'active': return 'Active';
    case 'waiting_permission': return 'Permission needed';
    case 'paused': return 'Paused';
    case 'awaiting_review': return 'Ready for review';
    case 'completed': return 'Complete';
  }
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onCreateMission: () => void;
  onReset: () => void;
  trigger: RefObject<HTMLButtonElement | null>;
}

function SidebarContent({ onClose, onCreateMission, onReset }: Omit<SidebarProps, 'open' | 'trigger'>) {
  const { snapshot, view, navigate } = useApp();
  const selected = view.kind === 'workspace' ? getCompanion(snapshot, view.companionId) : snapshot.companions[0];
  const missions = selected ? getCompanionMissions(snapshot, selected.id) : [];

  function goHome() { navigate({ kind: 'home' }); onClose(); }
  function goGeneral(companionId: string) { navigate({ kind: 'workspace', companionId, missionId: null }); onClose(); }
  function goMission(missionId: string) {
    if (!selected) return;
    navigate({ kind: 'workspace', companionId: selected.id, missionId });
    onClose();
  }

  return <>
    <div className="sidebar-brand-row"><button className="app-brand" type="button" onClick={goHome}>morrow<span>+</span></button><button className="sidebar-close" type="button" onClick={onClose}>Close</button></div>
    {selected && <div className="sidebar-mascot-row"><div className="mascot-slot" role="img" aria-label="Reserved space for your future mascot"><i /><i /><i /><i /></div><div><strong>{selected.name}</strong><span>Let’s make progress</span></div></div>}
    <nav className="sidebar-navigation" aria-label="Workspace navigation">
      <button className={`sidebar-link${view.kind === 'workspace' && view.missionId === null ? ' is-current' : ''}`} type="button" aria-current={view.kind === 'workspace' && view.missionId === null ? 'page' : undefined} disabled={!selected} onClick={() => selected && goGeneral(selected.id)}>General chat</button>
      <button className="sidebar-link sidebar-new-mission" type="button" disabled={!selected} onClick={onCreateMission}>＋ New mission</button>
      <h2>Missions</h2>
      {missions.length ? missions.map((mission) => <button className={`sidebar-mission${view.kind === 'workspace' && view.missionId === mission.id ? ' is-current' : ''}`} type="button" key={mission.id} aria-current={view.kind === 'workspace' && view.missionId === mission.id ? 'page' : undefined} onClick={() => goMission(mission.id)}><strong>{mission.objective}</strong><span>{statusLabel(mission)}</span></button>) : <p className="sidebar-empty">No missions yet.</p>}
    </nav>
    <div className="sidebar-bottom">
      <button type="button" className="sidebar-link" aria-current={view.kind === 'home' ? 'page' : undefined} onClick={goHome}>Companions</button>
      {selected && snapshot.companions.length > 1 && <label className="sidebar-select">Switch companion<select aria-label="Switch companion" value={selected.id} onChange={(event) => goGeneral(event.target.value)}>{snapshot.companions.map((companion) => <option key={companion.id} value={companion.id}>{companion.name}</option>)}</select></label>}
      <div className="sidebar-user"><div className="mascot-slot mascot-slot-small" role="img" aria-label="Reserved space for your future mascot"><i /><i /><i /><i /></div><span>{snapshot.profile?.name ?? 'Local demo'}</span></div>
      <small>Local demo · manual progress only</small><button className="sidebar-reset" type="button" onClick={onReset}>Reset demo</button>
    </div>
  </>;
}

function Sidebar({ open, onClose, onCreateMission, onReset, trigger }: SidebarProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);
  function close() {
    if (dialog.current?.open) dialog.current.close();
    onClose();
    requestAnimationFrame(() => trigger.current?.focus());
  }
  return <>
    <aside className="app-sidebar"><SidebarContent onClose={close} onCreateMission={onCreateMission} onReset={onReset} /></aside>
    <dialog ref={dialog} className="sidebar-dialog" aria-label="Navigation" onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => requestAnimationFrame(() => trigger.current?.focus())} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <SidebarContent onClose={close} onCreateMission={onCreateMission} onReset={onReset} />
    </dialog>
  </>;
}

export default function App() {
  const { initializing, snapshot, storage, actions, view, navigate } = useApp();
  const resetDialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const [storageError, setStorageError] = useState('');
  const [resetPending, setResetPending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewportWide, setViewportWide] = useState(() => typeof window === 'undefined' || window.innerWidth > 900);
  const selectedId = view.kind === 'workspace' ? view.companionId : snapshot.companions[0]?.id;

  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px)');
    const update = () => setViewportWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => { if (viewportWide) setSidebarOpen(false); }, [viewportWide]);

  async function retryPersistence() {
    setStorageError('');
    const result = await actions.retryPersistence();
    if (!result.ok) setStorageError(result.error.message);
  }
  async function resetDemo() {
    if (resetPending) return;
    setResetPending(true);
    setStorageError('');
    const result = await actions.resetDemo();
    setResetPending(false);
    if (!result.ok) { setStorageError(result.error.message); return; }
    resetDialog.current?.close();
  }
  function createMission() {
    if (!selectedId) return;
    if (view.kind !== 'workspace' || view.companionId !== selectedId) navigate({ kind: 'workspace', companionId: selectedId, missionId: null });
    setSidebarOpen(false);
    setCreateOpen(true);
  }

  const blocked = storage.mode === 'blocked';
  const onboard = !initializing && !blocked && !snapshot.profile;
  return <div className={`app-shell${snapshot.profile && !blocked ? ' app-shell-ready' : ''}`}>
    {snapshot.profile && !blocked && <Sidebar trigger={menuTrigger} open={sidebarOpen && !viewportWide} onClose={() => setSidebarOpen(false)} onCreateMission={createMission} onReset={() => { setSidebarOpen(false); requestAnimationFrame(() => resetDialog.current?.showModal()); }} />}
    <div className="app-main">
      {storage.mode === 'memory' && <section className="app-storage" role="status" aria-live="polite"><p><strong>Changes are not being saved.</strong> {storage.message}</p><button type="button" onClick={() => void retryPersistence()}>Retry saving</button></section>}
      {storageError && !blocked && <p className="app-action-error app-global-error" role="alert">{storageError}</p>}
      {blocked ? <main className="app-recovery" aria-labelledby="app-recovery-title"><p className="app-eyebrow">Saved demo data needs attention</p><h1 id="app-recovery-title">This demo could not open its saved data.</h1><p>{storage.message} Reset the demo to remove its saved data and start again. Other data in this browser will stay untouched.</p>{storageError && <p className="app-action-error" role="alert">{storageError}</p>}<button className="app-button" type="button" onClick={() => resetDialog.current?.showModal()}>Review reset</button></main>
        : initializing ? <main className="app-loading" aria-live="polite">Loading your demo…</main>
          : onboard ? <Onboarding />
            : view.kind === 'home' ? <>
              <header className="mobile-topbar"><button ref={menuTrigger} type="button" className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">☰</button><strong>Companions</strong></header><Home />
            </> : <Workspace onMenu={() => setSidebarOpen(true)} menuRef={menuTrigger} createOpen={createOpen} onCreateOpenChange={setCreateOpen} renderMissionDetail={(props) => <MissionDetail {...props} />} />}
    </div>
    <dialog className="app-reset-dialog" ref={resetDialog} aria-labelledby="app-reset-title" aria-describedby="app-reset-description" onCancel={() => setStorageError('')}><form method="dialog" className="app-reset-close"><button className="app-text-button" type="submit" aria-label="Cancel reset">Cancel</button></form><p className="app-eyebrow">Start over</p><h2 id="app-reset-title">Reset this demo?</h2><p id="app-reset-description">This removes the profile, companions, missions and conversations saved by this demo on this device.</p><p className="app-dialog-note">Other browser data will stay untouched.</p>{storageError && <p className="app-action-error" role="alert">{storageError}</p>}<div className="app-dialog-actions"><form method="dialog"><button className="app-button app-button-secondary" type="submit" disabled={resetPending}>Keep my data</button></form><button className="app-button" type="button" onClick={() => void resetDemo()} disabled={resetPending}>{resetPending ? 'Resetting…' : 'Reset demo'}</button></div></dialog>
  </div>;
}
