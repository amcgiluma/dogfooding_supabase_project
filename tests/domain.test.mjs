import assert from 'node:assert/strict';
import test from 'node:test';
import { applyAction } from '../src/domain/actions.ts';
import { getMessages, getMission, getMissionDeliverables } from '../src/domain/selectors.ts';
import { createInitialSnapshot } from '../src/domain/seeds.ts';

const fixedTime = '2026-09-30T10:00:00.000Z';
function runtime() {
  let next = 0;
  return { now: () => fixedTime, id: () => `id-${++next}` };
}
const onboarding = {
  name: 'Ada', goal: 'Build useful tools', intendedUse: 'Personal projects',
  companionName: 'Mica', appearance: 'wolf'
};
function succeed(snapshot, action, rt) {
  const result = applyAction(snapshot, action, rt);
  assert.equal(result.ok, true, result.ok ? '' : result.error.message);
  return result.value;
}
function rejectedUnchanged(snapshot, action, rt, code) {
  const before = structuredClone(snapshot);
  deepFreeze(snapshot);
  const result = applyAction(snapshot, action, rt);
  assert.equal(result.ok, false);
  if (code) assert.equal(result.error.code, code);
  assert.deepEqual(snapshot, before, 'rejected action mutated its input snapshot');
  return result;
}
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
function onboard(rt = runtime()) {
  return { rt, snapshot: succeed(createInitialSnapshot(), { type: 'completeOnboarding', input: onboarding, companionId: 'c1' }, rt) };
}
function addMission(snapshot, rt, companionId, missionId, kind = 'custom') {
  return succeed(snapshot, { type: 'createMission', mission: { companionId, missionId,
    input: { kind, objective: `Goal for ${missionId}`, targetDate: null } } }, rt);
}
function advance(snapshot, rt, companionId, missionId) {
  return succeed(snapshot, { type: 'advanceDemo', companionId, missionId }, rt);
}
function reachReview(snapshot, rt, companionId, missionId) {
  // Every recipe reaches review after progress, permission approval, then final delivery.
  snapshot = advance(snapshot, rt, companionId, missionId);
  snapshot = advance(snapshot, rt, companionId, missionId);
  const mission = getMission(snapshot, companionId, missionId);
  assert.equal(mission.status, 'waiting_permission');
  snapshot = succeed(snapshot, { type: 'decidePermission', companionId, missionId, gateId: mission.gate.id, decision: 'approve' }, rt);
  return advance(snapshot, rt, companionId, missionId);
}

test('onboarding creates one coherent seeded workspace and cannot run twice', () => {
  const rt = runtime();
  const empty = createInitialSnapshot();
  const snapshot = succeed(empty, { type: 'completeOnboarding', input: onboarding, companionId: 'c1' }, rt);
  assert.deepEqual(snapshot.profile, { name: 'Ada', goal: 'Build useful tools', intendedUse: 'Personal projects' });
  assert.equal(snapshot.companions.length, 1);
  assert.equal(snapshot.companions[0].id, 'c1');
  assert.equal(snapshot.missions.length, 3);
  assert.deepEqual(snapshot.missions.map((mission) => mission.status), ['active', 'waiting_permission', 'awaiting_review']);
  assert.ok(snapshot.missions.every((mission) => mission.companionId === 'c1'));
  assert.equal(snapshot.missions[1].demoCursor, 2);
  const review = snapshot.missions[2];
  assert.equal(snapshot.deliverables.length, 1);
  assert.equal(snapshot.deliverables[0].id, review.deliverableId);
  assert.equal(snapshot.deliverables[0].missionId, review.id);
  assert.equal(snapshot.deliverables[0].companionId, 'c1');
  const allIds = [
    ...snapshot.companions.map((x) => x.id), ...snapshot.missions.map((x) => x.id),
    ...snapshot.missions.filter((x) => x.status === 'waiting_permission').map((x) => x.gate.id),
    ...snapshot.messages.map((x) => x.id), ...snapshot.events.map((x) => x.id), ...snapshot.deliverables.map((x) => x.id)
  ];
  assert.equal(new Set(allIds).size, allIds.length, 'seed IDs should be unique');
  rejectedUnchanged(snapshot, { type: 'completeOnboarding', input: onboarding, companionId: 'c2' }, rt, 'invalid_transition');
  const second = succeed(snapshot, { type: 'createCompanion', companion: { companionId: 'c2', name: 'Nova', appearance: 'skull' } }, rt);
  assert.equal(second.missions.length, snapshot.missions.length, 'a new companion should not receive missions or history');
  assert.deepEqual(second.events, snapshot.events);
  rejectedUnchanged(second, { type: 'createMission', mission: { companionId: 'missing', missionId: 'foreign', input: { kind: 'custom', objective: 'Wrong owner', targetDate: null } } }, rt, 'not_found');
});

