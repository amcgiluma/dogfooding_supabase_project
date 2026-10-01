import type { Companion, ConversationScope, Deliverable, Message, Mission, ProgressEvent, Snapshot } from './types';

export function getCompanion(snapshot: Snapshot, companionId: string): Companion | undefined {
  return snapshot.companions.find((companion) => companion.id === companionId);
}
export function getMission(snapshot: Snapshot, companionId: string, missionId: string): Mission | undefined {
  return snapshot.missions.find((mission) => mission.companionId === companionId && mission.id === missionId);
}
export function getCompanionMissions(snapshot: Snapshot, companionId: string): Mission[] {
  return snapshot.missions.filter((mission) => mission.companionId === companionId);
}
export function getMessages(snapshot: Snapshot, scope: ConversationScope): Message[] {
  return snapshot.messages.filter((message) => message.scope.kind === scope.kind && message.scope.companionId === scope.companionId &&
    (scope.kind === 'general' || (message.scope.kind === 'mission' && message.scope.missionId === scope.missionId)));
}
export function getMissionEvents(snapshot: Snapshot, companionId: string, missionId: string): ProgressEvent[] {
  return snapshot.events.filter((event) => event.companionId === companionId && event.missionId === missionId);
}
export function getMissionDeliverables(snapshot: Snapshot, companionId: string, missionId: string): Deliverable[] {
  return snapshot.deliverables.filter((item) => item.companionId === companionId && item.missionId === missionId);
}
