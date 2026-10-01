import { useRef, useState, type FormEvent, type RefObject } from 'react';
import { useApp } from '../../app/AppProvider';
import { getMissionDeliverables, getMissionEvents, getMission } from '../../domain/selectors';
import { getDemoStep } from '../../domain/simulation';
import type { ActionResult, Mission } from '../../domain/types';
import { Chat } from '../chat/Chat';
import { STAGE_FIXTURES } from './stageFixtures';
import './mission.css';

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

function stateText(state: ReturnType<typeof stageState>): string {
  if (state === 'complete') return 'Complete';
  if (state === 'ready') return 'Ready to review';
  return 'To do';
}

function ErrorText({ id, message }: { id: string; message: string }) {
  return message ? <p className="mission-error" id={id} role="alert">{message}</p> : null;
}

interface MissionDetailFormProps {
  companionId: string;
  missionId: string;
  objective: string;
  status: Mission['status'];
}

function MissionDetailForms({ companionId, missionId, objective, status }: MissionDetailFormProps) {
  const { actions } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState(objective);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionDraft, setCorrectionDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [editError, setEditError] = useState('');
  const [correctionError, setCorrectionError] = useState('');
  const editRef = useRef<HTMLTextAreaElement>(null);
  const correctionRef = useRef<HTMLTextAreaElement>(null);
  const editTriggerRef = useRef<HTMLButtonElement>(null);
  const correctionTriggerRef = useRef<HTMLButtonElement>(null);
  const canEdit = status !== 'completed';
  const canCorrect = status === 'awaiting_review' || status === 'completed';

  async function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setEditError('');
    const result = await actions.editMissionGoal(companionId, missionId, editDraft);
    setPending(false);
    if (!result.ok) {
      setEditError(result.error.message);
      editRef.current?.focus();
      return;
    }
    setEditOpen(false);
    requestAnimationFrame(() => editTriggerRef.current?.focus());
  }

  async function requestChanges(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setCorrectionError('');
    const result = await actions.requestCorrections(companionId, missionId, correctionDraft);
    setPending(false);
    if (!result.ok) {
      setCorrectionError(result.error.message);
      correctionRef.current?.focus();
      return;
    }
    setCorrectionDraft('');
    setCorrectionOpen(false);
    requestAnimationFrame(() => document.getElementById(`mission-title-${missionId}`)?.focus());
  }

  function closeEdit() {
    setEditDraft(objective);
    setEditError('');
    setEditOpen(false);
    requestAnimationFrame(() => editTriggerRef.current?.focus());
  }

  function closeCorrections() {
    setCorrectionError('');
    setCorrectionOpen(false);
    requestAnimationFrame(() => correctionTriggerRef.current?.focus());
  }

  return (
    <div className="mission-forms">
      {canEdit && <div className="mission-form-actions">
        {!editOpen && <button ref={editTriggerRef} className="mission-text-button" type="button" onClick={() => { setEditDraft(objective); setEditOpen(true); }}>Edit goal</button>}
        {canCorrect && !correctionOpen && <button ref={correctionTriggerRef} className="mission-text-button" type="button" onClick={() => setCorrectionOpen(true)}>Request corrections</button>}
      </div>}
      {status === 'completed' && !correctionOpen && <button ref={correctionTriggerRef} className="mission-text-button" type="button" onClick={() => setCorrectionOpen(true)}>Request corrections</button>}
      {editOpen && <form className="mission-inline-form" onKeyDown={(event) => { if (event.key === 'Escape' && !pending) { event.preventDefault(); closeEdit(); } }} onSubmit={(event) => void saveGoal(event)}>
        <label htmlFor={`mission-goal-${missionId}`}>Edit mission goal</label>
        <textarea id={`mission-goal-${missionId}`} ref={editRef} rows={3} autoFocus required value={editDraft} onChange={(event) => { setEditDraft(event.target.value); setEditError(''); }} aria-invalid={Boolean(editError)} aria-describedby={editError ? `mission-goal-error-${missionId}` : undefined} />
        <ErrorText id={`mission-goal-error-${missionId}`} message={editError} />
        <div className="mission-control-row"><button className="mission-button" type="submit" disabled={pending || !editDraft.trim()}>{pending ? 'Saving…' : 'Save goal'}</button><button className="mission-text-button" type="button" disabled={pending} onClick={closeEdit}>Cancel</button></div>
      </form>}
      {correctionOpen && <form className="mission-inline-form" onKeyDown={(event) => { if (event.key === 'Escape' && !pending) { event.preventDefault(); closeCorrections(); } }} onSubmit={(event) => void requestChanges(event)}>
        <label htmlFor={`mission-corrections-${missionId}`}>What should change?</label>
        <textarea id={`mission-corrections-${missionId}`} ref={correctionRef} rows={3} autoFocus required value={correctionDraft} onChange={(event) => { setCorrectionDraft(event.target.value); setCorrectionError(''); }} aria-invalid={Boolean(correctionError)} aria-describedby={correctionError ? `mission-corrections-error-${missionId}` : undefined} />
        <ErrorText id={`mission-corrections-error-${missionId}`} message={correctionError} />
        <div className="mission-control-row"><button className="mission-button" type="submit" disabled={pending || !correctionDraft.trim()}>{pending ? 'Sending…' : 'Send corrections'}</button><button className="mission-text-button" type="button" disabled={pending} onClick={closeCorrections}>Cancel</button></div>
      </form>}
    </div>
  );
}

