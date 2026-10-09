(() => {
  "use strict";
  if (!window.IntersectionObserver || !Element.prototype.animate) return;
  const root = document.documentElement;
  const brand = document.getElementById("intro-title");
  const headings = [
    ...document.querySelectorAll("main > section[aria-labelledby]"),
  ]
    .map((section) =>
      document.getElementById(section.getAttribute("aria-labelledby")),
    )
    .filter((heading) => heading && heading !== brand);
  const layer = document.createElement("div");
  layer.className = "type-flight";
  layer.setAttribute("aria-hidden", "true");
  document.body.append(layer);
  let previous = brand;
  let active = null;
  let animations = [];
  let generation = 0;
  const movable = () =>
    !root.classList.contains("static-motion") && !document.hidden;

  function settle() {
    generation++;
    animations.forEach((animation) => animation.cancel());
    animations = [];
    if (active) active.classList.remove("type-transforming");
    active = null;
    layer.replaceChildren();
  }

  // Range measurements preserve the original em, br and accessible heading text.
  function letters(heading) {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const result = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const style = getComputedStyle(node.parentElement);
      for (let i = 0; i < node.length; i++) {
        const char = node.data[i];
        if (/\s/.test(char)) continue;
        const range = document.createRange();
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const rect = range.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        result.push({
          char,
          x: rect.left,
          y: rect.top + scrollY,
          size: parseFloat(style.fontSize),
          font: style.fontFamily,
          weight: style.fontWeight,
          italic: style.fontStyle,
          color: style.color,
        });
      }
    }
    return result;
  }

  function transform(heading) {
    if (heading === previous) return;
    const sourceHeading = previous;
    settle();
    previous = heading;
    if (!movable()) return;
    const source = letters(sourceHeading);
    const target = letters(heading);
    if (!source.length || !target.length) return;
    // Bring the previous phrase to the new section before rearranging it.
    // Its layout is scaled to fit the destination, including narrow phones.
    const sourceLeft = Math.min(...source.map((l) => l.x));
    const sourceTop = Math.min(...source.map((l) => l.y));
    const sourceWidth =
      Math.max(...source.map((l) => l.x + l.size)) - sourceLeft;
    const box = heading.getBoundingClientRect();
    const scale = Math.min(1, box.width / sourceWidth);
    source.forEach((letter) => {
      letter.x = box.left + (letter.x - sourceLeft) * scale;
      letter.y = box.top + scrollY + (letter.y - sourceTop) * scale;
      letter.size *= scale;
    });
    active = heading;
    heading.classList.add("type-transforming");
    const token = generation;
    const available = new Set(source);
    function glyph(letter) {
      const span = document.createElement("span");
      span.className = "type-glyph";
      span.textContent = letter.char;
      Object.assign(span.style, {
        left: `${letter.x}px`,
        top: `${letter.y}px`,
        fontFamily: letter.font,
        fontSize: `${letter.size}px`,
        fontWeight: letter.weight,
        fontStyle: letter.italic,
        color: letter.color,
      });
      layer.append(span);
      const range = document.createRange();
      range.selectNodeContents(span);
      const glyphTop = range.getBoundingClientRect().top + scrollY;
      span.style.top = `${letter.y + (letter.y - glyphTop)}px`;
      return span;
    }
    target.forEach((destination, index) => {
      const matches = [...available].filter((s) => s.char === destination.char);
      matches.sort(
        (a, b) =>
          Math.hypot(a.x - destination.x, a.y - destination.y) -
          Math.hypot(b.x - destination.x, b.y - destination.y),
      );
      const start = matches[0];
      if (start) available.delete(start);
      const span = glyph(destination);
      const dx = start ? start.x - destination.x : index % 2 ? 20 : -20;
      const dy = start ? start.y - destination.y : 24;
      const initialScale = start ? start.size / destination.size : 0.7;
      animations.push(
        span.animate(
          [
            {
              transform: `translate(${dx}px, ${dy}px) scale(${initialScale})`,
              color: start?.color || destination.color,
              opacity: start ? 1 : 0,
              offset: 0,
            },
            {
              transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 14}px) scale(${(initialScale + 1) / 2}) rotate(${index % 2 ? 5 : -5}deg)`,
              opacity: 1,
              offset: 0.5,
            },
            {
              transform: "translate(0, 0) scale(1)",
              color: destination.color,
              opacity: 1,
            },
          ],
          {
            duration: 1000,
            delay: (index % 7) * 18,
            easing: "cubic-bezier(.22,.65,.25,1)",
            fill: "both",
          },
        ),
      );
    });
    available.forEach((letter, index) => {
      animations.push(
        glyph(letter).animate(
          [
            { opacity: 1, transform: "translateY(0)" },
            {
              opacity: 0,
              transform: `translateY(${index % 2 ? -18 : 18}px) scale(.8)`,
            },
          ],
          { duration: 420, fill: "both", easing: "ease-out" },
        ),
      );
    });
    Promise.all(
      animations.map((animation) => animation.finished.catch(() => {})),
    ).then(() => {
      if (token === generation) settle();
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const incoming = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (incoming.length) transform(incoming[0].target);
    },
    { rootMargin: "-15% 0px -20% 0px", threshold: 0.2 },
  );
  headings.forEach((heading) => observer.observe(heading));
  // Return to the university name when the visitor reverses the opening scene.
  window.addEventListener(
    "scroll",
    () => {
      if (scrollY < 50) {
        settle();
        previous = brand;
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", settle);
  document.addEventListener("visibilitychange", settle);
  document.addEventListener("course:motion", settle);
})();
