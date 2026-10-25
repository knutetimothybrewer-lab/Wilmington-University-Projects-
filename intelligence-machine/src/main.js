import {
  renderLectureWorkspace,
  renderLectureNotes,
  installLectureUI,
  showLectureClosing,
} from "./lessons/lecture-ui.js";
import {
  chapterRegistry,
  getChapter,
  defaultPacing,
} from "./content/chapters.js";
import { campusSVG, avatarSVG } from "./views/art.js";
import { interiorSVG } from "./views/interiors.js";
import { AnimationEngine, easeInOut, pointAlong } from "./engine/animation.js";
import { state, persist, escapeText, announce } from "./engine/state.js";
const $ = (s) => document.querySelector(s);
const engine = new AnimationEngine();
let notesWindow = null,
  timerRunning = false,
  timerStart = 0,
  timerCarry = 0,
  timerInterval = 0;
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const reduced = () => state.reduced || motionQuery.matches;
$("#campus-layer").innerHTML = campusSVG(chapterRegistry);
$("#experience").append($("#explanation-panel"));
$("#guide-portrait").innerHTML =
  `<svg viewBox="-30 -105 60 110">${avatarSVG("guide-avatar")}</svg>`;
const pauseIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
const playIcon =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4l12 8-12 8z"/></svg>';
function paintAvatar(x, y, walk = 0, dx = 1) {
  const avatar = $("#student-avatar");
  avatar.setAttribute(
    "transform",
    `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(1.02)`,
  );
  const side = dx < 0 ? -1 : 1;
  avatar
    .querySelector(".avatar-person")
    .setAttribute(
      "transform",
      `translate(0 ${walk ? Math.abs(Math.sin(walk)) * -2 : 0}) scale(${side} 1)`,
    );
  avatar
    .querySelector(".leg-front")
    .setAttribute(
      "transform",
      `rotate(${Math.sin(walk) * 22 * (walk ? 1 : 0)} 0 -29)`,
    );
  avatar
    .querySelector(".leg-back")
    .setAttribute(
      "transform",
      `rotate(${-Math.sin(walk) * 22 * (walk ? 1 : 0)} 0 -29)`,
    );
  avatar
    .querySelector(".arm-front")
    .setAttribute(
      "transform",
      `rotate(${-Math.sin(walk) * 15 * (walk ? 1 : 0)} 12 -52)`,
    );
  avatar
    .querySelector(".arm-back")
    .setAttribute(
      "transform",
      `rotate(${Math.sin(walk) * 15 * (walk ? 1 : 0)} -13 -53)`,
    );
}
function camera(p, door) {
  const s = 1 + p * 1.3,
    cx = 720 + (door.x - 720) * p,
    cy = 430 + (door.y - 110 - 430) * p;
  $("#campus-camera").setAttribute(
    "transform",
    `translate(720 430) scale(${s}) translate(${-cx} ${-cy})`,
  );
}
function renderCards() {
  const active = state.chapter;
  $("#chapter-navigation").innerHTML = chapterRegistry
    .map(
      (c) =>
        `<button class="chapter-card ${c.id === active ? "active" : ""}" data-chapter="${c.id}" style="--accent:${c.accent}" aria-label="Visit chapter ${c.number}: ${c.topic}, ${c.name}${state.visited.includes(c.id) ? ", visited" : ""}" ${c.id === active ? 'aria-current="step"' : ""}><span class="chapter-number">0${c.number}</span><span><span class="chapter-topic">${c.topic}</span><span class="chapter-building">${c.name}</span><span class="chapter-card-bottom">${Math.round((c.minutes * state.duration) / 75)} MIN · OPEN TO EXPLORE</span></span><span class="chapter-arrow" aria-hidden="true">→</span>${state.visited.includes(c.id) ? '<span class="visited-mark" aria-hidden="true">✓</span>' : ""}</button>`,
    )
    .join("");
  $("#chapter-navigation")
    .querySelectorAll("button")
    .forEach((b) => (b.onclick = () => selectChapter(b.dataset.chapter)));
  document.querySelectorAll("[data-building]").forEach((b) => {
    b.classList.toggle("selected", b.dataset.building === active);
  });
  $("#visit-progress").textContent =
    `${state.visited.length} OF 5 CHAPTERS VISITED`;
  $("#overall-progress-bar").style.width = state.visited.length * 20 + "%";
}
function syncRoute() {
  try {
    const c = getChapter(state.chapter);
    const hash =
      state.location === "interior" && c
        ? "#chapter-" + c.id + "/" + c.scenes[state.scene].id
        : "#campus";
    history.replaceState(null, "", hash);
  } catch {}
}
function updateLabels() {
  const c = getChapter(state.chapter),
    inside = state.location === "interior";
  $("#breadcrumb").textContent = inside
    ? `CHAPTER 0${c.number}`
    : "CAMPUS OVERVIEW";
  $("#scene-label").textContent = inside ? c.name : "Your journey starts here";
  $("#scene-position-label").textContent = inside
    ? `${state.scene + 1} / ${c.scenes.length} · ${c.scenes[state.scene].name}`
    : "Campus hub";
  $("#scene-dots").innerHTML = (inside ? c.scenes.map((_, i) => i) : [0, 1, 2])
    .map(
      (n) => `<i class="${inside && n === state.scene ? "active" : ""}"></i>`,
    )
    .join("");
  $("#pacing-label").textContent = `${state.duration} MIN SESSION`;
  $("#next-button").setAttribute(
    "aria-label",
    inside && state.scene === c.scenes.length - 1
      ? c.number === 5
        ? "Finish and return to campus"
        : "Visit next chapter"
      : "Next scene",
  );
}
function applySettings() {
  document.body.classList.toggle("reduced-motion", reduced());
  document.body.classList.toggle("low-quality", state.quality === "low");
  document.body.classList.toggle("student-mode", state.mode === "student");
  $("#instructor-tools").hidden = state.mode === "student";
  document.body.classList.toggle("paused", state.paused);
  $("#instructor-mode").setAttribute(
    "aria-pressed",
    state.mode === "instructor",
  );
  $("#student-mode").setAttribute("aria-pressed", state.mode === "student");
  $("#reduced-motion").checked = state.reduced;
  $("#low-quality").checked = state.quality === "low";
  $("#session-duration").value = state.duration;
  $("#pause-button").setAttribute("aria-pressed", state.paused);
  $("#pause-button").setAttribute(
    "aria-label",
    state.paused ? "Resume animation" : "Pause animation",
  );
  $("#pause-button").innerHTML = state.paused ? playIcon : pauseIcon;
  if (state.mode === "student") {
    state.notesVisible = false;
    $("#notes-panel").hidden = true;
  }
  $("#study-reading").hidden =
    state.mode !== "student" || state.location !== "interior";
  renderCards();
  updateLabels();
}
function setMode(mode) {
  state.mode = mode;
  persist();
  applySettings();
  announce(
    mode === "instructor"
      ? "Instructor presentation mode. Teaching notes and pacing are available."
      : "Student exploration mode. All five chapters remain unlocked.",
  );
}
function showCampus() {
  state.location = "campus";
  $("#campus-layer").hidden = false;
  $("#interior-layer").hidden = true;
  $("#campus-intro").hidden = false;
  $("#interior-copy").hidden = true;
  $("#guide-card").hidden = false;
  $("#lesson-workspace").hidden = true;
  $("#scene-jump").hidden = true;
  $("#study-reading").hidden = true;
  $("#experience").classList.remove("focused-exhibit");
  $("#experience").classList.remove(
    "interior-active",
    "dark-interior",
    "scene-reveal",
    "explanation-open",
  );
  $("#notes-panel").hidden = true;
  state.notesVisible = false;
  camera(0, state.avatar);
  paintAvatar(state.avatar.x, state.avatar.y);
  renderCards();
  updateLabels();
}
function showInterior() {
  const c = getChapter(state.chapter);
  if (!c) return showCampus();
  state.location = "interior";
  $("#experience").classList.toggle(
    "machine-inside",
    c.id === "language" &&
      state.scene > 0 &&
      c.scenes[state.scene].id !== "check",
  );
  $("#interior-layer").innerHTML = interiorSVG(c, c.scenes[state.scene]);
  $("#campus-layer").hidden = true;
  $("#interior-layer").hidden = false;
  $("#campus-intro").hidden = true;
  $("#interior-copy").hidden = false;
  $("#guide-card").hidden = true;
  $("#experience").classList.add("interior-active");
  $("#experience").classList.toggle(
    "dark-interior",
    ["language", "observatory"].includes(c.id),
  );
  $("#experience").classList.toggle("scene-reveal", state.scene === 1);
  $("#experience").classList.remove("explanation-open");
  $("#interior-eyebrow").textContent =
    `0${c.number} / ${c.scenes[state.scene].eyebrow}`;
  $("#interior-heading").textContent = c.scenes[state.scene].title;
  $("#interior-description").textContent = c.scenes[state.scene].body;
  $("#chapter-time").textContent =
    `SUGGESTED CHAPTER · ${Math.round((c.minutes * state.duration) / 75)} MIN`;
  $("#explanation-text").textContent = c.qualification;
  $("#explanation-panel").hidden = true;
  $("#explanation-button").setAttribute("aria-expanded", "false");
  $("#explanation-button").textContent = "Reveal explanation";
  $("#notes-button").setAttribute("aria-expanded", state.notesVisible);
  $("#notes-panel").hidden = !state.notesVisible || state.mode !== "instructor";
  renderCards();
  updateLabels();
  renderLectureWorkspace(c, c.scenes[state.scene]);
  updateNotes();
}
function settleTravel(c) {
  engine.cancel();
  state.phase = "idle";
  state.paused = false;
  state.chapter = c.id;
  state.location = "interior";
  state.avatar = { ...c.door };
  state.visited = [...new Set([...state.visited, c.id])];
  document
    .querySelectorAll(".door-open")
    .forEach((e) => e.classList.remove("door-open"));
  $("#travel-banner").hidden = true;
  $("#journey-trail").setAttribute("d", "");
  showInterior();
  applySettings();
  persist();
  syncRoute();
  announce(
    `Arrived at ${c.name}. Scene ${state.scene + 1}: ${c.scenes[state.scene].name}.`,
  );
}
function selectChapter(id, { replay = false } = {}) {
  const c = getChapter(id);
  if (!c) return;
  engine.cancel();
  state.paused = false;
  state.notesVisible = false;
  document
    .querySelectorAll(".door-open")
    .forEach((e) => e.classList.remove("door-open"));
  $("#experience").classList.remove("map-zoomed");
  $("#map-zoom").setAttribute("aria-pressed", "false");
  state.scene = 0;
  if (state.location === "interior" || replay)
    state.avatar = { x: 755, y: 770 };
  state.chapter = id;
  showCampus();
  state.phase = "entering";
  $("#travel-banner").hidden = false;
  $("#travel-message").textContent = `Walking to ${c.name}`;
  $("#guide-message").textContent =
    `Next stop: ${c.topic}. Follow the paths around the campus.`;
  const points = [
    { ...state.avatar },
    { x: 775, y: 565 },
    { x: 775, y: 538 },
    { ...c.door },
  ];
  $("#journey-trail").setAttribute(
    "d",
    points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" "),
  );
  if (reduced()) {
    settleTravel(c);
    return;
  }
  const duration = state.quality === "low" ? 1600 : 3600;
  engine.run(
    duration,
    (p) => {
      const walkProgress = Math.min(1, p / 0.72);
      const pos = pointAlong(points, easeInOut(walkProgress));
      paintAvatar(pos.x, pos.y, p < 0.72 ? (p * duration) / 85 : 0, pos.dx);
      $("#travel-progress-bar").style.transform = `scaleX(${p})`;
      if (p >= 0.72) {
        $("#building-" + id).classList.add("door-open");
        $("#travel-message").textContent = `Entering ${c.name}`;
      }
      camera(p > 0.8 ? easeInOut((p - 0.8) / 0.2) : 0, c.door);
    },
    () => settleTravel(c),
  );
  applySettings();
  announce(`Travelling to ${c.name}. Transition can be paused or skipped.`);
}
function returnCampus() {
  engine.cancel();
  const c = getChapter(state.chapter);
  state.phase = "returning";
  state.paused = false;
  state.avatar = c ? { ...c.door } : { x: 755, y: 770 };
  showCampus();
  $("#travel-banner").hidden = false;
  $("#travel-message").textContent = "Returning to the campus";
  const complete = () => {
    state.phase = "idle";
    $("#travel-banner").hidden = true;
    camera(0, state.avatar);
    persist();
    syncRoute();
    applySettings();
    announce("Returned to campus. All five chapter buildings are available.");
  };
  if (reduced() || !c) {
    complete();
    return;
  }
  engine.run(
    state.quality === "low" ? 350 : 900,
    (p) => {
      camera(1 - easeInOut(p), c.door);
      $("#travel-progress-bar").style.transform = `scaleX(${p})`;
    },
    complete,
  );
  applySettings();
}
function changeScene(direction) {
  if (state.phase !== "idle") engine.finish();
  if (state.location === "campus") {
    const c = getChapter(state.chapter);
    selectChapter(
      direction > 0
        ? chapterRegistry[c ? Math.min(4, c.number) : 0].id
        : chapterRegistry[c ? Math.max(0, c.number - 2) : 0].id,
    );
    return;
  }
  const c = getChapter(state.chapter);
  const next = state.scene + direction;
  if (next < 0) {
    returnCampus();
    return;
  }
  if (next >= c.scenes.length) {
    if (c.number === 5) {
      returnCampus();
      showLectureClosing();
    } else selectChapter(chapterRegistry[c.number].id);
    return;
  }
  state.scene = next;
  showInterior();
  persist();
  syncRoute();
  announce(`Scene ${state.scene + 1}: ${c.scenes[state.scene].name}`);
}
function togglePause() {
  state.paused = !state.paused;
  if (state.paused) engine.pause();
  else engine.resume();
  applySettings();
  announce(
    state.paused
      ? "Animation paused. You can still navigate or skip."
      : "Animation resumed.",
  );
}
function replay() {
  if (state.phase !== "idle") engine.cancel();
  const c = getChapter(state.chapter);
  if (state.location === "campus") {
    selectChapter(c?.id || chapterRegistry[0].id, { replay: true });
    return;
  }
  showInterior();
  state.phase = "replay";
  state.paused = false;
  $("#travel-banner").hidden = false;
  $("#travel-message").textContent = "Replaying the student’s arrival";
  const avatar = $("#interior-avatar");
  const complete = () => {
    state.phase = "idle";
    $("#travel-banner").hidden = true;
    avatar?.setAttribute("transform", "");
    applySettings();
    announce("Scene replay complete.");
  };
  if (reduced()) {
    complete();
    return;
  }
  engine.run(
    1200,
    (p) => {
      avatar?.setAttribute(
        "transform",
        `translate(${-55 + 55 * easeInOut(p)} 0)`,
      );
      if (avatar) {
        avatar
          .querySelector(".leg-front")
          .setAttribute("transform", `rotate(${Math.sin(p * 24) * 18} 0 -29)`);
        avatar
          .querySelector(".leg-back")
          .setAttribute("transform", `rotate(${-Math.sin(p * 24) * 18} 0 -29)`);
      }
      $("#travel-progress-bar").style.transform = `scaleX(${p})`;
    },
    () => {
      avatar
        ?.querySelectorAll(".leg")
        .forEach((e) => e.removeAttribute("transform"));
      complete();
    },
  );
  applySettings();
}
function resetScene() {
  engine.cancel();
  state.phase = "idle";
  state.paused = false;
  state.notesVisible = false;
  $("#travel-banner").hidden = true;
  if (state.location === "interior") {
    delete state.activities[
      state.chapter + "/" + getChapter(state.chapter).scenes[state.scene].id
    ];
    persist();
    showInterior();
  } else {
    state.avatar = { x: 755, y: 770 };
    showCampus();
  }
  applySettings();
  announce("Current scene reset. Chapter visits are unchanged.");
}
function notesHTML() {
  const c = getChapter(state.chapter);
  return c
    ? renderLectureNotes(c, c.scenes[state.scene])
    : "<h2>Opening · 5 minutes</h2><p>Start with the essential question: what should students still learn to do themselves when AI can produce an answer? Invite one classroom use and one concern. Explain the five destinations and the distinction between real computational models and scripted demonstrations. Use the opening control for the title and roadmap. Start the lecture clock when you are ready.</p>";
}
function updateNotes() {
  $("#notes-content").innerHTML = notesHTML();
  if (notesWindow && !notesWindow.closed) {
    const main = notesWindow.document.querySelector("main");
    if (main) main.innerHTML = notesHTML();
  }
}
function openNotesWindow() {
  if (state.mode !== "instructor") return;
  try {
    notesWindow = window.open(
      "",
      "intelligence-machine-presenter-notes",
      "width=650,height=800",
    );
    if (!notesWindow) {
      announce(
        "Notes popup was blocked. Use Teaching notes to show them on this screen.",
      );
      return;
    }
    notesWindow.document.open();
    notesWindow.document.write(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Instructor notes · Intelligence Campus</title><style>body{font:16px/1.7 Arial,sans-serif;background:#f7f7ef;color:#1b4434;max-width:800px;padding:35px;margin:auto}h1,h2{font:34px Georgia,serif}h3{font-size:13px;margin-top:25px}header{font-size:12px;background:#e5ecd9;padding:15px}button{font:inherit;padding:8px 14px;margin-top:15px}</style></head><body><header>INSTRUCTOR NOTES · This separate window is visible if you share your entire screen. Share only the presentation window when appropriate.</header><main></main><button onclick="window.close()">Close notes</button></body></html>',
    );
    notesWindow.document.close();
    updateNotes();
  } catch {
    announce(
      "Separate notes are unavailable. Use the inline teaching notes instead.",
    );
  }
}
function openDialog(id) {
  $("#" + id).showModal();
}
function updateTimer() {
  const ms = timerCarry + (timerRunning ? performance.now() - timerStart : 0);
  state.elapsed = ms;
  $("#session-time").textContent =
    String(Math.floor(ms / 60000)).padStart(2, "0") +
    ":" +
    String(Math.floor(ms / 1000) % 60).padStart(2, "0");
  const suggestion = state.duration * 60000;
  $("#pacing-label").textContent =
    ms > suggestion ? "REVIEW YOUR PACING" : `${state.duration} MIN SESSION`;
}
$("#timer-button").onclick = () => {
  timerRunning = !timerRunning;
  if (timerRunning) {
    timerStart = performance.now();
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    timerCarry += performance.now() - timerStart;
    clearInterval(timerInterval);
  }
  $("#timer-button").textContent = timerRunning ? "Pause clock" : "Start clock";
  $("#timer-button").setAttribute(
    "aria-label",
    timerRunning ? "Pause lecture clock" : "Start lecture clock",
  );
  updateTimer();
};
$("#instructor-mode").onclick = () => setMode("instructor");
$("#student-mode").onclick = () => setMode("student");
$("#begin-button").onclick = () => openDialog("opening-dialog");
$("#next-button").onclick = () => changeScene(1);
$("#previous-button").onclick = () => changeScene(-1);
$("#pause-button").onclick = togglePause;
$("#replay-button").onclick = replay;
$("#reset-scene").onclick = resetScene;
$("#campus-button").onclick = returnCampus;
$("#back-campus-top").onclick = returnCampus;
$("#brand-campus").onclick = (e) => {
  e.preventDefault();
  returnCampus();
};
$("#skip-transition").onclick = () => engine.finish();
document.querySelectorAll("[data-building]").forEach((g) => {
  g.addEventListener("click", () => selectChapter(g.dataset.building));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectChapter(g.dataset.building);
    }
  });
});
$("#map-zoom").onclick = () => {
  const zoom = $("#experience").classList.toggle("map-zoomed");
  $("#map-zoom").setAttribute("aria-pressed", zoom);
  $("#map-zoom").textContent = zoom ? "−" : "＋";
};
$("#explanation-button").onclick = () => {
  const open = $("#explanation-panel").hidden;
  $("#explanation-panel").hidden = !open;
  $("#explanation-button").setAttribute("aria-expanded", open);
  $("#explanation-button").textContent = open
    ? "Hide explanation"
    : "Reveal explanation";
  $("#experience").classList.toggle("explanation-open", open);
};
$("#discussion-button").onclick = () => {
  const c = getChapter(state.chapter);
  $("#discussion-title").textContent = c.scenes[state.scene].discussion;
  openDialog("discussion-dialog");
};
$("#notes-button").onclick = () => {
  if (state.mode !== "instructor") return;
  state.notesVisible = !state.notesVisible;
  $("#notes-panel").hidden = !state.notesVisible;
  $("#notes-button").setAttribute("aria-expanded", state.notesVisible);
  updateNotes();
  if (state.notesVisible)
    $("#notes-panel").scrollIntoView({
      behavior: reduced() ? "instant" : "smooth",
      block: "nearest",
    });
};
$("#close-notes").onclick = () => {
  state.notesVisible = false;
  $("#notes-panel").hidden = true;
  $("#notes-button").setAttribute("aria-expanded", "false");
  $("#notes-button").focus();
};
$("#popout-notes").onclick = openNotesWindow;
$("#settings-button").onclick = () => openDialog("settings-dialog");
$("#help-button").onclick = () => openDialog("help-dialog");
$("#resources-button").onclick = () => openDialog("help-dialog");
document
  .querySelectorAll("[data-close]")
  .forEach((b) => (b.onclick = () => b.closest("dialog").close()));