test('messages stay in each companion and mission conversation without changing work state', () => {
  const rt = runtime();
  let snapshot = onboard(rt).snapshot;
  snapshot = succeed(snapshot, { type: 'createCompanion', companion: { companionId: 'c2', name: 'Nova', appearance: 'skull' } }, rt);
  snapshot = addMission(snapshot, rt, 'c1', 'm1');
  snapshot = addMission(snapshot, rt, 'c2', 'm2');
  const scopes = [
    { kind: 'general', companionId: 'c1' }, { kind: 'general', companionId: 'c2' },
    { kind: 'mission', companionId: 'c1', missionId: 'm1' }, { kind: 'mission', companionId: 'c2', missionId: 'm2' }
  ];
  const beforeMissions = structuredClone(snapshot.missions);
  for (const [index, scope] of scopes.entries()) snapshot = succeed(snapshot, { type: 'sendMessage', scope, text: `Message ${index}` }, rt);
  assert.equal(snapshot.messages.length, 8, 'each user message should have one scoped demo reply');
  for (const [index, scope] of scopes.entries()) {
    const messages = getMessages(snapshot, scope);
    assert.deepEqual(messages.map((message) => message.role), ['user', 'companion']);
    assert.equal(messages[0].text, `Message ${index}`);
    assert.ok(messages.every((message) => message.scope.companionId === scope.companionId));
  }
  assert.deepEqual(snapshot.missions, beforeMissions, 'chat must not edit objectives, permission, or progress');
  rejectedUnchanged(snapshot, { type: 'sendMessage', scope: scopes[0], text: '   ' }, rt, 'invalid_input');
  rejectedUnchanged(snapshot, { type: 'sendMessage', scope: { kind: 'mission', companionId: 'c1', missionId: 'm2' }, text: 'Cross-owner' }, rt, 'not_found');
  rejectedUnchanged(snapshot, { type: 'sendMessage', scope: { kind: 'general', companionId: 'missing' }, text: 'Unknown' }, rt, 'not_found');
});

test('pause, permission gates, decline, resume, and approval preserve explicit stopping points', () => {
  const rt = runtime();
  let snapshot = onboard(rt).snapshot;
  snapshot = addMission(snapshot, rt, 'c1', 'gate-mission');
  snapshot = succeed(snapshot, { type: 'pauseMission', companionId: 'c1', missionId: 'gate-mission' }, rt);
  assert.equal(getMission(snapshot, 'c1', 'gate-mission').status, 'paused');
  snapshot = succeed(snapshot, { type: 'resumeMission', companionId: 'c1', missionId: 'gate-mission' }, rt);
  snapshot = advance(snapshot, rt, 'c1', 'gate-mission');
  snapshot = advance(snapshot, rt, 'c1', 'gate-mission');
  const waiting = getMission(snapshot, 'c1', 'gate-mission');
  const gateId = waiting.gate.id;
  rejectedUnchanged(snapshot, { type: 'advanceDemo', companionId: 'c1', missionId: 'gate-mission' }, rt, 'invalid_transition');
  rejectedUnchanged(snapshot, { type: 'decidePermission', companionId: 'c1', missionId: 'gate-mission', gateId: 'wrong-gate', decision: 'approve' }, rt, 'invalid_transition');
  let declined = succeed(snapshot, { type: 'decidePermission', companionId: 'c1', missionId: 'gate-mission', gateId, decision: 'decline' }, rt);
  assert.equal(getMission(declined, 'c1', 'gate-mission').status, 'paused');
  assert.deepEqual(getMission(declined, 'c1', 'gate-mission').resumeState, { status: 'waiting_permission', gate: waiting.gate });
  rejectedUnchanged(declined, { type: 'advanceDemo', companionId: 'c1', missionId: 'gate-mission' }, rt, 'invalid_transition');
  rejectedUnchanged(declined, { type: 'decidePermission', companionId: 'c1', missionId: 'gate-mission', gateId, decision: 'decline' }, rt, 'invalid_transition');
  declined = succeed(declined, { type: 'resumeMission', companionId: 'c1', missionId: 'gate-mission' }, rt);
  assert.equal(getMission(declined, 'c1', 'gate-mission').status, 'waiting_permission');
  assert.deepEqual(getMission(declined, 'c1', 'gate-mission').gate, waiting.gate);
  const approved = succeed(declined, { type: 'decidePermission', companionId: 'c1', missionId: 'gate-mission', gateId, decision: 'approve' }, rt);
  assert.equal(getMission(approved, 'c1', 'gate-mission').status, 'active');
  rejectedUnchanged(approved, { type: 'decidePermission', companionId: 'c1', missionId: 'gate-mission', gateId, decision: 'approve' }, rt, 'invalid_transition');
  assert.ok(approved.events.some((event) => event.kind === 'permission_approved'));
  assert.ok(approved.events.some((event) => event.kind === 'permission_declined'));
});

