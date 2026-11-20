# Stonehollow: The Oracle Rock

An animated, interactive AI-literacy walkthrough for the **AI Literacy for Educators** course (about 15–20 minutes).
Cavepeople and dinosaurs figure out AI together while learners work through three modules:

1. **Sparkstone Grades the Cave Paintings**: why AI should not be the final grader.
2. **The Sniff-o-Saurus**: why AI detectors are unreliable.
3. **The Stone Forge**: how to build AI-resistant and AI-integrated assessments.

Twelve mastery-gated questions (single choice, multi-select, two-bucket sort, true/false stone cards, ordering, and a
"build it" forge challenge), each with a four-step hint ladder. The walkthrough ends on a results page ("The Cave Wall")
with a copyable completion summary and a print / save-as-PDF option.

## Files

- `index.html`: the whole experience in one self-contained file (inline CSS, inline SVG art, Web Audio sound, vanilla JS).
  No CDNs, no external assets, no build step. It works from disk, on GitHub Pages, or inside an LMS iframe.

## Live URL

When GitHub Pages is enabled for this repository (branch `main`, folder `/ (root)`), the walkthrough is served at:

```
https://<github-username>.github.io/<repository-name>/stonehollow/
```

For this repository: `https://knutetimothybrewer-lab.github.io/Wilmington-University-Projects-/stonehollow/`

If you move it to its own repository named `stonehollow`, the pattern becomes `https://<github-username>.github.io/stonehollow/`.
All paths are relative, so either location works.

## Editing the text

All dialog, questions, hints and explanations live in the `CONFIG` object at the top of the `<script>` block in
`index.html`. Edit the strings there; the logic below it doesn't need to change. Bump `CONFIG.version` when you redeploy.
The version shows in the footer, so you can tell which deploy students are seeing.

## Instructor tools

- `?debug=1` (for example `.../stonehollow/?debug=1`) shows a "skip to module" menu and a "reveal answers" toggle.
- Progress is saved in `localStorage` when the browser allows it, and in memory otherwise (some LMS iframes block storage).

## Embedding in Canvas or another LMS

```html
<iframe src="https://knutetimothybrewer-lab.github.io/Wilmington-University-Projects-/stonehollow/"
        title="Stonehollow: The Oracle Rock" style="width:100%;height:720px;border:0" allow="clipboard-write"></iframe>
```

The layout fills whatever height the iframe gives it. `allow="clipboard-write"` lets the "Copy completion summary"
button work inside the frame. Without it, the page shows the summary text for manual copying.

## Accessibility

Full keyboard operation, visible focus, live regions for dialog and feedback, labelled SVG art, a mute toggle, and a
"Reduce motion" toggle that also follows the system `prefers-reduced-motion` setting.

The completion summary is a self-report, not a secure certificate.
