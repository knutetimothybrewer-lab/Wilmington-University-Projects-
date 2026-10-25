import { installCurriculum } from "../content/curriculum.js";
import { getChapter } from "../content/chapters.js";
installCurriculum();
const STORAGE_KEY = "wilmington-intelligence-machine-v1";
export const state = {
  mode: "instructor",
  chapter: null,
  scene: 0,
  visited: [],
  location: "campus",
  phase: "idle",
  paused: false,
  reduced: false,
  quality: "high",
  duration: 75,
  elapsed: 0,
  avatar: { x: 755, y: 770 },
  notesVisible: false,
  activities: {},
  reflection: "",
};
export let storageOK = true;
try {
  const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  if (s && typeof s === "object") {
    if (
      s.activities &&
      typeof s.activities === "object" &&
      !Array.isArray(s.activities)
    )
      state.activities = s.activities;
    state.reflection = typeof s.reflection === "string" ? s.reflection : "";
    state.mode = s.mode === "student" ? "student" : "instructor";
    state.chapter = getChapter(s.chapter) ? s.chapter : null;
    state.scene =
      Number.isInteger(s.scene) &&
      s.scene >= 0 &&
      s.scene < (getChapter(s.chapter)?.scenes.length || 0)
        ? s.scene
        : 0;
    state.visited = Array.isArray(s.visited)
      ? [...new Set(s.visited.filter((id) => getChapter(id)))]
      : [];
    state.location =
      state.chapter && s.location === "interior" ? "interior" : "campus";
    state.reduced = s.reduced === true;
    state.quality = s.quality === "low" ? "low" : "high";
    state.duration = [60, 75, 90].includes(s.duration) ? s.duration : 75;
  }
} catch {
  storageOK = false;
}
export function persist() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: state.mode,
        chapter: state.chapter,
        scene: state.scene,
        visited: state.visited,
        location: state.location,
        reduced: state.reduced,
        quality: state.quality,
        duration: state.duration,
        activities: state.activities,
        reflection: state.reflection,
      }),
    );
    storageOK = true;
  } catch {
    storageOK = false;
  }
  document
    .querySelector("#storage-note")
    ?.replaceChildren(
      document.createTextNode(
        storageOK
          ? "Progress stays in this browser. No personal data collected."
          : "Local storage unavailable. Your progress stays in this session only.",
      ),
    );
}
export const escapeText = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function announce(text) {
  document.querySelector("#live-status").textContent = text;
}
