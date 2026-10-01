export type Appearance = 'skull' | 'wolf';
export type MissionKind = 'app' | 'research' | 'monitoring' | 'custom';
export interface Profile { name: string; goal: string; intendedUse: string }
export interface Companion { id: string; name: string; appearance: Appearance; createdAt: string }
export type ConversationScope = { kind: 'general'; companionId: string }
  | { kind: 'mission'; companionId: string; missionId: string };
export interface Message { id: string; scope: ConversationScope; role: 'user' | 'companion'; text: string; createdAt: string }
export interface PermissionGate { id: string; action: string; resource: string; explanation: string }
export type ResumeState = { status: 'active' } | { status: 'waiting_permission'; gate: PermissionGate };
export type MissionState = { status: 'active' }
  | { status: 'paused'; resumeState: ResumeState }
  | { status: 'waiting_permission'; gate: PermissionGate }
  | { status: 'awaiting_review'; deliverableId: string }
  | { status: 'completed'; deliverableId: string; completedAt: string };
export interface MissionBase { id: string; companionId: string; kind: MissionKind; objective: string;
  targetDate: string | null; progress: number; demoCursor: number; createdAt: string; updatedAt: string }
export type Mission = MissionBase & MissionState;
export type EventKind = 'created' | 'progress' | 'paused' | 'resumed' | 'goal_edited'
  | 'permission_requested' | 'permission_approved' | 'permission_declined' | 'delivered'
  | 'completed' | 'corrections_requested';
export interface ProgressEvent { id: string; companionId: string; missionId: string;
  kind: EventKind; summary: string; createdAt: string }
export interface Deliverable { id: string; companionId: string; missionId: string; title: string;
  kind: 'app' | 'report' | 'update' | 'note'; body: string; createdAt: string }
export interface Snapshot { schemaVersion: 1; profile: Profile | null; companions: Companion[];
  missions: Mission[]; messages: Message[]; events: ProgressEvent[]; deliverables: Deliverable[] }
export interface Runtime { now(): string; id(): string }
export type ActionResult<T = undefined> = { ok: true; value: T }
  | { ok: false; error: { code: 'invalid_input' | 'not_found' | 'invalid_transition' | 'storage_error'; message: string } };
export interface OnboardingInput extends Profile { companionName: string; appearance: Appearance }
export interface MissionInput { kind: MissionKind; objective: string; targetDate: string | null }
