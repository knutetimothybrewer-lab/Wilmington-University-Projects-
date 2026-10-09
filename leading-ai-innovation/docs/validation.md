# Validation record

Tests were run on October 9, 2026 in the attached cloud machine, using Node 24.19.0, Python 3.12.14, system Chromium, and the supplied Playwright installation.

## Executed checks

- Production build: `npm run build` passed. Complete output copied to `dist/`, `.nojekyll` generated, asset paths checked for repository-subdirectory compatibility.
- Content suite: `npm test` passed all four tests. Verified 15 substantive chapter records, required instructional layers, all objectives/framework domains, unique activity types, valid source IDs, and five simulation stages with consequences.
- Browser suite: `tests/browser.mjs` runs against `/dist/` to exercise the actual production output under a subdirectory. The final run passed 93 assertions; its timestamp and target are recorded in ignored `test-results/summary.json`. Every activity is exercised, including all faculty/community responses, three full simulation paths, risky choices and constraints, local restore/reset, and exports.
- Presenter default, study details, switching modes with chapter/reflection preservation, completion restoration, and deep-link navigation passed.
- Manifesto generation, downloaded file content, clipboard copying, and print-document construction/cleanup passed. The test stubs the native print dialog and checks the generated print content; it does not assert printer or operating-system dialog behavior.
- Chapter panel Escape/focus restoration and Page Down navigation passed. Form inputs are protected from presentation keyboard shortcuts.
- Mobile (390×844), tablet (768×1024), desktop (1440×1000), and reduced-motion (1366×768) browser layouts checked. No horizontal overflow on the tested layouts. An additional 320-pixel viewport check reported zero overflow.
- No JavaScript page errors and no external application requests in the tested browser session. User reflections are not transmitted.
- Storage-denied browser context tested: session-only editing remains functional and storage limitations are explained.
- Axe accessibility scan with WCAG 2 A/AA, 2.1 AA, and 2.2 AA tags, with all study details open: zero violations, 32 passing rules. Low-contrast numbering and fading essential text discovered in the first scan were corrected. Scan evidence: ignored `test-results/accessibility.json`.
- Constrained-browser check: Chromium with four-times CPU throttling and disabled cache loaded in approximately 753 ms; 13 resource entries, 170,619 transferred bytes, 2,905 DOM nodes. This was a cloud-host test, not a measurement on a physical school Chromebook.
- Representative screenshots captured and visually inspected for desktop opening, mobile opening, and evidence dashboard. Screenshot files are under ignored `test-results/`.
- Repository welcome `index.html` remains unchanged; the new project is isolated in its own directory.

## Repeat accessibility checks

Install test tooling outside the application checkout (or use your own tools directory):

```sh
npm install --prefix /tmp/leadership-a11y --cache /tmp/leadership-npm-cache \
  --no-package-lock --no-audit --no-fund @axe-core/playwright
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright \
AXE_MODULE=/tmp/leadership-a11y/node_modules/@axe-core/playwright \
CHROMIUM_PATH=/usr/bin/chromium node tests/accessibility.mjs
```

Keep the development server running and build first. No runtime dependency or repository package/lockfile changes are needed for this test.

## Remaining review

- No physical Chromebook, screen-reader user session, Safari/Firefox run, or university LMS embed test was performed. Native fullscreen and actual OS print dialogs require manual verification in the deployment context. Automated accessibility checks are not a WCAG conformance certification.
- GitHub Pages output and paths were validated locally, but no remote site was deployed or tested. The manual workflow template is intentionally inactive until an authorized deployment task.
- UNESCO publication full text and the assigned Bowen/Watson chapter were not accessible; Learning Forward returned 403. The references and source log distinguish reviewed material from unverified reading prompts. Complete source-specific instructional review before university distribution.
