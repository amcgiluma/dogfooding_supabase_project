import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApp } from '../../app/AppProvider';
import { getMissionDeliverables, getMissionEvents, getMission } from '../../domain/selectors';
import { getDemoStep } from '../../domain/simulation';
import type { ActionResult, Mission } from '../../domain/types';
import { Chat } from '../chat/Chat';
import { STAGE_FIXTURES } from './stageFixtures';
import './mission.css';

export interface MissionDetailProps { detailsOpen: boolean; wide: boolean; onCloseDetails: () => void; onOpenDetails: (opener?: HTMLElement) => void }

function missionStatus(mission: Mission): string {
  switch (mission.status) {
    case 'active': return 'Active · working';
    case 'waiting_permission': return 'Waiting for your permission';
    case 'paused': return mission.resumeState.status === 'waiting_permission' ? 'Paused · permission needed' : 'Paused by you';
    case 'awaiting_review': return 'Paused · Ready for review';
    case 'completed': return 'Completed';
  }
}
function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Time unavailable' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
function stageState(mission: Mission, index: number): 'complete' | 'ready' | 'pending' {
  if (index === 0 && mission.demoCursor >= 1) return 'complete';
  if (index === 1 && mission.demoCursor >= 3) return 'complete';
  if (index === 2 && mission.status === 'completed') return 'complete';
  if (index === 2 && mission.status === 'awaiting_review') return 'ready';
  return 'pending';
}

function MissionActionStrip({ mission, companionId, onViewDeliverable }: { mission: Mission; companionId: string; onViewDeliverable: (opener: HTMLElement) => void }) {
  const { actions } = useApp();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correction, setCorrection] = useState('');
  const actionRef = useRef<HTMLButtonElement>(null);
  const correctionRef = useRef<HTMLTextAreaElement>(null);
  const correctionTrigger = useRef<HTMLButtonElement>(null);
  const demoStep = mission.status === 'active' ? getDemoStep(mission) : null;

  async function run(runAction: () => Promise<ActionResult>) {
    if (pending) return;
    setPending(true); setError('');
    const result = await runAction();
    setPending(false);
    if (!result.ok) { setError(result.error.message); requestAnimationFrame(() => actionRef.current?.focus()); }
  }
  async function requestCorrections(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError('');
    const result = await actions.requestCorrections(companionId, mission.id, correction);
    setPending(false);
    if (!result.ok) { setError(result.error.message); correctionRef.current?.focus(); return; }
    setCorrection(''); setCorrectionOpen(false); requestAnimationFrame(() => correctionTrigger.current?.focus());
  }
  function openCorrections() { setCorrectionOpen(true); requestAnimationFrame(() => correctionRef.current?.focus()); }
  function closeCorrections() { setCorrectionOpen(false); requestAnimationFrame(() => correctionTrigger.current?.focus()); }

  return <section className="mission-controls" aria-label="Mission actions">
    {mission.status === 'active' && <><p>This is a demo. Advance one simulated step when you choose.</p><div className="mission-control-row"><button ref={actionRef} className="mission-button mission-button-secondary" type="button" disabled={pending} onClick={() => void run(() => actions.pauseMission(companionId, mission.id))}>Pause mission</button>{demoStep && <button className="mission-button" type="button" disabled={pending} onClick={() => void run(() => actions.advanceDemo(companionId, mission.id))}>{demoStep.kind === 'permission' ? 'Advance to permission' : demoStep.kind === 'review' ? 'Prepare final review' : 'Advance demo one step'}</button>}</div></>}
    {mission.status === 'waiting_permission' && <><p className="mission-control-lead">Permission needed for this simulated action</p><dl className="mission-gate"><div><dt>Action</dt><dd>{mission.gate.action}</dd></div><div><dt>Resource</dt><dd>{mission.gate.resource}</dd></div></dl><p>{mission.gate.explanation}</p><div className="mission-control-row"><button ref={actionRef} className="mission-button" type="button" disabled={pending} onClick={() => void run(() => actions.decidePermission(companionId, mission.id, mission.gate.id, 'approve'))}>Approve this action</button><button className="mission-button mission-button-secondary" type="button" disabled={pending} onClick={() => void run(() => actions.decidePermission(companionId, mission.id, mission.gate.id, 'decline'))}>Decline</button><button className="mission-text-button" type="button" disabled={pending} onClick={() => void run(() => actions.pauseMission(companionId, mission.id))}>Pause</button></div></>}
    {mission.status === 'paused' && <><p>{mission.resumeState.status === 'waiting_permission' ? 'The same permission request remains unresolved. Resume to decide it.' : 'Work is stopped at this point. Resume when you want to continue.'}</p><button ref={actionRef} className="mission-button" type="button" disabled={pending} onClick={() => void run(() => actions.resumeMission(companionId, mission.id))}>Resume mission</button></>}
    {mission.status === 'awaiting_review' && <><p className="mission-control-lead">This mission is paused while you review the deliverable.</p><div className="mission-control-row"><button ref={actionRef} className="mission-button mission-button-secondary" type="button" onClick={(event) => onViewDeliverable(event.currentTarget)}>View deliverable</button><button className="mission-button" type="button" disabled={pending} onClick={() => void run(() => actions.confirmCompletion(companionId, mission.id))}>Confirm complete</button><button ref={correctionTrigger} className="mission-text-button" type="button" onClick={openCorrections}>Request corrections</button></div></>}
    {mission.status === 'completed' && <><p>You confirmed this mission complete. Its history and deliverables stay here.</p><div className="mission-control-row"><button ref={actionRef} className="mission-button mission-button-secondary" type="button" onClick={(event) => onViewDeliverable(event.currentTarget)}>View deliverable</button><button ref={correctionTrigger} className="mission-text-button" type="button" onClick={openCorrections}>Request corrections</button></div></>}
    {error && <p className="mission-action-error" id={`mission-action-error-${mission.id}`} role="alert">{error}</p>}
    {correctionOpen && <form className="mission-correction-form" onSubmit={(event) => void requestCorrections(event)} onKeyDown={(event) => { if (event.key === 'Escape' && !pending) { event.preventDefault(); closeCorrections(); } }}><label htmlFor={`mission-corrections-${mission.id}`}>What should change?</label><textarea ref={correctionRef} id={`mission-corrections-${mission.id}`} rows={2} value={correction} required onChange={(event) => setCorrection(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `mission-action-error-${mission.id}` : undefined} /><div className="mission-control-row"><button className="mission-button" type="submit" disabled={pending || !correction.trim()}>{pending ? 'Sending…' : 'Send corrections'}</button><button className="mission-text-button" type="button" disabled={pending} onClick={closeCorrections}>Cancel</button></div></form>}
  </section>;
}

