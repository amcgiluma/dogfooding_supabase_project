import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { OnboardingInput } from '../../domain/types';
import { useApp } from '../../app/AppProvider';
import type { MotionPreferences } from '../../app/motion';
import { useTypedPrompt } from '../../app/useTypedPrompt';
import './onboarding.css';

const steps = ['you', 'goal', 'use', 'companion'] as const;
type Step = (typeof steps)[number];

const stepIndex: Record<Step, number> = { you: 0, goal: 1, use: 2, companion: 3 };
const goalSuggestions = ['Ship a first version', 'Explore an idea', 'Keep track of changes'];
const useSuggestions = ['Build something', 'Research a question', 'Stay on top of changes'];

function makeStarField(seed: number, count: number) {
  let value = seed;
  return Array.from({ length: count }, (_, index) => {
    value = (value * 16807) % 2147483647;
    const x = (value / 2147483647) * 1440;
    value = (value * 16807) % 2147483647;
    const y = (value / 2147483647) * 900;
    value = (value * 16807) % 2147483647;
    const radius = 0.45 + (value / 2147483647) * 0.75;
    const opacity = 0.36 + (value / 2147483647) * 0.5;
    return { x, y, radius, opacity, id: `${seed}-${index}` };
  });
}

// Fixed fields are built once so React renders never reshuffle the sky.
const starFields = [makeStarField(29, 76), makeStarField(91, 54)] as const;

function StellarScene({ reducedMotion, hidden }: { reducedMotion: boolean; hidden: boolean }) {
  return (
    <div
      className={`onboarding-scene${reducedMotion ? ' is-static' : ''}${hidden ? ' is-paused' : ''}`}
      aria-hidden="true"
    >
      <div className="onboarding-sky-layer onboarding-sky-layer-distant">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-80 610C176 420 282 430 482 510s321 125 496 36 281-192 542-180" />
          <path d="M182 900c116-236 236-358 407-391s253 73 401 44 270-166 450-322" />
          {starFields[0].map((star) => <circle key={star.id} cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />)}
        </svg>
      </div>
      <div className="onboarding-sky-layer onboarding-sky-layer-near">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-90 292c224 124 343 110 498 8s288-177 433-90 248 237 399 226 176-109 310-202" />
          <path d="M296-70c106 210 191 285 333 301s225-121 360-95 233 204 382 263" />
          {starFields[1].map((star) => <circle key={star.id} cx={star.x} cy={star.y} r={star.radius} opacity={star.opacity} />)}
        </svg>
      </div>
    </div>
  );
}

