const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  for (const width of [360, 1440]) {
    const p = await b.newPage({ viewport: { width, height: 900 } });
    await p.goto(process.env.COURSE_TEST_URL || "http://127.0.0.1:8000/");
    assert.match(await p.locator("h1").innerText(), /Wilmington\s+University/);
    await p.screenshot({ path: `/tmp/type-opening-${width}.png` });
    async function go(id) {
      await p.evaluate((id) => {
        const h = document.getElementById(id);
        scrollTo({
          top: h.getBoundingClientRect().top + scrollY - 250,
          behavior: "instant",
        });
      }, id);
    }
    await go("welcome-title");
    await p.waitForFunction(() => document.querySelector(".type-transforming"));
    assert((await p.locator(".type-glyph").count()) > 20);
    await p.waitForTimeout(500);
    await p.screenshot({ path: `/tmp/type-flight-${width}.png` });
    await p.waitForTimeout(800);
    assert.equal(await p.locator(".type-glyph").count(), 0);
    assert.equal(await p.locator("#welcome-title").isVisible(), true);
    await go("overview-title");
    await p.waitForFunction(() => document.querySelector(".type-transforming"));
    await p.locator("#motionToggle").click();
    assert.equal(await p.locator(".type-glyph").count(), 0);
    assert.equal(await p.locator(".type-transforming").count(), 0);
    await p.locator("#motionToggle").click();
    await go("portfolio-title");
    await p.waitForTimeout(100);
    await go("skills-title");
    await p.waitForTimeout(1250);
    assert.equal(await p.locator(".type-glyph").count(), 0);
    assert.equal(await p.locator(".type-transforming").count(), 0);
    await go("welcome-title");
    await p.waitForTimeout(80);
    await p.setViewportSize({ width: width + 10, height: 900 });
    await p.waitForTimeout(1250);
    assert.equal(await p.locator(".type-transforming").count(), 0);
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    );
    await p.close();
    console.log(`PASS typography ${width}`);
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
