# Overview: mission-a-implementation

## Goal and acceptance

- Juanma chose option A after published mission-experience proposals and asks for its implementation. Selection authorizes real UI edits now. Use current new branch `design/mission-companion-ui`.
- Reference: `docs/mission-experience/conversation.html`, shared preview.css and preview.js, privately published at https://raiden-mission-experience.supabase-8786.chatgpt.site. A is companion-led conversation with persistent side brief; Details is a vertical route, progress ring, history/results. Do not use the static fake state controller in React.
- Creation: objective -> type + optional target -> editable review, all in same native dialog. Companion uses actual companion name, reserved art mount, finite accessible typewriter, kind-dependent response; previous answers remain visible. Defaults app and no date. Objective still max180. Keep actions.createMission contract and navigate only after successful confirmation. Back/edit/cancel do not create anything. Retain draft/step on cancel and reopen within same active companion workspace; reset after successful create and on changing companion. Errors and duplicate-submit protection; no extra API/schema/storage changes.
- Details: black surface, white text, cyan, existing fonts, visual 0..100 demo-estimate ring, exact stages and states from MissionDetail/STAGE_FIXTURES, companion first-person explanation and next step by actual mission state, chronological actual history and actual deliverables. Keep all existing actions/edit permissions/paused semantics, corrections and review logic. No new/fake metrics. Chat general Details and onboarding appearance are outside scope.
- Reuse existing motion preferences; extract useTypedPrompt from onboarding to a small shared hook, keeping onboarding behavior intact. Split prompt rendering so typing does not rerender form on each character. Full accessible text and reserved layout height immediately; finite timers, reduced-motion full, hidden pauses; no permanent animations.
- Responsive dialog approximately960px with conversational left and brief right, stacked on mobile. Details existing desktop panel/mobile dialog, no workspace route replacement. Keep role/progress labels, keyboard focus, native modal and focus restoration. Prevent creation and mobile Details being open at once; cancel restores underlying context. Preserve workspace chat/mission navigation.
- React/TypeScript only, no dependencies, no any, no remote backend or local Supabase artifacts. Read .agents/skills/vercel-react-best-practices/SKILL.md; use simple inferred types/state, no needless memo/wrappers. Scope create-mission, mission detail markup/styles, shared hook, minimal Workspace integration, root README. Existing graphitic app shell stays as-is; selected UI surfaces use true black. No app deployment requested. Root owns mock Site publishing and README publication/selection annotations.
- Tests: run existing pnpm typecheck/test/build. Root browser checks actual React app via native MCP (CLI browser sessions die across exec calls and subagents cannot share root MCP profile). Do not repeat failed CLI setup. Verification agent runs commands/static review, root provides browser screenshots/results for its report.

## Tasks

| ID | Type | Expected result | Depends on | Plan | Report | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Implementation | Implement selected A in React, retained wizard and visual Details | — | tasks/T01.md | reports/T01.md | Completed |
| V01 | Verification | Typecheck/test/build, static review, root browser evidence | T01 | tasks/V01.md | reports/V01.md | Completed |

Sol plans, Luna executes, root reviews and checks native browser. Scope is now selected option A only; previous unselected mock browser matrices are superseded.

## Completion

- Selected A implemented in the local React prototype. Root reviewed both reports and the desktop/mobile screenshots. Typecheck, all 20 existing tests, production build and whitespace checks passed. Native browser checks covered onboarding, retained creation draft, actual mission actions through permission/review/completion/corrections, Details data, keyboard/focus, finite typing and reduced motion. Final browser console: zero errors or warnings.
- Source-reviewed limits are recorded in V01: failed creation and duplicate-submit races were not fault-injected; companion-change draft reset and hidden-tab cleanup were reviewed in code. No backend or application publication was required. The corrected static proposals were published privately to their existing Site.
