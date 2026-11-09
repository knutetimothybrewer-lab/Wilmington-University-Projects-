# How Do Computers Talk? A Basic Guide to AI and Large Language Models

A self-running, 19-page crayon picture-book presentation for "AI Literacy for Educators."
One file (`index.html`), vanilla JS/CSS/SVG, no network calls, works fully offline.
Open it in a browser. By default it is in **click mode**: every speech bubble, character and animation appears when you click.
Click mode has no skipping: the Next button, Page Down, number keys, End and the progress dots only go **backward** or stay put. The only way forward is to click through every step. Activity pages (feed the books, tokens, next word, temperature, backpack, prompt journey, Real-or-Ghost game, bias shelves, recipe, iterate, checklist, traffic light) also wait until the activity is finished, and the page shows what is still needed. Demo cursors do not run in click mode, so you do each activity yourself.
Press `A` (or the Auto button) to switch to **autoplay**, where it runs itself start to finish (about 20 minutes).

## Controls
| Key | Action |
|---|---|
| Click / Right arrow | Reveal the next bubble or animation; when everything on the page is showing, go to the next page |
| C | Toggle click mode on / off |
| Space | Pause / resume everything |
| Left / Right | Previous / next page |
| A | Toggle autoplay (turns click mode off) |
| 1-9 (0 = page 10) | Jump to a page (autoplay mode only; click mode only goes back) (use Home/End or click the trail dots for 11-18); Home / End also work; the progress trail dots are clickable |
| F | Fullscreen (full-bleed, bar hidden; Esc or F exits). If a host blocks it, open the file in its own tab |
| R | Restart the current page's animation |
| [ and ] | Slow down / speed up all timings (0.5x to 3x) |
| M | Reduce-motion ("Calm") toggle; also on by default if the OS asks for reduced motion |

The toolbar is a slim bar docked under the slide, so it never covers anything. The cursor hides when idle.
In autoplay mode, real input on an interactive widget cancels that widget's auto-demo, and autoplay will
not advance until 4 seconds after the last input. Clicking a widget (a button, slider, card, bar) uses the widget and does not advance the slide.

## Motion
Everything on every page is always moving a little:
- Speech bubbles and captions pop in word by word; characters hop, tilt, fidget their arms and look around; cards and tokens bob; birds, a butterfly, rising stars, clouds and grass keep the scenery alive.
- Hand-drawn "line boil": art re-wiggles between two crayon textures. This is the heaviest effect. To remove it, delete the `.box::before,.btn::before,.tile::before,.chip::before{animation:boil ...}` rules in the CSS.
- Calm mode (M, or the OS reduced-motion setting) turns all of this off and shows everything at once.

## Check for understanding
Page 18 is a 14-question multiple-choice check that covers the basics from the whole deck (patterns, LLMs, training, tokens, next-word prediction, temperature, context window, understanding vs. pattern matching, hallucinations, bias, the prompt recipe, iterating, verifying, and the classroom traffic light). Nothing is graded harshly: a wrong choice highlights the correct answer, explains why, and names the page to look back at. The last screen shows the score and a "look back" list of missed topics. Edit the `Q18` array in the script to change the questions (first option in each is the correct one; the order is shuffled for display).

## Adjusting timing
Open `index.html` and edit the `DWELL` object at the top of the script (seconds per page).
`CONFIG` just below it holds the idle wait, toolbar/cursor hide delays and speed steps.
Dwell times are "virtual" seconds, so `[` and `]` scale them too.
Each page's own timeline (when bubbles pop, when the ghost cursor clicks) is in its `script(t)`
function, in milliseconds from the start of that page.

## Structure
`PAGES` registry (one `build()` + `script(t)` per page) · `Timeline` scheduler (pausable, speed-scaled,
demo steps keyed so real input overrides them) · character components (`svgRobo`, `svgTess`, `svgKid`,
`svgWorm`, `svgGhost`) · ghost-cursor demo helper · deck controller (transitions, trail, controls).

## Notes
Handwriting fonts come from system fallbacks (Chalkboard SE, Marker Felt, Comic Sans MS, cursive),
so lettering varies by machine; SVG titles are length-locked so they always fit.
Token splitting on page 5 is a labeled approximation, not a real tokenizer.

## Publishing with GitHub Pages
`.github/workflows/pages.yml` publishes only `ai-guide/index.html` (nothing else in the repo). One-time setup: repository Settings > Pages > Source: "GitHub Actions". After that, each push to `main` that touches `ai-guide/` redeploys it to `https://<owner>.github.io/<repo>/`.
