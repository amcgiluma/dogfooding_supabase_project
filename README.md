# Compañeros digitales

Una web de compañeros que conocen al usuario, organizan sus misiones y trabajan para entregar resultados útiles.

- [Mapa visual interactivo](resumen.html): resumen de la idea con imágenes y un recorrido de misión.
- [Proyecto completo](proyecto.md): visión, decisiones, pendientes y propuesta de plan de construcción.
- [Registro del brainstorming](decisiones.md): preguntas y respuestas con las aclaraciones posteriores.
- [Imágenes y prompts](assets/README.md): procedencia de las imágenes conceptuales originales.

Abre `resumen.html` en el navegador. No requiere instalación ni conexión: conserva la carpeta `assets` junto al archivo. También funciona con un servidor estático local.

La demostración es conceptual. Los controles permiten explorar la experiencia, sin ejecutar agentes ni crear recursos remotos. Las ilustraciones, nombres de estados y pantallas son propuestas visuales; las decisiones confirmadas y los puntos pendientes se distinguen en el documento completo.

## Local prototype

The navigable React demo lives in this repository. It walks through onboarding, companion workspaces, separate general and mission conversations, mission creation, simulated progress, permission decisions and deliverable review.

### Run it

Use Node.js 20.19.x or 22.12+ and pnpm 10.15. The `packageManager` field pins the pnpm version for Corepack.

```sh
corepack pnpm install
corepack pnpm dev
```

If Corepack is unavailable, run the same pinned pnpm CLI through npm:

```sh
npm exec --yes --package=pnpm@10.15.0 -- pnpm install
npm exec --yes --package=pnpm@10.15.0 -- pnpm dev
```

The dev command prints the local URL. To check or preview a production build:

```sh
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm preview
```

```sh
npm exec --yes --package=pnpm@10.15.0 -- pnpm typecheck
npm exec --yes --package=pnpm@10.15.0 -- pnpm test
npm exec --yes --package=pnpm@10.15.0 -- pnpm build
npm exec --yes --package=pnpm@10.15.0 -- pnpm preview
```

The test script runs the focused Node tests in `tests/`. The V01–V03 plan covers additional domain and browser verification.

### Walkthrough

Complete the four onboarding steps to enter your companion's chat. Send a general message, then create a mission from an example or a custom objective. Use the top navigation and mission row to move between companion chats and missions. The seeded missions show active work, a permission decision and a ready-for-review deliverable. Mission stages, progress, history and deliverables appear in the technical column on desktop; open Details on smaller screens. Advance active work with the visible demo control, pause and resume it, edit its goal explicitly, then confirm its final review or request corrections. The correction stays on the same mission and keeps its history. Refresh to check that IDs, messages and progress remain saved; use **Reset demo** to return to onboarding.

### Data and demo limits

The demo stores its versioned snapshot in this browser's `localStorage` under `companions-prototype:v1`. Use **Reset demo** in the app to remove only that key and return to first-run onboarding. Other browser data is left alone. If browser storage is unavailable, the app explains that changes are temporary and offers a retry. Invalid saved data is shown as a recovery state; reset is explicit.

Mission work is deterministic sample behavior. It advances only when you press a demo action. The prototype has no AI, backend, account/auth, payments, EC2 work or app connectors, and it does not make network requests for mission work. No Supabase project setup is needed to run it.

Supabase is the intended future backend for structured data. A future adapter should preserve the repository boundary, scope every read and write to the right user and companion, and enforce authorization with Row Level Security. Any real-time subscriptions would need the same access rules. Auth, Supabase storage, deployment and external connections remain future work and are not configured by this local prototype.

## Chat redesign previews

[Explore the personality refinements for the selected layout A](docs/morrow-chat-redesign/index.html): Orbit, Studio and Sidekick. Each standalone HTML option includes conversational stellar onboarding, populated chat, permission request and deliverable review. Empty mascot mounts reserve space for Juanma's future artwork in the sidebar, onboarding and mobile header. Use the preview selector to switch views; controls provide local demonstration feedback without sending messages or running missions.

[The original A/B/C comparison](docs/morrow-chat-redesign/initial-options.html) remains available for reference.

[Open the privately published previews](https://morrow-chat-redesign.supabase-8786.chatgpt.site). Sign in with the owning ChatGPT account if prompted. Only the static previews are published; the React prototype is not deployed there.

The older Morrow previews record an earlier design direction. Juanma selected Vector for the React application: a graphite interface with left navigation on desktop, a mobile navigation drawer and compact mission titles, flat transcript rows and a technical stages and activity column. Local Rajdhani and IBM Plex fonts provide the display and body type. New profiles start with a companion named Raiden; saved companion names and browser data remain intact. First-run onboarding keeps its typewriter prompt and layered star field, which moves for a finite time on each step. Reduced motion shows the full prompt and still stars; hidden tabs pause typing and interface motion.

The workspace reserves a 72×72px mascot mount on desktop and a 56×56px mount on mobile. The existing onboarding, navigation and companion-list mounts remain available for future artwork. View changes, dialogs, messages and progress updates use brief finite transitions; selecting the current view does not replay its entrance.

The published HTML previews remain design references. Run the React prototype locally to use the implemented experience.

## Raiden redesign previews

[Compare Command, Signal and Vector](docs/raiden-interface/index.html): three static proposals for the Raiden identity, with graphite surfaces, cyan accents, Rajdhani and IBM Plex Sans, clipped corners and finite animations. Each includes onboarding, chat, mission creation, permission and review examples. Juanma confirmed graphite as the replacement for the earlier pure-black design constraint.

[Open the privately published Raiden proposals](https://raiden-interface.supabase-8786.chatgpt.site). Sign in with the owning ChatGPT account if prompted. The older Morrow previews keep their existing URL.

The Vector selection is implemented in the local React prototype. These static previews do not read or modify the prototype's saved data. See [preview setup and implementation notes](docs/raiden-interface/README.md) for local viewing and build details.

## Mission experience proposals

[Compare three guided mission experiences](docs/mission-experience/index.html): Conversation uses a companion-led exchange with a lateral summary; Focus puts one question at the center and turns Details into a visual route; Compact keeps the exchange short with a persistent lower summary and dense mission instruments.

Each proposal walks through objective, type and optional target date, then an editable review inside the same creation menu. The companion speaks through text, as in onboarding. Mission Details shows progress, stages, activity and results, including permission, paused, review and completed examples. The target date is a planning reference, not a scheduled job; progress is a demo estimate. The interfaces use English, and the comparison uses Spanish.

[Private mission design review](https://raiden-mission-experience.supabase-8786.chatgpt.site). Sign in with the owning ChatGPT account if prompted.

Juanma selected **Conversation (A)** for the local React prototype on `design/mission-companion-ui`. Creation stays in one dialog: objective, mission type and optional target, then an editable review. The companion's text accompanies each step, with a live mission brief. Cancel preserves the draft until creation or a companion change.

Mission Details uses a progress ring, stage route, activity and results from the saved mission. On desktop, its column spans the header and chat. Opening and closing animate the column width together with the chat; the title keeps its reading width and the panel content keeps its final width during the reveal. The collapsed panel is inert and hidden from assistive technology. Mobile uses a full-screen dialog. Details and mission creation use brief opening and closing transitions; reduced motion and hidden tabs make them immediate. Progress remains a demo estimate; permission decisions and final review use the existing actions. Reduced motion displays the complete companion prompt immediately.

The published proposals remain isolated static references. They do not access the prototype's browser storage, run agents, or require Supabase setup. See [preview instructions](docs/mission-experience/README.md) for local viewing and packaging.
