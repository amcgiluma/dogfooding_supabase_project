import { useRef, useState, type ReactNode } from 'react';
import { useApp } from '../../app/AppProvider';
import { getCompanion, getCompanionMissions } from '../../domain/selectors';
import { APPEARANCES } from '../../domain/seeds';
import type { Mission } from '../../domain/types';
import { Chat } from '../chat/Chat';
import { CreateMission } from '../create-mission/CreateMission';
import './workspace.css';

interface WorkspaceProps { missionDetail?: ReactNode }

function statusLabel(mission: Mission): string {
  switch (mission.status) {
    case 'active': return 'Active';
    case 'waiting_permission': return 'Waiting for permission';
    case 'paused': return 'Paused';
    case 'awaiting_review': return 'Paused · Ready for review';
    case 'completed': return 'Completed';
  }
}

/** Companion workspace with one visible conversation scope and mission navigation. */
export function Workspace({ missionDetail }: WorkspaceProps) {
  const { snapshot, view, navigate } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const createTrigger = useRef<HTMLButtonElement>(null);
  if (view.kind !== 'workspace') return null;
  const { companionId, missionId } = view;
  const companion = getCompanion(snapshot, companionId);
  if (!companion) return <main className="workspace-page"><p>This companion is unavailable.</p><button className="workspace-text-button" type="button" onClick={() => navigate({ kind: 'home' })}>Return home</button></main>;
  const missions = getCompanionMissions(snapshot, companionId);
  const appearance = APPEARANCES.find((item) => item.id === companion.appearance) ?? APPEARANCES[0];

  function selectMission(nextMissionId: string | null) {
    navigate({ kind: 'workspace', companionId, missionId: nextMissionId });
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <div className="workspace-identity">
          <img src={appearance.src} alt="" />
          <div><p className="workspace-eyebrow">{companion.name} / Workspace</p><h1>{companion.name}</h1></div>
        </div>
        <div className="workspace-header-actions">
          <button className="workspace-text-button" type="button" onClick={() => navigate({ kind: 'home' })}>All companions</button>
          <button ref={createTrigger} className="workspace-create-button" type="button" aria-expanded={createOpen} aria-controls="workspace-create-region" onClick={() => {
            if (createOpen) { setCreateOpen(false); requestAnimationFrame(() => createTrigger.current?.focus()); }
            else setCreateOpen(true);
          }}>{createOpen ? 'Close create form' : 'Create mission +'}</button>
        </div>
      </header>

      <div id="workspace-create-region">{createOpen && <CreateMission companionId={companionId} onClose={(restoreFocus = true) => {
        setCreateOpen(false);
        if (restoreFocus) requestAnimationFrame(() => createTrigger.current?.focus());
      }} />}</div>

      <div className="workspace-grid">
        <section className="workspace-conversation" aria-labelledby="workspace-conversation-title">
          <h2 id="workspace-conversation-title">{missionId ? 'Mission' : 'General conversation'}</h2>
          {missionId ? (
            missionDetail ?? <p className="workspace-empty-detail">Mission details are loading.</p>
          ) : (
            <Chat key={`general-${companionId}`} scope={{ kind: 'general', companionId }} />
          )}
        </section>
        <aside className="workspace-missions" aria-labelledby="workspace-missions-title">
          <h2 id="workspace-missions-title">Your missions</h2>
          <button className={`workspace-mission-row${missionId === null ? ' workspace-mission-selected' : ''}`} type="button" onClick={() => selectMission(null)} aria-current={missionId === null ? 'page' : undefined}>
            <span><strong>General conversation</strong><small>{missionId === null ? 'Selected' : 'Companion chat'}</small></span>
            <span aria-hidden="true">→</span>
          </button>
          {missions.length === 0 ? <p className="workspace-empty-missions">No missions yet. Create one when you are ready.</p> : missions.map((mission) => (
            <button className={`workspace-mission-row${missionId === mission.id ? ' workspace-mission-selected' : ''}`} type="button" key={mission.id} onClick={() => selectMission(mission.id)} aria-current={missionId === mission.id ? 'page' : undefined}>
              <span><strong>{mission.objective}</strong><small>{mission.kind} · {statusLabel(mission)}</small></span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
        </aside>
      </div>
      <p className="workspace-demo-note">Demo · each conversation and mission belongs to {companion.name}.</p>
    </main>
  );
}
