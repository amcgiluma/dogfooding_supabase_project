import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useApp } from '../../app/AppProvider';
import type { MotionPreferences } from '../../app/motion';
import { useTypedPrompt } from '../../app/useTypedPrompt';
import type { MissionKind } from '../../domain/types';
import './create-mission.css';

interface CreateMissionProps {
  companionId: string;
  companionName: string;
  open: boolean;
  motion: MotionPreferences;
  onClose: (restoreFocus?: boolean) => void;
}
interface Example { title: string; objective: string }
type Step = 1 | 2 | 3;

const examples: Example[] = [
  { title: 'Build an app', objective: 'Build a small first version of my app idea' },
  { title: 'Research an idea', objective: 'Research the options for my idea and share the findings' },
  { title: 'Watch for changes', objective: 'Watch for changes that matter to me and summarize them' },
];
const kinds: { id: MissionKind; label: string; response: string }[] = [
  { id: 'app', label: 'App', response: 'We’ll start with one useful screen.' },
  { id: 'research', label: 'Research', response: 'We’ll compare what matters to your question.' },
  { id: 'monitoring', label: 'Monitoring', response: 'We’ll define which changes deserve your attention.' },
  { id: 'custom', label: 'Custom', response: 'We’ll agree on a small result you can review.' },
];

function MissionPrompt({ companionName, prompt, motion, open, reply }: { companionName: string; prompt: string; motion: MotionPreferences; open: boolean; reply?: string }) {
  const typedPrompt = useTypedPrompt(prompt, motion.reduced, motion.hidden || !open);
  return (
    <div className="create-mission-prompt-line">
      <div className="create-mission-companion">
        <div className="mascot-slot create-mission-mascot" aria-hidden="true"><i /><i /><i /><i /></div>
        <span>{companionName}</span>
      </div>
      <div className="create-mission-prompt-copy">
        <h2 id="create-mission-current-prompt" className="create-mission-prompt">
          <span className="create-mission-prompt-measure" aria-hidden="true">{prompt}</span>
          <span className="create-mission-prompt-typed" aria-hidden="true">{typedPrompt}</span>
          <span className="create-mission-screen-reader-only">{prompt}</span>
        </h2>
        {reply && <p className="create-mission-reply">{reply}</p>}
      </div>
    </div>
  );
}

