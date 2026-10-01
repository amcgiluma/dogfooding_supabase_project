import { useRef, useState, type FormEvent } from 'react';
import { useApp } from '../../app/AppProvider';
import './home.css';

/** Compact companion management. Saved appearance values stay untouched. */
export function Home() {
  const { snapshot, actions, navigate } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState('');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const createTriggerRef = useRef<HTMLButtonElement>(null);
  const identityTriggers = useRef(new Map<string, HTMLButtonElement>());

  async function createCompanion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingId('new'); setError('');
    const result = await actions.createCompanion({ name: createName, appearance: 'skull' });
    setPendingId(null);
    if (!result.ok) { setError(result.error.message); return; }
    setCreateOpen(false); setCreateName('');
    navigate({ kind: 'workspace', companionId: result.value.companionId, missionId: null });
  }
  async function renameCompanion(event: FormEvent<HTMLFormElement>, companionId: string) {
    event.preventDefault(); setPendingId(companionId); setError('');
    const result = await actions.renameCompanion(companionId, nameDraft);
    setPendingId(null);
    if (!result.ok) { setError(result.error.message); return; }
    setEditingId(null); requestAnimationFrame(() => identityTriggers.current.get(companionId)?.focus());
  }

  return <main className="home-page">
    <header className="home-heading"><div><h1>Companions</h1><p>Each companion keeps their own conversations and missions.</p></div><button ref={createTriggerRef} className="home-button" type="button" aria-expanded={createOpen} onClick={() => { setCreateOpen((open) => !open); setError(''); }}>{createOpen ? 'Cancel' : 'Create companion +'}</button></header>
    {createOpen && <form className="home-create" onSubmit={(event) => void createCompanion(event)} onKeyDown={(event) => { if (event.key === 'Escape') { setCreateOpen(false); createTriggerRef.current?.focus(); } }}><label htmlFor="new-companion-name">Name your companion</label><div className="home-create-row"><input id="new-companion-name" autoFocus required maxLength={48} value={createName} aria-invalid={Boolean(error)} aria-describedby={error ? 'home-error' : undefined} onChange={(event) => { setCreateName(event.target.value); setError(''); }} placeholder="A new companion"/><button className="home-button" type="submit" disabled={pendingId === 'new'}>{pendingId === 'new' ? 'Creating…' : 'Create and open'}</button></div><p>A new companion starts with an empty workspace.</p></form>}
    {error && <p id="home-error" className="home-error" role="alert">{error}</p>}
    {snapshot.companions.length === 0 ? <p className="home-empty">No companions yet. Create one to start a conversation.</p> : <ul className="home-companions">{snapshot.companions.map((companion) => {
      const missions = snapshot.missions.filter((mission) => mission.companionId === companion.id);
      return <li className="home-companion" key={companion.id}><div className="mascot-slot" role="img" aria-label="Reserved space for your future mascot"><i/><i/><i/><i/></div><div className="home-companion-copy"><div className="home-companion-title">{editingId === companion.id ? <form className="home-rename" onSubmit={(event) => void renameCompanion(event, companion.id)} onKeyDown={(event) => { if (event.key === 'Escape') { setEditingId(null); requestAnimationFrame(() => identityTriggers.current.get(companion.id)?.focus()); } }}><label className="visually-hidden" htmlFor={`rename-${companion.id}`}>Rename {companion.name}</label><input id={`rename-${companion.id}`} autoFocus maxLength={48} value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} /><button className="home-text-button" type="submit" disabled={pendingId === companion.id}>Save</button><button className="home-text-button" type="button" onClick={() => { setEditingId(null); requestAnimationFrame(() => identityTriggers.current.get(companion.id)?.focus()); }}>Cancel</button></form> : <><h2>{companion.name}</h2><button ref={(node) => { if (node) identityTriggers.current.set(companion.id, node); else identityTriggers.current.delete(companion.id); }} className="home-text-button" type="button" onClick={() => { setEditingId(companion.id); setNameDraft(companion.name); setError(''); }}>Rename</button></>}</div><p>{missions.length ? `${missions.length} ${missions.length === 1 ? 'mission' : 'missions'}` : 'No missions yet'}</p><div className="home-actions"><button className="home-button" type="button" onClick={() => navigate({ kind: 'workspace', companionId: companion.id, missionId: null })}>Open chat</button>{missions.map((mission) => <button className="home-text-button" type="button" key={mission.id} onClick={() => navigate({ kind: 'workspace', companionId: companion.id, missionId: mission.id })}>Open: {mission.objective}</button>)}</div></div></li>;
    })}</ul>}
  </main>;
}
