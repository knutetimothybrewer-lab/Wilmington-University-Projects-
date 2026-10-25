# AI Literacy for Educators: Journey Through the Intelligence Machine

**Complete lecture edition · Wilmington University · Graduate education**

## Open the lecture

Download **`AI-Literacy-Lecture.html`** and double-click it in Chrome or Edge. The complete campus, content, diagrams, laboratories, notes, and assessments are inside that single file. You do not need a terminal, server, installation, internet connection, login, subscription, or API key. If GitHub shows code, use **Download raw file** first. The identically generated `index.html` is also a complete portable copy.

## Teach with it

1. Choose **Instructor** mode (the default).
2. Use **Begin your journey** for the opening question and five-building roadmap.
3. Start the clock when you want; it never advances scenes automatically.
4. Click a campus building or chapter card. The student walks to it; pause or skip the transition as needed.
5. Use the **Scene** selector or left/right controls to move through the teaching sequence.
6. In each exhibit, ask for a prediction, manipulate a variable, inspect the change, and discuss what the model leaves out.
7. Use **Focus exhibit** for larger laboratory space or **View environment** to reveal the room artwork.
8. Use **Dive Deeper**, **Reveal explanation**, and **Discussion prompt** to adjust depth without leaving the scene.
9. **Teaching notes** shows notes on the main screen; **Open separate notes window** provides a separate presenter view. Share only the lecture window if you want to avoid sharing notes. Full-screen sharing can expose both windows.
10. Finish the fifth checkpoint to return to campus and open the closing synthesis and reflection.

**Lecture tools** provides the opening roadmap, references with review notes, and a downloadable complete instructor guide with demonstrations, discussion prompts, technical explanations, applications, and answer keys. Reference links require internet only if opened. The lecture itself works offline.

## What is included

- Original 2.5D university-inspired campus, recognizable walking student, five distinct buildings and interiors, opening doors, camera travel, and skippable transitions.
- **29 teaching scenes**, **18 manipulable laboratories**, and **15 formative questions** with explanatory feedback.
- All five requested chapters: Four Kinds of AI; Token by Token; Hallucinations; Automation Bias; Human and Machine.
- Shared Instructor and Explore modes. Explore mode shows additional persistent study explanations and uses the same activities.
- Adjustable 60/75/90-minute pacing, manually controlled lecture clock, previous/next, chapter/scene selection, replay, scene reset, campus return, and fullscreen where supported.
- Local saved chapter/scene, visits, laboratory inputs, question responses, and closing reflection. Reset learning progress requires explicit confirmation.
- Reduced motion, lower animation, semantic controls, text equivalents, keyboard navigation, visible focus, responsive layouts, offline operation, and a storage-denied fallback.

## Suggested 75-minute session

| Segment           | Minutes | Main work                                                                        |
| ----------------- | ------: | -------------------------------------------------------------------------------- |
| Opening           |       5 | Essential question, purpose, campus roadmap                                      |
| Four Kinds of AI  |      15 | Rules, data classifier, neural computation, generation                           |
| Token by Token    |      20 | Tokens, embeddings, training/inference, attention, prediction, sampling, context |
| Hallucinations    |      12 | Unsupported claims, citations, confidence, verification, retrieval               |
| Automation Bias   |      10 | Commission/omission, support decisions, assessment errors, attribution           |
| Human and Machine |      10 | Task allocation, workflows, principles, agency, final checkpoint                 |
| Closing           |       3 | Synthesis and professional commitment                                            |

Each scene’s suggested minutes sum to its chapter allocation. The 60/90-minute setting scales chapter guidance but never imposes a time limit. For 60 minutes, use fewer experimental contrasts and leave deeper explanations for independent study. For 90 minutes, add pair discussion and a second verification/decision attempt. A full classroom rehearsal was not performed; adapt pacing to participation.

## Laboratory inventory and honesty

