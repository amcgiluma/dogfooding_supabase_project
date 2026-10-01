import { useRef, useState } from 'react';
import { getCompanion } from '../domain/selectors';
import { Home } from '../features/home/Home';
import { MissionDetail } from '../features/mission/MissionDetail';
import { Onboarding } from '../features/onboarding/Onboarding';
import { Workspace } from '../features/workspace/Workspace';
import { useApp } from './AppProvider';
import './app.css';

export default function App() {
  const { initializing, snapshot, storage, actions, view, navigate } = useApp();
  const resetDialog = useRef<HTMLDialogElement>(null);
  const [storageError, setStorageError] = useState('');
  const [resetPending, setResetPending] = useState(false);

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
    if (!result.ok) {
      setStorageError(result.error.message);
      return;
    }
    resetDialog.current?.close();
  }

  const selectedCompanion = view.kind === 'workspace' ? getCompanion(snapshot, view.companionId) : null;
  const blocked = storage.mode === 'blocked';

  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="app-brand" type="button" onClick={() => navigate({ kind: 'home' })} aria-label="Go to companions">morrow<span>.</span></button>
        <nav className="app-nav" aria-label="Main navigation">
          {snapshot.profile && <button type="button" aria-current={view.kind === 'home' ? 'page' : undefined} onClick={() => navigate({ kind: 'home' })}>Companions</button>}
          {selectedCompanion && <span className="app-current">{selectedCompanion.name}</span>}
        </nav>
      </header>

      {storage.mode === 'memory' && <section className="app-storage app-storage-warning" role="status" aria-live="polite">
        <p><strong>Changes are not being saved.</strong> {storage.message} Keep this tab open or retry browser storage.</p>
        <button type="button" onClick={() => void retryPersistence()}>Retry saving</button>
      </section>}

      {blocked ? <main className="app-recovery" aria-labelledby="app-recovery-title">
        <p className="app-eyebrow">Saved demo data needs attention</p>
        <h1 id="app-recovery-title">This demo could not open its saved data.</h1>
        <p>{storage.message} Reset the demo to remove its saved data and start again. Other data in this browser will stay untouched.</p>
        {storageError && <p className="app-action-error" role="alert">{storageError}</p>}
        <button className="app-button" type="button" onClick={() => resetDialog.current?.showModal()}>Review reset</button>
      </main> : initializing ? <main className="app-loading" aria-live="polite">Loading your demo…</main> : (
        <div className="app-content">
          {!snapshot.profile ? <Onboarding /> : view.kind === 'home' ? <Home /> : (
            <Workspace key={view.companionId} missionDetail={view.missionId ? <MissionDetail key={view.missionId} /> : undefined} />
          )}
        </div>
      )}

      <footer className="app-footer">
        <span>Local demo · work advances only when you choose</span>
        <button type="button" onClick={() => resetDialog.current?.showModal()}>Reset demo</button>
      </footer>

      <dialog className="app-reset-dialog" ref={resetDialog} aria-labelledby="app-reset-title" aria-describedby="app-reset-description" onCancel={() => setStorageError('')}>
        <form method="dialog" className="app-reset-close"><button className="app-text-button" type="submit" aria-label="Cancel reset">Cancel</button></form>
        <p className="app-eyebrow">Start over</p>
        <h2 id="app-reset-title">Reset this demo?</h2>
        <p id="app-reset-description">This removes the profile, companions, missions and conversations saved by this demo on this device.</p>
        <p className="app-dialog-note">Other browser data will stay untouched.</p>
        {storageError && <p className="app-action-error" role="alert">{storageError}</p>}
        <div className="app-dialog-actions">
          <form method="dialog"><button className="app-button app-button-secondary" type="submit" disabled={resetPending}>Keep my data</button></form>
          <button className="app-button" type="button" onClick={() => void resetDemo()} disabled={resetPending}>{resetPending ? 'Resetting…' : 'Reset demo'}</button>
        </div>
      </dialog>
    </div>
  );
}