/** Collects the first profile and opens the new companion's general chat. */
export function Onboarding({ motion }: { motion: MotionPreferences }) {
  const { actions, navigate } = useApp();
  const [step, setStep] = useState<Step>('you');
  const [draft, setDraft] = useState<OnboardingInput>({
    name: '',
    goal: '',
    intendedUse: '',
    companionName: 'Raiden',
    appearance: 'skull',
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const submitLock = useRef(false);
  const activeField = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const prompt = step === 'you'
    ? 'First things first. What should I call you?'
    : step === 'goal'
      ? `Nice to meet you, ${draft.name.trim()}. What would you like to make progress on?`
      : step === 'use'
        ? 'What kind of help should we start with?'
        : 'One last thing. What should we call your companion?';
  const typedPrompt = useTypedPrompt(prompt, motion.reduced, motion.hidden);

  useEffect(() => {
    activeField.current?.focus();
  }, [step]);

  function updateDraft<K extends keyof OnboardingInput>(key: K, value: OnboardingInput[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError('');
  }

  function validateCurrentStep() {
    if (step === 'you' && !draft.name.trim()) return 'Add your name to continue.';
    if (step === 'goal' && !draft.goal.trim()) return 'Add a goal to continue.';
    if (step === 'use' && !draft.intendedUse.trim()) return 'Tell me how you would like to use a companion.';
    if (step === 'companion' && !draft.companionName.trim()) return 'Give your companion a name.';
    return '';
  }

  async function finishOnboarding() {
    if (submitLock.current) return;
    submitLock.current = true;
    setPending(true);
    setError('');

    try {
      const result = await actions.completeOnboarding({
        name: draft.name.trim(),
        goal: draft.goal.trim(),
        intendedUse: draft.intendedUse.trim(),
        companionName: draft.companionName.trim(),
        appearance: draft.appearance,
      });
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      navigate({ kind: 'workspace', companionId: result.value.companionId, missionId: null });
    } catch {
      setError('I could not save that just now. Please try again.');
    } finally {
      submitLock.current = false;
      setPending(false);
    }
  }

  function goForward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      activeField.current?.focus();
      return;
    }
    if (step === 'companion') {
      void finishOnboarding();
      return;
    }
    const next = steps[stepIndex[step] + 1];
    if (next) setStep(next);
    setError('');
  }

  function goBack() {
    if (pending) return;
    const previous = steps[stepIndex[step] - 1];
    if (previous) {
      setStep(previous);
      setError('');
    }
  }

  const descriptionIds = `onboarding-prompt${error ? ' onboarding-error' : ''}`;

  return (
    <main className="onboarding-page">
      <StellarScene key={step} reducedMotion={motion.reduced} hidden={motion.hidden} />
      <p className="onboarding-wordmark">RAIDEN<span> / PERSONAL</span></p>

      <div className="onboarding-mascot" role="img" aria-label="Reserved space for your future mascot">
        <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
      </div>

      <section className="onboarding-copy" aria-labelledby="onboarding-greeting">
        <p className="onboarding-greeting" id="onboarding-greeting">hello, human.</p>
        <p className="onboarding-step">Step {stepIndex[step] + 1} of {steps.length}</p>

        <div className="onboarding-conversation" key={step}>
          <div className="onboarding-prompt-wrap">
            <h1 className="onboarding-prompt" id="onboarding-prompt">
            <span className="onboarding-prompt-measure" aria-hidden="true">{prompt}</span>
            <span className="onboarding-prompt-typed" aria-hidden="true">{typedPrompt}</span>
            <span className="onboarding-screen-reader-only">{prompt}</span>
            </h1>
          </div>

          {stepIndex[step] > stepIndex.you && (
            <div className="onboarding-reply"><span>Your name</span><p>{draft.name.trim()}</p></div>
          )}
          {stepIndex[step] > stepIndex.goal && (
            <div className="onboarding-reply"><span>Your goal</span><p>{draft.goal.trim()}</p></div>
          )}
          {stepIndex[step] > stepIndex.use && (
            <div className="onboarding-reply"><span>How you’ll use your companion</span><p>{draft.intendedUse.trim()}</p></div>
          )}

          <form className="onboarding-form" onSubmit={goForward} noValidate>
            {step === 'you' && (
              <label className="onboarding-field" htmlFor="onboarding-name">
                Your name
                <input
                  ref={(node) => { activeField.current = node; }}
                  id="onboarding-name"
                  autoComplete="given-name"
                  value={draft.name}
                  aria-invalid={Boolean(error) || undefined}
                  aria-describedby={descriptionIds}
                  onChange={(event) => updateDraft('name', event.target.value)}
                />
              </label>
            )}

            {step === 'goal' && (
              <>
                <label className="onboarding-field" htmlFor="onboarding-goal">
                  Your goal
                  <textarea
                    ref={(node) => { activeField.current = node; }}
                    id="onboarding-goal"
                    rows={3}
                    value={draft.goal}
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={descriptionIds}
                    onChange={(event) => updateDraft('goal', event.target.value)}
                    placeholder="What would you like help with?"
                  />
                </label>
                <div className="onboarding-suggestions" aria-label="Goal suggestions">
                  {goalSuggestions.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => updateDraft('goal', suggestion)}>{suggestion}</button>
                  ))}
                </div>
              </>
            )}

            {step === 'use' && (
              <>
                <label className="onboarding-field" htmlFor="onboarding-use">
                  How would you like to use a companion?
                  <textarea
                    ref={(node) => { activeField.current = node; }}
                    id="onboarding-use"
                    rows={3}
                    value={draft.intendedUse}
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={descriptionIds}
                    onChange={(event) => updateDraft('intendedUse', event.target.value)}
                    placeholder="A few words is enough"
                  />
                </label>
                <div className="onboarding-suggestions" aria-label="Ways to use your companion">
                  {useSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      aria-pressed={draft.intendedUse === suggestion}
                      onClick={() => updateDraft('intendedUse', suggestion)}
                    >{suggestion}</button>
                  ))}
                </div>
              </>
            )}

            {step === 'companion' && (
              <>
                <label className="onboarding-field" htmlFor="onboarding-companion-name">
                  Companion name
                  <input
                    ref={(node) => { activeField.current = node; }}
                    id="onboarding-companion-name"
                    maxLength={48}
                    value={draft.companionName}
                    aria-invalid={Boolean(error) || undefined}
                    aria-describedby={descriptionIds}
                    onChange={(event) => updateDraft('companionName', event.target.value)}
                  />
                </label>
                <p className="onboarding-note">Your profile is saved on this device.</p>
              </>
            )}

            {error && <p className="onboarding-error" id="onboarding-error" role="alert">{error}</p>}
            <div className="onboarding-actions">
              {step !== 'you' && <button className="onboarding-button secondary" type="button" onClick={goBack} disabled={pending}>Back</button>}
              <button className="onboarding-button" type="submit" disabled={pending}>
                {pending ? 'Saving…' : step === 'companion' ? 'Enter chat' : 'Continue'}
                {!pending && step !== 'companion' && <span aria-hidden="true"> →</span>}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
