import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { chapterRegistry } from "../src/content/chapters.js";
import { installCurriculum } from "../src/content/curriculum.js";
installCurriculum();
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { default: AxeBuilder } = require(
  process.env.AXE_MODULE ||
    "/tmp/intelligence-a11y/node_modules/@axe-core/playwright",
);
const b = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
await mkdir("test-results", { recursive: true });
try {
  const context = await b.newContext({
    viewport: { width: 1366, height: 768 },
    reducedMotion: "reduce",
  });
  const p = await context.newPage();
  await p.goto(process.env.TEST_URL || "http://127.0.0.1:8010/");
  async function scan(name) {
    const r = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    results.push({ name, violations: r.violations, passes: r.passes.length });
    console.log(
      name,
      JSON.stringify(
        r.violations.map((v) => ({
          id: v.id,
          count: v.nodes.length,
          nodes: v.nodes
            .slice(0, 5)
            .map((n) => ({ target: n.target, summary: n.failureSummary })),
        })),
      ),
    );
  }
  await scan("campus");
  for (const c of chapterRegistry) {
    await p.locator(`[data-chapter="${c.id}"]`).click();
    for (let i = 0; i < c.scenes.length; i++) {
      if (!c.scenes[i].lab) continue;
      await p.locator("#scene-selector").selectOption(String(i));
      await scan(c.id + "/" + c.scenes[i].id);
    }
  }
  await p.locator("#deeper-button").click();
  await scan("deeper-dialog");
  await p.keyboard.press("Escape");
  await p.locator("#settings-button").click();
  await scan("settings-dialog");
  await writeFile(
    "test-results/lecture-accessibility.json",
    JSON.stringify(results, null, 2),
  );
  assert.equal(
    results.reduce((a, r) => a + r.violations.length, 0),
    0,
  );
  console.log(
    `PASS: ${results.length} Axe view scans with zero detected violations.`,
  );
  await context.close();
} finally {
  await b.close();
}