document.querySelectorAll("dialog").forEach((d) =>
  d.addEventListener("click", (e) => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        d.close();
    }
  }),
);
$("#reduced-motion").onchange = (e) => {
  state.reduced = e.target.checked;
  if (reduced()) engine.finish();
  applySettings();
  persist();
};
$("#low-quality").onchange = (e) => {
  state.quality = e.target.checked ? "low" : "high";
  applySettings();
  persist();
};
$("#session-duration").onchange = (e) => {
  state.duration = +e.target.value;
  applySettings();
  persist();
};
motionQuery.addEventListener?.("change", () => {
  if (reduced()) engine.finish();
  applySettings();
});
$("#clear-progress").onclick = () => {
  $("#clear-confirm").hidden = false;
  $("#clear-confirm-button").focus();
};
$("#clear-cancel").onclick = () => {
  $("#clear-confirm").hidden = true;
  $("#clear-progress").focus();
};
$("#clear-confirm-button").onclick = () => {
  engine.cancel();
  state.visited = [];
  state.chapter = null;
  state.scene = 0;
  state.phase = "idle";
  state.avatar = { x: 755, y: 770 };
  state.paused = false;
  $("#travel-banner").hidden = true;
  showCampus();
  syncRoute();
  applySettings();
  persist();
  $("#clear-confirm").hidden = true;
  $("#settings-dialog").close();
  announce("Saved chapter visits cleared.");
};
async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen();
    else announce("Fullscreen is unavailable in this browser.");
  } catch {
    announce("Fullscreen is unavailable in this browser or embedded window.");
  }
}
$("#fullscreen-button").onclick = fullscreen;
document.addEventListener("fullscreenchange", () =>
  $("#fullscreen-button").setAttribute(
    "aria-label",
    document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen",
  ),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!document.querySelector("dialog[open]")) {
      if (state.phase !== "idle") engine.finish();
      else if (state.notesVisible) $("#close-notes").click();
    }
    return;
  }
  if (
    e.altKey ||
    e.ctrlKey ||
    e.metaKey ||
    e.shiftKey ||
    document.querySelector("dialog[open]") ||
    e.target.closest("input,textarea,select,[contenteditable]")
  )
    return;
  const k = e.key.toLowerCase();
  if (k === " " && e.target.closest("button,a,[role=button]")) return;
  if (k === "arrowright") {
    e.preventDefault();
    changeScene(1);
  } else if (k === "arrowleft") {
    e.preventDefault();
    changeScene(-1);
  } else if (k === " ") {
    e.preventDefault();
    togglePause();
  } else if (k === "h") returnCampus();
  else if (k === "r") replay();
  else if (k === "f") fullscreen();
  else if (/^[1-5]$/.test(k)) selectChapter(chapterRegistry[+k - 1].id);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && engine.job && !engine.paused) {
    state.paused = true;
    engine.pause();
    applySettings();
  }
});
installLectureUI({
  goScene: (n) => {
    if (state.phase !== "idle") engine.finish();
    const c = getChapter(state.chapter);
    if (!c || !Number.isInteger(n) || n < 0 || n >= c.scenes.length) return;
    state.scene = n;
    showInterior();
    syncRoute();
    persist();
  },
  begin: () => selectChapter("discovery"),
});
if (location.hash === "#campus") state.location = "campus";
if (location.hash.startsWith("#chapter-")) {
  const [id, sceneId] = location.hash.slice(9).split("/");
  if (getChapter(id)) {
    state.chapter = id;
    state.location = "interior";
    state.scene = Math.max(
      0,
      getChapter(id).scenes.findIndex((s) => s.id === sceneId),
    );
    state.visited = [...new Set([...state.visited, id])];
  }
}
if (state.location === "interior") showInterior();
else showCampus();
applySettings();
persist();
syncRoute();
// Scene routing is independent of animation. These read-only snapshots support repeatable QA.
window.campusDiagnostics = () => ({
  chapter: state.chapter,
  scene: state.scene,
  location: state.location,
  phase: state.phase,
  paused: state.paused,
  mode: state.mode,
  visited: [...state.visited],
  animationActive: !!engine.job,
  avatar: { ...state.avatar },
});
