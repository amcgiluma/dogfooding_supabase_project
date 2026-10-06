# Overview: mission-experience

## Goal and acceptance

- Request: Juanma wants mission creation with soul and companion guidance, and visual mission Details. Approved plan requests three HTML proposals before touching React. Work must be on a new branch: `design/mission-companion-ui`.
- Expected outcome: three genuinely different, working static mock experiences, comparison entrypoint, a new private Sites URL, browser evidence and README links.
- Acceptance: objective → type/date → editable review stays within the same creation menu; back retains inputs; companion speaks in text, like onboarding; final confirmation opens the mock mission; Details illustrates stages/progress/history/results and active, paused, permission, review, completed states; responsive desktop/mobile and keyboard behavior; reduced motion; no app data access.
- Constraints: true black #000, white main text, dense layout, no decorative cards/pills or gray pre-section subtitle lines, no em dashes or continuous animation. Keep Raiden's cyan accent, Rajdhani and IBM Plex fonts; English interface, Spanish comparison. Keep current reserved mascot approach: intentional outlined companion mount/name, no new artwork. No AI/audio/backend or Supabase changes. Never touch src or old previews. Do not publish the React app. Root handles publishing and root README. Paths are in `/Users/juanma/Desktop/dogfooding_project`.
- Artifacts: `docs/mission-experience/index.html`, `conversation.html`, `focus.html`, `compact.html`, local assets if needed, `README.md` in that directory. Prefer self-contained HTML per proposal; local fonts may be shared. Any state/scripts are local demo behavior only; never read browser localStorage.
- Options: A conversation with persistent lateral summary; B large central prompt and illustrated route, with Details as a visual map; C compact conversation and a persistent summary below, with Details as a dense instrument panel. All use the same three-step flow and available domain data, avoiding invented metrics/history percentages.
- Dates remain optional targets, never schedules. No new mission fields. Review edits return to the appropriate step; no destructive side effects. Use fictional sample events with clear demo identification, not claims of real work. Details sample state selector is a preview control outside the product surface.
- Implementation refinement: use shared local `preview.css` and `preview.js` to keep behavior consistent across layouts. Companion prompts type once per step using bounded timers; full accessible text is available immediately. Reduced motion shows full text, hidden tabs pause typing, and input controls never wait for the typing effect.

## Tasks

| ID | Type | Expected result | Depends on | Plan | Report | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Implementation | Three polished interactive HTML proposals and comparison | — | `tasks/T01.md` | `reports/T01.md` | Completed |
| V01 | Verification | Browser evidence for desktop/mobile, flow, states, keyboard and reduced motion | T01 | `tasks/V01.md` | `reports/V01.md` | Completed |

Planning: GPT-6.1 Sol. Execution: GPT-6 Luna. Root owns branch, publishing, final integration and review. Verification does not modify product files; report issues to root.

## Completion

- Evidence reviewed: T01 static checks; V01 partial CLI evidence; root native MCP verified selected A back/field retention, creation 0%, first advance 32%, explicit permission and review 100%, completion stages, successful draft consumption, single modal across resize, mobile Details and no horizontal overflow. Root visually reviewed selected desktop and mobile screenshots in output/playwright/mission-experience/a-selected-*.png.
- Scope update: Juanma selected A during the turn. Remaining B/C browser matrix is superseded; source previews remain available. Actual application implementation tracked separately in ../mission-a-implementation/overview.md.
- Published private review: https://raiden-mission-experience.supabase-8786.chatgpt.site. Final accessibility/draft fixes deployed successfully to the same private Site, commit 3bbd9118528ea93e91d7fb858e0f65f12f3f2f02.
