import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useApp } from '../../app/AppProvider';
import type { MissionKind } from '../../domain/types';
import './create-mission.css';

interface CreateMissionProps { companionId: string; onClose: (restoreFocus?: boolean) => void }
interface Example { kind: MissionKind; title: string; objective: string }

const examples: Example[] = [
  { kind: 'app', title: 'Build an app', objective: 'Build a small first version of my app idea' },
  { kind: 'research', title: 'Research an idea', objective: 'Research the options for my idea and share the findings' },
  { kind: 'monitoring', title: 'Watch for changes', objective: 'Watch for changes that matter to me and summarize them' },
];
const kinds: { id: MissionKind; label: string }[] = [
  { id: 'app', label: 'App' }, { id: 'research', label: 'Research' },
  { id: 'monitoring', label: 'Monitoring' }, { id: 'custom', label: 'Custom' },
];

function recommendedDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Modal mission form. The date is a target only; it never schedules work. */
export function CreateMission({ companionId, onClose }: CreateMissionProps) {
  const { actions, navigate } = useApp();
  const objectiveRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pendingRef = useRef(false);
  const [kind, setKind] = useState<MissionKind>('app');
  const [objective, setObjective] = useState('');
  const [targetDate, setTargetDate] = useState(recommendedDate);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const objectiveId = `create-mission-objective-${companionId}`;
  const dateId = `create-mission-date-${companionId}`;
  const errorId = `${objectiveId}-error`;
  useEffect(() => { const dialog = dialogRef.current; if (dialog && !dialog.open) dialog.showModal(); }, []);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current) return;
    if (!objective.trim()) {
      setError('Enter a short objective to create this mission.');
      objectiveRef.current?.focus();
      return;
    }
    pendingRef.current = true;
    setPending(true);
    setError('');
    const result = await actions.createMission(companionId, { kind, objective, targetDate: targetDate || null });
    pendingRef.current = false;
    setPending(false);
    if (!result.ok) {
      setError(result.error.message);
      objectiveRef.current?.focus();
      return;
    }
    onClose(false);
    navigate({ kind: 'workspace', companionId, missionId: result.value.missionId });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  }

  function applyExample(example: Example) {
    setKind(example.kind);
    setObjective(example.objective);
    setError('');
    objectiveRef.current?.focus();
  }

  return (
    <dialog ref={dialogRef} className="create-mission" aria-labelledby="create-mission-title" onKeyDown={handleKeyDown} onCancel={(event) => { event.preventDefault(); onClose(); }} onClose={() => onClose()}>
      <div className="create-mission-heading">
        <h2 id="create-mission-title">Create a mission</h2>
        <button className="create-mission-text-button" type="button" onClick={() => onClose()}>Cancel</button>
      </div>
      <form className="create-mission-form" onSubmit={(event) => void create(event)}>
        <label className="create-mission-field" htmlFor={objectiveId}>
          Short objective
          <input autoFocus ref={objectiveRef} id={objectiveId} value={objective} maxLength={180} onChange={(event) => { setObjective(event.target.value); setError(''); }} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} placeholder="What should we work toward?" />
        </label>
        {error && <p className="create-mission-error" id={errorId} role="alert">{error}</p>}
        <fieldset className="create-mission-kinds">
          <legend>Mission type</legend>
          {kinds.map((item) => <label key={item.id} className="create-mission-kind">
            <input type="radio" name={`mission-kind-${companionId}`} value={item.id} checked={kind === item.id} onChange={() => setKind(item.id)} />
            <span>{item.label}</span>
          </label>)}
        </fieldset>
        <label className="create-mission-field" htmlFor={dateId}>
          Recommended date · optional
          <input id={dateId} type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
        </label>
        <p className="create-mission-hint">An editable target for the plan, not a scheduled job. Clear the date to leave it open.</p>
        <button className="create-mission-submit" type="submit" disabled={pending}>{pending ? 'Creating…' : 'Create and open mission'}</button>
      </form>
      <div className="create-mission-examples" aria-label="Objective examples">
        {examples.map((example) => <article className="create-mission-example" key={example.kind}>
          <div><strong>{example.title}</strong><p>{example.objective}</p>
            <button className="create-mission-text-button" type="button" onClick={() => applyExample(example)}>Use example</button>
          </div>
        </article>)}
      </div>
      <p className="create-mission-demo">Demo · missions stay with this companion.</p>
    </dialog>
  );
}
