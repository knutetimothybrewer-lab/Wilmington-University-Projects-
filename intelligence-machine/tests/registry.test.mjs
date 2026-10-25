import test from "node:test";
import assert from "node:assert/strict";
import { chapterRegistry, defaultPacing } from "../src/content/chapters.js";
import {
  installCurriculum,
  chapterQuestions,
} from "../src/content/curriculum.js";
import { lectureSources } from "../src/content/sources.js";
import { pointAlong } from "../src/engine/animation.js";
import {
  softmax,
  nearestCentroid,
  forwardNetwork,
  approximateTokens,
  seededRandom,
  sampleIndex,
} from "../src/lessons/models.js";
import { readFile } from "node:fs/promises";
installCurriculum();
test("All five complete chapters have timed scenes and complete instructional layers", () => {
  assert.equal(chapterRegistry.length, 5);
  assert.equal(
    chapterRegistry.reduce((n, c) => n + c.scenes.length, 0),
    29,
  );
  assert.equal(chapterRegistry.flatMap((c) => c.simulations).length, 18);
  for (const c of chapterRegistry) {
    assert.equal(c.status, "lecture");
    assert.equal(
      c.scenes.reduce((n, s) => n + s.minutes, 0),
      c.minutes,
    );
    assert.equal(new Set(c.scenes.map((s) => s.id)).size, c.scenes.length);
    for (const s of c.scenes) {
      for (const field of [
        "body",
        "explanation",
        "analogy",
        "misconception",
        "application",
        "discussion",
        "deeper",
      ])
        assert.ok(s[field].length > 35, `${c.id}/${s.id}: ${field}`);
      assert.ok(s.notes.demonstration.length > 50);
      assert.ok(s.notes.facilitation.length > 50);
    }
    assert.equal(chapterQuestions[c.id].length, 3);
    for (const q of chapterQuestions[c.id]) {
      assert.equal(q[1].length, 3);
      assert.ok(q[2] >= 0 && q[2] < 3);
      assert.ok(q[3].length > 60);
    }
  }
});
test("Lecture pacing totals exactly 75 minutes including opening and closing", () =>
  assert.equal(
    defaultPacing.opening +
      chapterRegistry.reduce((s, c) => s + c.minutes, 0) +
      defaultPacing.closing,
    75,
  ));
test("Softmax is stable, normalized, and temperature changes concentration", () => {
  const low = softmax([2, 1, 0, -1], 0.1),
    high = softmax([2, 1, 0, -1], 2);
  assert.ok(low[0] > high[0]);
  assert.ok(Math.abs(high.reduce((a, b) => a + b, 0) - 1) < 1e-12);
  assert.deepEqual(softmax([10000, 10000]), [0.5, 0.5]);
  assert.throws(() => softmax([1, 2], 0), RangeError);
  assert.throws(() => softmax([NaN], 1), TypeError);
});
test("Classifier recomputes centroids, changes its prediction and rejects missing classes", () => {
  assert.equal(nearestCentroid([1, 2], [8, 9], 3).label, "A");
  assert.equal(nearestCentroid([0, 1], [3, 4], 3).label, "B");
  assert.equal(nearestCentroid([1], [3], 2).label, "tie");
  assert.throws(() => nearestCentroid([], [1], 2), TypeError);
});
test("Network follows stated forward equations and responds to an adjusted weight", () => {
  const a = forwardNetwork(1, 0.5, 0),
    b = forwardNetwork(1, 0.5, 2);
  assert.equal(a.h1, 0);
  assert.equal(b.h1, 1.75);
  assert.ok(b.y > a.y);
  assert.ok(b.y > 0 && b.y < 1);
});
test("Approximate tokenizer preserves input and documents synthetic IDs", () => {
  const text = "Hello, multilingual learners! 🧠";
  const pieces = approximateTokens(text);
  assert.equal(pieces.map((p) => p.piece).join(""), text);
  assert.ok(pieces.every((p) => Number.isInteger(p.id)));
  assert.equal(approximateTokens("").length, 0);
});
test("Seeded sampling is reproducible and covers a varied distribution", () => {
  const a = seededRandom(17),
    b = seededRandom(17);
  const x = Array.from({ length: 100 }, () => sampleIndex([0.5, 0.3, 0.2], a));
  assert.deepEqual(
    x,
    Array.from({ length: 100 }, () => sampleIndex([0.5, 0.3, 0.2], b)),
  );
  assert.equal(new Set(x).size, 3);
});
test("Waypoints resolve corners and endpoints", () => {
  const p = [
    { x: 0, y: 0 },
    { x: 3, y: 0 },
    { x: 3, y: 4 },
  ];
  assert.deepEqual(pointAlong(p, 1), { x: 3, y: 4, dx: 0 });
  assert.equal(pointAlong(p, 3 / 7).x, 3);
});
test("Sources distinguish full-text review and metadata-only review", () => {
  assert.equal(lectureSources.length, 5);
  assert.equal(
    lectureSources.filter((s) => s.status.includes("Metadata")).length,
    2,
  );
  lectureSources.forEach((s) => {
    assert.ok(s.url.startsWith("https://"));
    assert.ok(s.note.length > 100);
  });
});
test("Portable document has no runtime dependencies and includes all laboratories", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.equal(/<script[^>]+src=/.test(html), false);
  assert.equal(/^import\s+[\s\S]*?\sfrom\s/m.test(html), false);
  for (const id of chapterRegistry.flatMap((c) => c.simulations))
    assert.ok(html.includes(id));
  assert.ok(
    html.includes("lecture-edition") || html.includes("LECTURE EDITION"),
  );
});
