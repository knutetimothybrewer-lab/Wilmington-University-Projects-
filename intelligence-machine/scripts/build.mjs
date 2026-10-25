import { readFile, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const order = [
  "src/content/chapters.js",
  "src/content/curriculum.js",
  "src/content/sources.js",
  "src/views/art.js",
  "src/views/interiors.js",
  "src/engine/animation.js",
  "src/engine/simulation.js",
  "src/engine/state.js",
  "src/lessons/models.js",
  "src/lessons/labs.js",
  "src/lessons/lecture-ui.js",
  "src/main.js",
];
let js = "";
for (const name of order) {
  const text = await readFile(new URL(name, root), "utf8");
  js +=
    "\n// " +
    name +
    "\n" +
    text
      .replace(/^import\s+[\s\S]*?\s+from\s+['"][^'"]+['"];?\s*$/gm, "")
      .replace(/\bexport (?=(?:const|let|function|class)\b)/g, "");
}
const css = await readFile(new URL("src/styles/main.css", root), "utf8");
let html = await readFile(new URL("src/shell.html", root), "utf8");
html = html
  .replace("<!-- STYLES -->", () => "<style>\n" + css + "\n</style>")
  .replace(
    "<!-- SCRIPTS -->",
    () => "<script>\n(()=>{\n" + js + "\n})();\n</script>",
  );
await writeFile(new URL("index.html", root), html);
await writeFile(new URL("AI-Literacy-Lecture.html", root), html);
console.log(
  `Built portable index.html (${Math.round(Buffer.byteLength(html) / 1024)} KB). Open directly in Chrome or Edge; no server or installation required.`,
);
