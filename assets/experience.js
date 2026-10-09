/* Purposeful interaction: a manipulable classroom, sample artifacts, and bounded motion. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (!$("#studio")) return;
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
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const canMove = () =>
    !motionPreference.matches &&
    !document.documentElement.classList.contains("static-motion") &&
    !document.hidden;
  const animations = new Map();
  function move(el, frames, options = {}) {
    if (!el || !canMove() || !el.animate) return;
    animations.get(el)?.cancel();
    const animation = el.animate(frames, {
      duration: 450,
      easing: "cubic-bezier(.16,1,.3,1)",
      ...options,
    });
    animations.set(el, animation);
    animation.finished
      .then(() => {
        if (animations.get(el) === animation) animations.delete(el);
      })
      .catch(() => {});
  }
  function settle() {
    animations.forEach((a) => {
      try {
        a.finish();
      } catch {
        a.cancel();
      }
    });
    animations.clear();
  }
  const weeks =
    typeof WEEKS !== "undefined"
      ? WEEKS
      : $$(".week").map((w) => ({
          n: Number(w.dataset.week),
          phase: w.dataset.phase,
          title: $("h3", w).textContent,
          build: $(".week-build p", w).textContent,
        }));
  const artifacts = typeof ARTIFACTS !== "undefined" ? ARTIFACTS : [];
  $$("[data-enhanced-only]").forEach((el) => (el.hidden = false));
  let studioWeek = 0,
    feature = "access",
    format = "read",
    reviewed = false,
    privacy = true,
    tour = null,
    sceneVisible = false;
  const scene = $("#studioScene"),
    timeline = $("#studioTimeline");
  const featureInfo = {
    access: {
      kicker: "01 / ACCESS & CHOICE",
      title: "One idea.<br>More ways in.",
      description:
        "Offering multiple ways to encounter an idea can support access. Choose a format to see the same science concept presented differently.",
    },
    review: {
      kicker: "02 / YOUR PROFESSIONAL JUDGMENT",
      title: "A first draft.<br>A thoughtful review.",
      description:
        "A confident answer can still need correction. Compare this simulated AI draft with a teacher-reviewed explanation, then decide what your learners need.",
    },
    privacy: {
      kicker: "03 / PRIVACY & TRUST",
      title: "Protect the learner.<br>Keep the learning.",
      description:
        "A useful prompt describes the learning need without unnecessary personal details. Compare the safeguards in this fictional example.",
    },
  };
  const formats = {
    read: "<h4>The water cycle</h4><p>Sunlight warms water. It evaporates, condenses into clouds, and returns as precipitation.</p>",
    visual:
      '<h4>Follow the water</h4><div class="studio-flow"><span>Water warms</span><i aria-hidden="true">→</i><span>Vapor rises</span><i aria-hidden="true">→</i><span>Clouds form</span><i aria-hidden="true">→</i><span>Rain returns</span></div><p style="margin-top:12px">The arrows show the sequence. Match each step with an example you know.</p>',
    scaffold:
      "<h4>Build the idea, step by step</h4><ol><li>Start with a puddle in the sun. What changes?</li><li>Connect water vapor with clouds.</li><li>Complete the sentence: water returns as ____.</li></ol>",
  };
  function updateBoard(animate = true) {
    const board = $(".studio-teaching-wall");
    board.classList.toggle("corrected", feature === "review" && reviewed);
    board.classList.toggle("needs-review", feature === "review" && !reviewed);
    $("#studioBoardKicker").textContent =
      feature === "access"
        ? "SAME IDEA · DIFFERENT WAYS IN"
        : feature === "review"
          ? "THE TEACHER STAYS IN THE LOOP"
          : "A LEARNING NEED, NOT A STUDENT RECORD";
    $("#studioBoardTitle").textContent =
      feature === "access"
        ? format === "visual"
          ? "Follow the water."
          : format === "scaffold"
            ? "A little support. A new connection."
            : "There’s more than one way to learn."
        : feature === "review"
          ? reviewed
            ? "Different plants. Different light needs."
            : "“All plants need direct sunlight.”"
          : privacy
            ? "Learning need: visual steps."
            : "Pause. What does this task really need?";
    $("#studioBoardContent").innerHTML =
      feature === "access"
        ? format === "visual"
          ? '<div class="studio-flow"><span>Warm</span><i aria-hidden="true">→</i><span>Rise</span><i aria-hidden="true">→</i><span>Clouds</span><i aria-hidden="true">→</i><span>Return</span></div>'
          : format === "scaffold"
            ? "<p>Notice a puddle. Connect the steps. Explain it in your own words.</p>"
            : "<p>Read an explanation. Explore a diagram. Work through a supported example.</p>"
        : feature === "review"
          ? reviewed
            ? "<p>Check a trusted reference. Revise the generalization. Adapt for your class.</p>"
            : "<p>A deliberately planted error. Try the teacher review to improve this draft.</p>"
          : privacy
            ? '<div class="studio-flow"><span>Fictional profile</span><span>No identifiers</span><span>Teacher review</span></div>'
            : "<p>Names and unrelated personal details do not help explain a learning need.</p>";
    if (animate)
      move(board, [
        { opacity: 0.35, transform: "translateY(9px)" },
        { opacity: 1, transform: "translateY(0)" },
      ]);
  }
  function status() {
    const w = weeks.find((w) => w.n === studioWeek);
    $("#studioStatus").textContent =
      `Viewing ${w.phase}, Week ${studioWeek}. ${feature === "access" ? "Learning choices" : feature === "review" ? "Teacher review" : "Privacy and trust"} selected.`;
  }
  function setWeek(n, animate = true) {
    studioWeek = Math.max(0, Math.min(7, Number(n)));
    const w = weeks.find((w) => w.n === studioWeek);
    if (!w) return;
    const previous = scene.dataset.phase;
    scene.dataset.phase = w.phase;
    timeline.value = studioWeek;
    timeline.setAttribute("aria-valuetext", `Week ${studioWeek}: ${w.title}`);
    $("#studioTimelineLabel").textContent = `Week ${studioWeek} · ${w.title}`;
    $("#studioRoomLabel").textContent = `${w.phase} · Week ${studioWeek}`;
    $("#studioWeekLabel").textContent = `WEEK ${studioWeek} / YOUR BUILD`;
    $("#studioWeekBuild").textContent = w.build;
    $("#studioWeekLink").href = `#week-${studioWeek}`;
    $$("[data-studio-phase]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.studioPhase === w.phase)),
    );
    const count = artifacts.filter((a) => a.week <= studioWeek).length;
    $$(".studio-artifacts i").forEach((el, i) =>
      el.classList.toggle("collected", i < count),
    );
    if (animate && previous !== w.phase)
      move(
        $(".studio-glass"),
        [
          { opacity: 0, transform: "translateY(25px) rotate(-4deg)" },
          { opacity: 1, transform: "translateY(0) rotate(0deg)" },
        ],
        { duration: 900 },
      );
    status();
  }
  function setFeature(name) {
    feature = name;
    scene.dataset.feature = name;
    const info = featureInfo[name];
    $("#studioFeatureKicker").textContent = info.kicker;
    $("#studioFeatureTitle").innerHTML = info.title;
    $("#studioFeatureDescription").textContent = info.description;
    $$("[data-studio-feature]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.studioFeature === name)),
    );
    $("#studioAccess").hidden = name !== "access";
    $("#studioReview").hidden = name !== "review";
    $("#studioPrivacy").hidden = name !== "privacy";
    updateBoard();
    status();
    move($(".studio-feature-panel:not([hidden])"), [
      { opacity: 0, transform: "translateX(10px)" },
      { opacity: 1, transform: "translateX(0)" },
    ]);
  }
  $$("[data-studio-feature]").forEach((b) =>
    b.addEventListener("click", () => {
      stopTour();
      setFeature(b.dataset.studioFeature);
    }),
  );
  $$("[data-format]").forEach((b) =>
    b.addEventListener("click", () => {
      format = b.dataset.format;
      $$("[data-format]").forEach((x) =>
        x.setAttribute("aria-pressed", String(x === b)),
      );
      $("#studioLearningExample").innerHTML = formats[format];
      updateBoard();
      move($("#studioLearningExample"), [
        { opacity: 0.3, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ]);
    }),
  );
  $("#studioReviewToggle").addEventListener("click", () => {
    reviewed = !reviewed;
    const b = $("#studioReviewToggle");
    b.setAttribute("aria-pressed", String(reviewed));
    b.textContent = reviewed
      ? "Compare with the first draft"
      : "Apply teacher review";
    $("#studioReviewExample").innerHTML = reviewed
      ? "<h4>Plants have different light needs.</h4><p>Some plants thrive in direct sun; others prefer indirect light or shade. Verify a plant’s needs using a trusted horticultural source, then adapt the explanation for your learners.</p>"
      : "<h4>“All plants need direct sunlight.”</h4><p>This confident generalization needs a teacher’s attention.</p>";
    updateBoard();
    move($("#studioReviewExample"), [
      { opacity: 0.3, transform: "scale(.97)" },
      { opacity: 1, transform: "scale(1)" },
    ]);
  });
  $("#studioPrivacyToggle").addEventListener("click", () => {
    privacy = !privacy;
    const b = $("#studioPrivacyToggle");
    b.setAttribute("aria-pressed", String(privacy));
    b.textContent = privacy
      ? "Privacy safeguards on"
      : "Show the safer version";
    $("#studioPrivacyExample").innerHTML = privacy
      ? "<h4>A safer starting point</h4><p>Use a fictional learner profile and only the learning need required for the task.</p><ul><li>Student name: excluded</li><li>Personal identifiers: excluded</li><li>Learning need: visual steps</li></ul>"
      : "<h4>Review before sharing</h4><p>Even in a fictional example, adding a student’s name or unrelated personal details is unnecessary. Follow your school’s policy and use an approved tool.</p><ul><li>Name field: unnecessary</li><li>Personal history: unnecessary</li><li>Learning need: useful</li></ul>";
    updateBoard();
  });
  function stopTour() {
    if (tour) {
      clearInterval(tour);
      tour = null;
    }
    $("#studioPlay").setAttribute("aria-pressed", "false");
    $("#studioPlay").firstElementChild.classList.remove("pause");
    $("#studioPlayLabel").textContent = "Play transformation";
  }
  function syncMotion() {
    if (!canMove()) {
      stopTour();
      settle();
      scene.style.setProperty("--room-rx", "0deg");
      scene.style.setProperty("--room-ry", "0deg");
    }
    $("#studioPlay").disabled = !canMove();
    $("#studioPlay").setAttribute(
      "aria-label",
      canMove()
        ? "Play or pause the classroom transformation"
        : "Automatic transformation is paused for your motion preference",
    );
  }
  $("#studioPlay").addEventListener("click", () => {
    if (tour) {
      stopTour();
      return;
    }
    if (!canMove()) return;
    if (studioWeek === 7) setWeek(0);
    $("#studioPlay").setAttribute("aria-pressed", "true");
    $("#studioPlay").firstElementChild.classList.add("pause");
    $("#studioPlayLabel").textContent = "Pause transformation";
    tour = setInterval(() => {
      if (!canMove() || !sceneVisible) {
        stopTour();
        return;
      }
      setWeek(studioWeek + 1);
      if (studioWeek === 7) stopTour();
    }, 2600);
  });
  timeline.addEventListener("input", () => {
    stopTour();
    setWeek(timeline.value);
  });
  $$("[data-studio-phase]").forEach((b) =>
    b.addEventListener("click", () => {
      stopTour();
      setWeek({ Understand: 0, Design: 3, Lead: 6 }[b.dataset.studioPhase]);
    }),
  );
  const stack = document.createElement("div");
  stack.className = "studio-artifacts";
  stack.setAttribute("aria-hidden", "true");
  stack.innerHTML = "<i></i>".repeat(8);
  scene.appendChild(stack);
  if (window.IntersectionObserver)
    new IntersectionObserver(
      (entries) => {
        sceneVisible = entries[0].isIntersecting;
        scene.classList.toggle("scene-resting", !sceneVisible);
        if (!sceneVisible) stopTour();
      },
      { threshold: 0.1 },
    ).observe(scene);
  else sceneVisible = true;
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    scene.addEventListener(
      "pointermove",
      (e) => {
        if (!canMove()) return;
        const r = scene.getBoundingClientRect();
        scene.style.setProperty(
          "--room-rx",
          (-(e.clientY - r.top) / r.height + 0.5) * 2 + "deg",
        );
        scene.style.setProperty(
          "--room-ry",
          ((e.clientX - r.left) / r.width - 0.5) * 3 + "deg",
        );
      },
      { passive: true },
    );
    scene.addEventListener("pointerleave", () => {
      scene.style.setProperty("--room-rx", "0deg");
      scene.style.setProperty("--room-ry", "0deg");
    });
  }
  setWeek(0, false);
  updateBoard(false);
  syncMotion();
  document.addEventListener("course:motion", syncMotion);
  motionPreference.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTour();
      settle();
    } else syncMotion();
  });

  // An explicit sample preview for every portfolio artifact; never presented as completed coursework.
  const samples = [
    {
      description:
        "Start with a reusable brief, then check the result in your own context.",
      content:
        "<h3>A five-part prompt template</h3><ol><li><b>Role:</b> You are a fourth-grade science teacher.</li><li><b>Task:</b> Draft a short water-cycle explanation.</li><li><b>Context:</b> Support developing readers and English learners.</li><li><b>Format:</b> A short paragraph and a labeled sequence.</li><li><b>Constraints:</b> No student data. Flag uncertainty. Keep language clear.</li></ol><h4>Teacher check</h4><p>Verify the science, compare with your curriculum, and adapt the language before using it.</p>",
    },
    {
      description:
        "Design toward a meaningful learning goal, with multiple ways to participate.",
      content:
        '<h3>Explain the water cycle</h3><p><b>Learning goal:</b> Describe how water moves through evaporation, condensation, and precipitation.</p><div class="sample-grid"><div><h4>Encounter the idea</h4><p>Read a short passage, use a labeled diagram, or listen to a teacher explanation.</p></div><div><h4>Show understanding</h4><p>Explain aloud, label a sequence, or write a short response.</p></div><div><h4>Check & adapt</h4><p>Notice the learner’s explanation. Offer supports and feedback that preserve the learning goal.</p></div></div>',
    },
    {
      description:
        "A slide deck can offer a clear sequence without overwhelming the learner.",
      content:
        '<div class="sample-slide" data-slide="0"><div><p class="eyebrow">SLIDE 1 / NOTICE</p><h3>Where did the puddle go?</h3><p>Begin with a familiar observation. Let learners offer an explanation.</p></div><div class="studio-flow"><span>Sunlight</span><i aria-hidden="true">↓</i><span>A warming puddle</span></div></div><div class="sample-slide" data-slide="1" hidden><div><p class="eyebrow">SLIDE 2 / CONNECT</p><h3>Follow the water.</h3><p>Connect each term with an observation. Include an accessible text explanation alongside the diagram.</p></div><div class="studio-flow"><span>Evaporation</span><i aria-hidden="true">↓</i><span>Condensation</span><i aria-hidden="true">↓</i><span>Precipitation</span></div></div><div class="sample-slide" data-slide="2" hidden><div><p class="eyebrow">SLIDE 3 / EXPLAIN</p><h3>Tell the story your way.</h3><p>Explain the sequence aloud, in writing, or with a labeled diagram. Check that each response shows the science.</p></div><div class="studio-flow"><span>Explain</span><span>Check</span><span>Revise</span></div></div><div class="sample-slide-controls"><button class="text-button" data-slide-direction="-1">Previous slide</button><span id="sampleSlideCount" role="status">1 / 3</span><button class="text-button" data-slide-direction="1">Next slide</button></div>',
    },
    {
      description:
        "Keep the teaching moves, supports, and checks close at hand.",
      content:
        "<h3>A one-page teaching guide</h3><h4>Before teaching</h4><p>Check the explanation against a trusted science reference. Prepare a readable diagram and clear vocabulary.</p><h4>During the lesson</h4><ol><li>Invite learners to notice a familiar example.</li><li>Explain the sequence using words and a diagram.</li><li>Offer sentence frames or a worked example when useful.</li></ol><h4>After the lesson</h4><p>Ask for an explanation in the learner’s chosen format. Check understanding and plan the next support.</p>",
    },
    {
      description:
        "Adjust support and complexity while preserving a meaningful common learning goal.",
      content:
        '<h3>One goal. Three starting points.</h3><div class="studio-choices" role="group" aria-label="Sample material support level"><button data-sample-level="0" aria-pressed="true">Entry</button><button data-sample-level="1" aria-pressed="false">Core</button><button data-sample-level="2" aria-pressed="false">Extend</button></div><div id="sampleLevelContent" class="studio-example"><h4>Start with a supported sequence</h4><p>Match evaporation, condensation, and precipitation to three labeled images. Explain one connection using a sentence frame.</p></div><h4>Accommodation check</h4><p>For a fictional learner who benefits from visual steps, pair clear text with the sequence. Check that the support addresses the actual need.</p>',
    },
    {
      description:
        "A classroom policy starts with responsibilities and school-approved practices.",
      content:
        "<h3>Our classroom AI commitments</h3><ul><li>Use only approved tools and follow school requirements.</li><li>Protect student data and minimize what is shared.</li><li>Verify facts, sources, and outputs.</li><li>Make the use of AI transparent when required.</li><li>Educators retain responsibility for grades, placements, and IEP decisions.</li></ul><h4>A note for families</h4><p>Explain the instructional purpose, teacher oversight, safeguards, and how families can ask questions. Review this sample against your school’s policies before adapting it.</p>",
    },
    {
      description: "Turn a promising idea into a small, accountable pilot.",
      content:
        '<h3>A thoughtful implementation plan</h3><div class="sample-checklist"><label><input type="checkbox"> Check school readiness and choose a clear goal.</label><label><input type="checkbox"> Plan a student AI literacy lesson and accessible supports.</label><label><input type="checkbox"> Evaluate and pilot one student-facing tool.</label><label><input type="checkbox"> Document privacy and ethics safeguards.</label><label><input type="checkbox"> Plan staff learning and monitor results.</label></div><p class="small-note" style="margin-top:18px">Try the planning checklist. These sample selections stay only in this open preview.</p>',
    },
    {
      description:
        "Plan a recorded 10-minute presentation that makes your reasoning visible.",
      content:
        "<h3>Your presentation storyboard</h3><table><thead><tr><th>Time</th><th>What to explain</th></tr></thead><tbody><tr><td>0–2 minutes</td><td>Your school’s readiness, the learning goal, and the reason for your pilot.</td></tr><tr><td>2–7 minutes</td><td>The student AI literacy lesson, accessible supports, tool evaluation, and staff learning.</td></tr><tr><td>7–10 minutes</td><td>Privacy and ethics safeguards, monitoring, and your next steps.</td></tr></tbody></table><h4>Keep your judgment visible</h4><p>Explain what you checked, what you changed, and why the plan fits your learners. This storyboard is a sample, not an uploaded video.</p>",
    },
  ];
  const dialog = $("#artifactDialog"),
    seen = new Set();
  const explored = document.createElement("p");
  explored.className = "portfolio-explore-status";
  explored.setAttribute("role", "status");
  explored.innerHTML =
    '<span aria-hidden="true">0</span><span>Explore the samples. Imagine what you’ll make.</span>';
  $("#artifactGrid").after(explored);
  function openArtifact(index) {
    const a = artifacts[index],
      sample = samples[index];
    if (!a || !sample || typeof dialog.showModal !== "function") return;
    $("#artifactDialogWeek").textContent = `WEEK ${a.week} / ${a.type}`;
    $("#artifactDialogTitle").textContent = a.title;
    $("#artifactDialogDescription").textContent = sample.description;
    $("#artifactDialogContent").innerHTML = sample.content;
    $("#artifactDialogLink").href = `#week-${a.week}`;
    dialog.showModal();
    document.body.classList.add("dialog-open");
    seen.add(index);
    $$(".artifact")[index]?.classList.add("artifact-previewed");
    explored.innerHTML = `<span aria-hidden="true">${seen.size}</span><span>${seen.size} of 8 sample artifacts explored. Your own portfolio starts with your weekly builds.</span>`;
    move(
      dialog,
      [
        { opacity: 0, transform: "translateY(30px) scale(.94)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      { duration: 550 },
    );
    move(
      $("#artifactDialogContent"),
      [
        {
          opacity: 0,
          transform: "perspective(1000px) rotateX(-8deg)",
          transformOrigin: "top",
        },
        {
          opacity: 1,
          transform: "perspective(1000px) rotateX(0)",
          transformOrigin: "top",
        },
      ],
      { duration: 650 },
    );
    let slide = 0;
    function showSlide() {
      const cards = $$("[data-slide]", dialog);
      cards.forEach((el, i) => (el.hidden = i !== slide));
      $("#sampleSlideCount").textContent = `${slide + 1} / 3`;
      $$("[data-slide-direction]", dialog).forEach(
        (b) =>
          (b.disabled =
            Number(b.dataset.slideDirection) < 0 ? slide === 0 : slide === 2),
      );
      move(cards[slide], [
        { opacity: 0.2, transform: "translateX(15px)" },
        { opacity: 1, transform: "translateX(0)" },
      ]);
    }
    $$("[data-slide-direction]", dialog).forEach((b) =>
      b.addEventListener("click", () => {
        slide = Math.max(
          0,
          Math.min(2, slide + Number(b.dataset.slideDirection)),
        );
        showSlide();
      }),
    );
    if (index === 2) showSlide();
    const levels = [
      [
        "Start with a supported sequence",
        "Match evaporation, condensation, and precipitation to three labeled images. Explain one connection using a sentence frame.",
      ],
      [
        "Explain the connections",
        "Write or speak a short explanation connecting the three stages. Include a familiar example and check the vocabulary.",
      ],
      [
        "Extend the explanation",
        "Explain how the water cycle can look different in two environments. Support your explanation with a trusted source and note any uncertainty.",
      ],
    ];
    $$("[data-sample-level]", dialog).forEach((b) =>
      b.addEventListener("click", () => {
        $$("[data-sample-level]", dialog).forEach((x) =>
          x.setAttribute("aria-pressed", String(x === b)),
        );
        const l = levels[Number(b.dataset.sampleLevel)];
        $("#sampleLevelContent").innerHTML = `<h4>${l[0]}</h4><p>${l[1]}</p>`;
        move($("#sampleLevelContent"), [
          { opacity: 0.2, transform: "translateY(8px)" },
          { opacity: 1, transform: "translateY(0)" },
        ]);
      }),
    );
  }
  $$(".artifact").forEach((card, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "artifact-preview-button";
    b.dataset.enhancedOnly = "";
    b.setAttribute("aria-haspopup", "dialog");
    b.setAttribute(
      "aria-label",
      `Open illustrative ${artifacts[i]?.title || "artifact"} preview`,
    );
    b.innerHTML = 'Open a sample <span aria-hidden="true">+</span>';
    $(".artifact-source", card).before(b);
    b.addEventListener("click", () => openArtifact(i));
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
      const paper = $(".artifact-symbol", card);
      card.addEventListener(
        "pointermove",
        (e) => {
          if (!canMove()) return;
          const r = card.getBoundingClientRect();
          paper.style.transform = `perspective(400px) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 18}deg) rotateX(${-((e.clientY - r.top) / r.height - 0.5) * 12}deg) translateY(-4px)`;
        },
        { passive: true },
      );
      card.addEventListener("pointerleave", () => (paper.style.transform = ""));
    }
  });
  $("#artifactDialogClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    animations.get(dialog)?.cancel();
  });
  dialog.addEventListener("click", (e) => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  });
  $("#artifactDialogLink").addEventListener("click", (e) => {
    e.preventDefault();
    const target = $($("#artifactDialogLink").hash);
    dialog.close();
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: canMove() ? "smooth" : "instant",
        block: "start",
      });
    }
  });
  $$(".week").forEach((w) => {
    const index = artifacts.findIndex((a) => a.week === Number(w.dataset.week));
    if (index < 0) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "week-preview-button";
    b.dataset.enhancedOnly = "";
    b.setAttribute("aria-haspopup", "dialog");
    b.textContent = "Preview a sample build +";
    b.addEventListener("click", () => openArtifact(index));
    w.appendChild(b);
  });
  const weekNav = document.createElement("nav");
  weekNav.className = "studio-week-nav";
  weekNav.dataset.enhancedOnly = "";
  weekNav.setAttribute("aria-label", "Jump to a course week");
  weekNav.innerHTML = weeks
    .map(
      (w) =>
        `<a href="#week-${w.n}" aria-label="Week ${w.n}: ${escape(w.title)}">${w.n}</a>`,
    )
    .join("");
  $("#weeks").before(weekNav); // Move into the weekly column, preserving the two-column journey layout.
  $("#weeks").prepend(weekNav);
  $$("a", weekNav).forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = $(a.hash);
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({
        behavior: canMove() ? "smooth" : "instant",
        block: "start",
      });
    }),
  );
  document.addEventListener("course:week", (e) => {
    $$("a", weekNav).forEach((a) => {
      if (a.hash === `#week-${e.detail.week}`)
        a.setAttribute("aria-current", "step");
      else a.removeAttribute("aria-current");
    });
  });
  $("#studioWeekLink").addEventListener("click", (e) => {
    e.preventDefault();
    const target = $($("#studioWeekLink").hash);
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({
      behavior: canMove() ? "smooth" : "instant",
      block: "start",
    });
  });

  // Make the existing labs feel responsive, and let visitors take away a reusable prompt.
  $$('[role="tab"]').forEach((b) =>
    b.addEventListener("click", () =>
      move($(".skill-panel:not([hidden]) .demo-paper"), [
        { opacity: 0.3, transform: "translateY(15px)" },
        { opacity: 1, transform: "translateY(0)" },
      ]),
    ),
  );
  const growth = document.createElement("div");
  growth.className = "prompt-growth";
  growth.setAttribute("aria-hidden", "true");
  growth.innerHTML = "<i></i>".repeat(5);
  $("#promptParts").before(growth);
  const copy = document.createElement("div");
  copy.className = "prompt-copy";
  copy.dataset.enhancedOnly = "";
  copy.innerHTML =
    '<label for="assembledPrompt">YOUR PROMPT, READY TO ADAPT</label><textarea id="assembledPrompt" readonly aria-describedby="copyPromptStatus"></textarea><button class="text-button" id="copyPrompt">Copy this prompt</button><p id="copyPromptStatus" class="prompt-copy-status" role="status">An example prompt. Adapt and verify before using it.</p>';
  $("#promptResponse").after(copy);
  function refreshPrompt() {
    const n = Number($("#promptCount").textContent.split("/")[0]);
    $$(".prompt-growth i").forEach((i, k) => i.classList.toggle("on", k < n));
    $("#assembledPrompt").value = n
      ? $$("#promptParts li")
          .slice(0, n)
          .map((li) => li.textContent.trim())
          .join("\n")
      : "Make a worksheet about fractions.";
    move($("#promptResponse"), [
      { opacity: 0.3, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ]);
  }
  new MutationObserver(refreshPrompt).observe($("#promptCount"), {
    childList: true,
    characterData: true,
    subtree: true,
  });
  refreshPrompt();
  $("#copyPrompt").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText($("#assembledPrompt").value);
      $("#copyPromptStatus").textContent =
        "Prompt copied. Adapt it to your context and check the output.";
    } catch {
      $("#assembledPrompt").focus();
      $("#assembledPrompt").select();
      $("#copyPromptStatus").textContent =
        "The prompt is selected. Use your device’s copy command.";
    }
  });
  const stamp = document.createElement("span");
  stamp.className = "practice-stamp";
  stamp.textContent = "PRACTICE COMPLETE";
  stamp.hidden = true;
  $("#checkFeedback").after(stamp);
  $("#verifyBtn").addEventListener("click", () => {
    if (!$("#verifyBtn").disabled) return;
    stamp.hidden = false;
    move(
      stamp,
      [
        { opacity: 0, transform: "scale(1.4) rotate(-12deg)" },
        { opacity: 1, transform: "scale(1) rotate(-3deg)" },
      ],
      { duration: 450 },
    );
    move($("#checkFeedback"), [{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
    });
  });
  $("#resetCheck").addEventListener("click", () => (stamp.hidden = true));
  $$("[data-step]").forEach((b) =>
    b.addEventListener("click", () => {
      $(".review-steps").style.setProperty("--review-step", b.dataset.step);
      move($("#reviewExample"), [
        { opacity: 0.3, transform: "translateY(12px)" },
        { opacity: 1, transform: "translateY(0)" },
      ]);
    }),
  );
  $$(".assessment-row").forEach((b) =>
    b.addEventListener("click", () => {
      move($("#chartValue"), [
        { opacity: 0.25, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" },
      ]);
      move($("#assessmentDetail"), [{ opacity: 0.3 }, { opacity: 1 }], {
        duration: 550,
      });
    }),
  );
  if (window.IntersectionObserver) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            move(
              e.target,
              [
                { opacity: 0.2, transform: "translateY(22px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 700 },
            );
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    $$(
      ".question-card,.field-notes,.outcome-list li,.rhythm-list li",
    ).forEach((el) => observer.observe(el));
  }
})();