/** Three conversational steps share one native dialog; cancel keeps the draft in this workspace. */
export function CreateMission({ companionId, companionName, open, motion, onClose }: CreateMissionProps) {
  const { actions, navigate } = useApp();
  const objectiveRef = useRef<HTMLTextAreaElement>(null);
  const typeRef = useRef<HTMLInputElement>(null);
  const reviewRef = useRef<HTMLHeadingElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pendingRef = useRef(false);
  const [step, setStep] = useState<Step>(1);
  const [kind, setKind] = useState<MissionKind>('app');
  const [objective, setObjective] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const objectiveId = `create-mission-objective-${companionId}`;
  const dateId = `create-mission-date-${companionId}`;
  const errorId = `${objectiveId}-error`;
  const selectedKind = kinds.find((item) => item.id === kind)!;
  const formattedTarget = targetDate
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${targetDate}T00:00:00.000Z`))
    : 'No target date';
  const prompt = step === 1
    ? 'What should we work toward?'
    : step === 2
      ? 'What kind of mission is this?'
      : 'Here’s our mission.';
  const reply = step === 1
    ? 'Tell me the result you want. We’ll shape the first step together.'
    : step === 2
      ? selectedKind.response
      : 'Check the goal and details. Start when you’re ready.';

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const frame = requestAnimationFrame(() => {
      if (!dialog.open) dialog.showModal();
      if (step === 1) objectiveRef.current?.focus();
      if (step === 2) typeRef.current?.focus();
      if (step === 3) reviewRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, step]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingRef.current || pending) return;
    if (step === 1) {
      if (!objective.trim()) {
        setError('Enter a mission objective to continue.');
        objectiveRef.current?.focus();
        return;
      }
      setError('');
      setStep(2);
      return;
    }
    if (step === 2) {
      setError('');
      setStep(3);
      return;
    }

    pendingRef.current = true;
    setPending(true);
    setError('');
    try {
      const result = await actions.createMission(companionId, { kind, objective: objective.trim(), targetDate: targetDate || null });
      if (!result.ok) {
        setError(result.error.message);
        requestAnimationFrame(() => submitRef.current?.focus());
        return;
      }
      setStep(1);
      setKind('app');
      setObjective('');
      setTargetDate('');
      onClose(false);
      navigate({ kind: 'workspace', companionId, missionId: result.value.missionId });
    } catch {
      setError('I could not create that mission just now. Please try again.');
      requestAnimationFrame(() => submitRef.current?.focus());
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  }

  function close() {
    if (!pendingRef.current) onClose();
  }

  function goBack() {
    if (pendingRef.current) return;
    setError('');
    setStep(step === 3 ? 2 : 1);
  }

  function useExample(example: Example) {
    if (pendingRef.current) return;
    setObjective(example.objective);
    setError('');
    objectiveRef.current?.focus();
  }

  return (
    <dialog
      ref={dialogRef}
      className={`create-mission${motion.reduced || motion.hidden ? ' motion-static' : ''}`}
      aria-labelledby="create-mission-current-prompt"
      onCancel={(event) => { event.preventDefault(); close(); }}
    >
      <div className="create-mission-heading">
        <span className="create-mission-heading-label">NEW MISSION</span>
        <button className="create-mission-text-button" type="button" disabled={pending} onClick={close}>Cancel</button>
      </div>
      <div className="create-mission-layout">
        <div className="create-mission-main">
          <div className="create-mission-transcript" aria-label="Conversation so far">
            {step > 1 && <><p><span>{companionName}</span>What should we work toward?</p><p><span>You</span>{objective}</p></>}
            {step > 2 && <><p><span>{companionName}</span>What kind of mission is this?</p><p><span>You</span>{selectedKind.label}{targetDate ? ` · Target ${formattedTarget}` : ''}</p></>}
          </div>
          <MissionPrompt companionName={companionName} prompt={prompt} reply={reply} motion={motion} open={open} />
          <form className="create-mission-form" onSubmit={(event) => void create(event)} noValidate>
            {step === 1 && <>
              <label className="create-mission-field" htmlFor={objectiveId}>Mission objective
                <textarea ref={objectiveRef} id={objectiveId} rows={3} value={objective} maxLength={180} onChange={(event) => { setObjective(event.target.value); setError(''); }} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
              </label>
              <div className="create-mission-examples" aria-label="Objective examples">
                {examples.map((example) => <button className="create-mission-example" key={example.title} type="button" disabled={pending} onClick={() => useExample(example)}><span>{example.title}</span><span>Use example</span></button>)}
              </div>
              {error && <p className="create-mission-error" id={errorId} role="alert">{error}</p>}
              <div className="create-mission-actions"><span /><button className="create-mission-submit" type="submit" disabled={pending}>Continue</button></div>
            </>}
            {step === 2 && <>
              <fieldset className="create-mission-kinds"><legend>Mission type</legend>
                {kinds.map((item) => <label key={item.id} className="create-mission-kind"><input ref={item.id === kind ? typeRef : undefined} type="radio" name={`mission-kind-${companionId}`} value={item.id} checked={kind === item.id} onChange={() => { setKind(item.id); setError(''); }} /><span>{item.label}</span></label>)}
              </fieldset>
              <label className="create-mission-field" htmlFor={dateId}>Target date (optional)
                <input id={dateId} type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
              </label>
              <p className="create-mission-hint">A target, not a schedule.</p>
              {error && <p className="create-mission-error" role="alert">{error}</p>}
              <div className="create-mission-actions"><button className="create-mission-back" type="button" disabled={pending} onClick={goBack}>Back</button><button className="create-mission-submit" type="submit" disabled={pending}>Review mission</button></div>
            </>}
            {step === 3 && <>
              <div className="create-mission-review" aria-labelledby="create-mission-review-title">
                <h3 id="create-mission-review-title" ref={reviewRef} tabIndex={-1}>Review mission</h3>
                <dl><div><dt>Goal</dt><dd>{objective.trim()}</dd></div><div><dt>Type</dt><dd>{selectedKind.label}</dd></div><div><dt>Target</dt><dd>{formattedTarget}</dd></div></dl>
                <div className="create-mission-review-actions"><button type="button" disabled={pending} onClick={() => { setError(''); setStep(1); }}>Edit objective</button><button type="button" disabled={pending} onClick={() => { setError(''); setStep(2); }}>Edit type and target</button></div>
              </div>
              {error && <p className="create-mission-error" role="alert">{error}</p>}
              <div className="create-mission-actions"><button className="create-mission-back" type="button" disabled={pending} onClick={goBack}>Back</button><button ref={submitRef} className="create-mission-submit" type="submit" disabled={pending}>{pending ? 'Creating…' : 'Start mission'}</button></div>
            </>}
          </form>
        </div>
        <aside className="create-mission-brief" aria-label="Mission brief">
          <p>MISSION BRIEF</p>
          <dl><div><dt>Goal</dt><dd>{objective.trim() || 'Not set'}</dd></div><div><dt>Type</dt><dd>{selectedKind.label}</dd></div><div><dt>Target</dt><dd>{targetDate ? formattedTarget : 'No target date'}</dd></div></dl>
        </aside>
      </div>
    </dialog>
  );
}
