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

Complete the four onboarding steps to enter your companion's chat. Send a general message, then create a mission from an example or a custom objective. Choose missions from the sidebar and open details when needed. The seeded missions show active work, a permission decision and a ready-for-review deliverable. Advance active work with the visible demo control, pause and resume it, edit its goal explicitly, then confirm its final review or request corrections. The correction stays on the same mission and keeps its history. Refresh to check that IDs, messages and progress remain saved; use **Reset demo** to return to onboarding.

### Data and demo limits

The demo stores its versioned snapshot in this browser's `localStorage` under `companions-prototype:v1`. Use **Reset demo** in the app to remove only that key and return to first-run onboarding. Other browser data is left alone. If browser storage is unavailable, the app explains that changes are temporary and offers a retry. Invalid saved data is shown as a recovery state; reset is explicit.

Mission work is deterministic sample behavior. It advances only when you press a demo action. The prototype has no AI, backend, account/auth, payments, EC2 work or app connectors, and it does not make network requests for mission work. No Supabase project setup is needed to run it.

Supabase is the intended future backend for structured data. A future adapter should preserve the repository boundary, scope every read and write to the right user and companion, and enforce authorization with Row Level Security. Any real-time subscriptions would need the same access rules. Auth, Supabase storage, deployment and external connections remain future work and are not configured by this local prototype.

## Chat redesign previews

[Explore the personality refinements for the selected layout A](docs/morrow-chat-redesign/index.html): Orbit, Studio and Sidekick. Each standalone HTML option includes conversational stellar onboarding, populated chat, permission request and deliverable review. Empty mascot mounts reserve space for Juanma's future artwork in the sidebar, onboarding and mobile header. Use the preview selector to switch views; controls provide local demonstration feedback without sending messages or running missions.

[The original A/B/C comparison](docs/morrow-chat-redesign/initial-options.html) remains available for reference.

[Open the privately published previews](https://morrow-chat-redesign.supabase-8786.chatgpt.site). Sign in with the owning ChatGPT account if prompted. Only the static previews are published; the React prototype is not deployed there.

Juanma selected A3 Sidekick for the React application. The implementation uses a chat-first layout, charcoal navigation and input surfaces, blue actions and empty mounts for the future mascot. First-run onboarding has a moving stellar background and finite typewriter questions. Reduced-motion preferences show the full question immediately and keep the stars still; motion pauses while the tab is hidden.

The published HTML previews remain design references. Run the React prototype locally to use the implemented experience.

## Raiden redesign previews

[Compare Command, Signal and Vector](docs/raiden-interface/index.html): three static proposals for the Raiden identity, with graphite surfaces, cyan accents, Rajdhani and IBM Plex Sans, clipped corners and finite animations. Each includes onboarding, chat, mission creation, permission and review examples. Juanma confirmed graphite as the replacement for the earlier pure-black design constraint.

[Open the privately published Raiden proposals](https://raiden-interface.supabase-8786.chatgpt.site). Sign in with the owning ChatGPT account if prompted. The older Morrow previews keep their existing URL.

The React application remains on the existing design until a proposal is selected. These previews do not read or modify the prototype's saved data. See [preview setup and review status](docs/raiden-interface/README.md) for local viewing, building and the next implementation steps.
