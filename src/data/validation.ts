import type { Snapshot } from '../domain/types';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === 'string';
const isText = (value: unknown): value is string => isString(value) && value.trim().length > 0;
const isIso = (value: unknown): value is string => isString(value) && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value;
const isDate = (value: unknown): value is string => isString(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
const isOneOf = <T extends string>(value: unknown, values: readonly T[]): value is T => typeof value === 'string' && values.some((item) => item === value);
const appearances = ['skull', 'wolf'] as const;
const missionKinds = ['app', 'research', 'monitoring', 'custom'] as const;
const eventKinds = ['created', 'progress', 'paused', 'resumed', 'goal_edited', 'permission_requested', 'permission_approved', 'permission_declined', 'delivered', 'completed', 'corrections_requested'] as const;
const deliverableKinds = ['app', 'report', 'update', 'note'] as const;
const gateOk = (value: unknown): value is Record<string, unknown> => isRecord(value) && isText(value.id) && isText(value.action) && isText(value.resource) && isText(value.explanation);

export function isSnapshot(value: unknown): value is Snapshot {
  if (!isRecord(value) || value.schemaVersion !== 1 || !Array.isArray(value.companions) || !Array.isArray(value.missions) || !Array.isArray(value.messages) || !Array.isArray(value.events) || !Array.isArray(value.deliverables)) return false;
  const profile = value.profile;
  if (profile !== null && (!isRecord(profile) || !isText(profile.name) || !isText(profile.goal) || !isText(profile.intendedUse))) return false;
  const companionIds = new Set<string>();
  const missionById = new Map<string, Record<string, unknown>>();
  const allIds = new Set<string>();
  const reserveId = (id: unknown): id is string => {
    if (!isText(id) || allIds.has(id)) return false;
    allIds.add(id);
    return true;
  };
  for (const item of value.companions) {
    if (!isRecord(item) || !reserveId(item.id) || !isText(item.name) || !isOneOf(item.appearance, appearances) || !isIso(item.createdAt)) return false;
    companionIds.add(item.id);
  }
  const reviewReferences: Array<{ id: string; companionId: string; missionId: string }> = [];
  for (const item of value.missions) {
    if (!isRecord(item) || !reserveId(item.id) || !isText(item.companionId) || !companionIds.has(item.companionId) || !isOneOf(item.kind, missionKinds) || !isText(item.objective) || !(item.targetDate === null || isDate(item.targetDate)) || typeof item.progress !== 'number' || !Number.isFinite(item.progress) || item.progress < 0 || item.progress > 100 || !Number.isInteger(item.demoCursor) || (item.demoCursor as number) < 0 || !isIso(item.createdAt) || !isIso(item.updatedAt)) return false;
    if (item.status === 'active') { /* valid */ }
    else if (item.status === 'waiting_permission') {
      if (!gateOk(item.gate) || !reserveId(item.gate.id)) return false;
    } else if (item.status === 'paused') {
      if (!isRecord(item.resumeState)) return false;
      if (item.resumeState.status === 'active') { /* valid */ }
      else if (item.resumeState.status === 'waiting_permission') {
        if (!gateOk(item.resumeState.gate) || !reserveId(item.resumeState.gate.id)) return false;
      } else return false;
    } else if (item.status === 'awaiting_review' || item.status === 'completed') {
      if (!isText(item.deliverableId)) return false;
      reviewReferences.push({ id: item.deliverableId, companionId: item.companionId, missionId: item.id });
      if (item.status === 'completed' && !isIso(item.completedAt)) return false;
    } else return false;
    missionById.set(item.id, item);
  }
  for (const item of value.deliverables) {
    if (!isRecord(item) || !reserveId(item.id) || !isText(item.missionId) || !isText(item.companionId) || !isOneOf(item.kind, deliverableKinds) || !isText(item.title) || !isString(item.body) || !isIso(item.createdAt)) return false;
    const mission = missionById.get(item.missionId);
    if (!mission || mission.companionId !== item.companionId) return false;
  }
  for (const reference of reviewReferences) {
    const deliverable = value.deliverables.find((item) => isRecord(item) && item.id === reference.id && item.companionId === reference.companionId && item.missionId === reference.missionId);
    if (!deliverable) return false;
  }
  for (const item of value.messages) {
    if (!isRecord(item) || !reserveId(item.id) || !isText(item.text) || !isRecord(item.scope) || !isText(item.scope.companionId) || !isIso(item.createdAt) || !isOneOf(item.role, ['user', 'companion'] as const) || !isRecord(item.scope) || !companionIds.has(item.scope.companionId)) return false;
    if (item.scope.kind === 'mission') {
      const mission = isText(item.scope.missionId) ? missionById.get(item.scope.missionId) : undefined;
      if (!mission || mission.companionId !== item.scope.companionId) return false;
    } else if (item.scope.kind !== 'general') return false;
  }
  for (const item of value.events) {
    if (!isRecord(item) || !reserveId(item.id) || !isText(item.missionId) || !isText(item.companionId) || !isOneOf(item.kind, eventKinds) || !isText(item.summary) || !isIso(item.createdAt)) return false;
    const mission = missionById.get(item.missionId);
    if (!mission || mission.companionId !== item.companionId) return false;
  }
  if (profile === null && (value.companions.length > 0 || value.missions.length > 0 || value.messages.length > 0 || value.events.length > 0 || value.deliverables.length > 0)) return false;
  return true;
}
