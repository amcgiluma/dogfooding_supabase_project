import { createDemoSeeds } from './seeds';
import { getDemoReply, getDemoStep } from './simulation';
import type { ActionResult, Appearance, ConversationScope, MissionInput, MissionKind, OnboardingInput, Runtime, Snapshot } from './types';
import type { Mission } from './types';

type NewCompanion = { companionId: string; name: string; appearance: Appearance };
type NewMission = { companionId: string; missionId: string; input: MissionInput };
export type DomainAction =
  | { type: 'completeOnboarding'; input: OnboardingInput; companionId: string }
  | { type: 'createCompanion'; companion: NewCompanion }
  | { type: 'renameCompanion'; companionId: string; name: string }
  | { type: 'setCompanionAppearance'; companionId: string; appearance: Appearance }
  | { type: 'createMission'; mission: NewMission }
  | { type: 'sendMessage'; scope: ConversationScope; text: string }
  | { type: 'pauseMission'; companionId: string; missionId: string }
  | { type: 'resumeMission'; companionId: string; missionId: string }
  | { type: 'editMissionGoal'; companionId: string; missionId: string; objective: string }
  | { type: 'decidePermission'; companionId: string; missionId: string; gateId: string; decision: 'approve' | 'decline' }
  | { type: 'confirmCompletion'; companionId: string; missionId: string }
  | { type: 'requestCorrections'; companionId: string; missionId: string; text: string }
  | { type: 'advanceDemo'; companionId: string; missionId: string };

const fail = (code: 'invalid_input' | 'not_found' | 'invalid_transition', message: string): ActionResult<Snapshot> => ({ ok: false, error: { code, message } });
const ok = (snapshot: Snapshot): ActionResult<Snapshot> => ({ ok: true, value: snapshot });
const trim = (value: string): string => value.trim();
const validAppearance = (value: string): value is Appearance => value === 'skull' || value === 'wolf';
const validKind = (value: string): value is MissionKind => value === 'app' || value === 'research' || value === 'monitoring' || value === 'custom';
const validDate = (value: string | null): boolean => value === null || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value);
const stamp = (runtime: Runtime) => runtime.now();
const event = (runtime: Runtime, companionId: string, missionId: string, kind: Snapshot['events'][number]['kind'], summary: string) => ({ id: runtime.id(), companionId, missionId, kind, summary, createdAt: stamp(runtime) });
const ownedMission = (snapshot: Snapshot, companionId: string, missionId: string): Mission | undefined => snapshot.missions.find((item) => item.companionId === companionId && item.id === missionId);

