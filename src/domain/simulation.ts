import type { ConversationScope, Deliverable, Mission, PermissionGate } from './types';

export type DemoDeliverable = Pick<Deliverable, 'title' | 'kind' | 'body'>;
export type DemoStep =
  | { kind: 'progress'; summary: string; progress: number; deliverable?: DemoDeliverable }
  | { kind: 'permission'; gate: Omit<PermissionGate, 'id'> }
  | { kind: 'review'; deliverable: DemoDeliverable };

const progressCopy = {
  app: {
    summary: 'The first screen and its main path are outlined.',
    deliverable: {
      title: 'First screen proposal', kind: 'app' as const,
      body: 'A focused first version with a welcome view, a place to collect notes, and one clear next step.\n\nSuggested first pass\n1. Welcome and explain the workspace\n2. Add a note with a short title\n3. Show the next action beside each note\n\nThis is a text proposal for the local demo, not a built or deployed application.'
    }
  },
  research: {
    summary: 'The research question is organized into a small comparison.',
    deliverable: {
      title: 'Research outline', kind: 'report' as const,
      body: 'Research outline\n\nQuestion\nWhat evidence would help compare the available approaches?\n\nSignals to collect\n• Setup effort\n• Ongoing cost\n• Fit for the stated goal\n\nThis outline is a simulated starting point. No external sources were searched.'
    }
  },
  monitoring: {
    summary: 'A concise update format is ready for this monitoring goal.',
    deliverable: {
      title: 'Update format', kind: 'update' as const,
      body: 'Update format\n\n• What changed\n• Why it may matter to this goal\n• What to check next\n\nThis is a sample format only. Nothing is being watched in the background.'
    }
  },
  custom: {
    summary: 'The goal is broken into a clear first step.',
    deliverable: {
      title: 'First-step note', kind: 'note' as const,
      body: 'First step\n\nRestate the goal in one sentence, list the information needed, and agree on a small result that can be reviewed.\n\nThis is a simulated note based on the custom mission.'
    }
  }
} satisfies Record<Mission['kind'], { summary: string; deliverable: DemoDeliverable }>;

const finalCopy = {
  app: { title: 'Prototype handoff', kind: 'app' as const },
  research: { title: 'Research findings', kind: 'report' as const },
  monitoring: { title: 'Monitoring update', kind: 'update' as const },
  custom: { title: 'Mission result', kind: 'note' as const }
} satisfies Record<Mission['kind'], Pick<DemoDeliverable, 'title' | 'kind'>>;

const permissionCopy = {
  app: { action: 'Review sample project data', resource: 'Example project information' },
  research: { action: 'Review sample research sources', resource: 'Example source summaries' },
  monitoring: { action: 'Review a sample update', resource: 'Example monitoring signal' },
  custom: { action: 'Review a sample external result', resource: 'Example project information' }
} satisfies Record<Mission['kind'], Pick<PermissionGate, 'action' | 'resource'>>;

function finalBody(mission: Mission): string {
  const heading = mission.objective.trim();
  switch (mission.kind) {
    case 'app':
      return `Goal: ${heading}\n\nPrototype handoff\n\nThe first version centers on the main task, keeps the next action visible, and leaves room to add detail later.\n\nReview checklist\n• The first screen explains what to do\n• The main action is easy to find\n• Example content makes the flow understandable\n\nThis is a readable demo brief. No application was built, connected, or deployed.`;
    case 'research':
      return `Goal: ${heading}\n\nResearch summary\n\nThe question is framed around the stated goal. Compare options using evidence, practical effort, and important tradeoffs.\n\nSuggested conclusion\nChoose the option with the clearest fit for the first use case, then revisit the decision when new evidence changes the tradeoff.\n\nThis is a simulated example. No external sources were searched.`;
    case 'monitoring':
      return `Goal: ${heading}\n\nSample monitoring update\n\nNo new change was checked in this local demo. A useful update would name the change, explain why it matters, and link it to a next step.\n\nNothing is monitored or scheduled in the background.`;
    case 'custom':
      return `Goal: ${heading}\n\nResult\n\nA practical first outcome is to agree on the smallest useful result, gather the information needed for it, and review the result against the original goal.\n\nThis is a simulated note. No outside action was taken.`;
  }
}

/** A deterministic, user-advanced recipe. Permission and review are explicit stopping points. */
export function getDemoStep(mission: Mission): DemoStep | null {
  if (mission.status !== 'active') return null;
  switch (mission.demoCursor) {
    case 0: {
      const recipe = progressCopy[mission.kind];
      return {
        kind: 'progress', summary: recipe.summary, progress: 32,
        ...(mission.kind === 'app' ? { deliverable: recipe.deliverable } : {})
      };
    }
    case 1:
      {
        const gate = permissionCopy[mission.kind];
      return {
        kind: 'permission',
        gate: {
          ...gate,
          explanation: 'This simulated step represents reviewing information that would require your permission in a connected version. No service is connected in this demo.'
        }
      };
      }
    case 2: {
      const result = finalCopy[mission.kind];
      return {
        kind: 'review',
        deliverable: { ...result, body: finalBody(mission) }
      };
    }
    default:
      return null;
  }
}

export function getDemoReply(scope: ConversationScope, _text: string): string {
  const subject = scope.kind === 'mission' ? 'this mission' : 'your workspace';
  return `I’ve noted that for ${subject}. This is a local demo, so no work runs in the background.`;
}
