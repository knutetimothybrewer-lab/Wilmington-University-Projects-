import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chapterRegistry } from "../src/content/chapters.js";
import { installCurriculum } from "../src/content/curriculum.js";
installCurriculum();
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const base = process.env.TEST_URL || "http://127.0.0.1:8010/";
let assertions = 0;
const ok = (v, m) => {
  assert.ok(v, m);
  assertions++;
};
await mkdir("test-results", { recursive: true });
try {
  const ctx = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  const p = await ctx.newPage();
  const errors = [],
    external = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("request", (r) => {
    if (
      !r.url().startsWith(new URL(base).origin) &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await p.goto(base);
  ok((await p.locator("[data-building]").count()) === 5, "five buildings");
  ok(
    await p
      .locator(".presentation-bar")
      .evaluate((e) => e.getBoundingClientRect().bottom <= innerHeight),
    "1366 presentation controls fit",
  );
  await p.screenshot({
    path: "test-results/lecture-campus.png",
    fullPage: true,
  });
  const go = async (chapter, scene) => {
    const c = chapterRegistry.find((x) => x.id === chapter);
    if (
      (await p.evaluate(() => campusDiagnostics())).chapter !== chapter ||
      (await p.evaluate(() => campusDiagnostics())).location !== "interior"
    )
      await p.locator(`[data-chapter="${chapter}"]`).click();
    const index = c.scenes.findIndex((s) => s.id === scene);
    await p.locator("#scene-selector").selectOption(String(index));
  };
  for (const c of chapterRegistry) {
    await p.locator(`[data-chapter="${c.id}"]`).click();
    for (let i = 0; i < c.scenes.length; i++) {
      await p.locator("#scene-selector").selectOption(String(i));
      ok(
        await p.locator("#lesson-workspace").isVisible(),
        `${c.id}/${i} workspace`,
      );
      ok(
        (await p.locator("#lesson-content").textContent()).length > 120,
        `${c.id}/${i} substantive content`,
      );
      const ids = await p
        .locator("[id]")
        .evaluateAll((es) => es.map((e) => e.id));
      ok(ids.length === new Set(ids).size, `${c.id}/${i} unique IDs`);
      await p.locator("#deeper-button").click();
      ok(
        (await p.locator("#deeper-content").textContent()).length > 400,
        `${c.id}/${i} deeper explanation`,
      );
      await p.keyboard.press("Escape");
    }
  }
  await go("discovery", "rules");
  await p.locator("#rule-missing").uncheck();
  await p.locator("#rule-late").fill("4");
  await p.locator("#rule-late").dispatchEvent("input");
  ok(
    (await p.locator("#rule-diagram").textContent()).includes("NO AUTOMATIC"),
    "AND rule false",
  );
  await p.locator("#rule-logic").selectOption("or");
  ok(
    (await p.locator("#rule-diagram").textContent()).includes("SEND REMINDER"),
    "OR changes action",
  );
  await go("discovery", "classifier");
  await p.locator("#class-x").fill("3");
  await p.locator("#class-x").dispatchEvent("input");
  ok(
    (await p.locator(".lab-feedback").textContent()).includes("Prediction: A"),
    "classifier computes A",
  );
  await p.locator("#class-a").fill("0, 1");
  await p.locator("#class-b").fill("3, 4");
  ok(
    (await p.locator(".lab-feedback").textContent()).includes("Prediction: B"),
    "editable examples change classifier",
  );
  await p.locator("#class-a").fill("");
  ok(
    (await p.locator(".lab-feedback").textContent()).includes("both classes"),
    "invalid training data rejected",
  );
  await p.locator("#class-a").fill("0, 1");
  await go("discovery", "network");
  const before = await p.locator("#network-plot").textContent();
  await p.locator("#nn-weight").fill("2");
  await p.locator("#nn-weight").dispatchEvent("input");
  ok(
    (await p.locator("#network-plot").textContent()) !== before,
    "neural weight changes result",
  );
  await p.locator('[data-node="h1"]').click();
  ok(
    (await p.locator(".lab-feedback").textContent()).includes("ReLU"),
    "neural node inspection",
  );
  await go("discovery", "generation");
  await p.locator("#gen-task").selectOption("both");
  ok(
    (await p.locator("#generation-output").textContent()).includes("Combine") ||
      (await p.locator("#generation-output").textContent()).includes(
        "Combined",
      ),
    "combined mechanisms",
  );
  await go("language", "arrival");
  await p.locator("#token-text").fill('<script>alert("test")</script> 🧠');
  ok(
    (await p.locator("#token-output").textContent()).includes("<"),
    "token text escaped",
  );
  ok(
    (await p.locator("#token-output script").count()) === 0,
    "token input does not create markup",
  );
  await go("language", "attention");
  await p.locator('[data-focus="0"]').click();
  ok(
    (await p.locator("#attention-bars").textContent()).includes("masked"),
    "causal masking",
  );
  await p.locator('[data-focus="8"]').click();
  ok(
    !(await p.locator("#attention-bars").textContent()).includes("masked"),
    "last focus has all prior tokens",
  );
  await go("language", "prediction");
  await p.locator('[data-next="is"]').click();
  ok(
    (await p.locator("#prediction-sequence").textContent()).includes(
      "Learning is",
    ),
    "next token appended",
  );
  ok(
    (await p.locator('[data-next="social"]').count()) === 1,
    "conditional choices update",
  );
  await go("language", "temperature");
  await p.locator("#temperature-value").fill("0.1");
  await p.locator("#temperature-value").dispatchEvent("input");
  const low = await p.locator("#temperature-bars").textContent();
  await p.locator("#temperature-value").fill("2");
  await p.locator("#temperature-value").dispatchEvent("input");
  ok(
    (await p.locator("#temperature-bars").textContent()) !== low,
    "temperature changes probability chart",
  );
  await p.locator("#temperature-sample").click();
  ok(
    (await p.locator("#temperature-draws").textContent()).split(" · ")
      .length === 20,
    "twenty samples",
  );
  await p.locator("#temperature-greedy").click();
  ok(
    (await p.locator("#temperature-draws").textContent()) === "explore",
    "greedy selects maximum",
  );
  await p.screenshot({ path: "test-results/lecture-lab.png", fullPage: true });
  await p.locator(".lab-reset").click();
  ok((await p.locator("#temperature-value").inputValue()) === "1", "lab reset");
  await p.locator("#temperature-greedy").focus();
  await p.keyboard.press("Space");
  ok(
    (await p.locator("#temperature-draws").textContent()) === "explore",
    "Space activates a focused exhibit button",
  );
  await p.keyboard.press("ArrowRight");
  ok(
    (await p.evaluate(() => campusDiagnostics())).scene === 5,
    "presentation arrows work after clicking a button",
  );
  await go("language", "context");
  await p.locator("#context-size").fill("6");
  await p.locator("#context-size").dispatchEvent("input");
  ok(
    (await p.locator("#context-result").textContent()).includes("Thursday"),
    "context retains evidence",
  );
  await p.locator("#context-size").fill("2");
  await p.locator("#context-size").dispatchEvent("input");
  ok(
    (await p.locator("#context-result").textContent()).includes(
      "do not specify",
    ),
    "context removes fact",
  );
  await go("library", "citations");
  for (let i = 0; i < 3; i++) {
    await p.locator(`[data-citation-case="${i}"]`).click();
    await p.locator('[data-support="yes"]').click();
    ok(
      (await p.locator(".lab-feedback").textContent()).length > 150,
      "citation support feedback",
    );
    await p.locator("#citation-reveal").click();
    ok(
      (await p.locator(".lab-feedback").textContent()).length > 150,
      "verification evidence reveal",
    );
  }
  await go("library", "confidence");
  for (let i = 0; i < 3; i++) {
    await p.locator(`[data-claim="${i}"]`).click();
    await p.locator('[data-accuracy="false"]').click();
    ok(
      (await p.locator(".lab-feedback").textContent()).length > 100,
      "confidence claim evidence",
    );
  }
  await go("library", "verification");
  for (let i = 0; i < 4; i++)
    await p.locator(`[data-verify-step="${i}"]`).click();
  ok(
    (await p.locator(".lab-feedback").textContent()).includes(
      "defensible order",
    ),
    "verification sequence",
  );
  await go("observatory", "support");
  for (const choice of ["accept", "reject", "investigate"]) {
    await p.locator(`[data-support-action="${choice}"]`).click();
    ok(
      (await p.locator(".lab-feedback").textContent()).length > 80,
      "support decision branch",
    );
  }
  await p.locator("#support-context").click();
  ok(
    (await p.locator("#support-context-output").textContent()).includes(
      "assistive",
    ),
    "missing context revealed",
  );
  await go("observatory", "error");
  for (const choice of ["grammar", "ready", "concept"]) {
    await p.locator(`[data-error="${choice}"]`).click();
    ok(
      (await p.locator(".lab-feedback").textContent()).includes("1/6"),
      "assessment error explanation",
    );
  }
  await go("observatory", "trust");
  await p.locator("#trust-reveal").click();
  ok(
    (await p.locator("#trust-label").textContent()).includes("AI assistant"),
    "attribution changes",
  );
  ok(
    (await p.locator(".lab-feedback").textContent()).includes("not a measured"),
    "trust limitation",
  );
  await go("collaboration", "allocation");
  for (const [i, value] of ["assist", "led", "central"].entries()) {
    await p.locator("#allocate-" + i).selectOption(value);
    ok(
      (await p.locator(".lab-feedback").textContent()).includes("defensible"),
      "task allocation",
    );
  }
  await go("collaboration", "models");
  for (const model of ["human", "uncritical", "directed"]) {
    await p.locator(`[data-model="${model}"]`).click();
    ok(
      (await p.locator("#collaboration-comparison").textContent()).length > 100,
      "collaboration model feedback",
    );
  }
  await go("collaboration", "principles");
  for (const box of await p.locator(".principle-grid input").all())
    await box.check();
  ok(
    (await p.locator("#principle-protocol li").count()) === 7,
    "seven principles become actions",
  );
  for (const c of chapterRegistry) {
    await go(c.id, "check");
    for (let i = 0; i < 3; i++) {
      await p
        .locator(`input[data-question="${i}"][value="${c.assessments[i][2]}"]`)
        .check();
      await p.locator(`[data-reveal-question="${i}"]`).click();
      ok(
        (await p.locator("#question-feedback-" + i).textContent()).includes(
          "correct",
        ),
        "formative answer with explanation",
      );
    }
    ok(
      (await p.locator(".assessment-status").textContent()).includes("3 of 3"),
      "chapter feedback reviewed",
    );
    await p.locator('input[data-question="0"][value="1"]').check();
    ok(
      (await p.locator(".assessment-status").textContent()).includes("2 of 3"),
      "changing an answer updates the review count",
    );
    await p.locator('[data-reveal-question="0"]').click();
    ok(
      (await p.locator("#question-feedback-0").textContent()).includes(
        "Reconsider",
      ),
      "incorrect answer receives explanatory correction",
    );
  }
  await p.locator("#notes-button").click();
  ok(
    (await p.locator("#notes-content").textContent()).includes(
      "Instructor answer guide",
    ),
    "instructor answer key",
  );
  await p.locator("#close-notes").click();
  const popPromise = p.waitForEvent("popup");
  await p.locator("#popout-notes").click();
  const pop = await popPromise;
  await pop.waitForLoadState();
  ok(
    (await pop.locator("main").textContent()).includes("Final synthesis"),
    "separate notes matches scene",
  );
  await pop.close();
  await p.locator("#student-mode").click();
  ok(await p.locator("#study-reading").isVisible(), "study text visible");
  ok(
    await p.locator("#instructor-tools").isHidden(),
    "student mode hides notes",
  );
  ok(
    (await p.evaluate(() => campusDiagnostics())).scene === 4,
    "mode preserves current scene",
  );
  await p.locator("#instructor-mode").click();
  await p.reload();
  ok(
    (await p.evaluate(() => campusDiagnostics())).scene === 4,
    "scene beyond original three restored",
  );
  ok(
    (await p.locator(".assessment-status").textContent()).includes("3 of 3"),
    "answers persist",
  );
  await go("discovery", "classifier");
  ok(
    (await p.locator("#class-b").inputValue()) === "3, 4",
    "lab inputs persist across reload/chapters",
  );
  await p.locator("#room-button").click();
  ok(
    await p.locator("#lesson-workspace").isHidden(),
    "view room hides exhibit",
  );
  await p.locator("#return-exhibit").click();
  ok(await p.locator("#lesson-workspace").isVisible(), "return to lab");
  await p.locator("#lesson-focus").click();
  ok(
    await p
      .locator("#experience")
      .evaluate((e) => e.classList.contains("focused-exhibit")),
    "focus exhibit",
  );
  await p.locator("#lesson-focus").click();
  await p.locator("#help-button").click();
  await p.locator("#sources-button").click();
  ok(
    (await p.locator("#source-list article").count()) === 5,
    "references accessible",
  );
  await p.keyboard.press("Escape");
  const downloadPromise = p.waitForEvent("download");
  await p.locator("#export-guide").click();
  const download = await downloadPromise;
  await download.saveAs("test-results/lecture-guide.md");
  const guide = await readFile("test-results/lecture-guide.md", "utf8");
  ok(
    guide.includes("ANSWER GUIDE") &&
      guide.includes("scaled") &&
      guide.includes("Automation bias"),
    "guide export contains curriculum and answers",
  );
  await p.locator("#opening-button").click();
  ok(
    (await p.locator("#opening-dialog").textContent()).includes("15 min"),
    "opening roadmap",
  );
  await p.keyboard.press("Escape");
  await p.keyboard.press("Escape");
  await go("collaboration", "check");
  await p.locator("#next-button").click();
  ok(
    await p.locator("#closing-dialog").isVisible(),
    "final chapter opens closing",
  );
  await p
    .locator("#closing-reflection")
    .fill("Learners should justify evidence and retain agency.");
  const refPromise = p.waitForEvent("download");
  await p.locator("#export-reflection").click();
  const ref = await refPromise;
  await ref.saveAs("test-results/reflection.txt");
  ok(
    (await readFile("test-results/reflection.txt", "utf8")).includes(
      "retain agency",
    ),
    "reflection export",
  );
  await p.locator("#revisit-chapter").click();
  ok(
    (await p.evaluate(() => campusDiagnostics())).location === "campus",
    "closing returns campus",
  );
  ok(external.length === 0, "no external application requests");
  ok(errors.length === 0, "no runtime errors: " + errors.join(";"));
  await ctx.close();
  // Real-time cinematic and interruption checks use a fresh context with motion enabled.
  const ac = await browser.newContext({
    viewport: { width: 1366, height: 768 },
  });
  const ap = await ac.newPage();
  await ap.goto(base);
  await ap.locator('[data-chapter="discovery"]').click();
  await ap.waitForTimeout(400);
  const at = await ap.locator("#student-avatar").getAttribute("transform");
  await ap.waitForTimeout(250);
  ok(
    at !== (await ap.locator("#student-avatar").getAttribute("transform")),
    "avatar walks",
  );
  await ap.locator("#pause-button").click();
  const freeze = await ap.locator("#student-avatar").getAttribute("transform");
  await ap.waitForTimeout(250);
  ok(
    freeze === (await ap.locator("#student-avatar").getAttribute("transform")),
    "pause freezes journey",
  );
  await ap.locator("#pause-button").click();
  await ap.locator("#skip-transition").click();
  ok(
    (await ap.evaluate(() => campusDiagnostics())).location === "interior",
    "skip settles",
  );
  await ap.locator('[data-chapter="language"]').click();
  await ap.locator('[data-chapter="library"]').click();
  await ap.locator("#skip-transition").click();
  ok(
    (await ap.evaluate(() => campusDiagnostics())).chapter === "library",
    "rapid navigation",
  );
  await ac.close();
  for (const [name, options] of [
    [
      "large",
      { viewport: { width: 1920, height: 1080 }, reducedMotion: "reduce" },
    ],
    [
      "mobile",
      {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: "reduce",
      },
    ],
  ]) {
    const c = await browser.newContext(options);
    const page = await c.newPage();
    await page.goto(base + "#chapter-language/temperature");
    ok(
      (await page.locator("#temperature-value").count()) === 1,
      name + " direct scene link",
    );
    ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      name + " no overflow",
    );
    await page.locator("#temperature-sample").click();
    ok(
      (await page.locator("#temperature-draws").textContent()).split(" · ")
        .length === 20,
      name + " sampling works",
    );
    await page.screenshot({
      path: `test-results/lecture-${name}.png`,
      fullPage: true,
    });
    await c.close();
  }
  const oc = await browser.newContext();
  const op = await oc.newPage();
  const requests = [],
    errs = [];
  op.on("request", (r) => {
    if (!r.url().startsWith("data:")) requests.push(r.url());
  });
  op.on("pageerror", (e) => errs.push(e.message));
  await op.setContent(await readFile("index.html", "utf8"));
  await op.locator('[data-chapter="language"]').click();
  await op.locator("#skip-transition").click();
  await op.locator("#scene-selector").selectOption("4");
  await op.locator("#temperature-sample").click();
  ok(
    (await op.locator("#temperature-draws").textContent()).split(" · ")
      .length === 20,
    "offline document sampling",
  );
  ok(requests.length === 0, "offline document makes no requests");
  ok(errs.length === 0, "offline document no errors");
  await oc.close();
  console.log(
    `PASS: ${assertions} lecture browser assertions; all 29 scenes, all 18 laboratories, all 15 questions, notes, exports, storage, responsive screens, and offline operation.`,
  );
  await writeFile(
    "test-results/lecture-summary.json",
    JSON.stringify(
      {
        assertions,
        date: new Date().toISOString(),
        errors,
        scenes: 29,
        laboratories: 18,
        questions: 15,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