| Chapter       | Working laboratories                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Discovery     | Editable IF–THEN conditions; learned nearest-centroid classifier; adjustable two-unit neural forward pass; classification/generation task comparison                                             |
| Language      | Approximate tokenizer and synthetic IDs; hand-authored causal attention inspector; scripted conditional next-token choices; mathematical softmax/temperature/sampling; context-buffer experiment |
| Library       | Citation/source-support investigation; confidence-versus-accuracy claims; ordered verification workflow                                                                                          |
| Observatory   | Branching student-support decision with missing context; fraction assessment-error diagnosis; attribution/trust reflection                                                                       |
| Collaboration | Task allocation; three workflow comparison; seven principles converted into actions                                                                                                              |

No commercial AI runs in this application. The classifier is an actual small computational model. The neural network and temperature exhibits implement their stated mathematical equations. Other exhibits are transparently scripted conceptual demonstrations. Approximate tokens and synthetic IDs are not an actual model tokenizer. Scripted probabilities do not claim to come from an LLM. School cases, learner records, task outcomes, and attribution contrasts are fictional. The trust activity is not a validated psychological experiment.

## Research

The original transformer, hallucination-survey, and RAG papers were retrieved and relevant sections reviewed. Automation-bias publication metadata and NIST metadata/abstract were verified, while full-text access was unavailable. These limits are visible in the reference dialog and documented in `docs/sources.md`. No quotations, studies, statistics, citations, or universal educational effect sizes were invented. The fictional citation in the detective lab is explicitly labeled fictional. The citations activity distinguishes a real source’s existence from whether it supports a particular claim.

## Controls

| Key/control                              | Action                                                             |
| ---------------------------------------- | ------------------------------------------------------------------ |
| Left / Right                             | Previous / next scene                                              |
| 1–5                                      | Travel to a chapter                                                |
| Space                                    | Pause/resume motion (outside focused buttons and form fields)      |
| H / R / F                                | Campus / replay / fullscreen                                       |
| Escape                                   | Close top dialog/panel or skip a cinematic                         |
| Scene selector                           | Directly visit any scene in the current chapter                    |
| Reset in an exhibit                      | Restore its initial inputs                                         |
| Reset current scene                      | Restore current exhibit and temporary view state                   |
| Settings → Reset saved learning progress | Confirm clearing saved visits, activities, answers, and reflection |

Typing into form fields is protected from global shortcuts. Native form controls remain keyboard accessible. Reduced motion instantly reaches the same destination. Pausing never prevents access to navigation, explanations, or skip.

## Progress and privacy

State stays only in the browser/device and may be cleared or blocked, especially for local files or managed profiles. The application requests no names, emails, or actual student data and transmits no responses. Do not enter personal or student information in the reflection. Download the reflection for durable storage. An unavailable localStorage becomes an explanatory session-only fallback.

## Development architecture

`src/content/chapters.js` defines campus/building identity. `src/content/curriculum.js` supplies the complete scene registry, timings, instructional layers, demonstration procedures, and questions. `src/content/sources.js` holds references and review status. `src/lessons/models.js` contains testable mathematical/computational functions; `labs.js` renders the exhibits; `lecture-ui.js` renders explanations, resources, and exports. SVG views, the animation scheduler, centralized storage, and interface orchestration remain separate.

`docs/architecture.md` records the original foundation architecture. The lecture release extends it without replacing the campus. Generated `AI-Literacy-Lecture.html` and `index.html` are tracked; both contain the complete offline app. No build is needed to view either file.

After editing source, use Node 20+:

```sh
npm run build
npm test
```

No npm installation is required for the application or packager. To run automated browser tests, optionally serve the project with Python 3:

```sh
npm run dev
npm run test:browser
```

The server uses loopback port 8010. Playwright and Chromium are required only for testing. The cloud environment supplies Playwright through CommonJS lookup and `/usr/bin/chromium`; elsewhere provide `PLAYWRIGHT_MODULE` and `CHROMIUM_PATH`. `TEST_URL` overrides the test target. Optional Axe checks use `AXE_MODULE` pointing to `@axe-core/playwright`. See `docs/validation.md` for executed evidence and remaining manual checks.

All asset/content paths are portable; there are no runtime imports, external fonts, or required services. The static file is compatible with a repository subdirectory or approved LMS embedding. No live Pages site or repository settings were changed. The campus and student are original illustrations; this is not an official campus map or university logo reproduction.
