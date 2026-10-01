import type { Runtime, Snapshot } from './types';

export const APPEARANCES = [
  { id: 'skull', label: 'Skull', src: '/companions/skull.png' },
  { id: 'wolf', label: 'Wolf', src: '/companions/wolf.png' }
] as const;

export function createInitialSnapshot(): Snapshot {
  return { schemaVersion: 1, profile: null, companions: [], missions: [], messages: [], events: [], deliverables: [] };
}

export function createDemoSeeds(companionId: string, runtime: Runtime): Pick<Snapshot, 'missions' | 'messages' | 'events' | 'deliverables'> {
  const createdAt = runtime.now();
  const activeId = runtime.id();
  const waitingId = runtime.id();
  const reviewId = runtime.id();
  const reviewDeliverableId = runtime.id();
  const gateId = runtime.id();
  const mission = (id: string, kind: 'app' | 'research' | 'monitoring', objective: string, cursor: number) => ({
    id, companionId, kind, objective, targetDate: null, progress: 18, demoCursor: cursor, createdAt, updatedAt: createdAt, status: 'active' as const
  });
  const missions = [
    mission(activeId, 'app', 'Build a calm landing page for my idea', 0),
    { ...mission(waitingId, 'research', 'Compare three ways to validate this product idea', 2), status: 'waiting_permission' as const,
      gate: { id: gateId, action: 'Review sample research sources', resource: 'Example source summaries', explanation: 'This simulated permission step represents reviewing fictional source summaries. No external sources are connected or used in this demo.' } },
    { ...mission(reviewId, 'monitoring', 'Watch for useful updates about local AI tools', 3), status: 'awaiting_review' as const, progress: 100, deliverableId: reviewDeliverableId }
  ];
  const deliverables = [{ id: reviewDeliverableId, companionId, missionId: reviewId, title: 'Weekly update', kind: 'update' as const,
    body: `Fictional sample digest

1. Local inference: A hypothetical tool adds a smaller model option, which may reduce memory use for local testing.
2. Developer workflow: A hypothetical desktop runner improves prompt comparison, which could make experiments easier to repeat.
3. Data handling: A hypothetical release clarifies offline mode, worth checking before using sensitive files.

Suggested next step: choose one signal and compare its setup effort and memory needs against your current workflow.

This digest is entirely fictional. No actual sources were checked, and nothing is being watched or scheduled.`, createdAt }];
  const events = missions.map((item) => ({ id: runtime.id(), companionId, missionId: item.id,
    kind: (item.id === activeId ? 'progress' : item.id === waitingId ? 'permission_requested' : 'delivered') as 'progress' | 'permission_requested' | 'delivered',
    summary: item.id === activeId ? 'Started the first pass.' : item.id === waitingId ? 'Paused for your permission.' : 'Ready for your review.', createdAt }));
  return { missions, messages: [], events, deliverables };
}
