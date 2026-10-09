/* No libraries, services, cookies, or storage. Content settings live in course.js. */
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const escape = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false,
    expandedText = false,
    ticking = false,
    lastPhase = "",
    lastWeek = -1;

  function renderCourse() {
    if (typeof WEEKS !== "undefined")
      $("#weeks").innerHTML = WEEKS.map(
        (w) =>
          `<article class="week" id="week-${w.n}" data-week="${w.n}" data-phase="${escape(w.phase)}"><div class="week-meta"><span class="week-number">WEEK ${String(w.n).padStart(2, "0")}</span><span class="phase-pill">${escape(w.phase)}</span></div><h3>${escape(w.title)}</h3><p class="week-hook">${escape(w.hook)}</p><p class="week-role" hidden>Relevant to your selected role</p><div class="week-build"><span>YOUR BUILD</span><p>${escape(w.build)}</p></div><details><summary>Explore this week <span class="plus" aria-hidden="true">+</span></summary><div class="week-detail"><h4>UNDER THE HOOD</h4><p>${escape(w.underTheHood)}</p><h4>WHAT WE’LL EXPLORE</h4><ul>${w.topics.map((t) => `<li>${escape(t)}</li>`).join("")}</ul><h4>YOU’LL WALK AWAY WITH</h4><p>${escape(w.outcome)}</p></div></details></article>`,
      ).join("");
    if (typeof ARTIFACTS !== "undefined")
      $("#artifactGrid").innerHTML = ARTIFACTS.map(
        (a) =>
          `<article class="artifact" data-artifact-week="${a.week}"><div class="artifact-top"><span>WEEK ${String(a.week).padStart(2, "0")}</span><span>${a.mark}</span></div><div class="artifact-symbol" aria-hidden="true"><i></i><i></i><i></i><i></i></div><h3>${escape(a.title)}</h3><p>${escape(a.type)}</p><a class="artifact-source" href="#week-${a.week}" aria-label="See the Week ${a.week} build for ${escape(a.title)}">From your weekly build <span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M5 5h10v10"/></svg></span></a></article>`,
      ).join("");
    if (typeof ASSESSMENT !== "undefined") {
      const colors = ["#00693c", "#8ea97c", "#c1d2aa", "#d0c59e", "#487258"];
      const total = ASSESSMENT.reduce((n, a) => n + a.pct, 0);
      let sum = 0;
      const stops = ASSESSMENT.map((a, i) => {
        const start = sum;
        sum += a.pct;
        return `${colors[i % colors.length]} ${start}% ${sum}%`;
      });
      $("#assessmentChart").style.background =
        `conic-gradient(${stops.join(",")})`;
      $("#assessmentChart").setAttribute(
        "aria-label",
        "Assessment weights: " +
          ASSESSMENT.map((a) => `${a.label} ${a.pct}%`).join("; "),
      );
      $("#chartValue").textContent = total + "%";
      $("#assessmentRows").innerHTML = ASSESSMENT.map(
        (a, i) =>
          `<button class="assessment-row" data-assessment="${i}" aria-pressed="false" style="--slice:${colors[i % colors.length]}"><i aria-hidden="true"></i><span>${escape(a.label)}</span><b>${a.pct}%</b></button>`,
      ).join("");
      if (total !== 100) {
        $("#assessmentDetail").textContent =
          `Assessment configuration needs review: weights total ${total}%, not 100%.`;
        console.warn("Assessment weights must total 100%.");
      }
    }
  }
  renderCourse();
  $$(".static-demo-answer").forEach((el) => (el.hidden = true));

  // Native links and details remain usable if enhancement is unavailable.
  const tabs = $$('[role="tab"]');
  $(".skill-tabs").hidden = false;
  const panels = $$(".skill-panel");
  function selectTab(tab, focus = false) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const p = $("#" + t.getAttribute("aria-controls"));
      p.hidden = !on;
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", t.id);
      p.tabIndex = 0;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t));
    t.addEventListener("keydown", (e) => {
      let index;
      if (e.key === "ArrowRight") index = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") index = (i + tabs.length - 1) % tabs.length;
      if (e.key === "Home") index = 0;
      if (e.key === "End") index = tabs.length - 1;
      if (index !== undefined) {
        e.preventDefault();
        selectTab(tabs[index], true);
      }
    });
  });
  selectTab(tabs[0]);

  let checked = false;
  const claims = $$(".claim");
  claims.forEach((b) =>
    b.addEventListener("click", () => {
      if (!checked)
        b.setAttribute(
          "aria-pressed",
          String(b.getAttribute("aria-pressed") !== "true"),
        );
    }),
  );
  $("#verifyBtn").addEventListener("click", () => {
    const selected = claims.filter(
      (b) => b.getAttribute("aria-pressed") === "true",
    );
    if (!selected.length) {
      $("#checkFeedback").textContent =
        "Choose a claim first. It is okay to be unsure.";
      return;
    }
    checked = true;
    claims.forEach((b) => {
      b.disabled = true;
      b.classList.toggle("incorrect", b.dataset.error === "true");
    });
    const only = selected.length === 1 && selected[0].dataset.error === "true";
    $("#checkFeedback").textContent =
      (only ? "You found it. " : "Here is the claim to revisit. ") +
      "About 97% of Earth’s water is salt water; only about 3% is fresh, and most fresh water is frozen in ice caps and glaciers. Verify the claim against a trusted reference such as the USGS Water Science School. Confident wording is not evidence.";
    $("#verifyBtn").disabled = true;
  });
  $("#resetCheck").addEventListener("click", () => {
    checked = false;
    claims.forEach((b) => {
      b.disabled = false;
      b.setAttribute("aria-pressed", "false");
      b.classList.remove("incorrect");
    });
    $("#verifyBtn").disabled = false;
    $("#checkFeedback").textContent = "Select one or more claims to check.";
    claims[0].focus({ preventScroll: true });
  });

  const parts = ["Role", "Task", "Context", "Format", "Constraints"];
  const responses = [
    "A generic worksheet, without a clear grade or learning goal.",
    "<b>Grade 4 math practice</b>“Let’s practice some fractions!” The voice fits, but the skill is still unclear.",
    "<b>Compare these fractions</b>1. Which is greater: 1/2 or 3/8?<br>2. Which is less: 2/3 or 3/4?<br>3. Put these in order: 3/4, 1/2, 5/6.",
    "<b>More ways into the task</b>Compare 1/2 and 3/8 using two equal bars. Compare 2/3 and 3/4 using twelfths. Put the last set on a 0–1 number line.",
    "<b>A clear format and an answer key</b><table><thead><tr><th>Question</th><th>Visual hint</th><th>Answer</th></tr></thead><tbody><tr><td>Greater: 1/2 or 3/8?</td><td>Equal bars</td><td>1/2</td></tr><tr><td>Less: 2/3 or 3/4?</td><td>Twelfths</td><td>2/3</td></tr><tr><td>Order: 3/4, 1/2, 5/6</td><td>Number line</td><td>1/2, 3/4, 5/6</td></tr></tbody></table>",
    "<b>A more useful draft—not a finished resource.</b>Three short questions, visual hints, and an answer key. No student data included. <em>Check:</em> does the number-line method match what your learners know? Verify every answer and adapt before teaching.",
  ];
  let promptStage = 0;
  function showPrompt(n) {
    promptStage = n;
    $$("#promptParts li").forEach((li, i) => (li.hidden = i >= n));
    $("#promptResponse").innerHTML = responses[n];
    $("#promptNext").disabled = n === 5;
    $("#promptNext").textContent =
      n === 5 ? "All five parts added" : "Add " + parts[n] + " +";
    $("#promptCount").textContent = n + " / 5";
  }
  $("#promptNext").addEventListener("click", () =>
    showPrompt(Math.min(5, promptStage + 1)),
  );
  $("#promptReset").addEventListener("click", () => showPrompt(0));
  showPrompt(0);
  const review = [
    [
      "FACTS FIRST",
      "“All plants need direct sunlight.”",
      "Check the generalization against a trusted science source. Different plants need different amounts of light.",
    ],
    [
      "BETTER FEEDBACK",
      "“Explain how light needs differ.”",
      "Ask for age-appropriate language, examples of shade-tolerant plants, and one idea learners can investigate.",
    ],
    [
      "LOOK BEYOND THE DRAFT",
      "Compare with your science materials.",
      "Check the revised explanation against your curriculum and a trusted horticultural source. Resolve differences before using it.",
    ],
    [
      "YOUR PROFESSIONAL JUDGMENT",
      "Make it right for your learners.",
      "Edit into your own voice. Add an accessible illustration and your class’s familiar vocabulary. You own the final resource.",
    ],
  ];
  $$(".review-steps button").forEach((b) =>
    b.addEventListener("click", () => {
      const n = Number(b.dataset.step);
      $$(".review-steps button").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)),
      );
      $("#reviewExample").innerHTML =
        `<span class="review-status">${review[n][0]}</span><h4>${review[n][1]}</h4><p>${review[n][2]}</p>`;
    }),
  );

  function audience(key) {
    const p = typeof PERSONAS !== "undefined" ? PERSONAS[key] : null;
    $("#audienceMessage").textContent = p
      ? p.message
      : "Your experience is a strength. All five outcomes belong to every participant.";
    $$("[data-outcome]").forEach((li) => {
      const relevant = !!p && p.outcomes.includes(Number(li.dataset.outcome));
      li.classList.toggle("relevant", relevant);
      $(".relevant-label", li).hidden = !relevant;
    });
    $$(".week").forEach((w) => {
      const relevant = !!p && p.weeks.includes(Number(w.dataset.week));
      w.classList.toggle("relevant", relevant);
      $(".week-role", w).hidden = !relevant;
    });
    $("#clearAudience").hidden = !p;
  }
  $$('input[name="audience"]').forEach((r) =>
    r.addEventListener("change", () => audience(r.value)),
  );
  $("#clearAudience").addEventListener("click", () => {
    $$('input[name="audience"]').forEach((r) => (r.checked = false));
    audience(null);
    $('input[name="audience"]').focus({ preventScroll: true });
  });
  $$(".assessment-row").forEach((b) =>
    b.addEventListener("click", () => {
      const was = b.getAttribute("aria-pressed") === "true";
      $$(".assessment-row").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b && !was)),
      );
      const a =
        typeof ASSESSMENT !== "undefined"
          ? ASSESSMENT[Number(b.dataset.assessment)]
          : null;
      if (!a) return;
      $("#chartValue").textContent = was ? "100%" : a.pct + "%";
      $("#chartLabel").textContent = was ? "YOUR LEARNING" : a.label;
      $("#assessmentDetail").textContent = was
        ? "Five complementary ways to show your growth."
        : a.detail;
    }),
  );

  if (typeof LOGO_SRC !== "undefined" && LOGO_SRC) {
    $$(".official-logo").forEach((img) => {
      img.onload = () => (img.hidden = false);
      img.onerror = () => {
        img.hidden = true;
      };
      img.src = LOGO_SRC;
    });
  }
  // Avoid placeholder launches and unsupported protocols. No hidden click handler on a dead # link.
  if (
    typeof COURSE_START_URL !== "undefined" &&
    COURSE_START_URL.trim() &&
    !COURSE_START_URL.trim().startsWith("#")
  ) {
    try {
      const url = new URL(COURSE_START_URL, location.href);
      if (!["https:", "http:"].includes(url.protocol))
        throw new Error("Unsupported course URL");
      const a = $("#courseStart");
      a.href = url.href;
      a.target =
        typeof COURSE_START_TARGET === "undefined"
          ? "_top"
          : COURSE_START_TARGET;
      a.rel = "noopener";
      a.hidden = false;
      $("#courseUnavailable").hidden = true;
      $("#courseStatus").textContent =
        "Your next chapter is ready. Open Week 1 in your course.";
    } catch {
      $("#courseStatus").textContent =
        "The course link needs an update. Please contact your instructor.";
    }
  }

  const intro = $("#intro"),
    camera = $("#introCamera"),
    portal = $("#screenPortal");
  let geometry = { cx: 0, cy: 0, pw: 1, ph: 1, cw: 1, ch: 1, offsetY: 0 };
  function measure() {
    const cw = camera.offsetWidth,
      ch = camera.offsetHeight;
    const scale = Math.max(cw / 1672, ch / 941),
      ox = (cw - 1672 * scale) / 2,
      oy = (ch - 941 * scale) / 2;
    // Screen corners measured in the original study image; object-fit cover is accounted for.
    const x = 742 * scale + ox,
      y = 279 * scale + oy,
      pw = 480 * scale,
      ph = 277 * scale;
    Object.assign(portal.style, {
      left: x + "px",
      top: y + "px",
      width: pw + "px",
      height: ph + "px",
      transform: "none",
      border: "0",
      boxShadow: "none",
      borderRadius: "0",
    });
    geometry = {
      cx: x + pw / 2,
      cy: y + ph / 2,
      pw,
      ph,
      cw,
      ch,
      offsetY: camera.offsetTop,
      offsetX: camera.offsetLeft,
    };
    camera.style.transformOrigin = `${geometry.cx}px ${geometry.cy}px`;
    schedule();
  }
  function applyMotion(preserve = false) {
    const oldHeight = intro.offsetHeight,
      oldY = scrollY,
      inside = oldY > intro.offsetTop && oldY < intro.offsetTop + oldHeight;
    const staticMode = reduced.matches || paused || expandedText;
    root.classList.toggle("static-motion", staticMode);
    root.classList.toggle("motion-ready", !staticMode);
    root.classList.toggle("motion-paused", paused);
    const button = $("#motionToggle");
    button.hidden = false;
    button.disabled = reduced.matches || expandedText;
    button.setAttribute(
      "aria-pressed",
      String(paused || reduced.matches || expandedText),
    );
    $("#motionLabel").textContent = expandedText
      ? "Reading layout"
      : reduced.matches
        ? "Reduced motion"
        : paused
          ? "Resume motion"
          : "Pause motion";
    button.setAttribute(
      "aria-label",
      expandedText
        ? "Static reading layout for enlarged text"
        : reduced.matches
          ? "Reduced motion is enabled by your device preference"
          : paused
            ? "Resume motion"
            : "Pause motion",
    );
    button.firstElementChild.classList.toggle("play", staticMode);
    if (preserve) {
      if (oldY >= intro.offsetTop + oldHeight)
        window.scrollTo({
          top: oldY + intro.offsetHeight - oldHeight,
          behavior: "instant",
        });
      else if (inside && oldY > 120)
        window.scrollTo({
          top: $("#welcome").offsetTop - 76,
          behavior: "instant",
        });
    }
    measure();
  }
  $("#motionToggle").addEventListener("click", () => {
    paused = !paused;
    applyMotion(true);
  });
  reduced.addEventListener("change", () => applyMotion(true));
  const phases = {
    Understand: {
      label: "Understand · Weeks 0–2",
      number: "01 — UNDERSTAND",
      description: "Start with curiosity. Build understanding.",
      title: "Curiosity belongs here.",
      notes: ["Ask a question", "Check a source", "Keep thinking"],
    },
    Design: {
      label: "Design · Weeks 3–5",
      number: "02 — DESIGN",
      description:
        "Bring your ideas. Create more possibilities for your learners.",
      title: "More ways to learn.",
      notes: ["One lesson", "Many ways in", "Teacher reviewed"],
    },
    Lead: {
      label: "Lead · Weeks 6–7",
      number: "03 — LEAD",
      description:
        "Move forward with confidence—and your professional judgment.",
      title: "The future is human.",
      notes: ["Protect privacy", "Keep access open", "Lead thoughtfully"],
    },
  };
  function updateRoom() {
    const weeks = $$(".week");
    if (!weeks.length) return;
    const target = innerHeight * 0.46;
    let active = weeks[0];
    for (const w of weeks) {
      if (w.getBoundingClientRect().top <= target) active = w;
    }
    const phase = active.dataset.phase,
      week = Number(active.dataset.week);
    if (phase !== lastPhase) {
      lastPhase = phase;
      const data = phases[phase];
      $("#classroomViewport").dataset.phase = phase;
      $("#roomPhaseLabel").textContent = data.label;
      $("#phaseNumber").textContent = data.number;
      $("#phaseDescription").textContent = data.description;
      $("#boardTitle").textContent = data.title;
      ["A", "B", "C"].forEach(
        (k, i) => ($("#boardNote" + k).textContent = data.notes[i]),
      );
    }
    if (week !== lastWeek) {
      lastWeek = week;
      const count =
        typeof ARTIFACTS !== "undefined"
          ? ARTIFACTS.filter((a) => a.week <= week).length
          : 0;
      $("#artifactCount").textContent = count + " / 8";
      $$(".artifact-ticks i").forEach((i, n) =>
        i.classList.toggle("collected", n < count),
      );
    }
  }
  function frame() {
    ticking = false;
    if (document.hidden) return;
    const y = scrollY,
      total = document.documentElement.scrollHeight - innerHeight;
    $("#progress").style.transform =
      `scaleX(${total > 0 ? clamp(y / total) : 0})`;
    if (!reduced.matches && !paused && !expandedText) {
      const duration = Math.max(1, intro.offsetHeight - innerHeight),
        p = clamp((y - intro.offsetTop) / duration);
      const g = geometry;
      const endScale = Math.max(innerWidth / g.pw, innerHeight / g.ph) * 1.035;
      const approach = clamp((p - 0.05) / 0.87),
        eased = approach * approach * (3 - 2 * approach),
        zoom = Math.exp(Math.log(endScale) * eased);
      const dx = (innerWidth / 2 - g.cx - g.offsetX) * eased,
        dy = (innerHeight / 2 - g.cy - g.offsetY) * eased;
      camera.style.transform = `translate3d(${dx}px,${dy}px,0) scale(${zoom})`;
      $(".learner-layer").style.transform =
        `translate3d(${approach * approach * 160}px,${approach * 20}px,0) rotate(${approach * 1.5}deg)`;
      $(".desk-layer").style.transform =
        `translate3d(0,${approach * approach * 100}px,0)`;
      $(".portal-room").style.transform =
        `scale(${1 + clamp((p - 0.65) / 0.35) * 0.04})`;
      $(".portal-title").style.opacity = 1 - clamp((p - 0.5) / 0.22);
      $(".intro-arrival").style.opacity = clamp((p - 0.8) / 0.16);
      const opacity = 1 - clamp((p - 0.07) / 0.26);
      $("#introCopy").style.opacity = opacity;
      $("#introCopy").style.transform = `translateY(${-p * 80}px)`;
      $("#introCopy").style.visibility = opacity < 0.01 ? "hidden" : "visible";
      $(".intro-scrim").style.opacity = 1 - clamp((p - 0.08) / 0.33);
      $(".scene-caption").style.opacity = 1 - clamp(p / 0.3);
    } else {
      $("#introCopy").style.visibility = "visible";
      $(".scene-caption").style.opacity = 1;
      $(".intro-arrival").style.opacity = 0;
    }
    updateRoom();
    const sections = ["overview", "journey", "portfolio"];
    let current = "";
    sections.forEach((id) => {
      if ($("#" + id).getBoundingClientRect().top < innerHeight * 0.35)
        current = id;
    });
    $$(".site-header nav a").forEach((a) => {
      if (a.hash === "#" + current) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }
  function schedule() {
    if (!ticking && !document.hidden) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", measure, { passive: true });
  document.addEventListener("visibilitychange", () => {
    root.classList.toggle("page-hidden", document.hidden);
    if (!document.hidden) {
      ticking = false;
      schedule();
    }
  });
  // Focus the destination after in-page navigation, including Skip intro, without trapping Tab.
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const target = $(a.hash);
      if (!target) return;
      e.preventDefault();
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: reduced.matches || paused ? "instant" : "smooth",
        block: "start",
      });
    }),
  );
  $$("details").forEach((d) => d.addEventListener("toggle", schedule));
  if (window.IntersectionObserver) {
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("arrive");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.15 },
    );
    $$(".artifact").forEach((card, i) => {
      card.style.setProperty("--arrival-delay", (i % 4) * 80 + "ms");
      reveal.observe(card);
    });
    reveal.observe($("#assessmentChart"));
  }
  const textProbe = document.createElement("span");
  textProbe.className = "text-size-probe";
  textProbe.setAttribute("aria-hidden", "true");
  document.body.appendChild(textProbe);
  if (window.ResizeObserver)
    new ResizeObserver(() => {
      const enlarged = textProbe.getBoundingClientRect().height > 24;
      if (enlarged !== expandedText) {
        expandedText = enlarged;
        root.classList.toggle("text-expanded", enlarged);
        applyMotion(true);
      }
    }).observe(textProbe);
  applyMotion();
  addEventListener("load", measure, { once: true });
})();
