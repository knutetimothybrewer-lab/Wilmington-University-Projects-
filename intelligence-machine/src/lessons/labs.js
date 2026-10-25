import { state, persist, escapeText } from "../engine/state.js";
import {
  softmax,
  nearestCentroid,
  forwardNetwork,
  approximateTokens,
  seededRandom,
  sampleIndex,
} from "./models.js";
import { chapterQuestions } from "../content/curriculum.js";
const labTitles = {
  rules: "IF–THEN rule machine",
  classifier: "Learning from examples",
  network: "Neural network forward pass",
  generation: "Classify or generate?",
  tokenizer: "Approximate tokenizer",
  attention: "Attention inspector",
  prediction: "Next-token predictor",
  temperature: "Temperature & sampling",
  context: "Context window experiment",
  citations: "Citation detective",
  confidence: "Confidence versus accuracy",
  verification: "Research verification challenge",
  support: "Student-support decision",
  error: "Find the assessment error",
  trust: "Attribution & trust",
  allocation: "Who should do the work?",
  models: "Three collaboration models",
  principles: "Build responsible AI principles",
  assessment: "Check your understanding",
};
const E = escapeText;
const labButton = (text, attrs = "") =>
  `<button class="lab-button" ${attrs}>${text}</button>`;
const labRange = (id, label, min, max, step, value) =>
  `<label class="lab-range" for="${id}"><span>${label}</span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output for="${id}">${value}</output></label>`;
const labFeedback =
  '<div class="lab-feedback" role="status" aria-live="polite" hidden></div>';
