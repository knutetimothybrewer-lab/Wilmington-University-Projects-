const WEEKS = [
  {
    n: 0,
    phase: "Understand",
    title: "Orientation",
    short: "Orientation",
    hook: "What does 'AI' actually mean?",
    underTheHood: "AI vs. machine learning vs. generative AI",
    topics: [
      "The driving question",
      "AI you already use: spellcheck, captions, read-aloud",
      "How the course works",
    ],
    build: "Set up your accounts and post a 'My AI starting point' reflection",
    outcome: "Shared vocabulary and a clear starting point",
  },
  {
    n: 1,
    phase: "Understand",
    title: "How AI Works and Hallucinations",
    short: "How AI works",
    hook: "Why can confident text be completely wrong?",
    underTheHood: "Tokens and next-word prediction",
    topics: [
      "Four types of AI systems: rule-based, adaptive, generative, agentic",
      "Hallucinations and automation bias",
      "Human vs. artificial intelligence",
    ],
    build:
      "Hallucination Hunt: generate a reading passage and answer key, then find and fix every error",
    outcome: "You can predict where AI goes wrong and catch it",
  },
  {
    n: 2,
    phase: "Understand",
    title: "Good Inputs, Good Evaluation",
    short: "Good inputs",
    hook: "Same AI, wildly different results. What changed?",
    underTheHood: "Context windows: the AI only knows what you give it",
    topics: [
      "The five-part prompt framework",
      "Evaluating accuracy, credibility, bias, reliability, educational value",
      "Lateral reading and source checking",
    ],
    build:
      "A prompt library of 5 tested templates plus a credibility check of three AI-cited sources",
    outcome: "A reusable toolkit of prompts you trust",
  },
  {
    n: 3,
    phase: "Design",
    title: "Human-Centered Lesson Design with UDL",
    short: "Lesson design",
    hook: "Start with learners, not the tool.",
    underTheHood:
      "Grounding answers in sources can reduce errors but does not eliminate the need for verification",
    topics: [
      "Universal Design for Learning with AI",
      "Culturally responsive, relational teaching",
      "When NOT to use AI",
    ],
    build:
      "A UDL lesson plan for a real lesson, with a matching slide deck and one-page teaching guide",
    outcome: "A classroom-ready lesson package",
  },
  {
    n: 4,
    phase: "Design",
    title: "Exceptionalities, Accessibility, and Differentiation",
    short: "Access for all",
    hook: "Who does this tool help, and who might it miss?",
    underTheHood: "Bias: training data shapes defaults and assumptions",
    topics: [
      "AI and assistive technology",
      "Accommodations vs. modifications",
      "Algorithmic bias and equity of access",
    ],
    build:
      "One material in three readiness levels plus an accommodated version for a fictional student profile",
    outcome: "Materials that work for more of your students",
  },
  {
    n: 5,
    phase: "Design",
    title: "Assessment in AI-Rich Environments",
    short: "Assessment",
    hook: "If students have AI, what are we really measuring?",
    underTheHood:
      "Why AI should not be the final grader, and why AI detectors are unreliable",
    topics: [
      "Redesigning assessments to make thinking visible",
      "Academic integrity",
      "Student-facing AI tools with teacher oversight",
    ],
    build:
      "Redesign one assessment to be AI-resilient and set up one student-facing AI practice activity",
    outcome: "Assessments that still measure real learning",
  },
  {
    n: 6,
    phase: "Lead",
    title: "Ethics, Law, Privacy, and Choosing Tools",
    short: "Ethics and law",
    hook: "Where does your data actually go?",
    underTheHood: "What 'not used for training' does and does not mean",
    topics: [
      "FERPA, IDEA, and student privacy",
      "Copyright and ownership",
      "Course guardrails: educators retain responsibility for grades, placements, and IEP decisions",
    ],
    build:
      "Draft a classroom AI use policy and family letter, then vet one student-facing tool with the evaluation rubric",
    outcome: "A defensible, policy-aware approach",
  },
  {
    n: 7,
    phase: "Lead",
    title: "Leadership, the Future, and Capstone",
    short: "Capstone",
    hook: "What happens after the course ends?",
    underTheHood: "Agents and automation: AI that carries out multi-step tasks",
    topics: [
      "Future trends and how to evaluate claims",
      "Metacognitive modeling: thinking aloud while checking AI",
      "Organizational readiness and monitoring",
    ],
    build:
      "Capstone: a school AI implementation plan, a student AI literacy lesson, and a 10-minute video",
    outcome: "Your AI Teaching Portfolio and a plan to lead",
  },
];

// EDIT COURSE SETTINGS: use an approved original logo file; leave blank for the text label.
const COURSE_START_URL = "";
const COURSE_START_TARGET = "_top";
const LOGO_SRC = "";
const ASSESSMENT = [
  {
    label: "Weekly builds",
    pct: 35,
    detail: "Practical artifacts you build, verify, and improve each week.",
  },
  {
    label: "Discussion and peer feedback",
    pct: 15,
    detail: "AI Field Notes and two thoughtful peer replies.",
  },
  {
    label: "Tool evaluation and AI use policy",
    pct: 15,
    detail:
      "Evaluate a student-facing tool and establish responsible classroom use.",
  },
  {
    label: "Weekly concept checks",
    pct: 10,
    detail:
      "Check your understanding of how AI works and where its limits are.",
  },
  {
    label: "Capstone plan and video",
    pct: 25,
    detail:
      "Bring your school implementation plan together in a recorded 10-minute presentation.",
  },
];
const PERSONAS = {
  teacher: {
    weeks: [2, 3, 5],
    outcomes: [2, 4],
    message:
      "Bring your classroom experience. Leave with lessons, materials, and assessments you have built and checked.",
  },
  special: {
    weeks: [3, 4, 6],
    outcomes: [1, 4],
    message:
      "Your knowledge of individual learners comes first. Explore more ways to offer access, support, and choice.",
  },
  leader: {
    weeks: [6, 7],
    outcomes: [3, 5],
    message:
      "Build on your leadership. Develop a thoughtful plan to support colleagues and protect learners.",
  },
};
const ARTIFACTS = [
  { week: 2, title: "Prompt templates", type: "Reusable toolkit", mark: "01" },
  { week: 3, title: "Lesson plan", type: "Learners first", mark: "02" },
  { week: 3, title: "Slide deck", type: "Clear & accessible", mark: "03" },
  { week: 3, title: "Teaching guide", type: "Ready to teach", mark: "04" },
  {
    week: 4,
    title: "Differentiated materials",
    type: "More ways to learn",
    mark: "05",
  },
  {
    week: 6,
    title: "AI use policy",
    type: "Trust & responsibility",
    mark: "06",
  },
  {
    week: 7,
    title: "Implementation plan",
    type: "A thoughtful next step",
    mark: "07",
  },
  {
    week: 7,
    title: "Capstone video",
    type: "Your 10-minute story",
    mark: "08",
  },
];
