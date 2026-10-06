# Mission experience proposals

Three interactive static proposals for Raiden mission creation and Details. Start at the [Spanish comparison](index.html).

Juanma selected **A · Conversation** on 6 October 2026. It is the design reference for the React implementation on `design/mission-companion-ui`.

| File | Layout |
| --- | --- |
| [conversation.html](conversation.html) | Central conversation with a persistent side brief and a ring progress cue. |
| [focus.html](focus.html) | Centered question, connected step route, and a wide stage map. |
| [compact.html](compact.html) | Compact conversation, bottom brief, and a dense stage ledger. |

Each proposal shares [preview.css](preview.css) and [preview.js](preview.js). The preview state selector opens creation or a sample active, paused, permission, review, or completed mission. Closing creation before confirmation retains its in-memory draft; confirmation consumes it so the next mission starts fresh. Advancing the demo is explicit, and no app APIs or browser persistence are used. All actions affect only the current page session. The companion mount is reserved geometry, with no generated character art.

The stage names and subtasks map to `src/features/mission/stageFixtures.ts`. Progress, event summaries, permission labels, and deliverable copy map to `src/domain/simulation.ts`; transition labels follow `src/features/mission/MissionDetail.tsx` and `src/domain/actions.ts`. The preview uses fictional timestamps starting 6 October 2026. No research sources, monitoring, deployments, integrations, or external work occur.

Run locally from the repository root:

```sh
python3 -m http.server 4177 --bind 127.0.0.1 --directory docs/mission-experience
```

Fonts and their license files are copied into `fonts/` for portable publication. Browser verification is tracked separately in V01.

Private review URL: [Raiden mission experience](https://raiden-mission-experience.supabase-8786.chatgpt.site). Sign in with the owning ChatGPT account if prompted. Root checks the deployment status before handing off this URL.

Package only the static proposals with `node docs/mission-experience/build.mjs`. The output is `docs/mission-experience/dist/`; the Site identity is recorded in this directory's `.openai/hosting.json`. Publication uses an isolated copy of these files so the project branch and prior preview Sites remain separate.
