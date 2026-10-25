# Journey Through the Intelligence Machine
**AI Literacy for Educators · Wilmington University**

An immersive, cinematic, interactive lecture. An animated Wilmington student walks across a 2.5D virtual campus, enters five buildings, and works through live demonstrations on kinds of AI, how language models work, hallucinations, automation bias, and human–machine collaboration.

* **Deliverable:** `index.html`, one portable file (inline CSS, JavaScript and SVG, about 295 KB).
* **Runs offline.** No server, API key, login, subscription or build step is needed to *run* it. Double-click `index.html` in Chrome or Edge, or upload it to an LMS or any web host. It makes no network requests.
* **Target:** desktop Chrome/Edge, 16:9, scales to any window (checked at 1920×1080 and 1366×768).
* Default length 75 minutes; switchable to 60 or 90 (90 adds the optional scenes).

---

## Running it

1. Open `index.html`. The opening cinematic plays; press **S** to skip.
2. Share the browser window in your meeting tool. Press **F** for full screen.
3. Press **→** to advance. Press **Space** to reveal the next layer of a concept. Press **A** to reveal answers. Press **D** for Dive Deeper.
4. Keep private notes off the shared screen: press **G** (Guide) and choose *Open presenter notes in a separate window*. The in-page notes drawer (**N**) is clearly labelled in red because it is visible if you share that window.

### Two modes (same content, same simulations)
| | Instructor presentation (default) | Student exploration |
|---|---|---|
| Navigation | → / ← walk the lecture; map jumps anywhere | Free exploration; chapters unlock as the previous one is finished |
| Quizzes | Select, then reveal with **A** (class vote friendly) | Immediate explanatory feedback |
| Notes / pacing | Notes drawer, teaching guide, pacing timer | Study guide, progress counter |
| Switch | HUD button or Settings | HUD button or Settings |

Progress, quiz answers and optional notes are saved in the browser's `localStorage` only. No names or identifiers are requested or collected. *Settings → Erase all saved progress* clears everything.

### Keyboard shortcuts
`→/PgDn` next (during a cinematic: skip it) · `←/PgUp` previous · `Space/↓` reveal next layer · `A` answer/prompt · `D` Dive Deeper · `N` notes · `G` guide · `M` map & plan · `H` campus · `R` replay · `S/Esc` skip · `P` pause animation · `V` hide/show lesson panel (scene view) · `F` full screen · `+`/`−` text size · `?` help.

### Lecture plan (75 minutes; scaled automatically for 60 or 90)
| Segment | Min | Notes |
|---|---:|---|
| Opening cinematic, roadmap, warm-up | 5 | |
| 1 · Four Kinds of AI (AI Discovery Center) | 15 | optional: decision-tree workshop |
| 2 · Token by Token (Language Machine Lab) | 20 | optional: embedding map, attention explorer |
| 3 · Hallucinations (Digital Library) | 12 | |
| 4 · Automation Bias (Decision Observatory) | 10 | |
| 5 · Human and Machine (Collaboration Center) | 10 | |
| Return to campus, final reflection | 3 | |

The pacing indicator (click it to start/pause the timer; Alt+click resets) *suggests* "ahead / on pace / behind" and what to trim or add. It never advances or blocks anything.

---

## What is real and what is scripted
Every demonstration carries a badge, and the same distinction is in the instructor notes.

| Badge | Meaning | Examples |
|---|---|---|
| **Real computation (toy scale)** | The actual algorithm runs on the data you see | Rule engine, k-nearest-neighbor lab, neural-network forward pass (hand-set weights), bigram text generator, decision tree |
| **Simplified simulation** | Genuine arithmetic on illustrative numbers | Tokenizer (approximate, small vocabulary, hashed IDs), next-token probabilities, temperature/softmax, embedding map, attention, collaboration model |
| **Scripted demonstration** | Conceptual walk-through; outcomes are scripted | Context window, citation detective, confidence vs. accuracy, verification challenge, RAG toggle, student-support, assessment-error, trust, sorting, principles |

**No real large language model runs anywhere in this application.** No probability is presented as the output of a real model. Citation Detective contains four *fictional* entries (labelled as such on reveal and in the opening warning) beside four real, well-known works.

---

