# Overview: Morrow A3 implementation

## Goal and acceptance

- Request: Implement the user-selected published A3 Sidekick preview in the real React application. Add charcoal functional surfaces, animated stellar onboarding and finite typewriter prompts. Keep mascot areas empty because Juanma will supply the design.
- Reference: `docs/morrow-chat-redesign/a3-sidekick.html`. The user has selected this published mock and explicitly authorized implementation and motion. No additional mock selection is required.
- Outcome: Full-screen black app, a 240px desktop sidebar, centered chat up to 760px wide, mission details on demand, accessible mobile navigation/details drawers, conversational four-step onboarding that enters chat directly.
- Acceptance: preserve existing companion creation/rename, scoped messages, mission creation and every mission transition, saved snapshots, memory/recovery states and explicit reset. Fresh onboarding leads directly to the created companion's general chat; loading saved profile opens the first companion's chat. Empty mascot mounts replace all visible skull/wolf artwork without changing legacy appearance types or snapshot schema.
- Visual constraints: #000 canvas, white primary copy, functional #111/#18181b/#202024 surfaces, blue #0A84FF accent, dense rows, concise labels, no decorative cards/pills, no gray subtitle lines above section titles, no em dashes. Match A3's personality, monospace onboarding, `morrow+` wordmark and empty corner-mark mascot mounts.
- Motion: only onboarding stellar motion and prompt typing are authorized. Move a few pre-rendered SVG layers using compositor transforms; no per-frame JS, twinkle/pulse/blur/shimmer/spinners or animated layout. Pause in hidden tabs; reduced motion uses static sky and complete prompt instantly. Clean every listener/timer.
- Scope: existing React 19/Vite/localStorage prototype. No dependencies, new backend, Supabase artifacts, remote changes, migrations, schema/type/action changes, deployment or static mock edits. Domain/data files are read-only. README is owned by the primary agent.
- Verification: script checks plus real browser flow at 1440px, 390px and 320px, reduced motion, focus/dialog behavior, storage reload and error recovery. Typecheck/test/build must pass. pnpm is unavailable on this machine; `npm run typecheck`, `npm test`, `npm run build` run identical package scripts.

## Tasks

| ID | Type | Expected result | Depends on | Plan | Report | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Implementation | Conversational onboarding, stellar motion/typewriter, empty mount, direct chat entry | — | `tasks/T01.md` | `reports/T01.md` | Completed |
| T02 | Implementation | A3 shell, chat, mission actions/details, compact companion management, mobile drawers | — | `tasks/T02.md` | `reports/T02.md` | Completed; primary corrections applied |
| V01 | Verification | Script checks and browser acceptance evidence for both tasks | T01, T02 | `tasks/V01.md` | `reports/V01.md` | Completed |
| V02 | Verification | Isolated motion, malformed storage recovery and save retry evidence | T01, T02 | `tasks/V02.md` | `reports/V02.md` | Completed |

The primary agent updates statuses and reviews reports. T01 writes only `src/features/onboarding/**`; T02 writes application files outside that directory and leaves domain/data unchanged. Their integration contract is the unchanged `useApp()` action/navigation interface and global blue/gray tokens described in T02. T01 uses literal fallback colors or its own prefixed CSS, so the tasks can execute independently. Root owns README and plan status updates.

## Completion

- Evidence reviewed: T01/T02 implementation, V01/V02 verification and primary-review reports; actual onboarding/chat/details/create screenshots at desktop and mobile. Typecheck passed, all 20 focused tests passed, final production build passed. No domain/data/backend changes; git diff --check passed.
- Unmet criteria: none in the exercised application flows. Hidden-tab pausing and timer/listener cleanup were inspected in source because browser backgrounding was not reliably available.
- Result: A3 implemented with charcoal functional surfaces, blue actions, reserved mascot mounts, animated stellar onboarding and finite accessible typing. README updated. Vite remains available at http://127.0.0.1:43872/; published static previews remain reference only.
