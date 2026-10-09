// Optional authoring helper. The website itself has no build step.
// Start the development server first; changes are read from assets/course.js.
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
(async () => {
  const file = path.join(__dirname, "..", "index.html");
  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto(process.env.COURSE_TEST_URL || "http://127.0.0.1:8000/", {
      waitUntil: "networkidle",
    });
    const sections = await page.evaluate(() =>
      Object.fromEntries(
        [
          ["weeks", "weeks"],
          ["artifacts", "artifactGrid"],
          ["assessment", "assessmentRows"],
        ].map(([key, id]) => [
          key,
          (() => {
            const clone = document.getElementById(id).cloneNode(true);
            clone
              .querySelectorAll("[data-enhanced-only]")
              .forEach((el) => el.remove());
            return clone.innerHTML;
          })(),
        ]),
      ),
    );
    let html = fs.readFileSync(file, "utf8");
    for (const [key, content] of Object.entries(sections)) {
      const start = `<!-- fallback:${key}:start -->`,
        end = `<!-- fallback:${key}:end -->`;
      const a = html.indexOf(start),
        b = html.indexOf(end);
      if (a < 0 || b < a || !content.trim())
        throw new Error(`Missing fallback markers or content: ${key}`);
      html =
        html.slice(0, a + start.length) + "\n" + content + "\n" + html.slice(b);
    }
    fs.writeFileSync(file, html);
    console.log("Refreshed complete static course sections in index.html.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