## Project layout
```
ai-literacy-journey/
  index.html          <- built single-file deliverable (open this)
  build.py            <- inlines src/ into index.html (python3 build.py; no dependencies)
  README.md
  src/
    template.html     page skeleton and HUD markup
    styles.css        all styling (design tokens at the top, high-contrast overrides)
    core.js           state + localStorage, animation loop, cinematic runner, avatar, particles
    art.js            2.5D parallax campus (reusable), interior environments
    sims1.js          simulation engine (UI helpers, Bars) + Chapter 1-2 labs
    sims2.js          Chapter 3-5 labs + concept figures (Vis)
    content1.js       REFS + Chapter 0 (opening) + Chapter 1
    content2.js       Chapter 2
    content3.js       Chapters 3-5 and Chapter 6 (closing)
    app1.js           views, modals, notes pop-out, cinematics
    app2.js           navigation, scene builders, HUD, pacing, dialogs, keyboard
```
You only need Python to *rebuild*. You can also edit `index.html` directly; the content data blocks are plain JavaScript.

### Editing the lecture (content is separate from engine)
All teaching content lives in `CHAPTERS` (`src/content*.js`) and `REFS`. A scene is a plain object:

```js
{ id:'c3-halluc', type:'concept', title:'What Is a Hallucination?', minutes:2, station:420,
  concept:{ term, def, explain, analogy, mechanism, classroom, misconception, discuss,
            check:{q, opts, ans, why}, visual:'halluc', demo:'c3-citation' },
  deeper:{ title, html },                       // "Dive Deeper" (optional)
  notes:{ say, demo, facilitate, misc, follow, caveat, transition } }   // instructor-only
```
* **Scene types:** `concept`, `lab` (`sim:'id'` plus `lab:{purpose, steps[], prompt, classroom}`), `quiz` (`questions[]`; use `reflect:true` for open-ended items), `discuss`, `cinema` (`cine:'opening'|'portal'|'return'`), `hub`, `finale`.
* **Change a definition or question:** edit the string. No code changes.
* **Add a scene:** append an object to a chapter's `scenes`. The dots, map, pacing plan and student progress update automatically. Mark extras `optional:true`; they appear in the 90-minute plan and in student mode.
* **Add a simulation:** `Sims.myLab={kind:'sim', title, mount(el){ ...build DOM into el...; return {replay(){...}} }}`, then reference `sim:'myLab'` from a lab scene. Reuse `UI.slider`, `UI.seg`, `Bars`, `softmax`.
* **Add a building/module:** push a chapter object (give it an `env` from `Envs` in `art.js`, plus `door` and a center in `Campus.centers`) to reuse the campus for a future course module.

---

## Accessibility and performance
Keyboard operation of every control, visible focus rings, ARIA labels, `aria-live` announcements for scene changes and captions, a high-contrast theme, text scaling (A−/A+), captions/text equivalents for all cinematic animation (and figure captions for diagrams), reduced-motion mode (also auto-enabled from the OS preference on first run), pause for all ambient animation (content stays fully usable while paused), and a lower-performance mode (fewer particles, ~30 fps). Rendering uses one `requestAnimationFrame` loop that runs only while something animates.

---

## Quality-assurance record
Automated checks were run with headless Chromium (Playwright) against the built file:

* All 7 chapters / 44 scenes (5 required chapters plus opening and closing) load with **no console or page errors**, in instructor and student modes.
* A stress script clicked every button, tab, option and node and moved every slider in every scene (instructor ≈ 270 clicks, student ≈ 260): **no errors**.
* Pressing only **→** walks the whole lecture (campus → five buildings → return), including the walking, door and fade transitions; skipping any cinematic works.
* The full unskipped portal cinematic (lab → zoom through the monitor → digital world) and the return/closing sequence were visually verified frame by frame.
* Reduced-motion + low-performance mode, state persistence across reload, locked chapters in student mode, map, guide, settings, help, notes drawer and Dive Deeper were exercised.
* No panel overflow at 1920×1080; legibility checked at 1366×768. No external network requests.

### Known limitations (please read)
* **Not tested** in a real Microsoft Edge, Firefox or Safari (Edge shares Chromium's engine), on touch devices, or with a physical screen reader. Screen-reader support (labels, live regions) is implemented but not user-tested.
* The presenter-notes pop-out needs the browser to allow pop-ups. If blocked, use the in-page drawer (and do not share that window while it is open).
* The phone layout is not optimized: the stage is a scaled 16:9 canvas designed for laptops and projectors.
* Dragging in the sorting lab is mouse-only; click-to-place works by keyboard and touch.
* The tokenizer, embeddings, attention, probabilities and logits are teaching approximations (labelled in the interface).
* **References:** citations are drawn from the author's knowledge of the literature and were not machine-verified against a database. Confirm DOIs, volumes and pages before reuse (the lecture itself teaches this habit).
* Statements about research (automation bias, learning-style matching, desirable difficulties) are deliberately qualified; evidence for AI-specific effects in K-12 settings is still developing.
