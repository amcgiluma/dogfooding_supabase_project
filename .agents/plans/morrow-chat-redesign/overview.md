# Overview: morrow-chat-redesign

## Goal and acceptance

- Request: implement the agreed complete UI redesign, starting with three published static visual proposals and waiting for Juanma's choice before changing the real app.
- Current milestone: a polished chooser plus three genuinely distinct self-contained HTML alternatives, each with onboarding, populated general chat, permission mission, and deliverable review views. Responsive desktop/mobile, usable controls, accessible labels, no overflow.
- Destination: `docs/morrow-chat-redesign/`; screenshot evidence under `output/playwright/morrow-chat-redesign/`.
- Repo has React 19/Vite/TypeScript local prototype. Do not edit `src`, domain data, Supabase artifacts, or existing mocks. This milestone is static HTML only.
- Visual constraints: true black #000 main background, white primary text, neutral #111 functional surfaces, #262626 dividers, #A3A3A3 secondary text. #0A84FF accent/focus, #0066CC primary buttons, white button text. No decorative cards/pills, light gray subtitles above sections, em dashes, gradients/glass in workspace, or continuously repainting animations. System font for app, ui-monospace for onboarding. Moderate 10–14px functional corner radii.
- User selected chat protagonist with left navigation, optional mission details, direct chat entry, whole experience redesign. Current skull/wolf art is ugly and will be replaced later: use initials now. No external asset/font dependencies.
- Onboarding: sequential conversational name, objective, intended help, companion name; editable answers/back, suggested text choices. Own sparse static stellar SVG background, monospace inspired by user's GitHub onboarding memory, not a clone. No particles/typewriter/blinking. No fake AI claims.
- Option A: compact familiar navigation, 240px left sidebar, centered chat max 760px, optional 320px details panel. Best straightforward default.
- Option B: more immersive conversation, narrow left navigation rail with expandable mission drawer, wider readable central canvas; details as sheet. Meaningful different composition, still chat protagonist.
- Option C: companion relationship emphasis through prominent initial/name and small companion selector in left navigation, compact mission list, warmer conversational welcome wording while retaining black/blue palette; no giant avatar or extra decorative chrome.
- All options: messages user right and companion left; bottom composer; explicit fictional permission/review action strip near composer, goal/state in header; progress/history/output in details. Mobile navigation drawer, details overlay, usable composer. Show fictional app-design conversation, research permission scope, and weekly fictional deliverable review. Demo labels honest and concise. Do not imply backend/AI implemented.
- Build a useful chooser with Spanish explanations and links; product mock copy stays English. Each option supports choosing four views via external preview toolbar, details toggling, mobile navigation, and basic demo input affordances. Static mocks must not pretend real mission operations are executed. Show local preview confirmations where buttons require feedback, label preview clearly.
- Primary agent handles publishing via Sites and README link after local verification. Publication must upload ONLY static mock source, no repository secrets/source app.

## Tasks

| ID | Type | Expected result | Depends on | Plan | Report | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T01 | Implementation | chooser and three responsive self-contained HTML mock alternatives | — | `tasks/T01.md` | `reports/T01.md` | Completed |
| V01 | Verification | browser verification all options/views at desktop and mobile; screenshots, keyboard, overflow and console checks | T01 | `tasks/V01.md` | `reports/V01.md` | Completed |

Sol plans tasks; Luna executes. Primary reviews evidence and publishes. Real product implementation waits for user's visual choice per AGENTS.md.

## Completion

- Mock milestone complete: T01/V01 reports reviewed; 26 browser screenshots, focused interactions, two corrected defects and clean final console; primary screenshot review and git diff --check passed.
- Published owner-private at https://morrow-chat-redesign.supabase-8786.chatgpt.site. Exact final commit/version/deployment are recorded in reports/publication.md. Unauthenticated URL responds with the private access gate; no authenticated remote-browser claim.
- README updated with local and published preview links. No product or Supabase changes.
- Juanma selected A and requested a little more personality, leaving space for a mascot he will design. Refined A1 Orbit, A2 Studio and A3 Sidekick previews preserve A's layout and provide empty mascot mounts. New comparison is at index.html; initial-options.html preserves the original chooser. Personality selection precedes real application changes per AGENTS.md and html-communication.
- Juanma selected A3 Sidekick and authorized charcoal surfaces, animated stellar onboarding and typewriter prompts. Product implementation proceeds under `../morrow-a3-implementation/overview.md`; this preview milestone remains archived as the approved design reference.
