# A personality refinement

- Request: Juanma selected A, asked for a little personality, and will design the mascot himself.
- Deliverable: A1 Orbit (restrained space identity), A2 Studio (editorial serif identity and numbered missions), A3 Sidekick (closer conversational voice). A's chat/sidebar layout is preserved.
- Empty mascot mounts: 76px sidebar, 144px desktop onboarding, 72px narrow onboarding, 28px mobile header (22px at the narrowest widths). Corner registration marks reserve the space without depicting a character. No generated mascot assets.
- Original options are preserved; original chooser is at initial-options.html. Current index.html compares personality variants and recommends Orbit.
- Validation: inline scripts parse. Inspected desktop/mobile chat, desktop onboarding for all variants and mobile Orbit onboarding. All variants measured at 1440/390/320 for chat, and 320/768 for onboarding/permission/review with no horizontal overflow; send buttons remained within viewport. Local View draft opens and closes with Escape. Console reports zero errors/warnings.
- Evidence: output/playwright/morrow-personality contains chat captures at 1440/390/320, desktop onboarding captures, Orbit mobile onboarding and desktop/mobile chooser. Measurements are in the execution transcript.
- Published privately to https://morrow-chat-redesign.supabase-8786.chatgpt.site; status `succeeded`.
- Commit: `4ff118126aee132487a3a21224c08ff330ad689c`
- Version: `appgprj_6abe18116a948191a2033f51009b6121~appgver_5d0ee189c7dc81919c88da4e53bf6731`
- Deployment: `appgdep_6abe2dd838d48191b67b418551f3d3e5`
- README and selected-layout record updated. Real application changes await selection of the new personality treatment under AGENTS.md / html-communication.
