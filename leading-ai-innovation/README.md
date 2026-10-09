# Leading AI Innovation

MED 7830: AI Literacy for Educators · Week 7. A complete static seminar with 15 instructional modules, two shared-content viewing modes, original SVG learning environments, local reflections, a five-stage branching simulation, and downloadable/copyable/printable leadership commitments.

This project lives separately from the repository’s existing welcome `index.html`. The welcome page is preserved. No account, backend, paid API, external font, or runtime package is required. The university-inspired palette and original W course badge are not official university branding.

## Just view it in your browser

Download `view-presentation.html` and double-click it. This single file contains the complete presentation, styles, and JavaScript; it needs no terminal, server, installation, or other folders. If GitHub shows a file viewer, use **Download raw file** first. Browser policies can restrict local files; browser storage and clipboard behavior may differ for local files. Export the manifesto for a durable copy.

The modular `index.html` still uses the development-server instructions below. Regenerate the single-file edition after content changes with `node scripts/standalone.mjs` or `npm run build`.

## Run and build

Requirements: Python 3 for the development server; Node 20+ for build and content checks. Node 24 and Python 3.12 were used here. No `npm install` is needed.

```sh
cd /workspace/Wilmington-University-Projects-/leading-ai-innovation
npm run dev
```

The server listens on port 8001, loopback only. Use an HTTP server rather than opening the HTML with `file://`; ES module imports require HTTP. Within this cloud onboarding UI, loopback requests are for internal validation and are not user-facing previews.

```sh
npm run build
npm test
```

The build copies the complete static application into `dist/` and adds `.nojekyll`. It uses relative asset/module paths, so it works under a repository subdirectory. Serve `dist/` for production validation. There is no bundler or package lock because there are no runtime/build package dependencies.

## Content and code

- `src/content/modules.js`: the 15 chapters, definitions, analysis, elementary/secondary examples, access considerations, limits, strategies, and reflections.
- `src/content/scenarios.js`: fictional case decisions, learning-plan options, and simulation stages.
- `src/content/references.js`: learning objectives, W.I.L.M.U. domains, source links, and explicit verification notes.
- `src/components/`: shared semantic module rendering and original vector environments.
- `src/interactions/activities.js`: 15 distinct applications and local manifesto export.
- `src/animations/story.js`: event-driven scroll progress, restrained camera movement, scene/reveal observers.
- `src/utils/storage.js`: versioned local browser state and graceful storage failure.
- `src/styles/main.css`: responsive editorial system, study mode, reduced motion, and print layout.
- `docs/coverage.md`: instructional coverage and implementation map.
- `docs/sources.md`: source review evidence and unresolved access limitations.
- `docs/validation.md`: checks actually executed and remaining manual review.

Modify a chapter’s content in `modules.js`; both viewing modes share it. Add a source record and reference its ID rather than attributing a claim without a source. Update the activity handler and tests if you change a module ID or activity type. Keep fictional cases and illustrative data clearly labeled. Never enter student records into examples.

To add official branding, obtain an authorized asset, place it under `public/assets/branding/`, and replace the course badge in the header/footer with an image carrying meaningful alt text. Preserve proportions. Do not treat the suggested palette or current course badge as official brand specifications.

## Learning and accessibility

Presenter mode is the default and keeps detailed content in expandable sections. Study mode opens all detailed sections and keeps the same activities and reflections. Mode switches preserve the current chapter. A chapter panel, URL hashes, previous/next controls, Page Up/Down outside form controls, and a skip-introduction link support navigation. Escape closes the chapter panel and restores focus. There is no scroll hijacking.

Semantic sections, accessible labels, visible focus states, text alternatives for SVGs, non-color feedback, responsive layouts, reduced-motion preference support, and a motion toggle are included. Animation is event-driven and pauses when the document is hidden. Print the generated manifesto independently of the entire seminar. Automated accessibility checks are partial evidence, not certification; screen-reader and learner review remain appropriate before course distribution.

Reflections, activity choices, completion, viewing mode, and manifesto responses persist only in `localStorage` for this browser/device. Nothing is transmitted. The app never requests names or email addresses. Storage may be cleared or unavailable; export anything you want to retain. The reset control requires a second explicit local action. Simulation indicators are illustrative, not a validated leadership assessment.

## Browser tests

The environment provides Chromium and Playwright. Run:

```sh
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright \
CHROMIUM_PATH=/usr/bin/chromium npm run test:browser
```

Keep the development server running first; the default browser target is its `/dist/` subdirectory. Use `TEST_URL` to change the target. Elsewhere install Playwright in a separate tools directory, then supply its module path through `PLAYWRIGHT_MODULE` and a browser through `CHROMIUM_PATH`, or install Playwright locally and its browser per the official instructions. Browser tests fail explicitly if the tools are missing; they do not silently skip.

The suite exercises all activities, both modes, branching profiles/replay, completion/reflection restoration, manifesto generation/download/copy/print preparation, reset, internal hash links, keyboard navigation, mobile/tablet/reduced motion, and absence of external application requests. Screenshots and the current run summary are generated under ignored `test-results/`.

The optional Axe scan and its separate test-tool setup are documented in `docs/validation.md`.

## GitHub Pages

No push, publication, or remote settings were performed. `deployment/github-pages.yml` is a ready-to-review, manual-trigger workflow template. It is outside `.github/workflows` so it cannot unexpectedly publish on a later push. To use it:

1. Review source limitations and instructional content before distributing the seminar.
2. Copy it to `.github/workflows/leading-ai-pages.yml` at the repository root in an authorized deployment task.
3. Configure Pages to use GitHub Actions in repository settings.
4. Commit/push only when authorized, then manually run the workflow.

The artifact preserves the existing welcome page at the Pages root and hosts the seminar at `/leading-ai-innovation/` beneath the repository base path. Hash links resolve within that path. All assets are relative, and no client-side server routing is required. Pages has one site per repository; inspect any later site configuration before enabling this workflow.

## Instructional limitations

The supplied master brief was the only Week 7 material available. Relevant U.S. report, CAST, FERPA, FTC, DOJ, and IHI sections were accessed and reviewed. UNESCO’s official record responded with an application shell but the full publication text could not be retrieved. The assigned Bowen/Watson chapter was not supplied and publisher access returned 403. Learning Forward also returned 403. The application distinguishes verified recommendations, reading prompts, original instructional interpretations, and fictional cases. It does not fabricate quotations, statistics, chapter findings, or a two-document textual comparison. Verify the assigned book’s edition/year and review the missing readings before describing source integration as complete.