export function applyAction(snapshot: Snapshot, action: DomainAction, runtime: Runtime): ActionResult<Snapshot> {
  switch (action.type) {
    case 'completeOnboarding': {
      const { input } = action;
      const name = trim(input.name), goal = trim(input.goal), intendedUse = trim(input.intendedUse), companionName = trim(input.companionName);
      if (snapshot.profile || snapshot.companions.length) return fail('invalid_transition', 'Onboarding is already complete.');
      if (!name || !goal || !intendedUse || !companionName || !validAppearance(input.appearance)) return fail('invalid_input', 'Complete every field with a valid appearance.');
      const createdAt = stamp(runtime);
      const companion = { id: action.companionId, name: companionName, appearance: input.appearance, createdAt };
      const seeds = createDemoSeeds(companion.id, runtime);
      return ok({ ...snapshot, profile: { name, goal, intendedUse }, companions: [companion], ...seeds });
    }
    case 'createCompanion': {
      const { companionId, name: rawName, appearance } = action.companion;
      const name = trim(rawName);
      if (!snapshot.profile) return fail('invalid_transition', 'Complete onboarding before adding companions.');
      if (!name || !validAppearance(appearance)) return fail('invalid_input', 'Enter a name and valid appearance.');
      if (snapshot.companions.some((item) => item.id === companionId)) return fail('invalid_input', 'Companion ID already exists.');
      return ok({ ...snapshot, companions: [...snapshot.companions, { id: companionId, name, appearance, createdAt: stamp(runtime) }] });
    }
    case 'renameCompanion': {
      const name = trim(action.name);
      if (!name) return fail('invalid_input', 'Name cannot be empty.');
      if (!snapshot.companions.some((item) => item.id === action.companionId)) return fail('not_found', 'Companion not found.');
      return ok({ ...snapshot, companions: snapshot.companions.map((item) => item.id === action.companionId ? { ...item, name } : item) });
    }
    case 'setCompanionAppearance':
      if (!validAppearance(action.appearance)) return fail('invalid_input', 'Choose a valid appearance.');
      if (!snapshot.companions.some((item) => item.id === action.companionId)) return fail('not_found', 'Companion not found.');
      return ok({ ...snapshot, companions: snapshot.companions.map((item) => item.id === action.companionId ? { ...item, appearance: action.appearance } : item) });
    case 'createMission': {
      const { companionId, missionId, input } = action.mission;
      const objective = trim(input.objective);
      if (!snapshot.companions.some((item) => item.id === companionId)) return fail('not_found', 'Companion not found.');
      if (!objective || !validKind(input.kind) || !validDate(input.targetDate)) return fail('invalid_input', 'Enter an objective, mission type, and valid date.');
      if (snapshot.missions.some((item) => item.id === missionId)) return fail('invalid_input', 'Mission ID already exists.');
      const createdAt = stamp(runtime);
      const mission = { id: missionId, companionId, kind: input.kind, objective, targetDate: input.targetDate, progress: 0, demoCursor: 0, createdAt, updatedAt: createdAt, status: 'active' as const };
      return ok({ ...snapshot, missions: [...snapshot.missions, mission], events: [...snapshot.events, event(runtime, companionId, missionId, 'created', 'Mission created.')] });
    }
    case 'sendMessage': {
      const text = trim(action.text);
      if (!text) return fail('invalid_input', 'Message cannot be empty.');
      const validScope = snapshot.companions.some((item) => item.id === action.scope.companionId) &&
        (action.scope.kind === 'general' || !!ownedMission(snapshot, action.scope.companionId, action.scope.missionId));
      if (!validScope) return fail('not_found', 'Conversation not found.');
      const user = { id: runtime.id(), scope: action.scope, role: 'user' as const, text, createdAt: stamp(runtime) };
      const reply = { id: runtime.id(), scope: action.scope, role: 'companion' as const, text: getDemoReply(action.scope, text), createdAt: stamp(runtime) };
      return ok({ ...snapshot, messages: [...snapshot.messages, user, reply] });
    }
    case 'pauseMission': {
      const mission = ownedMission(snapshot, action.companionId, action.missionId);
      if (!mission) return fail('not_found', 'Mission not found.');
      if (mission.status !== 'active' && mission.status !== 'waiting_permission') return fail('invalid_transition', 'This mission cannot be paused now.');
      const resumeState = mission.status === 'active' ? { status: 'active' as const } : { status: 'waiting_permission' as const, gate: mission.gate };
      const updated = { ...mission, status: 'paused' as const, resumeState, updatedAt: stamp(runtime) };
      return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'paused', 'Mission paused.')] });
    }
    case 'resumeMission': {
      const mission = ownedMission(snapshot, action.companionId, action.missionId);
      if (!mission) return fail('not_found', 'Mission not found.');
      if (mission.status !== 'paused') return fail('invalid_transition', 'Only a paused mission can resume.');
      const state = mission.resumeState.status === 'active' ? { status: 'active' as const } : { status: 'waiting_permission' as const, gate: mission.resumeState.gate };
      const updated = { ...mission, ...state, updatedAt: stamp(runtime) };
      return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'resumed', 'Mission resumed.')] });
    }
    case 'editMissionGoal': {
      const objective = trim(action.objective);
      if (!objective) return fail('invalid_input', 'Goal cannot be empty.');
      const mission = ownedMission(snapshot, action.companionId, action.missionId);
      if (!mission) return fail('not_found', 'Mission not found.');
      if (mission.status === 'completed') return fail('invalid_transition', 'Request corrections before editing a completed mission.');
      const updated = { ...mission, objective, updatedAt: stamp(runtime) };
      return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'goal_edited', `Goal changed from “${mission.objective}” to “${objective}”.`)] });
    }
    case 'decidePermission': {
      const mission = ownedMission(snapshot, action.companionId, action.missionId);
      if (!mission) return fail('not_found', 'Mission not found.');
      if (mission.status !== 'waiting_permission' || mission.gate.id !== action.gateId) return fail('invalid_transition', 'That permission request is no longer active.');
      if (action.decision === 'approve') {
        const updated = { ...mission, status: 'active' as const, updatedAt: stamp(runtime) };
        return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'permission_approved', 'Permission approved for the described demo action.')] });
      }
      const updated = { ...mission, status: 'paused' as const, resumeState: { status: 'waiting_permission' as const, gate: mission.gate }, updatedAt: stamp(runtime) };
      return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'permission_declined', 'Permission declined. The request remains available.')] });
    }
    case 'confirmCompletion': {
      const mission = ownedMission(snapshot, action.companionId, action.missionId);
      if (!mission) return fail('not_found', 'Mission not found.');
      if (mission.status !== 'awaiting_review') return fail('invalid_transition', 'Mission is not waiting for review.');
      const updated = { ...mission, status: 'completed' as const, completedAt: stamp(runtime), updatedAt: stamp(runtime) };
      return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'completed', 'Completion confirmed.')] });
    }
    case 'requestCorrections': {
      const text = trim(action.text);
      if (!text) return fail('invalid_input', 'Describe the corrections.');
      const mission = ownedMission(snapshot, action.companionId, action.missionId);
      if (!mission) return fail('not_found', 'Mission not found.');
      if (mission.status !== 'awaiting_review' && mission.status !== 'completed') return fail('invalid_transition', 'Corrections are available after delivery.');
      const updated: Mission = { id: mission.id, companionId: mission.companionId, kind: mission.kind, objective: mission.objective, targetDate: mission.targetDate, progress: 0, demoCursor: 0, createdAt: mission.createdAt, updatedAt: stamp(runtime), status: 'active' };
      const message = { id: runtime.id(), scope: { kind: 'mission' as const, companionId: mission.companionId, missionId: mission.id }, role: 'user' as const, text, createdAt: stamp(runtime) };
      return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), messages: [...snapshot.messages, message], events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'corrections_requested', `Corrections requested: ${text}`)] });
    }
    case 'advanceDemo': {
      const mission = ownedMission(snapshot, action.companionId, action.missionId);
      if (!mission) return fail('not_found', 'Mission not found.');
      if (mission.status !== 'active') return fail('invalid_transition', 'Only active work can advance.');
      const step = getDemoStep(mission);
      if (!step) return fail('invalid_transition', 'No demo steps remain.');
      const updatedAt = stamp(runtime);
      const base = { ...mission, demoCursor: mission.demoCursor + 1, updatedAt };
      const missions = snapshot.missions.map((item) => item.id === mission.id ? base : item);
      if (step.kind === 'progress') {
        const events = [...snapshot.events, event(runtime, mission.companionId, mission.id, 'progress', step.summary)];
        if (!step.deliverable) return ok({ ...snapshot, missions: missions.map((item) => item.id === mission.id ? { ...base, progress: step.progress } : item), events });
        const deliverable = { ...step.deliverable, id: runtime.id(), companionId: mission.companionId, missionId: mission.id, createdAt: updatedAt };
        return ok({ ...snapshot, missions: missions.map((item) => item.id === mission.id ? { ...base, progress: step.progress } : item), events: [...events, event(runtime, mission.companionId, mission.id, 'delivered', `Partial deliverable added: ${deliverable.title}.`)], deliverables: [...snapshot.deliverables, deliverable] });
      }
      if (step.kind === 'permission') {
        const gate = { ...step.gate, id: runtime.id() };
        const updated = { ...base, status: 'waiting_permission' as const, gate };
        return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'permission_requested', `Permission requested: ${gate.action}.`)] });
      }
      const deliverable = { ...step.deliverable, id: runtime.id(), companionId: mission.companionId, missionId: mission.id, createdAt: updatedAt };
      const updated = { ...base, status: 'awaiting_review' as const, progress: 100, deliverableId: deliverable.id };
      return ok({ ...snapshot, missions: snapshot.missions.map((item) => item.id === mission.id ? updated : item), deliverables: [...snapshot.deliverables, deliverable], events: [...snapshot.events, event(runtime, mission.companionId, mission.id, 'delivered', `Final deliverable ready: ${deliverable.title}.`)] });
    }
  }
}
