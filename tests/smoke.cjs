const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("fs");
const base = process.env.COURSE_TEST_URL || "http://127.0.0.1:8000/";
const outputDir = fs.mkdtempSync(
  require("node:path").join(require("node:os").tmpdir(), "course-validation-"),
);
const axePath = process.env.AXE_CORE_PATH;
(async () => {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const reports = [];
  for (const width of [360, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const p = await context.newPage();
    const errors = [],
      failures = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("response", (r) => {
      if (r.status() >= 400) failures.push(r.url() + ": " + r.status());
    });
    await p.goto(base, { waitUntil: "networkidle" });
    assert.equal(await p.locator(".week").count(), 8);
    assert.equal(await p.locator(".artifact").count(), 8);
    assert.equal(await p.locator("#courseUnavailable").isDisabled(), true);
    assert.equal(await p.locator("#courseStart").isVisible(), false);
    await p.screenshot({ path: `${outputDir}/opening-${width}.png` });
    await p.locator(".skip-intro").click();
    await p.waitForFunction(() => document.activeElement.id === "welcome");
    await p.waitForTimeout(900);
    await p.screenshot({ path: `${outputDir}/banner-${width}.png` });
    await p.locator(".welcome-board .button").click();
    await p.waitForFunction(() => document.activeElement.id === "overview");
    // Classroom studio: manual controls, keyboard timeline, optional tour, and safeguards.
    await p.locator('[data-studio-phase="Design"]').click();
    assert.equal(
      await p.locator("#studioScene").getAttribute("data-phase"),
      "Design",
    );
    await p.locator('[data-studio-feature="access"]').click();
    await p.locator('[data-format="visual"]').click();
    assert.match(
      await p.locator("#studioLearningExample").textContent(),
      /Follow the water/,
    );
    await p.locator('[data-format="scaffold"]').click();
    assert.match(
      await p.locator("#studioLearningExample").textContent(),
      /step by step/,
    );
    await p.locator('[data-studio-feature="review"]').click();
    await p.locator("#studioReviewToggle").click();
    assert.match(
      await p.locator("#studioReviewExample").textContent(),
      /different light needs/,
    );
    await p.locator("#studioReviewToggle").click();
    assert.match(
      await p.locator("#studioReviewExample").textContent(),
      /All plants/,
    );
    await p.locator('[data-studio-feature="privacy"]').click();
    await p.locator("#studioPrivacyToggle").click();
    assert.match(
      await p.locator("#studioPrivacyExample").textContent(),
      /unnecessary/,
    );
    await p.locator("#studioPrivacyToggle").click();
    assert.match(
      await p.locator("#studioPrivacyExample").textContent(),
      /excluded/,
    );
    await p.locator("#studioTimeline").focus();
    await p.keyboard.press("End");
    assert.equal(
      await p.locator("#studioScene").getAttribute("data-phase"),
      "Lead",
    );
    assert.equal(await p.locator("#studioTimeline").inputValue(), "7");
    await p.keyboard.press("Home");
    assert.equal(
      await p.locator("#studioScene").getAttribute("data-phase"),
      "Understand",
    );
    await p.locator("#studioPlay").click();
    await p.waitForFunction(
      () => document.querySelector("#studioTimeline").value === "1",
    );
    await p.locator("#motionToggle").click();
    assert.equal(
      await p.locator("#studioPlay").getAttribute("aria-pressed"),
      "false",
    );
    assert.equal(await p.locator("#studioPlay").isDisabled(), true);
    await p.locator("#motionToggle").click();
    assert.equal(await p.locator("#studioPlay").isDisabled(), false);
    // All artifact dialogs and their richer samples, with native Escape/focus handling.
    for (let artifact = 0; artifact < 8; artifact++) {
      const trigger = p.locator(".artifact-preview-button").nth(artifact);
      await trigger.click();
      assert.equal(
        await p.locator("#artifactDialog").evaluate((d) => d.open),
        true,
      );
      assert(await p.locator("#artifactDialogContent").textContent());
      if (artifact === 2) {
        await p.locator('[data-slide-direction="1"]').click();
        assert.equal(
          await p.locator("#sampleSlideCount").textContent(),
          "2 / 3",
        );
      }
      if (artifact === 4) {
        await p.locator('[data-sample-level="2"]').click();
        assert.match(
          await p.locator("#sampleLevelContent").textContent(),
          /two environments/,
        );
      }
      if (artifact === 6) {
        await p.locator(".sample-checklist input").first().check();
        assert.equal(
          await p.locator(".sample-checklist input").first().isChecked(),
          true,
        );
      }
      await p.keyboard.press("Escape");
      assert.equal(
        await p.locator("#artifactDialog").evaluate((d) => d.open),
        false,
      );
      assert.equal(
        await trigger.evaluate((el) => el === document.activeElement),
        true,
      );
    }
    assert.match(
      await p.locator(".portfolio-explore-status").textContent(),
      /8 of 8/,
    );
    await p.locator("#tab-check").click();
    await p.locator('.claim[data-error="true"]').click();
    await p.locator("#verifyBtn").click();
    assert.match(
      await p.locator("#checkFeedback").textContent(),
      /You found it/,
    );
    await p.locator("#resetCheck").click();
    assert.equal(await p.locator("#verifyBtn").isDisabled(), false);
    await p.locator("#tab-check").focus();
    await p.keyboard.press("ArrowRight");
    assert.equal(
      await p.locator("#tab-prompt").getAttribute("aria-selected"),
      "true",
    );
    for (let i = 0; i < 5; i++) await p.locator("#promptNext").click();
    assert.equal(await p.locator("#promptNext").isDisabled(), true);
    assert.match(
      await p.locator("#promptResponse").textContent(),
      /No student data/,
    );
    await p.locator("#promptReset").click();
    assert.equal(await p.locator("#promptCount").textContent(), "0 / 5");
    assert.match(await p.locator("#assembledPrompt").inputValue(), /worksheet/);
    await p.locator("#tab-own").click();
    await p.locator('[data-step="3"]').click();
    assert.match(
      await p.locator("#reviewExample").textContent(),
      /own the final/,
    );
    await p.locator("#week-3 summary").click();
    assert.equal(await p.locator("#week-3 details").getAttribute("open"), "");
    await p.locator('input[value="special"]').check();
    assert.equal(await p.locator(".week.relevant").count(), 3);
    assert.equal(await p.locator(".outcome-list .relevant").count(), 2);
    assert.equal(await p.locator(".week").count(), 8);
    await p.locator("#clearAudience").click();
    assert.equal(await p.locator(".week.relevant").count(), 0);
    await p.locator(".capstone summary").click();
    assert.equal(await p.locator(".capstone").getAttribute("open"), "");
    await p.locator(".assessment-row").nth(4).click();
    assert.equal(await p.locator("#chartValue").textContent(), "25%");
    await p.locator(".assessment-row").nth(4).click();
    assert.equal(await p.locator("#chartValue").textContent(), "100%");
    const checks = [];
    for (const id of [
      "intro",
      "welcome",
      "overview",
      "skills",
      "studio",
      "journey",
      "week-4",
      "rhythm",
      "outcomes",
      "portfolio",
      "assessment",
      "finale",
    ]) {
      await p.evaluate((id) => {
        const el = document.getElementById(id);
        window.scrollTo({
          top: el.getBoundingClientRect().top + scrollY - 100,
          behavior: "instant",
        });
      }, id);
      await p.waitForTimeout(50);
      checks.push(
        await p.evaluate(
          (id) => ({
            id,
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
          }),
          id,
        ),
      );
    }
    assert(
      checks.every((c) => !c.overflow),
      JSON.stringify(checks),
    );
    // Reverse native scrolling resets both camera and classroom phase.
    await p.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await p.waitForTimeout(100);
    assert.equal(
      await p.locator("#classroomViewport").getAttribute("data-phase"),
      "Understand",
    );
    await p.locator("#motionToggle").click();
    assert(
      await p
        .locator("html")
        .evaluate((e) => e.classList.contains("static-motion")),
    );
    await p.locator("#motionToggle").click();
    assert(
      await p
        .locator("html")
        .evaluate((e) => e.classList.contains("motion-ready")),
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    reports.push({
      width,
      checks:
        "PASS: classroom studio, keyboard timeline, optional tour and global pause, all 8 artifact dialogs, slides, differentiation choices, checklist, real clicks, keyboard tabs, navigation, details, role highlights, assessment, reverse scroll, assets, no horizontal overflow",
    });
    await context.close();
  }
  for (const option of ["reduced", "no-js", "script-blocked"]) {
    const context = await browser.newContext({
      viewport: { width: 360, height: 900 },
      reducedMotion: option === "reduced" ? "reduce" : "no-preference",
      javaScriptEnabled: option !== "no-js",
    });
    const p = await context.newPage();
    if (option === "script-blocked")
      await p.route("**/assets/*.js", (r) => r.abort());
    await p.goto(base, { waitUntil: "networkidle" });
    assert.equal(await p.locator(".week").count(), 8);
    assert.equal(await p.locator(".artifact").count(), 8);
    assert.equal(await p.locator(".assessment-row").count(), 5);
    if (option === "reduced") {
      assert(
        await p
          .locator("html")
          .evaluate((e) => e.classList.contains("static-motion")),
      );
      assert.equal(await p.locator("#motionToggle").isDisabled(), true);
    } else {
      assert.equal(await p.locator(".skill-panel:visible").count(), 3);
      await p.locator("#week-7 summary").click();
      assert.equal(await p.locator("#week-7 details").getAttribute("open"), "");
    }
    reports.push({
      mode: option,
      checks: "PASS: complete readable course and native details",
    });
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const p = await context.newPage();
  await p.goto(base, { waitUntil: "networkidle" });
  if (axePath) {
    await p.addScriptTag({ path: axePath });
    const axe = await p.evaluate(
      async () =>
        await axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
        }),
    );
    reports.push({
      axeViolations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    assert.equal(
      axe.violations.length,
      0,
      "Accessibility violations: " +
        JSON.stringify(axe.violations.map((v) => v.id)),
    );
  } else
    reports.push({
      axe: "NOT RUN: supply AXE_CORE_PATH to a local axe.min.js",
    });
  fs.writeFileSync(
    outputDir + "/validation.json",
    JSON.stringify(reports, null, 2),
  );
  console.log(JSON.stringify(reports, null, 2));
  console.log("Results and screenshots: " + outputDir);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
