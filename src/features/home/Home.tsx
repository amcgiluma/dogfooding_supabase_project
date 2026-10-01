import { useRef, useState, type FormEvent } from 'react';
import { useApp } from '../../app/AppProvider';
import { APPEARANCES } from '../../domain/seeds';
import type { Appearance } from '../../domain/types';
import './home.css';

/** Lists each companion and keeps identity changes scoped to that companion. */
export function Home() {
  const { snapshot, actions, navigate } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createAppearance, setCreateAppearance] = useState<Appearance>('skull');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [appearanceId, setAppearanceId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const createTriggerRef = useRef<HTMLButtonElement>(null);
  const identityTriggers = useRef(new Map<string, HTMLButtonElement>());
  const appearanceTriggers = useRef(new Map<string, HTMLButtonElement>());

  async function createCompanion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingId('new');
    setError('');
    const result = await actions.createCompanion({ name: createName, appearance: createAppearance });
    setPendingId(null);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setCreateOpen(false);
    setCreateName('');
    navigate({ kind: 'workspace', companionId: result.value.companionId, missionId: null });
  }

  async function renameCompanion(event: FormEvent<HTMLFormElement>, companionId: string) {
    event.preventDefault();
    setPendingId(companionId);
    setError('');
    const result = await actions.renameCompanion(companionId, nameDraft);
    setPendingId(null);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setEditingId(null);
    window.requestAnimationFrame(() => identityTriggers.current.get(companionId)?.focus());
  }

  async function chooseAppearance(companionId: string, appearance: Appearance) {
    setPendingId(companionId);
    setError('');
    const result = await actions.setCompanionAppearance(companionId, appearance);
    setPendingId(null);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setAppearanceId(null);
    appearanceTriggers.current.get(companionId)?.focus();
  }

  const profileName = snapshot.profile?.name.trim();

  return (
    <main className="home-page">
      <header className="home-heading">
        <div>
          <p className="home-eyebrow">Your companions</p>
          <h1>{profileName ? `Good to see you, ${profileName}.` : 'Choose who you want beside you.'}</h1>
          <p className="home-lede">Each companion keeps their own conversations and missions.</p>
        </div>
          <button ref={createTriggerRef} className="home-button" type="button" onClick={() => { setCreateOpen((open) => !open); setError(''); }} aria-expanded={createOpen}>
          {createOpen ? 'Cancel' : 'Create companion +'}</button>
      </header>

      {createOpen && (
        <form className="home-create" onSubmit={createCompanion} onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setCreateOpen(false);
            createTriggerRef.current?.focus();
          }
        }}>
          <label className="home-field">
            Name your companion
            <input autoFocus maxLength={48} value={createName} aria-invalid={!!error || undefined} aria-describedby={error ? 'home-error' : undefined} onChange={(event) => { setCreateName(event.target.value); setError(''); }} placeholder="A new companion" />
          </label>
          <fieldset className="home-appearance-picker">
            <legend>Choose an appearance</legend>
            {APPEARANCES.map((item) => (
              <label className="home-appearance-option" key={item.id}>
                <input type="radio" name="new-appearance" value={item.id} checked={createAppearance === item.id} onChange={() => setCreateAppearance(item.id)} />
                <img src={item.src} alt="" />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
          <p className="home-hint">A new companion starts with an empty workspace.</p>
          <button className="home-button" type="submit" disabled={pendingId === 'new'}>{pendingId === 'new' ? 'Creating…' : 'Create and open'}</button>
        </form>
      )}

      {error && <p className="home-error" id="home-error" role="alert">{error}</p>}

      {snapshot.companions.length === 0 ? (
        <section className="home-empty" aria-labelledby="home-empty-title">
          <img src="/companions/skull.png" alt="" />
          <div>
            <h2 id="home-empty-title">Start with a companion</h2>
            <p>Your new workspace will be ready for its first mission.</p>
            {!createOpen && <button className="home-button" type="button" onClick={() => setCreateOpen(true)}>Create companion +</button>}
          </div>
        </section>
      ) : (
        <section className={`home-companions${snapshot.companions.length === 1 ? ' single' : ''}`} aria-label="Companions">
          {snapshot.companions.map((companion) => {
            const selectedAppearance = APPEARANCES.find((item) => item.id === companion.appearance) ?? APPEARANCES[0];
            const companionMissions = snapshot.missions.filter((mission) => mission.companionId === companion.id);
            return (
              <article className="home-companion" key={companion.id}>
                <button className="home-open" type="button" onClick={() => navigate({ kind: 'workspace', companionId: companion.id, missionId: null })} aria-label={`Open ${companion.name}`}>
                  <img className="home-companion-art" src={selectedAppearance.src} alt="" />
                </button>
                <div className="home-companion-name">
                  <h2>{companion.name}</h2>
                  {editingId === companion.id ? (
                    <form className="home-rename" onSubmit={(event) => void renameCompanion(event, companion.id)} onKeyDown={(event) => { if (event.key === 'Escape') { setEditingId(null); window.requestAnimationFrame(() => identityTriggers.current.get(companion.id)?.focus()); } }}>
                      <label className="home-field">
                        Rename {companion.name}
                        <input autoFocus maxLength={48} value={nameDraft} aria-invalid={!!error || undefined} aria-describedby={error ? 'home-error' : undefined} onChange={(event) => { setNameDraft(event.target.value); setError(''); }} />
                      </label>
                      <button className="home-text-button" type="submit" disabled={pendingId === companion.id}>Save name</button>
                      <button className="home-text-button" type="button" onClick={() => { setEditingId(null); window.requestAnimationFrame(() => identityTriggers.current.get(companion.id)?.focus()); }}>Cancel</button>
                    </form>
                  ) : (
                    <div className="home-actions">
                      <button ref={(node) => { if (node) identityTriggers.current.set(companion.id, node); else identityTriggers.current.delete(companion.id); }} className="home-text-button" type="button" onClick={() => { setEditingId(companion.id); setNameDraft(companion.name); setError(''); }}>Rename</button>
                      <button ref={(node) => { if (node) appearanceTriggers.current.set(companion.id, node); else appearanceTriggers.current.delete(companion.id); }} className="home-text-button" type="button" aria-expanded={appearanceId === companion.id} onClick={() => setAppearanceId((current) => current === companion.id ? null : companion.id)}>Choose appearance</button>
                    </div>
                  )}
                  {appearanceId === companion.id && (
                    <fieldset className="home-appearance-picker" aria-describedby={error ? 'home-error' : undefined}>
                      <legend>Appearance for {companion.name}</legend>
                      {APPEARANCES.map((item) => (
                        <label className="home-appearance-option" key={item.id}>
                          <input type="radio" name={`appearance-${companion.id}`} value={item.id} checked={companion.appearance === item.id} disabled={pendingId === companion.id} onChange={() => void chooseAppearance(companion.id, item.id)} />
                          <img src={item.src} alt="" />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}
                  <button className="home-button home-open-action" type="button" onClick={() => navigate({ kind: 'workspace', companionId: companion.id, missionId: null })}>Open {companion.name} →</button>
                  <div className="home-missions">
                    <h3>Missions</h3>
                    {companionMissions.length === 0 ? <p className="home-hint">No missions yet.</p> : (
                      <ul>
                        {companionMissions.map((mission) => {
                          const status = mission.status === 'awaiting_review' ? 'Paused · Ready for review'
                            : mission.status === 'waiting_permission' ? 'Waiting for permission'
                              : mission.status === 'paused' ? 'Paused'
                                : mission.status === 'completed' ? 'Complete' : 'Active';
                          return (
                            <li key={mission.id}>
                              <span>{mission.objective}<small>{status}</small></span>
                              <button className="home-text-button" type="button" onClick={() => navigate({ kind: 'workspace', companionId: companion.id, missionId: mission.id })}>Open →</button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <p className="home-demo-note">Demo · conversations and missions stay with their companion.</p>
    </main>
  );
}
