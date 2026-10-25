# Lecture release validation

The lecture release extends the tested campus foundation into 29 scenes, 18 laboratories, and 15 formative questions. Node 24, Python 3.12, system Chromium, and Playwright were used in the cloud machine.

## Executed checks

- `npm run build`: single-file packaging with embedded styles, scripts, and original SVG artwork; no runtime imports or required external assets.
- `npm test`: ten tests covering complete scene layers and timings, the exact 75-minute plan, stable softmax and temperature behavior, nearest-centroid prediction and invalid data, neural equations, approximate Unicode token preservation, seeded sampling, waypoints, source-review status, and portable document completeness.
- `npm run test:browser`: all 29 scenes visited; all 18 labs exercised; all 15 questions answered with explanatory feedback; deeper explanations checked; unique IDs checked per scene. Also tests edited training data, invalid data, neural outputs, markup escaping, causal masks, updated next-token choices, sampling and greedy selection, context loss, every citation/claim case, branching support responses, assessment correction, trust limitations, allocation, principles, notes/popup, local restore beyond the foundation’s original three scenes, saved lab inputs, focus/environment controls, opening/references, full guide download, closing reflection/export, campus return, responsive sizes, avatar walking, pause, skip, rapid navigation, and offline document operation.
- `node tests/accessibility.mjs`: Axe WCAG 2 A/AA, 2.1 AA, and 2.2 AA tags across 26 views: campus, all lab/checkpoint views, deeper dialog, and settings dialog.
- Screenshots captured for the campus, temperature exhibit, 1920×1080, and mobile layout. The main control bar fits the 1366×768 presentation viewport.
- Offline document injection executes a complete sampling laboratory without external requests and with storage-denied fallback. No claim of a physical Windows double-click test is made from the cloud machine.
- The original repository welcome page and the prior Leading AI Innovation project remain unchanged.

The final run passed 228 browser assertions; all 10 unit/content tests passed. The 26 Axe view scans reported zero detected violations. Exact final assertion counts and timestamps are stored in ignored `test-results/lecture-summary.json` and `test-results/lecture-accessibility.json` and summarized in the final delivery report. Screenshots and downloaded guide/reflection test files are also ignored.

## Interpretation

The classifier is computational, the neural and sampling models implement stated mathematics, and all other laboratories disclose their conceptual/scripted nature. No live commercial LLM, actual tokenizer, empirical school dataset, or validated psychological test is claimed. A demonstration’s output is not evidence of educational effectiveness.

Automated accessibility checks are not certification. A real 75-minute class rehearsal, physical school Chromebook, native Windows/Edge installation, screen-reader user session, Safari/Firefox, LMS embedding, and OS print-dialog behavior were not tested. Browser policies may restrict local files, storage, popups, or fullscreen. Teacher review of fit to the actual learners and course remains appropriate.

Full-text access limitations for two further-reading references are explicitly documented in `docs/sources.md` and the application. Three original AI papers were retrieved and relevant sections reviewed. No unavailable source is described as fully reviewed.