function MissionDetails({ mission, companionId, onClose }: { mission: Mission; companionId: string; onClose: () => void }) {
  const { snapshot, actions } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(mission.objective);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);
  const editTrigger = useRef<HTMLButtonElement>(null);
  const events = getMissionEvents(snapshot, companionId, mission.id);
  const deliverables = getMissionDeliverables(snapshot, companionId, mission.id);
  const stages = STAGE_FIXTURES[mission.kind];
  const target = mission.targetDate ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${mission.targetDate}T00:00:00.000Z`)) : null;

  async function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError('');
    const result = await actions.editMissionGoal(companionId, mission.id, draft);
    setPending(false);
    if (!result.ok) { setError(result.error.message); editRef.current?.focus(); return; }
    setEditOpen(false);
    requestAnimationFrame(() => editTrigger.current?.focus());
  }

  return <div className="mission-details-content">
    <header className="mission-header"><div><p className="mission-eyebrow">{mission.kind} mission</p><h2 id={`mission-title-${mission.id}`}>{mission.objective}</h2><div className="mission-meta"><span>{missionStatus(mission)}</span>{target && <span>Target · {target}</span>}<span>Demo steps happen only when you advance them</span></div></div><button className="mission-text-button mission-details-close" type="button" onClick={onClose}>Close</button></header>
    {mission.status !== 'completed' && <div className="mission-form-actions"><button ref={editTrigger} className="mission-text-button" type="button" onClick={() => { setDraft(mission.objective); setEditOpen((open) => !open); }}>Edit goal</button></div>}
    {editOpen && <form className="mission-inline-form" onSubmit={(event) => void saveGoal(event)} onKeyDown={(event) => { if (event.key === 'Escape' && !pending) { event.preventDefault(); event.stopPropagation(); setEditOpen(false); requestAnimationFrame(() => editTrigger.current?.focus()); } }}><label htmlFor={`mission-goal-${mission.id}`}>Edit mission goal</label><textarea id={`mission-goal-${mission.id}`} ref={editRef} rows={3} autoFocus value={draft} required onChange={(event) => { setDraft(event.target.value); setError(''); }} aria-invalid={Boolean(error)} aria-describedby={error ? `mission-goal-error-${mission.id}` : undefined} />{error && <p className="mission-error" id={`mission-goal-error-${mission.id}`} role="alert">{error}</p>}<div className="mission-control-row"><button className="mission-button" type="submit" disabled={pending || !draft.trim()}>{pending ? 'Saving…' : 'Save goal'}</button><button className="mission-text-button" type="button" disabled={pending} onClick={() => { setEditOpen(false); requestAnimationFrame(() => editTrigger.current?.focus()); }}>Cancel</button></div></form>}
    <section className="mission-progress-section"><h3>Progress <span>{mission.progress}% · demo estimate</span></h3><div className="mission-progress-track" role="progressbar" aria-label="Demo progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={mission.progress}><span style={{ width: `${mission.progress}%` }} /></div><details className="mission-stages"><summary>Stages and subtasks</summary><ol>{stages.map((stage, index) => { const state = stageState(mission, index); const text = state === 'complete' ? 'Complete' : state === 'ready' ? 'Ready to review' : 'To do'; return <li className={`mission-stage mission-stage-${state}`} key={stage.title}><div><strong>{stage.title}</strong><span>{text}</span></div><ul>{stage.subtasks.map((task) => <li key={task}>{task}</li>)}</ul></li>; })}</ol></details></section>
    <section className="mission-history"><h3>History</h3>{events.length === 0 ? <p className="mission-muted">No progress events yet.</p> : <ol>{events.map((event) => <li key={event.id}><time dateTime={event.createdAt}>{formatTime(event.createdAt)}</time><p>{event.summary}</p></li>)}</ol>}</section>
    <section className="mission-deliverables" aria-labelledby={`mission-deliverables-title-${mission.id}`}><h3 id={`mission-deliverables-title-${mission.id}`}>Deliverables</h3>{deliverables.length === 0 ? <p className="mission-muted">No deliverables yet. Advance the demo to create a sample output.</p> : deliverables.map((deliverable) => <article className="mission-deliverable" key={deliverable.id}><p className="mission-deliverable-kind">{deliverable.kind} · {deliverable.id === ('deliverableId' in mission ? mission.deliverableId : null) ? mission.status === 'completed' ? 'confirmed' : 'ready for review' : 'earlier output'}</p><h4>{deliverable.title}</h4><time dateTime={deliverable.createdAt}>{formatTime(deliverable.createdAt)}</time><p className="mission-deliverable-body">{deliverable.body}</p></article>)}</section>
  </div>;
}

export function MissionDetail({ detailsOpen, wide, onCloseDetails, onOpenDetails }: MissionDetailProps) {
  const { snapshot, view, navigate } = useApp();
  const mobileDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = mobileDialog.current;
    if (!dialog) return;
    if (detailsOpen && !wide && !dialog.open) dialog.showModal();
    if ((!detailsOpen || wide) && dialog.open) dialog.close();
  }, [detailsOpen, wide]);
  if (view.kind !== 'workspace' || !view.missionId) return null;
  const mission = getMission(snapshot, view.companionId, view.missionId);
  if (!mission) return <section className="mission-missing"><p>This mission is unavailable.</p><button className="mission-text-button" type="button" onClick={() => navigate({ kind: 'workspace', companionId: view.companionId, missionId: null })}>Return to general conversation</button></section>;
  const scope = { kind: 'mission' as const, companionId: view.companionId, missionId: mission.id };
  const detailContent = <MissionDetails key={mission.id} mission={mission} companionId={view.companionId} onClose={onCloseDetails} />;
  return <>
    <Chat key={`mission-${view.companionId}-${mission.id}`} scope={scope} companionName={snapshot.companions.find((item) => item.id === view.companionId)?.name} actionStrip={<MissionActionStrip mission={mission} companionId={view.companionId} onViewDeliverable={onOpenDetails} />} />
    {detailsOpen && wide && <aside className="mission-details-panel" id="mission-details-surface">{detailContent}</aside>}
    <dialog ref={mobileDialog} id={!wide ? 'mission-details-surface' : undefined} className="mission-details-dialog" aria-label="Mission details" onCancel={(event) => { event.preventDefault(); onCloseDetails(); }} onClose={() => { if (detailsOpen) onCloseDetails(); }}>{!wide && detailContent}</dialog>
  </>;
}
