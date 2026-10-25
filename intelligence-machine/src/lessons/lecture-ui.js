import { state, persist, escapeText, announce } from "../engine/state.js";
import { chapterRegistry, getChapter } from "../content/chapters.js";
import { lectureSources } from "../content/sources.js";
import { mountLectureLab } from "./labs.js";
const LE = escapeText;
let lectureCommands = {};
export function renderLectureNotes(c, scene) {
  return `<h2>${LE(c.name)} · ${LE(scene.name)}</h2><p><strong>Chapter ${c.minutes} min; this scene approximately ${scene.minutes} min at the 75-minute pace.</strong></p><h3>Objectives</h3><ul>${c.objectives.map((x) => `<li>${LE(x)}</li>`).join("")}</ul><h3>Suggested narration</h3><p>${LE(scene.notes.narration)}</p><h3>Demonstration procedure</h3><p>${LE(scene.notes.demonstration)}</p><h3>Educational application</h3><p>${LE(scene.application)}</p><h3>Analogy and limitation</h3><p>${LE(scene.analogy)}</p><h3>Anticipated misconception</h3><p>${LE(scene.misconception)}</p><h3>Facilitation prompt</h3><p>${LE(scene.discussion)}</p><p>${LE(scene.notes.facilitation)}</p><h3>Technical depth / qualification</h3><p>${LE(scene.deeper)}</p><h3>Transition</h3><p>${LE(scene.notes.transition)}</p>${scene.lab === "assessment" ? `<h3>Instructor answer guide</h3><ol>${c.assessments.map((q) => `<li>${LE(q[0])}<br><strong>${LE(q[1][q[2]])}</strong> ${LE(q[3])}</li>`).join("")}</ol>` : ""}`;
}
export function renderLectureWorkspace(c, scene) {
  document.querySelector("#experience").classList.remove("environment-view");
  const workspace = document.querySelector("#lesson-workspace");
  workspace.hidden = false;
  mountLectureLab(document.querySelector("#lesson-content"), c, scene);
  document.querySelector("#deeper-content").innerHTML =
    `<h3>The explanation</h3><p>${LE(scene.explanation)}</p><h3>Dive deeper</h3><p>${LE(scene.deeper)}</p><h3>Analogy and its limits</h3><p>${LE(scene.analogy)}</p><h3>Educational application</h3><p>${LE(scene.application)}</p><h3>Misconception to challenge</h3><p>${LE(scene.misconception)}</p>`;
  document.querySelector("#deeper-title").textContent = scene.name;
  const select = document.querySelector("#scene-selector");
  select.innerHTML = c.scenes
    .map(
      (s, i) =>
        `<option value="${i}">${i + 1}. ${LE(s.name)} · ${s.minutes} min</option>`,
    )
    .join("");
  select.value = state.scene;
  document.querySelector("#scene-jump").hidden = false;
  document.querySelector("#explanation-text").textContent = scene.explanation;
  document
    .querySelector("#lesson-focus")
    .setAttribute(
      "aria-pressed",
      document
        .querySelector("#experience")
        .classList.contains("focused-exhibit"),
    );
  document.querySelector("#lesson-focus").textContent = document
    .querySelector("#experience")
    .classList.contains("focused-exhibit")
    ? "Show campus room"
    : "Focus exhibit";
  const study = document.querySelector("#study-reading");
  study.innerHTML = `<h2>${LE(scene.name)}</h2><p>${LE(scene.explanation)}</p><h3>Apply it</h3><p>${LE(scene.application)}</p><h3>Analogy</h3><p>${LE(scene.analogy)}</p><h3>Common misconception</h3><p>${LE(scene.misconception)}</p><h3>Critical question</h3><p>${LE(scene.discussion)}</p><details><summary>Dive deeper</summary><p>${LE(scene.deeper)}</p></details>`;
  study.hidden = state.mode !== "student";
}
export function lectureGuide() {
  return (
    "# AI Literacy for Educators: Journey Through the Intelligence Machine\n\n75-minute plan: opening 5; chapters 15, 20, 12, 10, 10; closing 3.\n\n" +
    chapterRegistry
      .map(
        (c) =>
          "# " +
          c.name +
          "\n" +
          c.essentialQuestion +
          "\n\n" +
          c.scenes
            .map(
              (s) =>
                "## " +
                s.name +
                " (" +
                s.minutes +
                " min)\n\n" +
                s.body +
                "\n\nEXPLANATION\n" +
                s.explanation +
                "\n\nDEMONSTRATION\n" +
                s.notes.demonstration +
                "\n\nAPPLICATION\n" +
                s.application +
                "\n\nANALOGY\n" +
                s.analogy +
                "\n\nMISCONCEPTION\n" +
                s.misconception +
                "\n\nDISCUSSION\n" +
                s.discussion +
                "\n\nDEEPER\n" +
                s.deeper,
            )
            .join("\n\n") +
          "\n\nANSWER GUIDE\n" +
          c.assessments
            .map((q) => q[0] + "\n" + q[1][q[2]] + "\n" + q[3])
            .join("\n\n"),
      )
      .join("\n\n") +
    "\n\nREFERENCES\n" +
    lectureSources
      .map((s) => s.citation + "\n" + s.url + "\n" + s.status + " — " + s.note)
      .join("\n\n")
  );
}
function downloadLectureFile(name, text) {
  const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    ),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function showLectureClosing() {
  document.querySelector("#closing-reflection").value = state.reflection || "";
  document.querySelector("#closing-dialog").showModal();
}
export function installLectureUI(commands) {
  lectureCommands = commands;
  document.querySelector("#room-button").onclick = () =>
    document.querySelector("#experience").classList.add("environment-view");
  document.querySelector("#return-exhibit").onclick = () =>
    document.querySelector("#experience").classList.remove("environment-view");
  document.querySelector("#deeper-button").onclick = () =>
    document.querySelector("#deeper-dialog").showModal();
  document.querySelector("#lesson-focus").onclick = () => {
    const focused = document
      .querySelector("#experience")
      .classList.toggle("focused-exhibit");
    document
      .querySelector("#lesson-focus")
      .setAttribute("aria-pressed", focused);
    document.querySelector("#lesson-focus").textContent = focused
      ? "Show campus room"
      : "Focus exhibit";
  };
  document.querySelector("#scene-selector").onchange = (e) =>
    lectureCommands.goScene(+e.target.value);
  document.querySelector("#source-list").innerHTML = lectureSources
    .map(
      (s) =>
        `<article><h3>${LE(s.citation)}</h3><p>${LE(s.note)}</p><p><strong>${LE(s.status)}</strong></p><a href="${s.url}" target="_blank" rel="noopener noreferrer">Open authoritative record / source ↗</a></article>`,
    )
    .join("");
  document.querySelector("#sources-button").onclick = () =>
    document.querySelector("#sources-dialog").showModal();
  document.querySelector("#export-guide").onclick = () =>
    downloadLectureFile("AI-Literacy-Instructor-Guide.md", lectureGuide());
  document.querySelector("#opening-button").onclick = () =>
    document.querySelector("#opening-dialog").showModal();
  document.querySelector("#begin-lecture").onclick = () => {
    document.querySelector("#opening-dialog").close();
    lectureCommands.begin();
  };
  document.querySelector("#closing-reflection").oninput = (e) => {
    state.reflection = e.target.value;
    persist();
  };
  document.querySelector("#export-reflection").onclick = () =>
    downloadLectureFile(
      "AI-Literacy-Reflection.txt",
      "What should students still learn to do themselves when AI can produce an answer?\n\n" +
        (state.reflection || "") +
        "\n\nHuman judgment • Verification • Learner agency",
    );
  document.querySelector("#revisit-chapter").onclick = () =>
    document.querySelector("#closing-dialog").close();
}
