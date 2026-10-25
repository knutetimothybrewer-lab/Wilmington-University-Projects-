#!/usr/bin/env python3
"""Builds the single portable index.html from src/ (no dependencies; plain string inlining)."""
import pathlib
root = pathlib.Path(__file__).parent
src = root / "src"
order = ["core.js", "art.js", "sims1.js", "sims2.js", "content1.js", "content2.js", "content3.js", "app1.js", "app2.js"]
js = "\n".join((src / f).read_text(encoding="utf-8") for f in order)
css = (src / "styles.css").read_text(encoding="utf-8")
html = (src / "template.html").read_text(encoding="utf-8").replace("/*__CSS__*/", css).replace("/*__JS__*/", js.replace("</script", "<\\/script"))
(root / "index.html").write_text(html, encoding="utf-8")
print(f"Wrote {root/'index.html'} ({len(html)/1024:.0f} KB)")
