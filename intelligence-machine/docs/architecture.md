# Lecture release extension

The full lecture now implements 29 teaching scenes, 18 laboratories, and 15 formative questions. `src/content/curriculum.js` overlays the chapter registry; `src/lessons/models.js`, `labs.js`, and `lecture-ui.js` supply computational models, interactive exhibits, study views, and exports. The portable HTML remains dependency-free. Read README.md and docs/validation.md for current operations and checks. The foundation analysis below is retained as design history; its deferred-scope list has been completed in this lecture release.

# Architecture and scope — foundation release

## Specification analysis

The supplied Revised Version 2.0 describes the eventual 75-minute lecture, including 5 chapters, roughly 17 laboratories, assessments, full teaching guides, and optional advanced explanations. The user's preceding instruction explicitly limits the first implementation to a polished world/navigation foundation. That staged scope governs this release. The five exact chapter identities and their scientific qualifications are retained; full teaching scenes, laboratories, question banks, and source research are deferred. No empty laboratory buttons imply those features exist.

## Technical choices

- Modern vanilla JavaScript; SVG for the 2.5D campus, original buildings, landscaping, avatar, and five interiors. SVG permits crisp presentation scaling and semantic controls without WebGL or a graphics dependency. CSS provides lighting, perspective, and interface states. Canvas is unnecessary for this foundation.
- A fixed logical world coordinate system and responsive viewBox retain waypoint geometry at every screen size. On small screens the chapter list remains an equivalent navigation route, while a zoom control supports the map.
- One animation scheduler uses requestAnimationFrame only during journeys. Elapsed-time interpolation drives avatar position, walk cycle, door opening, and camera travel. Pause stores elapsed time. Cancel/skip resolves the same state transition; no unattended timeout advances instructional content.
- Central state validates chapter and scene identifiers, mode, animation preferences, visit state, and local progress. A serialized transition token prevents stale completion callbacks after skip, reset, direct jumps, or return-to-campus.
- Registry-driven chapters have ordered scenes, learning objectives, narration, explanations, analogies, misconceptions, discussion questions, assessment and simulation registries, transitions, timings, references, and explicit release status. Deferred content collections are empty and identified as future work rather than fabricated.
- Reusable view functions produce campus buildings, student avatar, interior props, teaching panels, chapter navigation, and notes. Data does not own SVG transforms or event listeners.
- Instructor and student modes share the same world, registry, navigation, and scene state. Instructor notes can open in a separate window; notes shown inside the main application are explicitly labeled visible to a screen share. The separate window updates while open and does not persist personal data.
- Authoring sources live under src/. A dependency-free Node packaging script inlines CSS and JavaScript into index.html. The delivered index.html has no imports, external assets, fetches, fonts, service worker, login, or API. No build or server is required to view it; packaging is only needed after editing source.

## State and events

Navigation: campus → walking → doorway → camera transition → interior scene. Return: interior → pullback → campus, keeping the avatar at that doorway. All cinematics can be skipped; reduced motion takes the final route immediately. Direct chapter selection replaces any in-flight transition. Scene changes occur only on user action.

Commands: selectChapter, nextScene, previousScene, returnCampus, pause, replay, resetScene, switchMode, setMotion, setQuality. Views consume current state. Progress saves only stable chapter/scene destinations; closing during a journey never restores an incoherent half-transition.

## Accessibility and performance

Visible text alternatives accompany map/interior artwork. Every building has a keyboard-focusable equivalent chapter button. Escape closes panels; arrow shortcuts do not run in form controls. Dialogs use native dialog with focus restoration. Reduced motion and low-animation settings are independent of navigation. Pausing a journey still leaves skip and navigation available. State persistence failure becomes an explanatory message, not a startup error. No personal information is requested.

No continuous particle loop, raster asset, third-party dependency, or GPU-heavy blur is required. 16:9 presentation scenes are primary; a stacked mobile layout preserves all controls. Browser checks cover 1920×1080, 1366×768, mobile, reduced motion, offline document execution, transitions, state restoration, and rapid navigation.
