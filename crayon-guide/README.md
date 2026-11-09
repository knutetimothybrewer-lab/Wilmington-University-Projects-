# How Do Computers Talk? A Crayon Guide to AI and Large Language Models

A self-running, 18-page crayon picture-book presentation for "AI Literacy for Educators."
One file (`index.html`), vanilla JS/CSS/SVG, no network calls, works fully offline.
Open it in a browser. It starts playing by itself (about 20 minutes).

## Controls
| Key | Action |
|---|---|
| Space | Pause / resume everything |
| Left / Right | Previous / next page |
| A | Toggle autoplay (page auto-advance) |
| 1-9 (0 = page 10) | Jump to a page (use Home/End or click the trail dots for 11-18); Home / End also work; the progress trail dots are clickable |
| F | Fullscreen |
| R | Restart the current page's animation |
| [ and ] | Slow down / speed up all timings (0.5x to 3x) |
| M | Reduce-motion ("Calm") toggle; also on by default if the OS asks for reduced motion |

A small toolbar appears on mouse move and hides after 3 seconds. The cursor hides when idle.
Touch/mouse input on any interactive widget cancels that widget's auto-demo, and autoplay will
not advance until 4 seconds after the last input.

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
