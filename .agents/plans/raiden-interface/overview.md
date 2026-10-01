# Overview: Raiden interface

## Goal and acceptance

- Request: Execute the agreed Raiden redesign plan on a new branch. Branch: `design/raiden-interface`.
- Current deliverable: Three genuinely different static HTML mockups, published for Juanma to choose. Stop before editing real React components, as required by AGENTS.md and html-communication.
- Acceptance: Command, Signal, Vector alternatives; desktop/mobile; onboarding, empty/populated chat, mission creation, permission, review; finite animations; functional preview controls; published URL verified.
- Confirmed design: graphite replaces pure black. Background #141619, surfaces #1C2025, inputs #242A31, borders #39434D, white primary text, secondary #B5BEC8, cyan #67E8F9, occasional violet #A78BFA and amber permission states. Angular 10px corner cuts, no decorative pills/cards, minimal copy, no em dashes. Sci-fi visibly expressed, not three recolors of one layout.
- Typography: Rajdhani 600/700 headings/brand; IBM Plex Sans 400/500/600 body. Local assets with system fallbacks; include licenses. Keep product copy English and preview explanation Spanish.
- Motion: one 600ms onboarding wordmark introduction, 220ms panel/dialog entry, 180ms new messages, 350ms real progress transitions, 120ms controls. Transform/opacity only. No infinite animations, respect reduced motion and hidden tabs.
- Layout concepts: Command = compact left navigation, center chat, right stages/activity. Signal = open conversation, top mission status strip, expandable details. Vector = asymmetric composition, stronger typography, distinct technical activity column.
- Creation: 600px max dialog, prominent objective, four accessible radio choices, compact clickable examples, collapsible target date details, one primary action. Date is a target, never scheduling.
- States: manual local demo only; no fake real AI work, scheduling, external sources or backend. Existing saved data, custom companion names and public/domain interfaces remain unchanged. Mascot reserved mount remains empty. Raiden default branding in mocks only until chosen implementation.
- Mock artifact destination: `docs/raiden-interface/`, separate from old Morrow references. Self-contained HTML variants may share local font files, but inline CSS and script per HTML. Primary agent handles publication, README, and final gate.
- Read relevant skills at `.agents/skills/html-communication/SKILL.md` and `.agents/skills/playwright/SKILL.md`; skill instructions overridden by confirmed graphite choice.

## Tasks

| ID | Type | Expected result | Depends on | Plan | Report | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Implementation | Comparison index and 3 distinct polished HTML alternatives | — | tasks/T01.md | reports/T01.md | Completed |
| V01 | Verification | Browser evidence at 390/768/1440px, controls, reduced motion, no overflow | T01 | tasks/V01.md | reports/V01.md | Completed |

Planning uses GPT-6.1 Sol; execution and verification use GPT-6 Luna, per delegate-large-tasks. No agents may edit real app components or publish remotely. Primary reviews all results and handles publication.

## Completion

- Evidence reviewed: T01 and V01 reports, desktop/mobile screenshots, local preview build, supplemental form/focus/fallback/console checks and published HTTP responses. See reports/P01.md.
- Published: https://raiden-interface.supabase-8786.chatgpt.site (owner-private). Comparison and three variants return the reviewed content. Previous Morrow site remains separate.
- Remaining verification limit: hidden-tab motion suppression was inspected in source, not behaviorally verified. No React implementation was changed.
- Remaining full-plan work: user selects a mock, then apply chosen system to React, branding/defaults, README; run typecheck/test/build and verify app flows. This is a deliberate user selection gate, not completed implementation.
