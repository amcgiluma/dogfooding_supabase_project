import type { MissionKind } from '../../domain/types';

export interface DemoStage {
  title: string;
  subtasks: string[];
}

export const STAGE_FIXTURES: Record<MissionKind, readonly DemoStage[]> = {
  app: [
    { title: 'Shape the first version', subtasks: ['Name the main user task', 'Choose the first screen'] },
    { title: 'Prepare the prototype', subtasks: ['Lay out the main path', 'Add example content'] },
    { title: 'Review the result', subtasks: ['Check it against the goal'] }
  ],
  research: [
    { title: 'Shape the question', subtasks: ['Clarify what matters', 'Set comparison criteria'] },
    { title: 'Prepare the comparison', subtasks: ['List useful evidence', 'Note practical tradeoffs'] },
    { title: 'Review the findings', subtasks: ['Connect findings to the goal'] }
  ],
  monitoring: [
    { title: 'Shape the signal', subtasks: ['Describe a useful change', 'Set relevance criteria'] },
    { title: 'Prepare an update', subtasks: ['Choose a concise format', 'Name a next step'] },
    { title: 'Review the update', subtasks: ['Check the sample against the goal'] }
  ],
  custom: [
    { title: 'Shape the outcome', subtasks: ['Clarify the desired result', 'Name what is needed'] },
    { title: 'Prepare a first step', subtasks: ['Choose a small action', 'Set a review point'] },
    { title: 'Review the result', subtasks: ['Check it against the goal'] }
  ]
};
