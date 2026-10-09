# AI Literacy for Educators

A static Wilmington University course welcome: a bright study, a scroll-controlled camera into a classroom, and an evolving course journey. Seven weeks plus Week 0 orientation. No backend, build step, API key, tracking, cookies, or local storage.

## Open the experience

Open `index.html` in a current browser with the `assets/` folder beside it, or serve the repository:

```sh
cd /workspace/Wilmington-University-Projects-
python3 -m http.server 8000 --bind 127.0.0.1
```

The same files work on GitHub Pages. The static site is prepared for the `gh-pages` branch of `knutetimothybrewer-lab/Wilmington-University-Projects-`. Configure GitHub Pages to deploy from that branch, folder `/ (root)`. A `.nojekyll` file keeps deployment purely static. Publication status must be checked separately; a pushed branch alone does not establish that the public site is live.

## Instructor edits

| Change                                                         | Edit                                                                                                                                                                                           |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Week 1 destination                                             | `COURSE_START_URL` in `assets/course.js`. Set a real course URL. An empty value shows a disabled, clearly explained launch button.                                                             |
| Link behavior in an LMS                                        | `COURSE_START_TARGET` in `assets/course.js`: `_top` by default; `_self` or `_blank` if appropriate. The LMS must permit the chosen navigation.                                                 |
| Official logo                                                  | Put the original file in `assets/`, set `LOGO_SRC` in `assets/course.js`. It is displayed with its original colors and proportions. The current university text label is not an official logo. |
| Weeks, topics, builds, outcomes                                | The `WEEKS` array in `assets/course.js`.                                                                                                                                                       |
| Assessment weights and details                                 | `ASSESSMENT` in `assets/course.js`. The total should remain 100%; invalid totals produce a visible configuration message.                                                                      |
| Role highlights                                                | `PERSONAS` in `assets/course.js`. Content is highlighted, never filtered away.                                                                                                                 |
| Portfolio artifacts                                            | `ARTIFACTS` in `assets/course.js`. Artifacts link back to the week where they are built.                                                                                                       |
| Palette                                                        | The named properties at the top of `assets/style.css`. Wilmington green is a requested accent, not a color sampled from a supplied logo.                                                       |
| Welcome, overview, weekly rhythm, capstone, text and standards | Semantic HTML in `index.html`.                                                                                                                                                                 |
| Interactions and camera                                        | `assets/app.js`.                                                                                                                                                                               |

The HTML includes a complete static copy of the weeks, portfolio, and assessment so course content remains readable if scripts are disabled or blocked. JavaScript refreshes those sections from the editable arrays. After changing the arrays, also refresh the static copy for script-free readers with the optional helper described below.

## Experience and accessibility

- Independent study, desk, transparent learner, monitor, and classroom layers. Native scrolling drives a reversible approach over 3.5 desktop viewport heights (2.9 on phones).
- Generated photographic imagery with subtle breathing and parallax. This is **2.5D photographic animation**, not a fully rigged 3D character, motion capture, or a rendered typing sequence.
- The same classroom architecture persists through Understand, Design, Lead, and the finale. Displays introduce source checking, multiple ways to learn, teacher review, accessibility, and privacy.
- Actual HTML copy and controls; no screenshot interface, canvas-only content, or animation libraries.
- Skip intro, keyboard navigation, arrow-key skill tabs, native expandable weeks, touch-accessible assessment details, and visible focus states.
- Motion pause stops ambient animation and switches to a static opening. Device reduced-motion preferences are respected automatically. Enlarged text uses a more spacious static reading layout.
- No continuous JavaScript animation loop: scroll and resize updates use a scheduled animation frame. Ambient CSS animation pauses when the document is hidden.
- All images, styles, and scripts are local. The shipped page makes no third-party font or API requests. Core site files total approximately 466 KB before transport compression.
- LMS iframe use was exercised locally. Host-specific LMS sanitization and sandbox policies still require a check in the actual LMS.

## Asset status

The pasted master brief was the authoritative specification. The separate original course prompt, official WU logo, and approved banner mockup were not attached and were not found in the checkout. The existing course data supplied the starting weekly content, with the new brief's light visual direction and grounding/guardrail wording applied.

The classroom and study plates, and the transparent learner foreground, were generated for this concept and optimized to WebP. They are not official university photography. The original generated PNGs remain outside the checkout in the workspace. Replace them with approved assets if required. Do not recolor or redraw the supplied official logo when it becomes available.

Still needed before a course launch:

1. The approved original WU logo (white monogram on blue, per the brief).
2. Review against the approved banner reference when supplied.
3. The actual Week 1 destination.
4. Enable GitHub Pages for `gh-pages` at `/ (root)` and verify the deployed website. Publication to this repository has been authorized.

## Validation

Tested in Chromium at 360, 768, and 1440 CSS pixels. Real clicks and keyboard actions exercised section navigation, all three skill demos, weekly details, role highlights, capstone, assessment selection/reset, motion pause/resume, reverse scrolling, and the unconfigured launch state. No missing local assets, JavaScript exceptions, or horizontal page overflow were found.

Additional checks covered:

- Reduced motion, JavaScript disabled, and JavaScript requests blocked: complete course content and native weekly details remain available.
- 200% text enlargement at 360 and 1440 pixels, with functional controls and no horizontal page overflow.
- A 720×450 viewport representing the reflow available to a 1440×900 browser at 200% zoom.
- An LMS-style 768-pixel iframe with working prompt interaction.
- axe-core WCAG A/AA scan: zero reported violations after correcting the outcome-number contrast. Automated checks do not replace a full assistive-technology audit.

With the server running, the optional development smoke test uses Playwright and Chromium already installed in this cloud environment:

```sh
node tests/smoke.cjs
```

`COURSE_TEST_URL` can select a different local server. `AXE_CORE_PATH` can point to an installed `axe.min.js` to include the automated accessibility scan; otherwise that scan is explicitly reported as unrun. Screenshots and results go to a newly created temporary directory, not into the repository. These development tools are not needed to run the site.

After editing course data, refresh the static fallback with the server running:

```sh
node scripts/refresh-static.cjs
```

Review the resulting `index.html` diff. This optional authoring helper uses the rendered data to update the three marked fallback sections; it does not change other content or publish anything.

## Review artifacts

The workspace handoff includes `/workspace/deliverables/AI-Literacy-Interactive-Preview.html` (embedded images, styles, and scripts), a source ZIP, desktop/mobile screenshots, and validation results. The single-file preview was served locally and verified with working interactions and no additional network requests. Direct `file:` navigation is blocked by the cloud browser's managed policy, so that navigation mode was not validated here.

The cloud environment's saved startup draft was updated for this file structure and smoke test. Saving the draft does not publish either the environment or this website. Review and save the draft in environment settings, then publish the environment when ready.
