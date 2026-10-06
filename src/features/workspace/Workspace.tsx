import { useEffect, useRef, useState, type ReactElement, type RefObject } from 'react';
import { useApp } from '../../app/AppProvider';
import { getCompanion, getCompanionMissions } from '../../domain/selectors';
import { Chat } from '../chat/Chat';
import { CreateMission } from '../create-mission/CreateMission';
import type { MotionPreferences } from '../../app/motion';
import './workspace.css';

interface WorkspaceProps {
  menuRef: RefObject<HTMLButtonElement | null>;
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
  motion: MotionPreferences;
  renderMissionDetail: (props: { detailsOpen: boolean; wide: boolean; motion: MotionPreferences; onCloseDetails: () => void; onOpenDetails: (opener?: HTMLElement) => void }) => ReactElement;
}

export function Workspace({ menuRef, createOpen, onCreateOpenChange, motion, renderMissionDetail }: WorkspaceProps) {
  const { snapshot, view, navigate } = useApp();
  const [wide, setWide] = useState(() => typeof window === 'undefined' || window.innerWidth > 900);
  const [detailsOpen, setDetailsOpen] = useState(() => typeof window === 'undefined' || window.innerWidth > 900);
  const visibleDetailsOpen = detailsOpen && !createOpen;
  const missionIdForDetails = view.kind === 'workspace' ? view.missionId : null;
  const detailsTrigger = useRef<HTMLButtonElement>(null);
  const detailsRestoreTarget = useRef<HTMLElement | null>(null);
  const generalDetailsDialog = useRef<HTMLDialogElement>(null);
  const [deliverableScrollRequest, setDeliverableScrollRequest] = useState<{ id: number; missionId: string } | null>(null);
  const deliverableRequestId = useRef(0);
  const processedDeliverableRequest = useRef(0);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 901px)');
    const update = () => setWide(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => { setDetailsOpen(wide && Boolean(missionIdForDetails)); }, [view.kind === 'workspace' ? `${view.companionId}:${view.missionId ?? ''}` : 'home', wide]);
  useEffect(() => {
    const dialog = generalDetailsDialog.current;
    if (!dialog) return;
    if (missionIdForDetails === null && !wide && visibleDetailsOpen && !dialog.open) dialog.showModal();
    if ((!visibleDetailsOpen || wide || missionIdForDetails !== null) && dialog.open) dialog.close();
  }, [visibleDetailsOpen, wide, view.kind === 'workspace' ? view.missionId : null]);
  useEffect(() => {
    const request = deliverableScrollRequest;
    if (!request || processedDeliverableRequest.current === request.id) return;
    if (missionIdForDetails !== request.missionId) {
      processedDeliverableRequest.current = request.id;
      return;
    }
    if (!visibleDetailsOpen) return;
    const motionOff = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.visibilityState === 'hidden';
    const frame = requestAnimationFrame(() => {
      if (processedDeliverableRequest.current === request.id) return;
      const target = document.getElementById(`mission-deliverables-title-${request.missionId}`);
      processedDeliverableRequest.current = request.id;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: motionOff ? 'auto' : 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [visibleDetailsOpen, missionIdForDetails, deliverableScrollRequest]);
  if (view.kind !== 'workspace') return null;
  const { companionId, missionId } = view;
  const companion = getCompanion(snapshot, companionId);
  if (!companion) return <main className="workspace-page"><p>This companion is unavailable.</p><button type="button" onClick={() => navigate({ kind: 'home' })}>Return to companions</button></main>;
  const title = missionId ? snapshot.missions.find((item) => item.id === missionId)?.objective ?? 'Mission' : 'General chat';
  const missions = getCompanionMissions(snapshot, companionId);
  function closeDetails() {
    setDetailsOpen(false);
    requestAnimationFrame(() => (detailsRestoreTarget.current ?? detailsTrigger.current)?.focus());
  }
  function openDetails(opener?: HTMLElement) {
    detailsRestoreTarget.current = opener ?? detailsTrigger.current;
    setDetailsOpen(true);
  }
  function closeCreation(restoreFocus = true) {
    onCreateOpenChange(false);
    const mobileDetailsResumes = !wide && detailsOpen;
    if (restoreFocus && !mobileDetailsResumes) {
      requestAnimationFrame(() => (document.querySelector<HTMLButtonElement>(wide ? '.app-sidebar .sidebar-new-mission' : '.app-new-mission') ?? menuRef.current)?.focus());
    }
  }

  return <main className={`workspace-page${missionId ? ' mission-workspace' : ''}${visibleDetailsOpen ? ' details-visible' : ''}${motion.reduced || motion.hidden ? ' motion-static' : ''}`}>
    <CreateMission key={companionId} companionId={companionId} companionName={companion.name} open={createOpen} motion={motion} onClose={closeCreation} />
    <section className="workspace-hero">
      <div className="workspace-hero-title"><span className="workspace-title-marker" aria-hidden="true" /><div><p>{companion.name} / {missionId ? 'MISSION' : 'GENERAL CHAT'}</p><h1 key={`${companionId}:${missionId ?? 'general'}`}>{title}</h1></div></div>
      <div className="workspace-hero-actions">
        <div className="workspace-presence">
          <div className="mascot-slot workspace-mascot" data-mascot-slot role="img" aria-label="Reserved space for your future mascot"><i /><i /><i /><i /></div>
          <span>{missionId ? snapshot.missions.find((item) => item.id === missionId)?.status.replace('_', ' ') : 'Personal workspace'}</span>
        </div>
        <button ref={detailsTrigger} className="workspace-details-toggle" type="button" aria-label={visibleDetailsOpen ? 'Hide details' : 'Details'} aria-expanded={visibleDetailsOpen} aria-controls={visibleDetailsOpen ? 'mission-details-surface' : undefined} onClick={(event) => visibleDetailsOpen ? closeDetails() : openDetails(event.currentTarget)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="16" rx="1" /><path d="M15 4v16" /><path className="workspace-details-toggle-pane" d="M15 4h6v16h-6z" /></svg>
          <span>Details</span>
        </button>
      </div>
      <nav className="workspace-mission-nav" aria-label="Conversation and missions"><button type="button" aria-current={!missionId ? 'page' : undefined} onClick={() => navigate({ kind: 'workspace', companionId, missionId: null })}>General chat</button>{missions.map((mission) => <button key={mission.id} type="button" aria-current={mission.id === missionId ? 'page' : undefined} onClick={() => navigate({ kind: 'workspace', companionId, missionId: mission.id })}>{mission.objective}</button>)}</nav>
    </section>
    <div className={`workspace-stage${visibleDetailsOpen && wide ? ' has-details' : ''}`}>
      <section className="workspace-conversation" aria-label={missionId ? 'Mission conversation' : 'General conversation'}>
        {missionId ? renderMissionDetail({ detailsOpen: visibleDetailsOpen, wide, motion, onCloseDetails: closeDetails, onOpenDetails: (opener) => { openDetails(opener); setDeliverableScrollRequest({ id: ++deliverableRequestId.current, missionId }); } }) : <>
          <Chat key={`general-${companionId}`} scope={{ kind: 'general', companionId }} companionName={companion.name} />
          {visibleDetailsOpen && wide && <aside className="general-details" id="mission-details-surface"><div className="workspace-details-heading"><h2>Companion details</h2><button type="button" className="workspace-quiet-button" onClick={closeDetails}>Close</button></div><dl><div><dt>For</dt><dd>{snapshot.profile?.name}</dd></div><div><dt>Current goal</dt><dd>{snapshot.profile?.goal}</dd></div><div><dt>How to help</dt><dd>{snapshot.profile?.intendedUse}</dd></div><div><dt>Missions</dt><dd>{snapshot.missions.filter((item) => item.companionId === companionId).length}</dd></div></dl></aside>}
          <dialog ref={generalDetailsDialog} id={!wide ? 'mission-details-surface' : undefined} className="general-details-dialog" aria-label="Companion details" onCancel={(event) => { event.preventDefault(); closeDetails(); }} onClose={() => { if (visibleDetailsOpen) closeDetails(); }}>{!wide && <><div className="workspace-details-heading"><h2>Companion details</h2><button type="button" className="workspace-quiet-button" onClick={closeDetails}>Close</button></div><dl><div><dt>For</dt><dd>{snapshot.profile?.name}</dd></div><div><dt>Current goal</dt><dd>{snapshot.profile?.goal}</dd></div><div><dt>How to help</dt><dd>{snapshot.profile?.intendedUse}</dd></div><div><dt>Missions</dt><dd>{snapshot.missions.filter((item) => item.companionId === companionId).length}</dd></div></dl></>}</dialog>
        </>}
      </section>
    </div>
  </main>;
}
