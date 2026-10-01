import { useEffect, useRef, useState, type ReactElement, type RefObject } from 'react';
import { useApp } from '../../app/AppProvider';
import { getCompanion } from '../../domain/selectors';
import { Chat } from '../chat/Chat';
import { CreateMission } from '../create-mission/CreateMission';
import './workspace.css';

interface WorkspaceProps {
  onMenu: () => void;
  menuRef: RefObject<HTMLButtonElement | null>;
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  renderMissionDetail: (props: { detailsOpen: boolean; wide: boolean; onCloseDetails: () => void; onOpenDetails: (opener?: HTMLElement) => void }) => ReactElement;
}

export function Workspace({ onMenu, menuRef, createOpen, onCreateOpenChange, renderMissionDetail }: WorkspaceProps) {
  const { snapshot, view, navigate } = useApp();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.innerWidth > 900);
  const missionIdForDetails = view.kind === 'workspace' ? view.missionId : null;
  const createTrigger = useRef<HTMLButtonElement>(null);
  const detailsTrigger = useRef<HTMLButtonElement>(null);
  const detailsRestoreTarget = useRef<HTMLElement | null>(null);
  const generalDetailsDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px)');
    const update = () => setWide(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => { setDetailsOpen(false); }, [view.kind === 'workspace' ? `${view.companionId}:${view.missionId ?? ''}` : 'home']);
  useEffect(() => {
    const dialog = generalDetailsDialog.current;
    if (!dialog) return;
    if (missionIdForDetails === null && !wide && detailsOpen && !dialog.open) dialog.showModal();
    if ((!detailsOpen || wide || missionIdForDetails !== null) && dialog.open) dialog.close();
  }, [detailsOpen, wide, view.kind === 'workspace' ? view.missionId : null]);
  if (view.kind !== 'workspace') return null;
  const { companionId, missionId } = view;
  const companion = getCompanion(snapshot, companionId);
  if (!companion) return <main className="workspace-page"><p>This companion is unavailable.</p><button type="button" onClick={() => navigate({ kind: 'home' })}>Return to companions</button></main>;
  const title = missionId ? snapshot.missions.find((item) => item.id === missionId)?.objective ?? 'Mission' : 'General chat';
  function closeDetails() { setDetailsOpen(false); requestAnimationFrame(() => (detailsRestoreTarget.current ?? detailsTrigger.current)?.focus()); }
  function openDetails(opener?: HTMLElement) { detailsRestoreTarget.current = opener ?? detailsTrigger.current; setDetailsOpen(true); }

  return <main className="workspace-page">
    <header className="workspace-topbar"><button ref={menuRef} type="button" className="mobile-menu" onClick={onMenu} aria-label="Open navigation">☰</button><div className="mascot-slot mascot-slot-mobile" role="img" aria-label="Reserved space for your future mascot"><i/><i/><i/><i/></div><div className="workspace-context"><strong>{companion.name}</strong><span>· {title}</span></div><div className="workspace-top-actions"><button ref={detailsTrigger} className="workspace-quiet-button" type="button" aria-expanded={detailsOpen} aria-controls="mission-details-surface" onClick={(event) => openDetails(event.currentTarget)}>Details</button><button ref={createTrigger} className="workspace-quiet-button workspace-create-trigger" type="button" onClick={() => onCreateOpenChange(true)}>New mission</button></div></header>
    {createOpen && <CreateMission companionId={companionId} onClose={(restoreFocus = true) => { onCreateOpenChange(false); if (restoreFocus) requestAnimationFrame(() => (wide ? createTrigger.current : menuRef.current)?.focus()); }} />}
    <div className={`workspace-stage${detailsOpen && wide ? ' has-details' : ''}`}>
      <section className="workspace-conversation" aria-label={missionId ? 'Mission conversation' : 'General conversation'}>
        {missionId ? renderMissionDetail({ detailsOpen, wide, onCloseDetails: closeDetails, onOpenDetails: openDetails }) : <>
          <Chat key={`general-${companionId}`} scope={{ kind: 'general', companionId }} companionName={companion.name} />
          {detailsOpen && wide && <aside className="general-details" id="mission-details-surface"><div className="workspace-details-heading"><h2>Companion details</h2><button type="button" className="workspace-quiet-button" onClick={closeDetails}>Close</button></div><dl><div><dt>For</dt><dd>{snapshot.profile?.name}</dd></div><div><dt>Current goal</dt><dd>{snapshot.profile?.goal}</dd></div><div><dt>How to help</dt><dd>{snapshot.profile?.intendedUse}</dd></div><div><dt>Missions</dt><dd>{snapshot.missions.filter((item) => item.companionId === companionId).length}</dd></div></dl></aside>}
          <dialog ref={generalDetailsDialog} id={!wide ? 'mission-details-surface' : undefined} className="general-details-dialog" aria-label="Companion details" onCancel={(event) => { event.preventDefault(); closeDetails(); }} onClose={() => { if (detailsOpen) closeDetails(); }}>{!wide && <><div className="workspace-details-heading"><h2>Companion details</h2><button type="button" className="workspace-quiet-button" onClick={closeDetails}>Close</button></div><dl><div><dt>For</dt><dd>{snapshot.profile?.name}</dd></div><div><dt>Current goal</dt><dd>{snapshot.profile?.goal}</dd></div><div><dt>How to help</dt><dd>{snapshot.profile?.intendedUse}</dd></div><div><dt>Missions</dt><dd>{snapshot.missions.filter((item) => item.companionId === companionId).length}</dd></div></dl></>}</dialog>
        </>}
      </section>
    </div>
  </main>;
}
