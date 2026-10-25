#!/usr/bin/env python3
"""Builds the single portable HTML files from src/ (no dependencies; plain string inlining).
   index.html = full edition   |   lite.html = simpler edition for educators new to AI"""
import pathlib
root = pathlib.Path(__file__).parent
src = root / "src"
common_a = ["core.js", "art.js", "sims1.js", "sims2.js"]
common_b = ["app1.js", "app2.js"]
editions = {
    "index.html": dict(pre=["edition_full.js"], content=["refs.js", "content1.js", "content2.js", "content3.js"],
                       title="Intelligence Machine Journey", heading="Journey Through the Intelligence Machine"),
    "lite.html": dict(pre=["edition_lite.js"], content=["refs.js", "content_lite.js"],
                      title="AI Made Simple", heading="AI Made Simple (Lite edition)"),
}
css = (src / "styles.css").read_text(encoding="utf-8")
tpl = (src / "template.html").read_text(encoding="utf-8")
for out, e in editions.items():
    files = e["pre"] + common_a + e["content"] + common_b
    js = "\n".join((src / f).read_text(encoding="utf-8") for f in files)
    html = (tpl.replace("/*__CSS__*/", css).replace("/*__JS__*/", js.replace("</script", "<\\/script"))
               .replace("{{TITLE}}", e["title"]).replace("{{HEADING}}", e["heading"]))
    (root / out).write_text(html, encoding="utf-8")
    print(f"Wrote {root/out} ({len(html)/1024:.0f} KB)")