function useActionErrorFocus() {
  const [error, setError] = useState('');
  const errorRef = useRef<HTMLParagraphElement>(null);
  function report(result: ActionResult, focusTarget?: RefObject<HTMLElement | null>) {
    if (result.ok) { setError(''); return true; }
    setError(result.error.message);
    requestAnimationFrame(() => (focusTarget?.current ?? errorRef.current)?.focus());
    return false;
  }
  return { error, errorRef, report };
}

function MissionDetailView({ companionId, missionId }: { companionId: string; missionId: string }) {
  const { snapshot, actions, navigate } = useApp();
  const mission = getMission(snapshot, companionId, missionId);
  const { error: actionError, errorRef, report } = useActionErrorFocus();
  const [pending, setPending] = useState(false);
  const actionRef = useRef<HTMLButtonElement>(null);
  if (!mission) return <section className="mission-missing"><p>This mission is unavailable.</p><button className="mission-text-button" type="button" onClick={() => navigate({ kind: 'workspace', companionId, missionId: null })}>Return to general conversation</button></section>;

  const scope = { kind: 'mission' as const, companionId, missionId };
  const events = getMissionEvents(snapshot, companionId, missionId);
  const deliverables = getMissionDeliverables(snapshot, companionId, missionId);
  const demoStep = mission.status === 'active' ? getDemoStep(mission) : null;
  const stages = STAGE_FIXTURES[mission.kind];

  async function runAction(run: () => Promise<ActionResult>) {
    if (pending) return;
    setPending(true);
    const result = await run();
    setPending(false);
    report(result, actionRef);
  }

  const formatTarget = mission.targetDate ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${mission.targetDate}T00:00:00.000Z`)) : null;

  return (
    <article className="mission-detail" aria-labelledby={`mission-title-${missionId}`}>
      <header className="mission-header">
        <div className="mission-heading-copy">
          <p className="mission-eyebrow">{mission.kind} mission</p>
      <h2 id={`mission-title-${missionId}`} tabIndex={-1}>{mission.objective}</h2>
          <div className="mission-meta"><span className={`mission-status mission-status-${mission.status}`}>{missionStatus(mission)}</span>{formatTarget && <span>Target date · {formatTarget}</span>}<span>Demo · steps happen only when you advance them</span></div>
        </div>
        <MissionDetailForms companionId={companionId} missionId={missionId} objective={mission.objective} status={mission.status} />
      </header>

      {actionError && <p className="mission-action-error" ref={errorRef} tabIndex={-1} role="alert">{actionError}</p>}

      <div className="mission-layout">
        <div className="mission-main-column">
          <section className="mission-chat-section" aria-labelledby={`mission-chat-title-${missionId}`}>
            <h3 id={`mission-chat-title-${missionId}`}>Mission conversation</h3>
            <Chat key={`mission-${companionId}-${missionId}`} scope={scope} />
          </section>

          <section className="mission-progress-section" aria-labelledby={`mission-progress-title-${missionId}`}>
            <h3 id={`mission-progress-title-${missionId}`}>Progress <span>{mission.progress}% · demo estimate</span></h3>
            <div className="mission-progress-track" role="progressbar" aria-label="Demo progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={mission.progress}><span style={{ width: `${mission.progress}%` }} /></div>
            <details className="mission-stages">
              <summary>Stages and subtasks</summary>
              <ol>{stages.map((stage, index) => {
                const state = stageState(mission, index);
                return <li className={`mission-stage mission-stage-${state}`} key={stage.title}>
                  <div><strong>{stage.title}</strong><span>{stateText(state)}</span></div>
                  <ul>{stage.subtasks.map((task) => <li key={task}>{task}</li>)}</ul>
                </li>;
              })}</ol>
            </details>
          </section>

          <section className="mission-history" aria-labelledby={`mission-history-title-${missionId}`}>
            <h3 id={`mission-history-title-${missionId}`}>History</h3>
            {events.length === 0 ? <p className="mission-muted">No progress events yet.</p> : <ol>{events.map((event) => <li key={event.id}><time dateTime={event.createdAt}>{formatTime(event.createdAt)}</time><p>{event.summary}</p></li>)}</ol>}
          </section>
        </div>

        <aside className="mission-side-column" aria-label="Mission status and deliverables">
          <section className="mission-controls" aria-labelledby={`mission-controls-title-${missionId}`}>
            <h3 id={`mission-controls-title-${missionId}`}>Mission controls</h3>
            {mission.status === 'active' && <>
              <p>This mission can advance one simulated step when you choose.</p>
              <div className="mission-control-row"><button ref={actionRef} className="mission-button mission-button-secondary" type="button" disabled={pending} onClick={() => void runAction(() => actions.pauseMission(companionId, missionId))}>Pause mission</button>{demoStep && <button className="mission-button" type="button" disabled={pending} onClick={() => void runAction(() => actions.advanceDemo(companionId, missionId))}>{demoStep.kind === 'permission' ? 'Advance to permission' : demoStep.kind === 'review' ? 'Prepare final review' : 'Advance demo one step'}</button>}</div>
            </>}
            {mission.status === 'waiting_permission' && <>
              <p className="mission-control-lead">Permission needed for this simulated action</p>
              <dl className="mission-gate"><div><dt>Action</dt><dd>{mission.gate.action}</dd></div><div><dt>Resource</dt><dd>{mission.gate.resource}</dd></div></dl>
              <p>{mission.gate.explanation}</p>
              <div className="mission-control-row"><button ref={actionRef} className="mission-button" type="button" disabled={pending} onClick={() => void runAction(() => actions.decidePermission(companionId, missionId, mission.gate.id, 'approve'))}>Approve this action</button><button className="mission-button mission-button-secondary" type="button" disabled={pending} onClick={() => void runAction(() => actions.decidePermission(companionId, missionId, mission.gate.id, 'decline'))}>Decline</button><button className="mission-text-button" type="button" disabled={pending} onClick={() => void runAction(() => actions.pauseMission(companionId, missionId))}>Pause</button></div>
            </>}
            {mission.status === 'paused' && <>
              <p>{mission.resumeState.status === 'waiting_permission' ? 'The same permission request remains unresolved. Resume to decide it.' : 'Work is stopped at this point. Resume when you want to continue.'}</p>
              <button ref={actionRef} className="mission-button" type="button" disabled={pending} onClick={() => void runAction(() => actions.resumeMission(companionId, missionId))}>Resume mission</button>
            </>}
            {mission.status === 'awaiting_review' && <>
              <p className="mission-control-lead">This mission is paused while you review the deliverable.</p>
              <div className="mission-control-row"><button ref={actionRef} className="mission-button mission-button-warm" type="button" disabled={pending} onClick={() => void runAction(() => actions.confirmCompletion(companionId, missionId))}>Confirm complete</button></div>
              <p>Request corrections from the goal controls above.</p>
            </>}
            {mission.status === 'completed' && <p className="mission-complete-copy">You confirmed this mission complete. Its conversation, history and deliverables stay here.</p>}
          </section>

          <section className="mission-deliverables" aria-labelledby={`mission-deliverables-title-${missionId}`}>
            <h3 id={`mission-deliverables-title-${missionId}`}>Deliverables</h3>
            {deliverables.length === 0 ? <p className="mission-muted">No deliverables yet. Advance the demo to create a sample output.</p> : deliverables.map((deliverable) => (
              <article className="mission-deliverable" key={deliverable.id}>
                <p className="mission-deliverable-kind">{deliverable.kind} · {deliverable.id === ('deliverableId' in mission ? mission.deliverableId : null) ? mission.status === 'completed' ? 'confirmed' : 'ready for review' : 'earlier output'}</p>
                <h4>{deliverable.title}</h4>
                <time dateTime={deliverable.createdAt}>{formatTime(deliverable.createdAt)}</time>
                <p className="mission-deliverable-body">{deliverable.body}</p>
              </article>
            ))}
          </section>
        </aside>
      </div>
    </article>
  );
}

/** Reads the selected mission and remounts its drafts when either scope changes. */
export function MissionDetail() {
  const { snapshot, view, navigate } = useApp();
  if (view.kind !== 'workspace' || !view.missionId) return null;
  const mission = getMission(snapshot, view.companionId, view.missionId);
  if (!mission) return <section className="mission-missing"><p>This mission is unavailable.</p><button className="mission-text-button" type="button" onClick={() => navigate({ kind: 'workspace', companionId: view.companionId, missionId: null })}>Return to general conversation</button></section>;
  return <MissionDetailView key={`${view.companionId}-${mission.id}`} companionId={view.companionId} missionId={mission.id} />;
}