function say(host, text) {
  const out = host.querySelector(".lab-feedback");
  out.hidden = false;
  out.textContent = text;
  if (
    host.contains(document.activeElement) &&
    document.activeElement.tagName === "BUTTON"
  )
    out.scrollIntoView({ block: "nearest", behavior: "instant" });
}
function saveLab(key, value) {
  state.activities[key] = value;
  persist();
}
function retrieve(key, initial) {
  const s = state.activities[key];
  return s && typeof s === "object" ? s : initial;
}
function rangeEvents(host, fn) {
  host.querySelectorAll("input[type=range]").forEach((input) =>
    input.addEventListener("input", () => {
      const o = host.querySelector(`output[for="${input.id}"]`);
      if (o) o.textContent = input.value;
      fn();
    }),
  );
}
export function labTitle(id) {
  return labTitles[id] || "Explore the concept";
}
export function mountLectureLab(host, c, scene) {
  const id = scene.lab,
    key = c.id + "/" + scene.id;
  if (!id) {
    host.innerHTML = `<div class="concept-reading"><span class="lab-kind">CONCEPT & APPLICATION</span><h2>${E(scene.name)}</h2><p>${E(scene.explanation)}</p><div class="concept-pair"><article><h3>A useful analogy</h3><p>${E(scene.analogy)}</p></article><article><h3>Bring it into education</h3><p>${E(scene.application)}</p></article></div><p class="misconception"><strong>Challenge this misconception:</strong> ${E(scene.misconception)}</p></div>`;
    return;
  }
  const kind = ["classifier"].includes(id)
    ? "COMPUTATIONAL MODEL"
    : ["network", "temperature"].includes(id)
      ? "SIMPLIFIED MATHEMATICAL SIMULATION"
      : "SCRIPTED CONCEPTUAL DEMONSTRATION";
  host.innerHTML = `<header class="lab-heading"><div><span class="lab-kind">${id === "assessment" ? "FORMATIVE ASSESSMENT" : kind}</span><h2>${labTitle(id)}</h2></div><button class="lab-reset" aria-label="Reset ${labTitle(id)}">Reset</button></header><div class="lab-body"></div>`;
  const body = host.querySelector(".lab-body");
  host.querySelector(".lab-reset").onclick = () => {
    delete state.activities[key];
    persist();
    mountLectureLab(host, c, scene);
  };
  const handlers = {
    rules,
    classifier,
    network,
    generation,
    tokenizer,
    attention,
    prediction,
    temperature,
    context,
    citations,
    confidence,
    verification,
    support,
    error,
    trust,
    allocation,
    models,
    principles,
    assessment,
  };
  handlers[id](body, key, c, scene);
}
function rules(h, key) {
  const prev = retrieve(key, {
    late: 2,
    threshold: 3,
    missing: true,
    logic: "and",
  });
  h.innerHTML = `<p>Fictional classroom workflow. Reminders require human context review.</p><label class="lab-check"><input id="rule-missing" type="checkbox" ${prev.missing ? "checked" : ""}> Draft is missing</label>${labRange("rule-late", "Days late", 0, 10, 1, prev.late)}${labRange("rule-threshold", "Reminder threshold", 1, 7, 1, prev.threshold)}<label class="lab-label" for="rule-logic">Combine conditions<select id="rule-logic"><option value="and">AND — both conditions</option><option value="or">OR — either condition</option></select></label><div id="rule-diagram" class="rule-diagram"></div>${labFeedback}`;
  h.querySelector("#rule-logic").value = prev.logic;
  const run = () => {
    const v = {
      late: +h.querySelector("#rule-late").value,
      threshold: +h.querySelector("#rule-threshold").value,
      missing: h.querySelector("#rule-missing").checked,
      logic: h.querySelector("#rule-logic").value,
    };
    const meets = v.late >= v.threshold,
      result = v.logic === "and" ? v.missing && meets : v.missing || meets;
    h.querySelector("#rule-diagram").innerHTML =
      `<span>Missing draft: <b>${v.missing ? "YES" : "NO"}</b></span><span>${v.logic.toUpperCase()}</span><span>Days ≥ ${v.threshold}: <b>${meets ? "YES" : "NO"}</b></span><span aria-hidden="true">→</span><strong>${result ? "SEND REMINDER" : "NO AUTOMATIC REMINDER"}</strong>`;
    say(
      h,
      (result
        ? "The explicit predicate is true. Send only a low-stakes reminder, then investigate context."
        : "The predicate is false. This does not establish that support is unnecessary.") +
        " OR can trigger when only one condition holds; AND needs both. No machine learning occurs.",
    );
    saveLab(key, v);
  };
  rangeEvents(h, run);
  h.querySelectorAll("select,input[type=checkbox]").forEach(
    (e) => (e.onchange = run),
  );
  run();
}
function classifier(h, key) {
  const s = retrieve(key, { a: "2, 3, 4", b: "7, 8, 9", x: 5 });
  h.innerHTML = `<p>Synthetic one-dimensional text-feature data. Class A/B are arbitrary labels, not learner ability.</p><div class="lab-grid"><label class="lab-label" for="class-a">Class A examples<input id="class-a" value="${E(s.a)}"></label><label class="lab-label" for="class-b">Class B examples<input id="class-b" value="${E(s.b)}"></label></div>${labRange("class-x", "Test feature", 0, 10, 0.1, s.x)}<div id="classifier-plot"></div>${labFeedback}`;
  const run = () => {
    const a = h.querySelector("#class-a").value,
      b = h.querySelector("#class-b").value,
      x = +h.querySelector("#class-x").value;
    saveLab(key, { a, b, x });
    try {
      const parse = (s) =>
        s.trim()
          ? s.split(",").map((v) => (v.trim() === "" ? NaN : Number(v)))
          : [];
      const aa = parse(a),
        bb = parse(b),
        r = nearestCentroid(aa, bb, x);
      if (
        [...aa, ...bb].some((n) => n < 0 || n > 10) ||
        aa.length + bb.length > 40
      )
        throw new Error("Use at most 40 examples between 0 and 10.");
      h.querySelector("#classifier-plot").innerHTML =
        `<svg viewBox="0 0 600 130" role="img" aria-label="Class A centroid ${r.a.toFixed(2)}, class B centroid ${r.b.toFixed(2)}, test ${x}, prediction ${r.label}"><path d="M30 85h540" stroke="#9bab97"/>${aa.map((n) => `<circle cx="${30 + n * 54}" cy="50" r="7" fill="#276a50"/>`).join("")}${bb.map((n) => `<rect x="${24 + n * 54}" y="65" width="12" height="12" fill="#a77c25"/>`).join("")}<path d="M${30 + r.boundary * 54} 20v80" stroke="#7a8290" stroke-dasharray="5 5"/><path d="M${30 + x * 54} 110v-20" stroke="#153d63" stroke-width="4"/><text x="30" y="125">0</text><text x="560" y="125">10</text></svg>`;
      say(
        h,
        `Mean A = ${r.a.toFixed(2)}; mean B = ${r.b.toFixed(2)}; midpoint = ${r.boundary.toFixed(2)}. Prediction: ${r.label === "tie" ? "TIE — equal distances" : r.label}. This computes from your examples; it has no validated educational accuracy.`,
      );
    } catch (err) {
      h.querySelector("#classifier-plot").textContent =
        "Prediction unavailable.";
      say(h, "Enter comma-separated numbers for both classes. " + err.message);
    }
  };
  h.querySelectorAll("input:not([type=range])").forEach(
    (e) => (e.oninput = run),
  );
  rangeEvents(h, run);
  run();
}
function network(h, key) {
  const s = retrieve(key, { x1: 0.6, x2: 0.4, w: 1 });
  h.innerHTML = `<div class="lab-grid">${labRange("nn-x1", "Input x₁", 0, 1, 0.05, s.x1)}${labRange("nn-x2", "Input x₂", 0, 1, 0.05, s.x2)}</div>${labRange("nn-weight", "Weight into h₁", -2, 2, 0.1, s.w)}<div id="network-plot"></div><div class="lab-actions">${labButton("Inspect h₁", 'data-node="h1"')}${labButton("Inspect h₂", 'data-node="h2"')}</div>${labFeedback}`;
  let result;
  const run = () => {
    const v = {
      x1: +h.querySelector("#nn-x1").value,
      x2: +h.querySelector("#nn-x2").value,
      w: +h.querySelector("#nn-weight").value,
    };
    result = forwardNetwork(v.x1, v.x2, v.w);
    saveLab(key, v);
    h.querySelector("#network-plot").innerHTML =
      `<svg viewBox="0 0 600 150" role="img" aria-label="Two inputs feed hidden units h1 ${result.h1.toFixed(3)} and h2 ${result.h2.toFixed(3)}; output ${result.y.toFixed(3)}"><g stroke="#8aa995" stroke-width="2"><path d="M90 40L290 40 500 75M90 110L290 40M90 40L290 110 500 75M90 110L290 110" fill="none"/></g><g fill="#e3eedb" stroke="#507d5c"><circle cx="90" cy="40" r="23"/><circle cx="90" cy="110" r="23"/><circle cx="290" cy="40" r="28"/><circle cx="290" cy="110" r="28"/><circle cx="500" cy="75" r="32"/></g><g text-anchor="middle" fill="#244631" font-size="13"><text x="90" y="44">${v.x1}</text><text x="90" y="114">${v.x2}</text><text x="290" y="44">${result.h1.toFixed(2)}</text><text x="290" y="114">${result.h2.toFixed(2)}</text><text x="500" y="80">${result.y.toFixed(3)}</text></g></svg>`;
    say(
      h,
      `h₁ = ${result.h1.toFixed(3)}, h₂ = ${result.h2.toFixed(3)}, sigmoid output = ${result.y.toFixed(3)}. Hand-set weights; no training, student prediction, or calibrated probability.`,
    );
  };
  rangeEvents(h, run);
  h.querySelectorAll("[data-node]").forEach(
    (b) =>
      (b.onclick = () =>
        say(
          h,
          b.dataset.node === "h1"
            ? "h₁ = ReLU(w·x₁ + 0.5·x₂ − 0.5). Changing w can activate or silence this unit."
            : "h₂ = ReLU(−0.7·x₁ + 0.8·x₂ + 0.2). Its contribution to the output is multiplied by −0.6.",
        )),
  );
  run();
}
function generation(h, key) {
  const examples = {
    topic: [
      "Classification",
      "Label: SCIENCE",
      "A label comes from a specified set. It still needs task-specific evaluation.",
    ],
    draft: [
      "Generation",
      "Plants use light energy in photosynthesis to build sugars from carbon dioxide and water.",
      "This is authored example text, not output from a live model. Check subject accuracy and level before use.",
    ],
    both: [
      "Combined workflow",
      "Classify the topic → draft an explanation → apply a rule filter → human review.",
      "One application can combine explicit rules, learned classification, and generation.",
    ],
  };
  h.innerHTML = `<label class="lab-label" for="gen-task">Choose an educational task<select id="gen-task"><option value="topic">Assign a topic label</option><option value="draft">Draft a science explanation</option><option value="both">Combine mechanisms</option></select></label><div id="generation-output" class="sample-output"></div>${labFeedback}`;
  const s = retrieve(key, { choice: "topic" });
  h.querySelector("select").value = examples[s.choice] ? s.choice : "topic";
  const run = () => {
    const choice = h.querySelector("select").value,
      [label, text, note] = examples[choice];
    h.querySelector("#generation-output").innerHTML =
      `<span>${label}</span><p>${E(text)}</p>`;
    say(h, note);
    saveLab(key, { choice });
  };
  h.querySelector("select").onchange = run;
  run();
}
function tokenizer(h, key) {
  const s = retrieve(key, { text: "Learning is a collaborative process." });
  h.innerHTML = `<label class="lab-label" for="token-text">Text to segment (maximum 1,000 characters)<textarea id="token-text" maxlength="1000" rows="2">${E(s.text)}</textarea></label><p class="lab-caption">Approximation: whitespace/punctuation pieces; long chunks split into four-character pieces. IDs are synthetic hashes.</p><div id="token-output" class="token-output"></div>${labFeedback}`;
  const run = () => {
    const text = h.querySelector("textarea").value,
      tokens = approximateTokens(text);
    h.querySelector("#token-output").innerHTML = tokens
      .map(
        (t) =>
          `<span><b>${E(t.piece.replace(/ /g, "␠").replace(/\n/g, "↵"))}</b><small>ID ${t.id}</small></span>`,
      )
      .join("");
    say(
      h,
      `${tokens.length} approximate pieces; ${text.length} JavaScript character units. These are not verified token counts or real model vocabulary IDs.`,
    );
    saveLab(key, { text });
  };
  h.querySelector("textarea").oninput = run;
  run();
}
function attention(h, key) {
  const tokens = [
    "The",
    "teacher",
    "helped",
    "the",
    "learner",
    "because",
    "she",
    "noticed",
    "confusion.",
  ];
  h.innerHTML = `<p>Hand-authored causal attention pattern. Choose a token; later positions are masked. These weights do not come from a trained model.</p><div class="lab-actions">${tokens.map((t, i) => labButton(E(t), `data-focus="${i}" aria-pressed="false"`)).join("")}</div><div id="attention-bars"></div>${labFeedback}`;
  const run = (i) => {
    h.querySelectorAll("[data-focus]").forEach((b) =>
      b.setAttribute("aria-pressed", +b.dataset.focus === i),
    );
    const weights = tokens.map((_, j) =>
      j > i ? 0 : j === i ? 3 : j === 1 ? 2 : 1,
    );
    const sum = weights.reduce((a, b) => a + b, 0);
    h.querySelector("#attention-bars").innerHTML = tokens
      .map(
        (t, j) =>
          `<div class="probability-row"><span>${E(t)}</span><div><i style="width:${(100 * weights[j]) / sum}%"></i></div><b>${j > i ? "masked" : ((100 * weights[j]) / sum).toFixed(1) + "%"}</b></div>`,
      )
      .join("");
    say(
      h,
      `Focus position ${i + 1}. The normalization includes only available positions. Attention is not a proof of conscious focus or a complete causal explanation.`,
    );
    saveLab(key, { focus: i });
  };
  h.querySelectorAll("button").forEach(
    (b) => (b.onclick = () => run(+b.dataset.focus)),
  );
  run(Math.min(8, Math.max(0, retrieve(key, { focus: 6 }).focus || 0)));
}
const tokenOptions = (prefix) => {
  const last = prefix.at(-1);
  return last === "Learning"
    ? [
        ["is", 0.5],
        ["requires", 0.3],
        ["can", 0.2],
      ]
    : last === "is"
      ? [
          ["social", 0.5],
          ["active", 0.3],
          ["complex", 0.2],
        ]
      : last === "requires"
        ? [
            ["practice", 0.6],
            ["feedback", 0.25],
            ["attention", 0.15],
          ]
        : last === "can"
          ? [
              ["change", 0.5],
              ["grow", 0.35],
              ["transfer", 0.15],
            ]
          : [
              ["and", 0.5],
              ["with", 0.3],
              ["through", 0.2],
            ];
};
function prediction(h, key) {
  let prefix = retrieve(key, { prefix: ["Learning"] }).prefix;
  if (!Array.isArray(prefix) || prefix.length > 8) prefix = ["Learning"];
  const render = () => {
    const opts = tokenOptions(prefix);
    h.innerHTML = `<p>Scripted teaching distributions; not predictions from a real language model.</p><div class="sample-output" id="prediction-sequence">${E(prefix.join(" "))}<span class="insertion-point" aria-hidden="true">▏</span></div><div class="next-token-options">${opts.map(([t, p]) => `<button class="probability-option" data-next="${t}" ${prefix.length >= 7 ? "disabled" : ""}><span>${t}</span><i style="width:${p * 100}%"></i><b>${(p * 100).toFixed(0)}%</b></button>`).join("")}</div>${labFeedback}`;
    h.querySelectorAll("[data-next]").forEach(
      (b) =>
        (b.onclick = () => {
          prefix.push(b.dataset.next);
          saveLab(key, { prefix });
          render();
        }),
    );
    say(
      h,
      prefix.length >= 7
        ? "Sequence limit reached. Use Reset to try a different path. These choices have no truth-verification mechanism."
        : "Select a continuation. The next table changes with the context; the percentages are illustrative.",
    );
  };
  render();
}
function temperature(h, key) {
  let s = retrieve(key, { temperature: 1, seed: 17, draws: [] });
  h.innerHTML = `<p>Mathematical sampling over four illustrative logits [2, 1, 0, −1]. No language model is running.</p>${labRange("temperature-value", "Temperature T", 0.1, 2, 0.1, s.temperature)}<div id="temperature-bars"></div><div class="lab-actions">${labButton("Sample 20 times", 'id="temperature-sample"')}${labButton("Choose greedily", 'id="temperature-greedy"')}</div><div id="temperature-draws" class="sample-output"></div>${labFeedback}`;
  const words = ["explore", "question", "compare", "invent"];
  const render = () => {
    s.temperature = +h.querySelector("input").value;
    const ps = softmax([2, 1, 0, -1], s.temperature);
    h.querySelector("#temperature-bars").innerHTML = ps
      .map(
        (p, i) =>
          `<div class="probability-row"><span>${words[i]}</span><div><i style="width:${100 * p}%"></i></div><b>${(100 * p).toFixed(1)}%</b></div>`,
      )
      .join("");
    h.querySelector("#temperature-draws").textContent = s.draws.length
      ? s.draws.map((i) => words[i]).join(" · ")
      : "Generate to inspect a sample. The probabilities sum to 100% before rounding.";
    saveLab(key, s);
    return ps;
  };
  rangeEvents(h, () => {
    render();
    say(
      h,
      "Temperature changes concentration, not factual verification. Existing samples remain labeled as previous draws until you sample again.",
    );
  });
  h.querySelector("#temperature-sample").onclick = () => {
    const ps = render(),
      rng = seededRandom(s.seed++);
    s.draws = Array.from({ length: 20 }, () => sampleIndex(ps, rng));
    render();
    say(
      h,
      `20 draws at T=${s.temperature}. Counts vary because sampling is stochastic. The reproducible seed advances each run. No factual conclusion follows from these frequencies.`,
    );
  };
  h.querySelector("#temperature-greedy").onclick = () => {
    s.draws = [0];
    render();
    say(
      h,
      "Greedy decoding selects the highest logit: explore. This policy is not the formula evaluated at T=0 and does not guarantee truth.",
    );
  };
  render();
}
function context(h, key) {
  const entries = [
    "Topic: classroom garden.",
    "Key fact: meeting is on Thursday.",
    "Audience: grade 4.",
    "Need an accessible handout.",
    "Keep the message short.",
    "Question: which day is the meeting?",
  ];
  const s = retrieve(key, { size: 3 });
  h.innerHTML = `<p>A conceptual six-message buffer. Real context limits use a specific tokenizer, not message counts.</p>${labRange("context-size", "Retained messages", 1, 6, 1, s.size)}<ol id="context-messages" class="context-messages"></ol><div id="context-result" class="sample-output"></div>${labFeedback}`;
  const run = () => {
    const size = +h.querySelector("input").value,
      cut = entries.length - size;
    h.querySelector("ol").innerHTML = entries
      .map(
        (e, i) =>
          `<li class="${i < cut ? "outside-context" : ""}">${E(e)} <small>${i < cut ? "outside buffer" : "available"}</small></li>`,
      )
      .join("");
    const available = cut <= 1;
    h.querySelector("#context-result").textContent = available
      ? "Evidence-backed continuation: the meeting is Thursday."
      : "Responsible continuation: the available messages do not specify the day. Ask for the missing information; a fluent guess would be unsupported.";
    say(
      h,
      "Truncation changes what is supplied to the generation step. This demonstration does not model commercial memory, retrieval, or training.",
    );
    saveLab(key, { size });
  };
  rangeEvents(h, run);
  run();
}
function citations(h, key) {
  const s = retrieve(key, { case: 0, choice: null, revealed: false });
  const cases = [
    {
      label: "Authentic publication",
      citation:
        "Vaswani, A., et al. (2017). Attention Is All You Need. arXiv:1706.03762.",
      claim:
        "This paper establishes that AI improves every student’s learning by 40%.",
      evidence:
        "The authoritative arXiv record identifies a transformer architecture paper and machine-translation evaluations. It does not establish this universal educational effect. A real source can be attached to an unsupported claim.",
      supported: false,
    },
    {
      label: "Explicitly fictional citation",
      citation:
        "Example, A., & Sample, B. (2099). Perfect teaching with infallible machines. Journal of Imaginary Evidence, 1, 1–9.",
      claim:
        "This citation proves that generated lesson plans never need review.",
      evidence:
        "This citation was invented for instruction and is labeled fictional. There is no claimed publication or evidence to support the assertion. Formatting cannot manufacture provenance.",
      supported: false,
    },
    {
      label: "Authentic publication",
      citation:
        "Lewis, P., et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. arXiv:2005.11401.",
      claim:
        "The paper describes a retrieval-augmented generation approach and evaluates it on knowledge-intensive tasks.",
      evidence:
        "The verified abstract describes combining parametric and non-parametric memory and evaluates knowledge-intensive NLP tasks. This supports the limited description; it does not guarantee that every retrieval-enabled answer is true.",
      supported: true,
    },
  ];
  let index = Number.isInteger(s.case) && s.case < 3 ? s.case : 0;
  const render = () => {
    const item = cases[index];
    h.innerHTML = `<div class="lab-actions">${cases.map((_, i) => labButton(`Case ${i + 1}`, `data-citation-case="${i}" aria-pressed="${i === index}"`)).join("")}</div><span class="lab-kind">${item.label}</span><blockquote>${E(item.citation)}</blockquote><p><strong>Claim:</strong> ${E(item.claim)}</p><div class="lab-actions">${labButton("Claim supported", 'data-support="yes"')}${labButton("Unsupported or unverifiable", 'data-support="no"')}${labButton("Reveal verification evidence", 'id="citation-reveal"')}</div>${labFeedback}`;
    h.querySelectorAll("[data-citation-case]").forEach(
      (b) =>
        (b.onclick = () => {
          index = +b.dataset.citationCase;
          saveLab(key, { case: index });
          render();
        }),
    );
    h.querySelectorAll("[data-support]").forEach(
      (b) =>
        (b.onclick = () => {
          const correct = (b.dataset.support === "yes") === item.supported;
          s.choice = b.dataset.support;
          saveLab(key, { case: index, choice: s.choice });
          say(
            h,
            `${correct ? "Your judgment fits the evidence." : "Reconsider the relationship between the source and this particular claim."} ${item.evidence}`,
          );
        }),
    );
    h.querySelector("#citation-reveal").onclick = () => say(h, item.evidence);
  };
  render();
}
function confidence(h, key) {
  const claims = [
    [
      "The fraction 1/8 is larger than 1/6 because 8 is larger than 6.",
      false,
      "For equal wholes, dividing into more equal parts makes each part smaller: 1/8 < 1/6. The confident “because” does not repair the mathematical error.",
    ],
    [
      "A real citation can be used in a summary that misrepresents the original source.",
      true,
      "Identity and support are different. Read the source’s actual method, results, and limitations.",
    ],
    [
      "A low sampling temperature guarantees that every factual statement is correct.",
      false,
      "Temperature changes selection probabilities, not whether an answer has been checked against reliable evidence.",
    ],
  ];
  let index = retrieve(key, { index: 0 }).index || 0;
  if (index > 2) index = 0;
  const render = () => {
    h.innerHTML = `<div class="lab-actions">${claims.map((_, i) => labButton(`Claim ${i + 1}`, `data-claim="${i}" aria-pressed="${i === index}"`)).join("")}</div><blockquote>“${E(claims[index][0])}”</blockquote><div class="lab-actions">${labButton("Accurate", 'data-accuracy="true"')}${labButton("Inaccurate", 'data-accuracy="false"')}</div>${labFeedback}`;
    h.querySelectorAll("[data-claim]").forEach(
      (b) =>
        (b.onclick = () => {
          index = +b.dataset.claim;
          saveLab(key, { index });
          render();
        }),
    );
    h.querySelectorAll("[data-accuracy]").forEach(
      (b) =>
        (b.onclick = () =>
          say(
            h,
            `${(b.dataset.accuracy === "true") === claims[index][1] ? "Correct." : "Reconsider the claim, independent of tone."} ${claims[index][2]}`,
          )),
    );
  };
  render();
}
function verification(h, key) {
  const steps = [
    "State the exact claim and its consequences.",
    "Locate the original publication and verify its identity.",
    "Read the relevant evidence and limitations.",
    "Cross-check material facts and document uncertainty.",
  ];
  let picked = retrieve(key, { picked: [] }).picked;
  if (!Array.isArray(picked) || picked.length > 4) picked = [];
  const render = () => {
    h.innerHTML = `<p>Build a defensible sequence. Another chatbot’s agreement is not independent source verification.</p><div class="verification-sequence">${picked.map((n, i) => `<p>${i + 1}. ${E(steps[n])}</p>`).join("") || "<p>No steps selected yet.</p>"}</div><div class="lab-actions">${[2, 0, 3, 1].map((i) => labButton(E(steps[i]), `data-verify-step="${i}" ${picked.includes(i) ? "disabled" : ""}`)).join("")}</div>${labFeedback}`;
    h.querySelectorAll("[data-verify-step]").forEach(
      (b) =>
        (b.onclick = () => {
          picked.push(+b.dataset.verifyStep);
          saveLab(key, { picked });
          render();
        }),
    );
    if (picked.length === 4)
      say(
        h,
        picked.every((v, i) => v === i)
          ? "A defensible order: identify the claim, locate its source, assess support, then corroborate and document limits. In practice you may revisit steps as evidence changes."
          : "The sequence needs revision. Define what you are checking before accepting a source; assess actual support before documenting a conclusion. Reset to try again.",
      );
  };
  render();
}
function support(h, key) {
  let s = retrieve(key, { choice: null, context: false });
  const feedbacks = {
    accept:
      "Accepting immediately may be an error of commission if the advice is wrong. A pattern does not establish its cause.",
    reject:
      "Rejecting automatically can also miss useful support. Appropriate reliance investigates evidence rather than assuming every recommendation is wrong.",
    investigate:
      "Investigation is the defensible first move: consult the learner respectfully, inspect access barriers, and involve qualified support staff.",
  };
  h.innerHTML = `<p class="case-badge">FICTIONAL STUDENT CASE · NO REAL RECORDS</p><div class="sample-output"><p>A grade 7 learner missed three online drafts. An automated system recommends a motivation contract.</p></div><div class="lab-actions">${labButton("Accept recommendation", 'data-support-action="accept"')}${labButton("Reject automatically", 'data-support-action="reject"')}${labButton("Investigate first", 'data-support-action="investigate"')}${labButton("Reveal additional context", 'id="support-context"')}</div><div id="support-context-output" class="sample-output" ${s.context ? "" : "hidden"}>The learner shares one device with siblings, and the submission widget does not work with their assistive technology. They completed a paper draft. These details were absent from the recommendation.</div>${labFeedback}`;
  h.querySelectorAll("[data-support-action]").forEach(
    (b) =>
      (b.onclick = () => {
        s.choice = b.dataset.supportAction;
        saveLab(key, s);
        say(
          h,
          feedbacks[s.choice] +
            (s.context
              ? " Address the access barrier, acknowledge the paper work, and avoid an unsupported motivation label."
              : " Reveal the missing context before deciding on an intervention."),
        );
      }),
  );
  h.querySelector("#support-context").onclick = () => {
    s.context = true;
    saveLab(key, s);
    h.querySelector("#support-context-output").hidden = false;
    say(
      h,
      "The recommendation omitted consequential context. Coordinate accessible submission and appropriate support. Do not enter this kind of real record into an unapproved tool.",
    );
  };
}
function error(h, key) {
  h.innerHTML = `<p class="case-badge">AUTHORED EXAMPLE OF A FLAWED AI-STYLE ITEM</p><blockquote>Which fraction is larger: 1/6 or 1/8?<br><strong>Generated key: 1/8, because its denominator is larger.</strong></blockquote><div class="lab-actions">${labButton("The key confuses denominator size with fraction magnitude", 'data-error="concept"')}${labButton("Only the grammar needs correction", 'data-error="grammar"')}${labButton("The item is ready to use", 'data-error="ready"')}</div>${labFeedback}`;
  h.querySelectorAll("[data-error]").forEach(
    (b) =>
      (b.onclick = () => {
        saveLab(key, { choice: b.dataset.error });
        say(
          h,
          b.dataset.error === "concept"
            ? "Correct. For the same whole, sixths are larger than eighths: 1/6 > 1/8. Correct the key, use a visual or number-line explanation, and check that the task assesses the intended concept."
            : "The conceptual error remains: 1/6 > 1/8. A larger denominator means smaller equal parts when the numerator and whole are held fixed. Polish is not evidence that an assessment is sound.",
        );
      }),
  );
}
function trust(h, key) {
  const s = retrieve(key, { rating: 3, revealed: false });
  h.innerHTML = `<p class="case-badge">REFLECTIVE CLASSROOM DEMONSTRATION · NOT A VALIDATED EXPERIMENT</p><blockquote>“Before assigning support, consult the learner and review the relevant classroom evidence.”</blockquote><p id="trust-label">Attributed to: ${s.revealed ? "an AI assistant (alternative label)" : "an experienced educator (initial label)"}</p>${labRange("trust-rating", "Willingness to rely", 1, 5, 1, s.rating)}<div class="lab-actions">${labButton("Show alternative attribution", 'id="trust-reveal"')}</div>${labFeedback}`;
  rangeEvents(h, () => {
    s.rating = +h.querySelector("input").value;
    saveLab(key, s);
  });
  h.querySelector("button").onclick = () => {
    s.revealed = true;
    saveLab(key, s);
    h.querySelector("#trust-label").textContent =
      "Alternative label: an AI assistant. The advice itself has not changed.";
    say(
      h,
      "Would the label change your rating? This demonstrates a question about attribution, not a measured bias or a diagnosis. Consider evidence, expertise, context, and accountability before relying on either source.",
    );
  };
}
function allocation(h, key) {
  const tasks = [
    [
      "Draft alternative wording for a non-sensitive newsletter.",
      "assist",
      "Substantial assistance can be appropriate, but factual claims, tone, and access still need review.",
    ],
    [
      "Give formative feedback on a learner’s argument.",
      "led",
      "Human-led with support: retain disciplinary judgment, suitable data handling, and a route to discuss feedback.",
    ],
    [
      "Determine disability-service eligibility or a safeguarding response.",
      "central",
      "Accountable professionals and required institutional processes remain central. A model is not the decision owner.",
    ],
  ];
  const s = retrieve(key, { choices: {} });
  h.innerHTML = `<p>Choose a defensible default. These are contextual teaching categories, not universal legal rules.</p>${tasks.map(([task], i) => `<label class="lab-label" for="allocate-${i}">${task}<select id="allocate-${i}" data-allocation="${i}"><option value="">Choose a collaboration pattern</option><option value="assist">AI can assist substantially</option><option value="led">Human-led with AI support</option><option value="central">Human responsibility must remain central</option></select></label>`).join("")}${labFeedback}`;
  h.querySelectorAll("select").forEach((sel) => {
    sel.value = s.choices[sel.dataset.allocation] || "";
    sel.onchange = () => {
      const i = +sel.dataset.allocation;
      s.choices[i] = sel.value;
      saveLab(key, s);
      say(
        h,
        `${sel.value === tasks[i][1] ? "A defensible default." : "Consider the task’s stakes and required judgment."} ${tasks[i][2]} Conditions can change the allocation; explain your rationale.`,
      );
    };
  });
}
function models(h, key) {
  const cases = {
    human: [
      "Human-only work",
      "The teacher drafts directly and checks the materials. This preserves direct engagement but still takes time and can contain mistakes. Examine learner access and independent understanding.",
    ],
    uncritical: [
      "Uncritically accepted AI output",
      "A polished draft arrives quickly, but a factual error and inaccessible formatting go unnoticed. Time to first draft hides downstream review costs and learner barriers. This is a fictional outcome.",
    ],
    directed: [
      "Human-directed collaboration",
      "The teacher requests alternatives, verifies claims, adapts access, discloses material assistance, and checks student reasoning. This may be useful, but costs review time and is not guaranteed to outperform a non-AI approach.",
    ],
  };
  h.innerHTML = `<p class="case-badge">FICTIONAL COMPARISON · NO EMPIRICAL EFFECT SIZES</p><div class="lab-actions">${Object.entries(
    cases,
  )
    .map(([id, [title]]) =>
      labButton(title, `data-model="${id}" aria-pressed="false"`),
    )
    .join(
      "",
    )}</div><div id="collaboration-comparison" class="sample-output"></div>${labFeedback}`;
  const run = (id) => {
    h.querySelectorAll("button").forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.model === id),
    );
    h.querySelector("#collaboration-comparison").textContent = cases[id][1];
    say(
      h,
      "Compare accuracy, accessibility, privacy, total work, and evidence of learning. The most polished product is not automatically the best process.",
    );
    saveLab(key, { choice: id });
  };
  h.querySelectorAll("button").forEach(
    (b) => (b.onclick = () => run(b.dataset.model)),
  );
  run(cases[retrieve(key, {}).choice] ? retrieve(key, {}).choice : "human");
}
function principles(h, key) {
  const entries = [
    [
      "verification",
      "Verification",
      "Check material claims against reliable evidence.",
    ],
    [
      "accountability",
      "Accountability",
      "Name the person who can change or stop the decision.",
    ],
    [
      "privacy",
      "Privacy",
      "Use only approved tools and minimize sensitive information.",
    ],
    [
      "equity",
      "Equity",
      "Inspect who benefits, who is excluded, and who can appeal.",
    ],
    [
      "transparency",
      "Transparency",
      "Explain meaningful assistance and its limits.",
    ],
    [
      "accessibility",
      "Accessibility",
      "Test actual workflows with learners and specialists.",
    ],
    [
      "agency",
      "Learner agency",
      "Require accessible evidence of the thinking the learner must own.",
    ],
  ];
  const s = retrieve(key, { selected: [] });
  h.innerHTML = `<p>Select values to build an actionable classroom protocol.</p><div class="principle-grid">${entries.map(([id, label]) => `<label class="lab-check"><input type="checkbox" value="${id}" ${s.selected.includes(id) ? "checked" : ""}>${label}</label>`).join("")}</div><ol id="principle-protocol"></ol>${labFeedback}`;
  const run = () => {
    s.selected = [...h.querySelectorAll("input:checked")].map((e) => e.value);
    h.querySelector("ol").innerHTML = entries
      .filter(([id]) => s.selected.includes(id))
      .map(
        ([, label, action]) => `<li><strong>${label}:</strong> ${action}</li>`,
      )
      .join("");
    say(
      h,
      s.selected.length === 7
        ? "You have a broad protocol. Add owners, feasible review time, and evidence of learning. A checklist alone cannot establish ethical use."
        : `${s.selected.length} principles selected. Consider what risk is left uncovered; then connect the chosen values to an actual practice, owner, and review point.`,
    );
    saveLab(key, s);
  };
  h.querySelectorAll("input").forEach((e) => (e.onchange = run));
  run();
}
function assessment(h, key, c) {
  const items = chapterQuestions[c.id];
  const s = retrieve(key, { answers: {}, revealed: {} });
  h.innerHTML = `<p>Three progressively applied questions. Choose, explain your reasoning, then reveal feedback. Your answers remain local.</p>${items.map(([q, options], i) => `<fieldset class="question-block"><legend>${i + 1}. ${E(q)}</legend>${options.map((text, j) => `<label class="lab-check"><input type="radio" name="question-${c.id}-${i}" value="${j}" data-question="${i}" ${s.answers[i] === j ? "checked" : ""}>${E(text)}</label>`).join("")}${labButton("Reveal answer & explanation", `data-reveal-question="${i}"`)}<div class="question-feedback" id="question-feedback-${i}" role="status" hidden></div></fieldset>`).join("")}<p class="assessment-status" role="status"></p>`;
  const show = (i) => {
    const out = h.querySelector("#question-feedback-" + i);
    out.hidden = false;
    const picked = s.answers[i],
      correct = items[i][2];
    out.textContent =
      picked === undefined
        ? "Choose an answer first; explain why before revealing feedback."
        : `${picked === correct ? "Your answer is correct." : "Reconsider your answer."} Correct response: ${items[i][1][correct]} ${items[i][3]}`;
    if (picked !== undefined) {
      s.revealed[i] = true;
      saveLab(key, s);
    }
    h.querySelector(".assessment-status").textContent =
      `${Object.keys(s.revealed).length} of 3 explanations reviewed. Use reasoning, not the count alone, as evidence of understanding.`;
  };
  h.querySelectorAll("input").forEach(
    (input) =>
      (input.onchange = () => {
        const i = +input.dataset.question;
        s.answers[i] = +input.value;
        delete s.revealed[i];
        saveLab(key, s);
        h.querySelector("#question-feedback-" + i).hidden = true;
        h.querySelector(".assessment-status").textContent =
          `${Object.keys(s.revealed).length} of 3 explanations reviewed. Reveal feedback again after changing an answer.`;
      }),
  );
  h.querySelectorAll("[data-reveal-question]").forEach(
    (b) => (b.onclick = () => show(+b.dataset.revealQuestion)),
  );
  Object.keys(s.revealed).forEach((i) => show(+i));
}
