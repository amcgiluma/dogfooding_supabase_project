import { useState, type FormEvent } from 'react';
import { APPEARANCES } from '../../domain/seeds';
import type { OnboardingInput } from '../../domain/types';
import { useApp } from '../../app/AppProvider';
import './onboarding.css';

const goalSuggestions = [
  'Ship a first version of my app',
  'Research an idea before I build it',
  'Keep an eye on changes that matter',
];

const useSuggestions = ['Build an app', 'Research an idea', 'Watch for changes'];

const steps = ['you', 'goal', 'use', 'companion'] as const;
type Step = (typeof steps)[number];

const stepIndex: Record<Step, number> = { you: 0, goal: 1, use: 2, companion: 3 };

/** Collects the first profile and creates its companion through the shared actions. */
export function Onboarding() {
  const { actions, navigate } = useApp();
  const [step, setStep] = useState<Step>('you');
  const [draft, setDraft] = useState<OnboardingInput>({
    name: '',
    goal: '',
    intendedUse: '',
    companionName: 'Morrow',
    appearance: 'skull',
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  function updateDraft<K extends keyof OnboardingInput>(key: K, value: OnboardingInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  }

  function goForward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentIndex = stepIndex[step];
    if (step === 'you' && !draft.name.trim()) {
      setError('Add your name to continue.');
      return;
    }
    if (step === 'goal' && !draft.goal.trim()) {
      setError('Add a goal to continue.');
      return;
    }
    if (step === 'use' && !draft.intendedUse.trim()) {
      setError('Tell me how you would like to use a companion.');
      return;
    }
    if (step === 'companion') {
      void finishOnboarding();
      return;
    }
    const next = steps[currentIndex + 1];
    if (next) setStep(next);
    setError('');
  }

  function goBack() {
    const previous = steps[stepIndex[step] - 1];
    if (previous) {
      setStep(previous);
      setError('');
    }
  }

  async function finishOnboarding() {
    if (!draft.companionName.trim()) {
      setError('Give your companion a name.');
      return;
    }
    setPending(true);
    setError('');
    const result = await actions.completeOnboarding({
      name: draft.name.trim(),
      goal: draft.goal.trim(),
      intendedUse: draft.intendedUse.trim(),
      companionName: draft.companionName.trim(),
      appearance: draft.appearance,
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    navigate({ kind: 'home' });
  }

  const appDevelopment = /app|develop|build|software/i.test(`${draft.goal} ${draft.intendedUse}`);
  const appearance = APPEARANCES.find((item) => item.id === draft.appearance) ?? APPEARANCES[0];
  const companionName = draft.companionName.trim() || 'your companion';

  return (
    <main className="onboarding-page">
      <div className="onboarding-copy">
        <p className="onboarding-eyebrow">A good place to begin</p>
        <h1>Hi, I’m {companionName}.</h1>
        <p className="onboarding-lede">I’m glad you’re here. Let’s find a useful next step together.</p>

        <div className="onboarding-conversation" aria-live="polite">
          <p className="onboarding-speaker">{companionName}</p>
          <p className="onboarding-prompt">
            {step === 'you' && 'What should I call you?'}
            {step === 'goal' && `Nice to meet you, ${draft.name.trim()}. What would you like to make progress on?`}
            {step === 'use' && 'What kind of help should we start with?'}
            {step === 'companion' && 'One last thing. What should your companion look like?'}
          </p>

          {step !== 'you' && <div className="onboarding-reply"><span>You</span><p>{draft.name.trim()}</p></div>}
          {stepIndex[step] > stepIndex.goal && <div className="onboarding-reply"><span>You</span><p>{draft.goal.trim()}</p></div>}
          {stepIndex[step] > stepIndex.use && <div className="onboarding-reply"><span>You</span><p>{draft.intendedUse.trim()}</p></div>}

          <form className="onboarding-form" onSubmit={goForward} noValidate>
            {step === 'you' && (
              <label className="onboarding-field">
                Your name
                <input autoFocus autoComplete="given-name" value={draft.name} aria-invalid={!!error || undefined} aria-describedby={error ? 'onboarding-error' : undefined} onChange={(event) => updateDraft('name', event.target.value)} />
              </label>
            )}

            {step === 'goal' && (
              <>
                <label className="onboarding-field">
                  Your goal
                  <textarea autoFocus rows={3} value={draft.goal} aria-invalid={!!error || undefined} aria-describedby={error ? 'onboarding-error' : undefined} onChange={(event) => updateDraft('goal', event.target.value)} placeholder="What would you like help with?" />
                </label>
                <div className="onboarding-suggestions" aria-label="Goal suggestions">
                  {goalSuggestions.map((suggestion) => (
                    <button className="onboarding-text-choice" key={suggestion} type="button" onClick={() => updateDraft('goal', suggestion)}>{suggestion}</button>
                  ))}
                </div>
              </>
            )}

            {step === 'use' && (
              <>
                <label className="onboarding-field">
                  Describe how you want to use a companion
                  <textarea autoFocus rows={3} value={draft.intendedUse} aria-invalid={!!error || undefined} aria-describedby={error ? 'onboarding-error' : undefined} onChange={(event) => updateDraft('intendedUse', event.target.value)} placeholder="A few words is enough" />
                </label>
                <div className="onboarding-suggestions" aria-label="Intended use suggestions">
                  {useSuggestions.map((suggestion) => (
                    <button className="onboarding-choice" key={suggestion} type="button" aria-pressed={draft.intendedUse === suggestion} onClick={() => updateDraft('intendedUse', suggestion)}>{suggestion}</button>
                  ))}
                </div>
                {appDevelopment && <p className="onboarding-hint">Vercel and Supabase connections can be added later. This demo does not connect to apps.</p>}
              </>
            )}

            {step === 'companion' && (
              <>
                <label className="onboarding-field">
                  Companion name
                  <input autoFocus maxLength={48} value={draft.companionName} aria-invalid={!!error || undefined} aria-describedby={error ? 'onboarding-error' : undefined} onChange={(event) => updateDraft('companionName', event.target.value)} />
                </label>
                <fieldset className="onboarding-appearance">
                  <legend>Choose an appearance</legend>
                  {APPEARANCES.map((item) => (
                    <label className="onboarding-appearance-choice" key={item.id}>
                      <input type="radio" name="appearance" value={item.id} checked={draft.appearance === item.id} onChange={() => updateDraft('appearance', item.id)} />
                      <img src={item.src} alt="" />
                      <span>{item.label}{item.id === 'wolf' ? ' · yellow frames, green lenses' : ''}</span>
                    </label>
                  ))}
                </fieldset>
                <p className="onboarding-hint">Your profile and companion are saved on this device. No account or app connection is needed.</p>
              </>
            )}

            {error && <p className="onboarding-error" id="onboarding-error" role="alert">{error}</p>}
            <div className="onboarding-actions">
              {step !== 'you' && <button className="onboarding-button secondary" type="button" onClick={goBack} disabled={pending}>Back</button>}
              <button className="onboarding-button" type="submit" disabled={pending}>
                {pending ? 'Saving…' : step === 'companion' ? 'Meet your companion' : 'Continue'}
                {!pending && step !== 'companion' && <span aria-hidden="true"> →</span>}
              </button>
            </div>
          </form>
        </div>
        <p className="onboarding-step">Step {stepIndex[step] + 1} of {steps.length}</p>
      </div>

      <div className="onboarding-artwork">
        <img src={appearance.src} alt={`${draft.companionName || 'Your companion'}, ${appearance.label.toLowerCase()} appearance`} />
        <p>{draft.companionName || 'Your companion'}</p>
      </div>
    </main>
  );
}
