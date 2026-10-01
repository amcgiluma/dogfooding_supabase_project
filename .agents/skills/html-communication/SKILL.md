---
name: html-communication
description: Create a polished HTML artifact when Juanma explicitly asks for an HTML plan, spec, write-up, findings summary, report, comparison, or set of UI mocks. Also use it for complex visual explanations and non-trivial UI decisions.
---

# HTML communication

Use this skill whenever Juanma explicitly asks for an HTML artifact to present information, even when the topic is simple. Also use a visual page when relationships, sequences, tradeoffs, or several moving parts would make a chat explanation dense. For UI work, follow the mock-first rule in `AGENTS.md`. The goal is for Juanma to understand the idea at a glance and explore details only if useful.

## Explain the idea

- Decide the one thing the reader should understand or choose. Put the answer near the top in plain language.
- For plans, specs, write-ups, findings, summaries, reports, and comparisons, preserve the facts, decisions, evidence, and open questions that matter. Organize them for scanning without inventing conclusions or stripping out important detail.
- Show structure with a diagram when it clarifies the material: flow for a process, timeline for an order of events, map for relationships, or comparison for choices. Label links and consequences directly. Use a concrete example when it removes ambiguity.
- Keep copy short and human-readable. Define unfamiliar terms where they first matter. If a simplification hides a real condition or uncertainty, make that condition visible.
- Use interaction only when it helps explain cause and effect or lets the reader compare scenarios. The page must still make sense without interaction.

## Build the page

- Create a self-contained HTML file with semantic HTML, responsive CSS, and inline SVG where useful. Avoid external dependencies unless the task needs them.
- Make it visually deliberate: strong type hierarchy, careful spacing, crisp alignment, restrained accents, and diagrams that carry information. Prefer a few well-composed sections to a long scroll of text.
- Follow the project's visual rules: dark mode, true black (`#000`) background, white primary text, dense information, minimal copy, no decorative card or pill chrome, no light-gray subtitle lines above sections, and no em dashes. Do not use continuously repainting animations.
- Keep text legible on mobile. Give diagrams text labels, sufficient contrast, and a reading order that survives narrow screens. Do not rely on color alone to convey meaning.
- Check the finished file in a browser or preview when available. Fix overflow, clipped labels, unclear diagrams, and broken interactions before sharing it.

## Deliver

Save the HTML in the workspace at a task-appropriate path and give Juanma a clickable link plus a one-sentence description. If the task or `AGENTS.md` calls for publication, publish the finished static page with an available tool and report its URL. Never claim a page is published without a working URL.

For UI mocks, make several genuinely different options, publish them as required by `AGENTS.md`, report the URL, and wait for Juanma's choice before editing real components. For explanations, give the useful answer in chat too; the HTML should make the difficult part easier to grasp, not be the only place the answer exists.
