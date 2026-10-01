import assert from 'node:assert/strict';
import test from 'node:test';
import { applyAction } from '../src/domain/actions.ts';
import { createInitialSnapshot } from '../src/domain/seeds.ts';
import { createLocalStorageRepository, createUnavailableRepository, decodeSnapshot, STORAGE_KEY } from '../src/data/localStorageRepository.ts';

const now = '2026-09-30T10:00:00.000Z';
function fixture() {
  let next = 0;
  const runtime = { now: () => now, id: () => `fixture-${++next}` };
  const result = applyAction(createInitialSnapshot(), { type: 'completeOnboarding', companionId: 'c1', input: {
    name: 'Ada', goal: 'Build tools', intendedUse: 'Personal projects', companionName: 'Mica', appearance: 'wolf'
  } }, runtime);
  assert.equal(result.ok, true);
  return result.value;
}
function memoryStorage(entries = new Map()) {
  const calls = { reads: [], writes: [], removals: [] };
  return {
    calls,
    entries,
    getItem(key) { calls.reads.push(key); return entries.get(key) ?? null; },
    setItem(key, value) { calls.writes.push([key, value]); entries.set(key, value); },
    removeItem(key) { calls.removals.push(key); entries.delete(key); }
  };
}
function corrupt(snapshot, mutate) {
  const value = structuredClone(snapshot);
  mutate(value);
  return JSON.stringify(value);
}

test('repository round trip retains the complete typed snapshot and missing key is empty', async () => {
  const storage = memoryStorage();
  const repository = createLocalStorageRepository(storage);
  assert.deepEqual(await repository.load(), { kind: 'empty' });
  const snapshot = fixture();
  assert.deepEqual(await repository.save(snapshot), { ok: true });
  const result = await repository.load();
  assert.equal(result.kind, 'loaded');
  if (result.kind === 'loaded') assert.deepEqual(result.snapshot, snapshot);
  assert.deepEqual(storage.calls.writes.map(([key]) => key), [STORAGE_KEY]);
  assert.deepEqual(storage.calls.reads, [STORAGE_KEY, STORAGE_KEY]);
});

test('malformed, unsupported, and forged cross-mission data is rejected without rewriting raw storage', async (t) => {
  const snapshot = fixture();
  const examples = [
    ['malformed JSON', '{not json', 'invalid'],
    ['unsupported schema', corrupt(snapshot, (value) => { value.schemaVersion = 2; }), 'unsupported_version'],
    ['invalid discriminant', corrupt(snapshot, (value) => { value.missions[0].status = 'running'; }), 'invalid'],
    ['invalid progress', corrupt(snapshot, (value) => { value.missions[0].progress = 101; }), 'invalid'],
    ['invalid cursor', corrupt(snapshot, (value) => { value.missions[0].demoCursor = -1; }), 'invalid'],
    ['invalid date', corrupt(snapshot, (value) => { value.companions[0].createdAt = '2026-02-30T10:00:00.000Z'; }), 'invalid'],
    ['duplicate IDs', corrupt(snapshot, (value) => { value.events[0].id = value.missions[0].id; }), 'invalid'],
    ['dangling event owner', corrupt(snapshot, (value) => { value.events[0].companionId = 'missing'; }), 'invalid'],
    ['foreign deliverable owner', corrupt(snapshot, (value) => { value.deliverables[0].companionId = 'missing'; }), 'invalid'],
    ['review points at another mission output', corrupt(snapshot, (value) => {
      value.missions[0].status = 'awaiting_review';
      value.missions[0].deliverableId = value.deliverables[0].id;
    }), 'invalid'],
    ['review delivery reassigned to a different mission', corrupt(snapshot, (value) => {
      value.deliverables[0].missionId = value.missions[0].id;
    }), 'invalid']
  ];
  for (const [name, raw, expected] of examples) {
    await t.test(name, async () => {
      const decoded = decodeSnapshot(raw);
      assert.equal(decoded.kind, expected);
      const storage = memoryStorage(new Map([[STORAGE_KEY, raw], ['sentinel', 'keep']]));
      const repository = createLocalStorageRepository(storage);
      const loaded = await repository.load();
      assert.equal(loaded.kind, expected);
      assert.equal(storage.entries.get(STORAGE_KEY), raw, 'rejected data should remain byte-for-byte unchanged');
      assert.deepEqual(storage.calls.writes, [], 'loading invalid data must not replace it with empty data');
      assert.equal(storage.entries.get('sentinel'), 'keep');
    });
  }
});

test('storage read, write, and remove failures return explicit outcomes', async () => {
  const readDenied = { getItem() { throw new Error('denied'); }, setItem() {}, removeItem() {} };
  assert.equal((await createLocalStorageRepository(readDenied).load()).kind, 'unavailable');

  const writeDenied = { getItem() { return null; }, setItem() { throw new Error('quota'); }, removeItem() {} };
  const save = await createLocalStorageRepository(writeDenied).save(fixture());
  assert.equal(save.ok, false);
  assert.match(save.message, /still available in memory/);

  const removeDenied = { getItem() { return null; }, setItem() {}, removeItem() { throw new Error('denied'); } };
  const reset = await createLocalStorageRepository(removeDenied).reset();
  assert.equal(reset.ok, false);
  assert.match(reset.message, /Could not remove/);

  const unavailable = createUnavailableRepository();
  assert.equal((await unavailable.load()).kind, 'unavailable');
  assert.equal((await unavailable.save(fixture())).ok, false);
  assert.equal((await unavailable.reset()).ok, false);
});

test('reset removes only the application key and keeps unrelated data', async () => {
  const storage = memoryStorage(new Map([[STORAGE_KEY, JSON.stringify(fixture())], ['sentinel', 'preserve me']]));
  const result = await createLocalStorageRepository(storage).reset();
  assert.deepEqual(result, { ok: true });
  assert.equal(storage.entries.has(STORAGE_KEY), false);
  assert.equal(storage.entries.get('sentinel'), 'preserve me');
  assert.deepEqual(storage.calls.removals, [STORAGE_KEY]);
});
