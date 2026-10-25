export const chapterRegistry = [
  {
    id: "discovery",
    number: 1,
    name: "AI Discovery Center",
    topic: "Four kinds of AI",
    subtitle: "Discover the systems behind the intelligence.",
    accent: "#d6a744",
    minutes: 15,
    position: { x: 560, y: 310 },
    door: { x: 575, y: 427 },
    kind: "museum",
    essentialQuestion:
      "What changes when a computer learns patterns from examples rather than simply following programmed instructions?",
    objectives: [
      "Distinguish explicit rules from learned patterns.",
      "Recognize that deep learning is a subset of machine learning.",
      "Locate generative tasks within this overlapping landscape.",
    ],
    qualification:
      "These are instructional categories, not mutually exclusive scientific classifications. Deep learning is a subset of machine learning; modern generative AI often uses deep neural networks.",
    narration:
      "Begin by asking participants where they already encounter AI. Use the four exhibit stations to preview the distinctions we will develop in the chapter.",
    analogy:
      "A written recipe and a cook learning from examples suggest different ways of building a system; neither analogy fully describes a computational model.",
    misconception:
      "The four categories are separate, equivalent branches of a scientific taxonomy.",
    discussion:
      "Which familiar classroom tool follows explicit rules, and which may rely on learned patterns?",
    scenes: [
      {
        id: "arrival",
        name: "The discovery hall",
        eyebrow: "The first question",
        title: "What makes a machine intelligent?",
        body: "Enter a museum of different approaches to AI. The four exhibit stations introduce explicit rules, learned patterns, deep networks, and generation.",
        stage: "overview",
      },
      {
        id: "orientation",
        name: "Four connected approaches",
        eyebrow: "A conceptual preview",
        title: "Different approaches. Overlapping ideas.",
        body: "Rules are explicitly specified. Machine learning learns statistical patterns. Deep learning uses multilayer neural networks. Generative systems produce new outputs. These ideas overlap.",
        stage: "exhibits",
      },
      {
        id: "reflection",
        name: "A question to carry forward",
        eyebrow: "Pause & discuss",
        title: "Where does the pattern come from?",
        body: "What changes when a computer learns patterns from examples rather than simply following programmed instructions?",
        stage: "reflection",
      },
    ],
    plannedLabs: [
      "IF–THEN rule machine",
      "Example-data classifier",
      "Adjustable neural network",
      "Generative task demonstrator",
    ],
    references: [],
  },
  {
    id: "language",
    number: 2,
    name: "Language Machine",
    topic: "Token by token",
    subtitle: "Travel inside the process of generation.",
    accent: "#5b9da6",
    minutes: 20,
    position: { x: 910, y: 245 },
    door: { x: 915, y: 365 },
    kind: "lab",
    essentialQuestion:
      "What does token-by-token generation explain, and what questions about understanding remain unresolved?",
    objectives: [
      "Distinguish model training from inference.",
      "Connect context, tokenization, and generation.",
      "Recognize why fluent output does not establish accuracy.",
    ],
    qualification:
      "The token streams in this foundation are conceptual artwork, not a tokenizer or a running language model. No numerical model probabilities are claimed.",
    narration:
      "Use the monitor as a doorway into the language machine. Preview the difference between producing plausible continuations and verifying a factual claim.",
    analogy:
      "Completing a sentence suggests conditional continuation, but next-token prediction alone is not a complete explanation of model capabilities.",
    misconception: "A fluent continuation must be a verified fact.",
    discussion:
      "What would you still need to check after receiving a beautifully written answer?",
    scenes: [
      {
        id: "arrival",
        name: "The computing laboratory",
        eyebrow: "Enter the language machine",
        title: "An answer begins with a continuation.",
        body: "Approach a research terminal. Beyond its screen is a conceptual landscape of context, tokens, attention, and possible continuations.",
        stage: "overview",
      },
      {
        id: "orientation",
        name: "Beyond the monitor",
        eyebrow: "A conceptual preview",
        title: "Context shapes what comes next.",
        body: "The floating words illustrate a sequence, not outputs from a model. Tokenization, context windows, attention, and sampling will become adjustable laboratories in a later chapter release.",
        stage: "exhibits",
      },
      {
        id: "reflection",
        name: "Fluency and understanding",
        eyebrow: "Pause & discuss",
        title: "What does a fluent answer leave unresolved?",
        body: "If a system generates a response token by token, what can that explain—and what evidence of understanding or accuracy is still missing?",
        stage: "reflection",
      },
    ],
    plannedLabs: [
      "Approximate tokenizer",
      "Illustrative next-token predictor",
      "Temperature simulation",
      "Context window experiment",
    ],
    references: [],
  },
  {
    id: "library",
    number: 3,
    name: "Digital Library",
    topic: "Hallucinations",
    subtitle: "Follow the evidence, beyond the convincing answer.",
    accent: "#9b839f",
    minutes: 12,
    position: { x: 1200, y: 380 },
    door: { x: 1205, y: 495 },
    kind: "library",
    essentialQuestion:
      "Why might a capable language model produce a persuasive explanation that is factually incorrect?",
    objectives: [
      "Separate plausibility from verification.",
      "Identify why provenance matters.",
      "Plan a source-checking workflow.",
    ],
    qualification:
      "Floating citations are schematic labels, not references to real publications. Verified and fictional citation activities are deferred until their evidence is checked.",
    narration:
      "Invite participants to notice how typography and citation format create authority. Ask what evidence would establish that a source exists and supports a claim.",
    analogy:
      "A convincing-looking library catalog entry is not the same as locating and reading the source.",
    misconception: "A complete-looking citation proves that a source exists.",
    discussion:
      "What is the difference between finding a source and verifying that it supports the claim?",
    scenes: [
      {
        id: "arrival",
        name: "The research library",
        eyebrow: "Beyond plausibility",
        title: "A convincing answer is only the beginning.",
        body: "Walk into a research library of claims, citations, and evidence. This is a place to ask where an answer came from and whether its support can be checked.",
        stage: "overview",
      },
      {
        id: "orientation",
        name: "The provenance desk",
        eyebrow: "A conceptual preview",
        title: "Trace the claim back to its source.",
        body: "Verification asks whether a source exists, whether it says what is claimed, and whether its evidence fits the educational use. Retrieval can help, but does not eliminate the need to check.",
        stage: "exhibits",
      },
      {
        id: "reflection",
        name: "The verification question",
        eyebrow: "Pause & discuss",
        title: "What would count as evidence?",
        body: "A plausible explanation includes a polished citation. What steps would you take before sharing it with students?",
        stage: "reflection",
      },
    ],
    plannedLabs: [
      "Citation detective",
      "Confidence versus accuracy",
      "Research verification challenge",
    ],
    references: [],
  },
  {
    id: "observatory",
    number: 4,
    name: "Decision Observatory",
    topic: "Automation bias",
    subtitle: "Keep professional judgment in the loop.",
    accent: "#d28b69",
    minutes: 10,
    position: { x: 1050, y: 630 },
    door: { x: 1050, y: 731 },
    kind: "observatory",
    essentialQuestion:
      "When does AI support professional judgment, and when does reliance begin to replace it?",
    objectives: [
      "Distinguish automation bias from algorithmic bias.",
      "Notice overreliance in consequential decisions.",
      "Identify opportunities for human investigation.",
    ],
    qualification:
      "The holographic school indicators are illustrative artwork. They are not student data, recommendations from an AI system, or a validated psychological experiment.",
    narration:
      "Frame this environment around decisions, not technology features. Invite learners to explain what they would investigate before acting on a recommendation.",
    analogy:
      "A navigation app can inform a route, but a driver still needs to notice a closed road.",
    misconception:
      "A recommendation is objective merely because it comes from a computer.",
    discussion:
      "What contextual information might be missing from an automated recommendation?",
    scenes: [
      {
        id: "arrival",
        name: "The school observatory",
        eyebrow: "The human decision",
        title: "A recommendation is not a responsibility.",
        body: "Enter a simulated educational decision space. AI can suggest a direction; educators remain responsible for understanding the context and consequences.",
        stage: "overview",
      },
      {
        id: "orientation",
        name: "The oversight station",
        eyebrow: "A conceptual preview",
        title: "Investigate before you act.",
        body: "Automation bias concerns overreliance on automated advice. Algorithmic bias concerns patterns of unfairness in systems or outcomes. They are related concerns, but not the same phenomenon.",
        stage: "exhibits",
      },
      {
        id: "reflection",
        name: "The judgment question",
        eyebrow: "Pause & discuss",
        title: "What would make you question the recommendation?",
        body: "When a tool and your professional judgment disagree, what evidence should you gather before deciding?",
        stage: "reflection",
      },
    ],
    plannedLabs: [
      "Student-support recommendation",
      "AI assessment error",
      "Attribution and trust demonstration",
    ],
    references: [],
  },
  {
    id: "collaboration",
    number: 5,
    name: "Collaboration Center",
    topic: "Human and machine",
    subtitle: "Design a future that keeps people at its center.",
    accent: "#78a27f",
    minutes: 10,
    position: { x: 465, y: 610 },
    door: { x: 465, y: 711 },
    kind: "collaboration",
    essentialQuestion:
      "What should students still learn and demonstrate independently when AI can produce an answer?",
    objectives: [
      "Consider complementary human and machine capabilities.",
      "Preserve human agency and responsibility.",
      "Connect verification, privacy, accessibility, and learning.",
    ],
    qualification:
      "The collaboration pathways are a conceptual preview. A complete ethical framework, sorting activity, and comparison laboratory will be developed with this chapter.",
    narration:
      "Reconnect all five buildings: understand systems, investigate output, notice limitations, retain judgment, and design responsible collaboration.",
    analogy:
      "A collaborator can help generate options; the educator must still judge whether those options serve learners.",
    misconception:
      "If a tool can produce a polished product, the learner no longer needs to understand the work.",
    discussion:
      "Which intellectual responsibility should remain with the learner even when a tool supports expression?",
    scenes: [
      {
        id: "arrival",
        name: "The shared learning laboratory",
        eyebrow: "Human-directed possibility",
        title: "Better tools. Thoughtful human direction.",
        body: "The journey ends in a shared workspace. Bring together AI capabilities, educator expertise, learner agency, and the responsibilities that cannot be delegated.",
        stage: "overview",
      },
      {
        id: "orientation",
        name: "The collaboration table",
        eyebrow: "A conceptual preview",
        title: "Assistance should strengthen agency.",
        body: "AI may support drafting, comparison, or access. People remain responsible for consequential judgments, privacy, fairness, relationships, and the purpose of learning.",
        stage: "exhibits",
      },
      {
        id: "reflection",
        name: "The closing reflection",
        eyebrow: "Carry the question forward",
        title: "What should learners still do themselves?",
        body: "AI literacy is not simply knowing how to use AI. It involves understanding how it works, evaluating outputs, recognizing limitations, and exercising responsible human judgment.",
        stage: "reflection",
      },
    ],
    plannedLabs: [
      "Who should do the work?",
      "Three collaboration models",
      "Responsible AI principles",
    ],
    references: [],
  },
].map((c) => ({
  ...c,
  status: "foundation",
  explanations: c.scenes.map((s) => s.body),
  technicalExplanations: [c.qualification],
  analogies: [c.analogy],
  misconceptions: [c.misconception],
  discussionQuestions: [c.discussion],
  assessments: [],
  simulations: [],
  transitions: { enter: "walk-door-zoom", exit: "pullback" },
  timing: { suggestedMinutes: c.minutes },
  instructorNotes: {
    narration: c.narration,
    facilitation:
      "Ask for a concrete example and invite a contrasting interpretation. This release is a foundation walkthrough, not the full 75-minute lesson.",
    next: "Return to the campus or select another chapter. No scene advances automatically.",
  },
}));
export const getChapter = (id) => chapterRegistry.find((c) => c.id === id);
export const defaultPacing = {
  opening: 5,
  chapters: [15, 20, 12, 10, 10],
  closing: 3,
  total: 75,
};
