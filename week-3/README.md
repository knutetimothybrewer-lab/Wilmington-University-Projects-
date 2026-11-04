# Week 3 microlecture: Designing Lessons with AI That Work for Every Learner

One file, `index.html`, holds the whole lecture. It has no outside files, no tracking, and makes no network requests.
It lives in this repository at `week-3/index.html`. The course welcome page at the top of the repository is a different file and was not changed.

## Publish on GitHub Pages
1. Create a new repository on GitHub (or use this one).
2. Upload `index.html` (for this repository it is already in the `week-3` folder).
3. Open the repository's **Settings**.
4. Choose **Pages** in the left menu.
5. Under **Source**, choose **Deploy from a branch**. Set the branch to **main** and the folder to **/ (root)**. Save.
6. Wait a minute or two, then refresh the Pages screen.
7. Copy the live link. If the file is in a folder, the link ends with `/week-3/`.

You can also double-click `index.html` to open it on your own computer.

## How to edit the words
Open `index.html` in any text editor. All the words are in the first part of the `<script>` block, under the big comment "HOW TO EDIT THE WORDS". Change text inside the quotation marks only. Keep the commas and brackets.

| Name | What it controls |
|---|---|
| `COURSE` | Page title, the storage name for "remember my place," and the cut-off for "You've got this" (0.75 means 75% of a concept's questions) |
| `SECTIONS` | The 9 sections: title, minutes, the "What you will learn" line, and the "Remember" line |
| `OUTCOMES`, `TOUR` | The four goals and the control tour on the welcome screen |
| `T.welcome`, `T.s1` ... `T.s8` | The words on every screen, grouped by section. `T.s1.lines` and `T.s3.claims` are the clickable lines with their feedback |
| `SORT_LEARNER` | Section 2 cards (`a` is the right answer: `learner` or `tool`) |
| `UDL_CARDS` | The eight "real option or label" cards (`a: "real"` or `"label"`) |
| `SORT_HUMAN` | Section 5 cards (`draft`, `together`, or `human`) |
| `BIG_IDEAS` | The five big ideas (also shown on the results page) |
| `WEEK` | "Your week at a glance." Change the order, names, and minutes (`lo` and `hi`) |
| `QUIZ` | The 12 final questions. `CORRECT: true` marks the right option. It is never shown on screen. `inv: true` adds the Example (invented) badge. `sec` is the section the Review button returns to |
| `CONCEPTS` | The six concept names shown on the results page |

Colors are the variables at the top of the `<style>` block.
