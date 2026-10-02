# Raiden interface proposals

Static design review for the Raiden redesign, on `design/raiden-interface`. These files are independent of the React prototype and do not read or change its saved data.

[Published comparison](https://raiden-interface.supabase-8786.chatgpt.site), private to the owning ChatGPT account. Previous Morrow previews remain separate.

Open [the comparison](index.html), then explore:

- [Command](command.html): compact navigation, central chat, mission tracking on the right.
- [Signal](signal.html): open conversation with a top mission strip and expandable details.
- [Vector](vector.html): asymmetric layout with larger headings and a technical activity column.

The preview controls demonstrate onboarding, empty/populated chat, mission creation, permission decisions and deliverable review. All activity is fictional and happens only on interaction. No accounts, agents, external sources or backend services are connected.

## Confirmed direction

Juanma selected Vector: a graphite interface, sci-fi typography, clipped corners and visible finite motion. Raiden is the product brand and new onboarding profiles use Raiden as the companion name. The React app now has a compact top header, large asymmetric workspace title, flat transcript rows, a technical mission column, and local Rajdhani and IBM Plex fonts. Existing companion names and browser data remain unchanged.

## Local review and build

From the repository root:

```sh
python3 -m http.server 4178 --bind 127.0.0.1 --directory docs/raiden-interface
```

Visit `http://127.0.0.1:4178`. To package the static HTML and fonts:

```sh
node docs/raiden-interface/build.mjs
```

The output is `docs/raiden-interface/dist/`. The build publishes only static proposals, not the React application. Publication uses the private Sites project recorded in this directory's `.openai/hosting.json`; keep previous Morrow previews separate.

## Fonts and motion

Rajdhani 600/700 and IBM Plex Sans 400/500/600 are served from `fonts/`, with their SIL Open Font License files alongside them. Source repositories: [Google Fonts Rajdhani](https://github.com/google/fonts/tree/main/ofl/rajdhani), [IBM Plex](https://github.com/IBM/plex).

Animations are finite, use transform/opacity, honor reduced motion and do not run continuously while idle. Interface copy remains English; the design comparison explains the choices in Spanish.

## Implementation status

Vector is selected and implemented in the local React application. Onboarding retains its typewriter and layered stellar scene; the scene settles after a finite step transition, and reduced-motion or hidden-tab preferences stop unnecessary motion. Run the React prototype from the repository root to inspect the implementation. The static proposals above remain unchanged historical references.
