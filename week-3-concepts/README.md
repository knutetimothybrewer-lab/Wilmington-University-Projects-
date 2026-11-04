# Week 3 concepts lecture (presenter-led)

`index.html` is the explanatory version of Week 3, built to be presented live. It has 21 pages in seven chapters: grounding (with three classroom examples), prompting (the five parts of a prompt), UDL with AI (prompts that build real options, then checks), checking what AI generates, what to keep human, privacy, and a wrap-up. It is separate from the student check page in `../week-3/`.

**Look:** every screen is a page in a comprehension book (ruled lines, margin line, spiral binding, margin notes), with Wilmington green, a Wilmington University wordmark on every page, and the same plain-words, Good / Error / Check this, and Example (invented) rules as the student page.

**Live link (after merge, once GitHub Pages is on):**
`https://knutetimothybrewer-lab.github.io/Wilmington-University-Projects-/week-3-concepts/`
A link to one page, such as `.../week-3-concepts/#8`, opens that page.

## Presenting
| Key | What it does |
|---|---|
| Right Arrow, Page Down, Space | Reveal the next idea on the page, then turn the page |
| Left Arrow, Page Up | Hide the last idea, then go back a page |
| N | Show or hide your presenter notes (talking points for each page) |
| A | Show everything on the page at once |
| C | Contents (click any line to jump) |
| F | Full screen |
| Home / End | First / last page |

Students can open the same link on their own and use **Show all**. The page makes no network requests and sends nothing anywhere.

## Editing
All words are in the data objects at the top of the script (`DECK`, `T`, `CONTENTS`, `EXAMPLES`, `PATTERN`, `PROMPT`, `UDL_AI`, `SORT`, `UDL_ROWS`, `KEEP`, `IDEAS`, `WEEK`). Presenter notes are the second text in each `addSlide(...)` line. To use the official logo, set `DECK.logoSrc` to the logo file path. To change the green, change `--wu-green` at the top of the style block.