test('delivery stops for review, completion closes work, and corrections reopen the same history', () => {
  const rt = runtime();
  let snapshot = onboard(rt).snapshot;
  snapshot = addMission(snapshot, rt, 'c1', 'delivery', 'app');
  snapshot = advance(snapshot, rt, 'c1', 'delivery');
  assert.equal(snapshot.deliverables.length, 2, 'app progress step appends its partial output');
  assert.equal(getMission(snapshot, 'c1', 'delivery').status, 'active');
  snapshot = advance(snapshot, rt, 'c1', 'delivery');
  const gate = getMission(snapshot, 'c1', 'delivery').gate;
  snapshot = succeed(snapshot, { type: 'decidePermission', companionId: 'c1', missionId: 'delivery', gateId: gate.id, decision: 'approve' }, rt);
  snapshot = advance(snapshot, rt, 'c1', 'delivery');
  let mission = getMission(snapshot, 'c1', 'delivery');
  assert.equal(mission.status, 'awaiting_review');
  const finalId = mission.deliverableId;
  assert.ok(snapshot.deliverables.some((item) => item.id === finalId && item.missionId === mission.id && item.companionId === 'c1'));
  rejectedUnchanged(snapshot, { type: 'advanceDemo', companionId: 'c1', missionId: 'delivery' }, rt, 'invalid_transition');
  const reviewCounts = { messages: snapshot.messages.length, events: snapshot.events.length, deliverables: snapshot.deliverables.length };
  let corrected = succeed(snapshot, { type: 'requestCorrections', companionId: 'c1', missionId: 'delivery', text: 'Please clarify the main path.' }, rt);
  mission = getMission(corrected, 'c1', 'delivery');
  assert.equal(mission.id, 'delivery');
  assert.equal(mission.status, 'active');
  assert.equal(mission.demoCursor, 0);
  assert.equal(mission.progress, 0);
  assert.ok(getMessages(corrected, { kind: 'mission', companionId: 'c1', missionId: 'delivery' }).some((message) => message.text === 'Please clarify the main path.'));
  assert.ok(corrected.events.some((event) => event.kind === 'corrections_requested' && event.summary.includes('Please clarify')));
  assert.equal(corrected.deliverables.length, reviewCounts.deliverables);
  assert.equal(corrected.events.length, reviewCounts.events + 1);
  corrected = advance(corrected, rt, 'c1', 'delivery');
  assert.equal(corrected.deliverables.length, reviewCounts.deliverables + 1);
  assert.ok(corrected.deliverables.some((item) => item.id === finalId), 'earlier final output remains in history');

  const completed = succeed(snapshot, { type: 'confirmCompletion', companionId: 'c1', missionId: 'delivery' }, rt);
  assert.equal(getMission(completed, 'c1', 'delivery').status, 'completed');
  rejectedUnchanged(completed, { type: 'advanceDemo', companionId: 'c1', missionId: 'delivery' }, rt, 'invalid_transition');
  rejectedUnchanged(completed, { type: 'editMissionGoal', companionId: 'c1', missionId: 'delivery', objective: 'Late edit' }, rt, 'invalid_transition');
  const completedCorrection = succeed(completed, { type: 'requestCorrections', companionId: 'c1', missionId: 'delivery', text: 'Update the conclusion.' }, rt);
  const reopened = getMission(completedCorrection, 'c1', 'delivery');
  assert.equal(reopened.id, 'delivery');
  assert.equal(reopened.status, 'active');
  assert.equal(reopened.demoCursor, 0);
  assert.equal(reopened.progress, 0);
  assert.equal(completedCorrection.deliverables.length, completed.deliverables.length);
  assert.ok(completedCorrection.events.some((event) => event.kind === 'completed'));
  assert.ok(completedCorrection.messages.some((message) => message.text === 'Update the conclusion.'));
});

test('goal edits during stopped states retain state and append an edit event', () => {
  const rt = runtime();
  let snapshot = onboard(rt).snapshot;
  snapshot = addMission(snapshot, rt, 'c1', 'editable');
  snapshot = succeed(snapshot, { type: 'pauseMission', companionId: 'c1', missionId: 'editable' }, rt);
  for (const status of ['paused', 'active']) {
    const before = getMission(snapshot, 'c1', 'editable');
    const next = succeed(snapshot, { type: 'editMissionGoal', companionId: 'c1', missionId: 'editable', objective: `Edited while ${status}` }, rt);
    const after = getMission(next, 'c1', 'editable');
    assert.equal(after.status, before.status);
    if (before.status === 'paused') assert.deepEqual(after.resumeState, before.resumeState);
    assert.equal(after.id, before.id);
    assert.ok(next.events.at(-1).kind === 'goal_edited');
    snapshot = next;
    if (status === 'paused') snapshot = succeed(snapshot, { type: 'resumeMission', companionId: 'c1', missionId: 'editable' }, rt);
  }
  snapshot = reachReview(snapshot, rt, 'c1', 'editable');
  const before = getMission(snapshot, 'c1', 'editable');
  const edited = succeed(snapshot, { type: 'editMissionGoal', companionId: 'c1', missionId: 'editable', objective: 'Edited during review' }, rt);
  assert.equal(getMission(edited, 'c1', 'editable').status, before.status);
  assert.equal(getMission(edited, 'c1', 'editable').deliverableId, before.deliverableId);
  assert.ok(edited.events.at(-1).kind === 'goal_edited');
});
