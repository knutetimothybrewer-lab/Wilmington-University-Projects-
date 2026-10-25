'use strict';
/* =====================================================================
   LITE EDITION CONTENT: plain language, no math, mechanism-first.
   Same scene format as the full edition (see content1.js for the field list).
   Extra field: concept.steps = [[title, plain description], ...] with visual:'steps'
   Extra field: concept.labels = {def:'The idea', ...} renames the tabs.
   ===================================================================== */
const L_LABELS={def:'The idea',analogy:'Everyday example',mechanism:'Step by step',classroom:'In school',misconception:'Common mix-up',discuss:'Talk about it',check:'Quick check'};

/* ---------------------------- CHAPTER 0 · WELCOME ---------------------------- */
CHAPTERS.push({
  id:0,key:'campus',title:'Welcome to Campus',short:'Campus',env:'campus',fx:'campus',
  essential:'What do I need to know about AI to make good decisions in my classroom?',
  objectives:['See the five ideas this session covers.','Share what you already believe about AI.'],
  summary:['AI is not magic and not a mind: it is tools that follow rules, learn patterns from examples, or build new text and images.','Today: five buildings, five short ideas, each with something you can try.'],
  refs:['long2020','miao2023'],
  guide:{facilitation:'Assume no prior knowledge. Welcome questions of any kind. If you hear jargon in the room, ask the speaker to say it again in everyday words.',transitions:'Open the map, then walk to Building 1.'},
  scenes:[
    {id:'open',type:'cinema',cine:'opening',title:'Welcome',minutes:1,
     cap:['Welcome to campus. No experience with AI needed.','Our student guide will show us how AI really works.','Five buildings. Five ideas. Let’s start walking.'],
     notes:{say:'"Welcome. You do not need any background in AI. We will walk through five short stops, and at each one you will try something hands-on. There are no wrong questions."',demo:'A short animated welcome. Press S to skip.',transition:'Press → for the roadmap.'}},
    {id:'objectives',type:'concept',title:'Our Five Stops',minutes:2,station:420,
     concept:{term:'Five ideas about AI',labels:L_LABELS,
       def:'AI is a set of computer tools. Some follow rules people wrote. Some find patterns in examples. Some write or draw new things. Today we look inside each one so you can decide when to trust it and when to check it.',
       analogy:'Think of a campus tour. You learn more by walking into each building and trying things than by reading a brochure.',
       mechanism:'Each building has a short explanation and something to try. The instructor steers. Later you can explore on your own at your own pace.',
       classroom:'You do not need to become a programmer. You need enough understanding to ask good questions of a tool, a vendor, a colleague or a student.',
       misconception:'Many people think AI is either magic or dangerous. Mostly, it is software with specific strengths and specific weak spots, and that is what we will look at.',
       check:{q:'What is the goal of today’s session?',opts:['Learn to program AI','Understand how AI works well enough to use it wisely and check it','Decide that AI should be banned','Memorize technical terms'],ans:1,why:'The goal is practical understanding for your own decisions, not programming or memorizing vocabulary.'},
       visual:'roadmap'},
     notes:{say:'"Five stops. At each one: a simple idea, something to try, and a quick check."',facilitate:'Invite a quick show of hands: who has used an AI chatbot? Who has never tried one? Normalize both.',transition:'Next: one quick warm-up.'}},
    {id:'warmup',type:'discuss',title:'Warm-Up',minutes:1,station:900,
     prompts:['In your own words, finish this sentence: "AI is ______."','Where might you have already used AI without calling it that? (spell check, maps, video suggestions)'],
     moves:['Collect answers without judging them. You will return to them at the end.','Listen for words like magic, robot, brain, search engine: these are useful starting points.'],
     notes:{say:'"There are no wrong answers. I just want to hear where we are starting."',transition:'Open the map and head to Building 1.'}},
    {id:'hub',type:'hub',title:'Campus Hub',minutes:0,notes:{say:'Click a building sign, or press → to walk to the next one.'}}
  ]
});

/* ---------------------------- CHAPTER 1 · KINDS OF AI ---------------------------- */
CHAPTERS.push({
  id:1,key:'discovery',title:'The AI Discovery Center',short:'Kinds of AI',env:'museum',fx:'museum',door:1,topic:'Kinds of AI',
  essential:'What is different between a computer that follows instructions and one that learns from examples?',
  objectives:['Tell apart rule-following, learning from examples, and creating new content.','See that a learning system changes when its examples change.','Explain why that matters when a school adopts a tool.'],
  summary:['Rule-following: a person writes every rule. Easy to inspect, but it only covers what the writer thought of.','Learning from examples: the computer finds patterns in examples. Good examples matter a lot.','Creating: some AI builds new text or images, one small piece at a time.'],
  refs:['mitchell1997','kasneci2023'],
  guide:{facilitation:'Let people try each demo before you explain it. Ask "What do you think will happen?" first.',transitions:'Bridge: "A chatbot is the third kind. How does it write? Next building."',qual:['These three groups are a teaching simplification. Real systems often combine them.','The demos are tiny. Real systems use far more data and are far more complex.']},
  scenes:[
    {id:'c1-overview',type:'concept',title:'Three Ways a Computer Can Seem Smart',minutes:2,station:420,
     concept:{term:'Rules, learning and creating',labels:L_LABELS,
       def:'Some AI follows rules a person wrote. Some AI learns patterns from examples. Some AI creates new text or images. All three are called AI, but they work very differently.',
       analogy:'A recipe card (follow the steps), an apprentice who tastes hundreds of dishes and learns what works (learn from examples), and a chef who invents a new dish in that style (create).',
       classroom:'A rule: "Email a reminder when homework is 3 days late." Learning: software that studies past student data to spot who may need help. Creating: a chatbot that drafts a rubric.',
       misconception:'"AI is one thing." It is really a family of different tools. Questions that make sense for one kind (Who wrote the rules?) do not fit another (What examples did it learn from?).',
       steps:[['Rules','A person writes: IF this, THEN that. The computer only does what the rules say.'],['Learning from examples','People supply many examples. The computer finds patterns and uses them on new cases.'],['Creating new things','The computer has learned what text or images usually look like, and builds new ones.']],
       check:{q:'Which one is learning from examples?',opts:['IF attendance < 80% THEN send an alert','Software studies thousands of past cases and finds patterns that predict who needs help','A calculator adding numbers','A fixed spelling list'],ans:1,why:'Learning systems discover their own patterns from examples. The first option is a rule a person wrote.'},
       visual:'steps',demo:'c1-rules'},
     notes:{say:'"Three kinds. A recipe, an apprentice, and a chef. Let’s try each."',demo:'Click the steps on the right to walk through the three kinds.',facilitate:'Ask for an example of each kind from their own school.',misc:'That these are rigid boxes. Many products mix them.',caveat:'Simplification for teaching.',transition:'"First, rules."'}},
    {id:'c1-rules',type:'lab',title:'Try It: A Rule Machine',minutes:2,station:420,sim:'rules',
     lab:{purpose:'See a system that only does what its rules say.',steps:['Move the student sliders and watch which rule fires.','Change a rule number a little (for example 80 to 79). See how students are treated differently.','Look for students that no rule covers.'],prompt:'Who is responsible when two nearly identical students get different results?',classroom:'Gradebook alerts, filters and reminders are often rule-based.'},
     notes:{say:'"Every decision here can be traced to a rule you can read. That is a strength. The weakness: it only knows what someone thought of."',demo:'Real rule engine on made-up students. First matching rule wins.',facilitate:'Invite someone to try to break the rules.',caveat:'Made-up student data.',transition:'"What if we do not know the rules, but we have examples?"'}},
    {id:'c1-knn',type:'lab',title:'Try It: Learning From Examples',minutes:3,station:820,sim:'knn',
     lab:{purpose:'Watch a computer find a pattern from examples, and see how it changes when the examples change.',steps:['Notice the green and orange areas: the computer drew them from the examples.','Click "Move test point" and click somewhere: see how the computer decides.','Try "Mislabeled examples" and "Unrepresentative sample". See how the result changes.','Add your own examples.'],prompt:'The computer’s method never changed, only the examples. What does that say about who is responsible for a learning tool?',classroom:'A tool trained on past students inherits any gaps or mistakes in past records.'},
     notes:{say:'"Nobody typed the rule. The computer worked it out from examples. Now let’s see how easily it can be misled."',demo:'A real (very simple) learning method: a new point is labelled by the three most similar examples.',facilitate:'Ask for a prediction before each preset: "Which way will the boundary move?"',misc:'"More data always fixes it." Not if the data is wrong or one-sided.',caveat:'Real systems are far larger, but depend on their examples in the same way.',transition:'"Now the third kind: creating."'}},
    {id:'c1-gen',type:'lab',title:'Try It: Picking vs. Creating',minutes:2,station:1220,sim:'gen',
     lab:{purpose:'Compare choosing from a fixed menu with building something new.',steps:['On the left, change the sentence and see the single label it gets.','On the right, press Generate several times.','Notice: which side can say something it has never seen before?'],prompt:'Why is it harder to check a created answer than a menu choice?',classroom:'Drafting a rubric or email has many acceptable answers, so checking takes judgment.'},
     notes:{say:'"The left side picks from a menu. The right side builds a sentence one word at a time."',demo:'A tiny word-by-word generator built from 11 teacher comments. It really runs.',facilitate:'Ask: "Is the generated sentence true?" That question leads into Chapter 3.',caveat:'Much simpler than real chatbots.',transition:'"Quick check, then we visit the Language Lab."'}},
    {id:'c1-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l1a',level:'Warm-up',kind:'Multiple choice',q:'What is the main difference between a rule-following system and a learning system?',opts:['Learning systems are always more accurate','A person writes the rules in one; the other finds patterns in examples','Rule systems use the internet','There is no difference'],ans:1,why:'In rule systems people write the logic. In learning systems the pattern comes from examples, so the examples matter a great deal.'},
      {id:'l1b',level:'Think it through',kind:'Scenario',q:'A tool learned from five years of school records, but most records came from one type of school. What is the most reasonable concern?',opts:['None: more data is always better','It may work poorly for students unlike those in the examples','The tool will refuse to run','It must be a rule-based tool'],ans:1,why:'A learning tool reflects its examples. If they are one-sided, the tool may be less reliable for others.'},
      {id:'l1c',level:'Reflect',kind:'Reflection',reflect:true,q:'What changes when a computer learns from examples instead of following instructions?',points:['Behavior comes from the examples, not from written rules.','Mistakes or gaps in the examples can become mistakes in the tool.','Someone needs to check how it performs for different students.']}],
     notes:{say:'Give people a moment to think, then reveal and discuss.',facilitate:'Press A to reveal an answer.'}},
    {id:'c1-nn',type:'lab',title:'Optional: Inside a Neural Network',minutes:2,optional:true,station:1620,sim:'nn',
     lab:{purpose:'Optional. See how many simple steps stacked together can produce a result.',steps:['Move the three sliders and watch the numbers flow left to right.','Click a circle to see how its number was worked out.','Change a connection strength and see what happens to the answer.'],prompt:'We can see every number here. Why is that hard for a system with billions of connections?',classroom:'Speech-to-text and image recognition use these layered networks.'},
     notes:{say:'Optional. A neural network is multiply, add, repeat. Learning means adjusting the connection strengths automatically.',caveat:'Connection strengths here are set by hand, not learned.'}}
  ]
});

/* ---------------------------- CHAPTER 2 · HOW A CHATBOT WRITES ---------------------------- */
CHAPTERS.push({
  id:2,key:'language',title:'Inside the Language Machine',short:'How Chatbots Write',env:'digital',fx:'digital',door:2,topic:'How chatbots write',
  essential:'If a chatbot builds its answer one small piece at a time, what does that explain about how it behaves?',
  objectives:['Describe the steps a chatbot takes to produce a reply.','Explain what a "token" is in everyday words.','Explain why the same question can give different answers.','Explain why a chatbot can lose track of earlier text.'],
  summary:['A chatbot splits text into pieces, turns them into numbers, scores possible next pieces, picks one, and repeats.','The "creativity dial" changes how adventurous the pick is, not how much it knows.','It can only use text that fits in its window.'],
  refs:['vaswani2017','jurafsky'],
  guide:{facilitation:'Keep to the five steps. Resist adding detail unless someone asks. The aim is a clear mental picture, not technical vocabulary.',transitions:'Bridge: "If it just picks likely words, what happens when likely and true disagree? Next building."',qual:['No lab here is a real chatbot. The splitting is approximate, and all probabilities are made-up numbers for teaching.','"One piece at a time" describes how text is produced. It does not by itself settle questions about what these systems can or cannot do; experts still debate that.']},
  scenes:[
    {id:'c2-portal',type:'cinema',cine:'portal',title:'Through the Screen',minutes:1,
     cap:['The Language Machine Lab. A monitor glows in the dark.','The camera moves toward the screen…','…and passes through it.','Inside: pieces of text, guesses and streams of data.'],
     notes:{say:'"Let’s step inside the machine. This picture is a metaphor, not a literal view."',demo:'Animated metaphor. Press S to skip.',transition:'Press →.'}},
    {id:'c2-how',type:'concept',title:'How a Chatbot Writes a Reply',minutes:3,station:420,
     concept:{term:'Writing one piece at a time',labels:L_LABELS,
       def:'A chatbot does not look up an answer. It builds its reply one small piece at a time, each time choosing a piece that is likely to come next, based on patterns it learned from huge amounts of text.',
       analogy:'Your phone’s "suggested next word," but far more powerful. It picks a word, adds it, then suggests again, hundreds of times.',
       classroom:'This is why a chatbot can write a smooth paragraph about almost anything, and also why it can be smoothly wrong.',
       misconception:'"It searches a database of facts." Usually it does not: it generates text from learned patterns. (Some products also add a web search or document lookup; that is an extra step.)',
       steps:[['1. Split','Your text is cut into small pieces called tokens: whole words or parts of words.'],['2. Turn into numbers','Each piece becomes a number, because computers work with numbers.'],['3. Score what comes next','The model gives every possible next piece a score for how likely it is.'],['4. Pick one','One piece is chosen, usually a likely one, with some chance involved.'],['5. Add it and repeat','The new piece joins the text and the loop runs again until the reply is done.']],
       check:{q:'What is the best description of how a chatbot produces a reply?',opts:['It looks up the answer in a library','It builds text one piece at a time, choosing likely next pieces','It thinks about the question like a person','It copies a stored answer'],ans:1,why:'Standard chatbots generate text step by step from learned patterns. They are not looking up a stored answer unless extra tools are added.'},
       visual:'steps',demo:'c2-tokenizer'},
     deeper:null,
     notes:{say:'"Five steps, over and over. Everything else about chatbots grows out of this loop."',demo:'Click Next step or Play all on the right.',facilitate:'Ask: "Where in these steps could a wrong fact sneak in?" (Step 3 and 4: likely is not the same as true.)',misc:'That it looks facts up; that it thinks like a person.',caveat:'Simplified. Products add steps such as safety filters, instructions and search.',transition:'"Let’s see step 1 for ourselves."'}},
    {id:'c2-tokenizer',type:'lab',title:'Try It: Splitting Text Into Pieces',minutes:2,station:820,sim:'tokenizer',
     lab:{purpose:'See how text is cut into pieces (step 1).',steps:['Click "Rare word" and notice how an unusual word breaks into several pieces.','Try "Non-English" and compare how many pieces it needs.','Switch to "Show token IDs": this number list is all the model receives.'],prompt:'Why might a chatbot struggle with spelling or counting letters if it never sees letters?',classroom:'A limit like "the tool cut off my essay" is measured in pieces, not words.'},
     notes:{say:'"Type anything. Common words stay whole. Rare words split up."',demo:'Approximate splitting with a small vocabulary. The numbers are made up. Real chatbots use a similar idea with a bigger learned list.',facilitate:'Try the instructor’s own name.',caveat:'Not any real chatbot’s exact splitting.',transition:'"Now step 3 and 4: choosing what comes next."'}},
    {id:'c2-next',type:'lab',title:'Try It: Choosing the Next Word',minutes:3,station:1220,sim:'nexttoken',
     lab:{purpose:'See that at every step there are many possible next words, each with a different chance.',steps:['Look at the bars: taller means more likely.','Click a bar to choose that word. Try a short bar.','Notice how your choice changes what comes next.','Try "Sample" and "Greedy: most likely".'],prompt:'Why might the most likely sentence not be the best one?',classroom:'The same question can have many reasonable answers, so a chatbot can give a different one each time.'},
     notes:{say:'"At each step there is a list of candidates. We choose one, and the list changes."',demo:'The percentages are made up for teaching. They are not from a real chatbot.',facilitate:'Have the class vote on each choice.',misc:'That the numbers shown come from a real chatbot.',caveat:'A real chatbot scores tens of thousands of possible pieces at each step.',transition:'"What if we turn up the randomness?"'}},
    {id:'c2-temp',type:'lab',title:'Try It: The Creativity Dial',minutes:2,station:1620,sim:'temperature',
     lab:{purpose:'See how a setting called "temperature" changes how adventurous the choice is (step 4).',steps:['Turn the dial to 0 and press "Generate 10".','Turn it up to 1, then 2, and generate again.','Watch how unlikely words (like pizza) start to appear.'],prompt:'When would you want a safe, predictable answer? When a surprising one?',classroom:'This is why asking the same question twice can give different answers.'},
     notes:{say:'"A low dial always picks the top choice. A high dial gives other choices a chance. The dial changes how it picks, not how much it knows."',demo:'Real arithmetic on made-up scores for one prompt.',misc:'That higher means smarter, or lower means more truthful.',caveat:'Many products hide this setting.',transition:'"One more limit: how much it can see at once."'}},
    {id:'c2-context',type:'lab',title:'Try It: How Much It Can See',minutes:2,station:420,sim:'context',
     lab:{purpose:'See that a chatbot can only use the text that fits in its window.',steps:['Slide the window smaller until the quiz message is greyed out.','Read how the reply changes.','Press "Repeat key fact near the end" to see one fix.'],prompt:'In a long chat, what should you repeat or re-paste?',classroom:'Explains why a very long conversation or document may be handled badly.'},
     notes:{say:'"If it is not in the window, the chatbot cannot use it. And a plausible guess can sound just as sure as a fact."',demo:'Guided example: no AI is running. Counts are approximate.',caveat:'Real behaviour varies by tool.',transition:'"Time for a check."'}},
    {id:'c2-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l2a',level:'Warm-up',kind:'Multiple choice',q:'What is a "token"?',opts:['A password','A small piece of text (a word or part of a word) the model works with','A kind of reward','A whole page'],ans:1,why:'Tokens are the pieces text is split into. Each becomes a number for the model.'},
      {id:'l2b',level:'Think it through',kind:'Prediction',q:'You turn the "creativity dial" way up. What is most likely?',opts:['Answers become more accurate','Answers become more varied and more surprising','Every answer becomes identical','The chatbot learns from you'],ans:1,why:'A higher dial gives less likely words a better chance, so replies vary more. It does not add knowledge or accuracy.'},
      {id:'l2c',level:'Reflect',kind:'Reflection',reflect:true,q:'If a chatbot builds its answer one piece at a time, what does that explain about how it behaves?',points:['It can sound smooth and sure even when it is wrong.','Different runs can give different answers.','It can only use what is in its window.','What it means for a system to "understand" is still debated.']}],
     notes:{say:'Take the reflection as a pair discussion.',facilitate:'Press A to reveal.'}}
  ]
});

/* ---------------------------- CHAPTER 3 · MADE-UP ANSWERS ---------------------------- */
CHAPTERS.push({
  id:3,key:'library',title:'The Digital Library',short:'Made-Up Answers',env:'library',fx:'library',door:3,topic:'Made-up answers',
  essential:'Why can a chatbot give a convincing answer that is wrong?',
  objectives:['Explain what an AI "hallucination" is.','Explain why smooth wording is not evidence of accuracy.','Use a simple routine to check a source.'],
  summary:['Chatbots pick likely words, not verified facts, so they can state wrong things confidently.','Check important claims in a trusted source you find yourself.','Giving a chatbot documents to answer from helps, but you still check.'],
  refs:['ji2023','lewis2020','mata2023','pashler2008'],
  guide:{facilitation:'Aim for calibrated trust, not cynicism. Chatbots are useful drafting tools. The skill is knowing what to verify.',transitions:'Bridge: "What if the wrong answer comes with authority attached? Next building."',qual:['Four of the eight citations in the Citation Detective are fictional teaching examples (this is stated on the screen). The four real ones are well known; confirm any citation before reusing it.','How often a given chatbot makes things up varies by tool and task; avoid quoting exact rates.']},
  scenes:[
    {id:'c3-why',type:'concept',title:'Why Chatbots Make Things Up',minutes:2,station:420,
     concept:{term:'Made-up answers (hallucinations)',labels:L_LABELS,
       def:'An AI "hallucination" is an answer that sounds right but is not supported by real sources. It can be a wrong fact, an invented quotation, or a reference to a book or article that does not exist.',
       analogy:'A confident improv actor playing a librarian can sound completely convincing and invent a call number on the spot. Sounding right and being right are different things.',
       classroom:'A chatbot may invent a reading list, a quotation for a lesson, or a research study to support a point. In 2023 lawyers submitted a legal brief containing cases a chatbot had invented, and a court sanctioned them.',
       misconception:'"If it gives a source, it must have looked it up." Not unless it is connected to a real search or document tool, and even then it can describe the source wrongly.',
       steps:[['It learned patterns','Citations, quotes and facts follow familiar shapes in the text it learned from.'],['You ask for one','You ask for a source or a fact.'],['It picks likely pieces','It builds something that fits the shape. There is no built-in "I could not find it" check.'],['It sounds sure','The reply reads smoothly and confidently, true or not.'],['You check','Only you can confirm it, in a source you find yourself.']],
       check:{q:'A chatbot gives a perfectly formatted citation. What does the format tell you?',opts:['The article exists','It looks like a citation. You still have to confirm it exists','The journal approved it','The chatbot searched the web'],ans:1,why:'Formatting is easy to imitate. Look the source up in a library database or on the publisher’s site.'},
       visual:'steps',demo:'c3-citation'},
     notes:{say:'"A chatbot is built to sound right. That is not the same as being right."',demo:'Walk through the five steps on the right.',facilitate:'Ask for a time a tool or a person gave them something plausible but wrong.',misc:'That newer chatbots never do this. They do it less in some cases, but it remains a known limitation.',caveat:'Terminology varies: some experts prefer "fabrication" or "confabulation".',transition:'"Can you spot a fake citation?"'}},
    {id:'c3-citation',type:'lab',title:'Try It: Real or Fake Citation?',minutes:2,station:820,sim:'citation',
     lab:{purpose:'Judge eight citations (four real, four fictional), then see the evidence.',steps:['Mark each as real or fabricated.','Talk with a neighbor about what you looked at.','Reveal the evidence and compare.'],prompt:'Which clues were reliable? What is your routine for checking a source?',classroom:'A ready-made activity: have students check citations from an AI-written bibliography.'},
     notes:{say:'"Real and fake look equally polished. The only reliable test is checking an independent source."',demo:'Four entries are fictional teaching examples. The other four are real, well-known works.',facilitate:'Look up one real citation live (doi.org or a library database).',caveat:'Confirm real citations yourself before reusing them.',transition:'"Does sounding confident mean it is right?"'}},
    {id:'c3-confidence',type:'lab',title:'Try It: Sounds Sure, Is It Right?',minutes:2,station:1220,sim:'confidence',
     lab:{purpose:'Guess which equally confident statements are true.',steps:['Choose true or false for each.','Reveal the evidence.','Compare how sure each sounded with how accurate it was.'],prompt:'If tone does not show reliability, what does?',classroom:'Students can write and swap their own true/false sets.'},
     notes:{say:'"Every statement is written with total certainty. Let’s see how many deserve it."',demo:'Written by a person in a confident chatbot style. Not real chatbot output.',facilitate:'Take a show of hands before each reveal.',caveat:'A real chatbot may or may not get these particular ones right.',transition:'"So how do we reduce the risk?"'}},
    {id:'c3-check',type:'concept',title:'How To Check',minutes:1,station:1620,
     concept:{term:'Giving it something to quote',labels:L_LABELS,
       def:'One way to reduce made-up answers is to give the chatbot trusted documents and ask it to answer only from them, with references you can open. This is sometimes called "retrieval."',
       analogy:'An open-book exam instead of a closed-book one: you can point to the page, but the student can still misread the page.',
       classroom:'A district assistant that answers from the district’s own policy files and shows where each answer came from is easier to check than a general chatbot.',
       misconception:'"If it shows sources, it must be correct." A source shows where to check. It does not prove the answer matches it.',
       check:{q:'A chatbot answers from your policy documents and cites them. What should you still do?',opts:['Nothing: it is guaranteed correct','Open the cited passage and confirm it says what the chatbot claims','Turn off the documents','Ask the chatbot if it is sure'],ans:1,why:'Grounding helps, but the answer can still misstate the source. Compare the claim to the passage.'},
       visual:'rag'},
     notes:{say:'"Give it something to quote, then check the quote."',demo:'Toggle Retrieval on and off and pick documents. Guided example: no AI or search is running.',caveat:'Quality depends on the documents and the setup.',transition:'"Quick check."'}},
    {id:'c3-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l3a',level:'Warm-up',kind:'Multiple choice',q:'Which best describes a hallucination?',opts:['A picture glitch','An answer that sounds right but is not supported by real sources','Any answer you dislike','A deliberate lie'],ans:1,why:'It is unsupported or invented content presented smoothly. It is not intentional deception.'},
      {id:'l3b',level:'Think it through',kind:'Scenario',q:'A chatbot gives a citation for a study that supports your lesson. What is the best next step?',opts:['Use it: it has authors and a journal name','Ask the same chatbot if it is real','Find the article yourself in a library database or on the publisher site','Check that the formatting looks right'],ans:2,why:'Verify independently. Asking the same chatbot is weak evidence because it can confirm things smoothly too.'},
      {id:'l3c',level:'Reflect',kind:'Reflection',reflect:true,q:'Why can a capable chatbot give a convincing answer that is wrong?',points:['It is built to produce likely, smooth text, not to verify facts.','It has no built-in way to say "I could not find that."','Smooth wording makes people trust it.','Checking the important parts is the remedy.']}],
     notes:{say:'Pair discussion for the reflection.',facilitate:'Press A to reveal.'}},
    {id:'c3-verify',type:'lab',title:'Optional: Does the Source Say That?',minutes:2,optional:true,station:420,sim:'verify',
     lab:{purpose:'Optional. Compare a summary to the source it claims to come from.',steps:['Read the claim, then the source excerpt.','Choose the problems you can support from the excerpt only.','Check your judgments.'],prompt:'How would you teach students to do this?',classroom:'The same four steps (find, read, compare, restate) work for any source.'},
     notes:{say:'Optional. A real source can still be misrepresented.',demo:'Fictional excerpt.',caveat:'Simplified statistics.'}}
  ]
});

/* ---------------------------- CHAPTER 4 · TRUSTING TOO MUCH ---------------------------- */
CHAPTERS.push({
  id:4,key:'observatory',title:'The Educational Decision Observatory',short:'Trusting AI',env:'obs',fx:'obs',door:4,topic:'Trusting AI too much',
  essential:'When does AI help our judgment, and when does it start to replace it?',
  objectives:['Explain "automation bias" in everyday words.','Spot situations where people stop checking.','Describe simple habits that keep a person in charge.'],
  summary:['When a tool is usually right, people stop checking, even when it is wrong.','Checking takes time, information and permission to say no.','The person using the tool stays accountable for the decision.'],
  refs:['parasuraman2010','skitka1999','dietvorst2015'],
  guide:{facilitation:'Do not shame anyone for trusting the demo. Everyone does under time pressure. That is the point.',transitions:'Bridge: "If neither blind trust nor refusing works, what does a good partnership look like? Last building."',qual:['Automation bias is well documented in aviation and medicine; research in classrooms is more limited. The student case here is fictional and illustrative.','The Trust Experiment, if used, is a classroom demonstration, not a research study.']},
  scenes:[
    {id:'c4-bias',type:'concept',title:'Why We Stop Checking',minutes:2,station:420,
     concept:{term:'Automation bias',labels:L_LABELS,
       def:'Automation bias is the habit of trusting a computer’s suggestion too much, so we skip checking it or ignore signs that it is wrong.',
       analogy:'GPS. It is usually right, so we stop watching the road. Then one day it points us onto a closed bridge.',
       classroom:'Accepting an early-warning flag without looking at the student’s situation. Using an AI-written test answer key without solving the questions. Assuming "no flag" means "no problem."',
       misconception:'"A teacher is in the loop, so there is oversight." A person who approves everything in seconds is present, but not really checking.',
       steps:[['The tool is usually right','Success builds trust.'],['People get busy','Checking takes time we do not have.'],['The tool looks authoritative','A score or a confident tone feels official.'],['We accept without checking','The suggestion becomes the decision.'],['A rare mistake gets through','Nobody catches it, and a student is affected.']],
       check:{q:'A system does not flag a struggling student, and nobody follows up because "the system would have told us." What is this an example of?',opts:['A system that works perfectly','Over-trusting automation: a missed problem because no one checked','A hallucination','A rule-based tool'],ans:1,why:'Relying on the absence of a flag instead of looking is a classic result of over-trusting automation.'},
       visual:'steps',demo:'c4-support'},
     notes:{say:'"The problem is not that tools are sometimes wrong. People are too. The problem is that we stop checking."',demo:'Walk through the five steps.',facilitate:'Ask: "What is the least evidence you would want before acting on a referral?"',misc:'That this only affects beginners.',caveat:'Strongest research is outside education.',transition:'"Let’s put you in the decision seat."'}},
    {id:'c4-support',type:'lab',title:'Try It: Accept or Investigate?',minutes:2,station:820,sim:'supportrec',
     lab:{purpose:'Decide whether to accept an AI recommendation about a student, with the option to look deeper first.',steps:['Decide: Accept, Reject or Investigate.','Reveal the extra information one item at a time.','Decide again and read the feedback.'],prompt:'What would a tool need to show you so you could decide well in two minutes?',classroom:'Good tools show their evidence, not just a score.'},
     notes:{say:'"A system gives you a score and a recommendation. You are busy. What do you do?"',demo:'Guided example with a fictional student.',facilitate:'Run it as a class vote before revealing anything.',misc:'That the right answer is always "reject the AI".',caveat:'The score is made up.',transition:'"Now a different problem: a test written by AI."'}},
    {id:'c4-assess',type:'lab',title:'Try It: Spot the Mistake',minutes:2,station:1220,sim:'assesserror',
     lab:{purpose:'Find the errors in AI-written test questions.',steps:['Decide whether each question looks fine or has an error.','Reveal the answers.','Notice how a neat answer key makes mistakes harder to see.'],prompt:'How much checking is right for a low-stakes quiz vs. a final exam?',classroom:'Solve every generated question yourself before using it.'},
     notes:{say:'"Four neat questions with answer keys. How many would you catch in a hurry?"',demo:'Guided example. Two items have errors, two are fine.',facilitate:'Solve item 1 by hand together.',caveat:'Not a claim about how often AI makes such errors.',transition:'"Quick check."'}},
    {id:'c4-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l4a',level:'Warm-up',kind:'Multiple choice',q:'What is automation bias?',opts:['A computer being unfair','Trusting automated suggestions too much and skipping checks','Refusing to use technology','A type of software bug'],ans:1,why:'It is a human habit: we over-trust automated suggestions.'},
      {id:'l4b',level:'Think it through',kind:'Scenario',q:'An AI tool recommends moving a student out of an advanced class, but you notice its data is out of date. What is the best response?',opts:['Follow it: it has more data than you','Ignore all AI tools from now on','Look into the missing or old information, talk with those involved, and make and explain the decision yourself','Ask the tool to double-check itself'],ans:2,why:'You are accountable for the decision. Use the tool as one input, check what it is missing, and be able to explain your choice.'},
      {id:'l4c',level:'Reflect',kind:'Reflection',reflect:true,q:'When does AI support your judgment, and when does it start to replace it?',points:['Support: it offers information and you weigh it and can say no.','Replace: you accept by default and cannot explain the decision.','Higher stakes call for more checking.','Time, evidence and permission to override make checking possible.']}],
     notes:{say:'Pair discussion for the reflection.',facilitate:'Press A to reveal.'}},
    {id:'c4-oversight',type:'concept',title:'Optional: Habits That Keep You in Charge',minutes:1,optional:true,station:420,
     concept:{term:'Meaningful checking',labels:L_LABELS,
       def:'Meaningful checking means a person has the time, the information and the permission to question and override a tool.',
       analogy:'A second pair of eyes works only if the person can actually see the problem and is allowed to say "stop."',
       classroom:'Ask any vendor: what examples was it built from? How does it do for different groups of students? What do reviewers see? How are overrides recorded?',
       misconception:'Two different problems are often mixed up: a tool being unfair (a problem in the tool) and people over-trusting it (a problem in how we use it). Each needs its own fix.',
       check:{q:'Which practice best supports real oversight?',opts:['Approve every flag within 5 seconds','Show the evidence behind each flag, allow time, and make overriding easy','Hide the score','Remove people from the process'],ans:1,why:'Oversight needs time, evidence and authority to override.'},
       visual:'biases'},
     notes:{say:'Optional. Two problems, two fixes.',caveat:'Examples of unfair tools come from health care and image analysis, but the mechanisms apply to education tools too.'}}
  ]
});

/* ---------------------------- CHAPTER 5 · PEOPLE AND MACHINES ---------------------------- */
CHAPTERS.push({
  id:5,key:'collab',title:'The Human–Machine Collaboration Center',short:'People and AI',env:'collab',fx:'collab',door:5,topic:'People and AI together',
  essential:'What should teachers and students keep doing themselves, even when AI can do it?',
  objectives:['Tell the difference between a good product and real understanding.','Sort school tasks by how much a person must stay in charge.','Write a short set of guiding principles for AI use.'],
  summary:['AI can help with drafts and ideas. People keep judgment, care and responsibility.','A polished result does not prove the student understands it.','Principles help only if you choose them and put them into practice.'],
  refs:['miao2023','bjork2011'],
  guide:{facilitation:'This topic is about values. Expect healthy disagreement, which depends on grade level, subject and local policy.',transitions:'Close with the essential question and then walk back to campus for the final reflection.',qual:['Laws and district policies about student data differ. Point people to their own institution’s guidance; this is not legal advice.']},
  scenes:[
    {id:'c5-human',type:'concept',title:'Doing Well vs. Understanding',minutes:2,station:420,
     concept:{term:'Good product, real understanding',labels:L_LABELS,
       def:'A good result (a polished essay) is not the same as understanding. A student can hand in excellent work without having learned what the task was meant to teach.',
       analogy:'A calculator makes arithmetic fast, but we still teach number sense so students can tell when an answer looks wrong.',
       classroom:'Plan for evidence of thinking: a short spoken explanation, drafts, in-class application, or a note about how AI was used. Decide where AI is welcome, where it is not, and say why.',
       misconception:'"If AI can do it, students no longer need to learn it." Some skills will change, but judging quality, reasoning and communicating are what make AI output usable at all.',
       check:{q:'A student hands in a flawless AI-written essay. What does that show most directly?',opts:['The student understands the topic','A strong product, but not by itself what the student can explain or do alone','The student cheated','Nothing at all'],ans:1,why:'Quality of the product is not proof of understanding. Look for explanation or application as well. Quality alone does not prove dishonesty either.'},
       visual:'perfunder',demo:'c5-sort'},
     notes:{say:'"The question is not whether students will use AI. It is what we still want them to do themselves, and how we will know."',demo:'Click each scenario on the right.',facilitate:'Ask for one skill that should stay independent in your subject.',caveat:'Research on AI and learning is still developing.',transition:'"Let’s sort some real school tasks."'}},
    {id:'c5-sort',type:'lab',title:'Try It: Who Should Do the Work?',minutes:3,station:820,sim:'sort',
     lab:{purpose:'Sort twelve school tasks by how much a person must stay in charge.',steps:['Click a task, then click a column.','Press Check and read the reasons.','Argue: what would change your answer?'],prompt:'Which placements depend on grade level, stakes or local policy?',classroom:'Teams can build their own sort to draft a school AI-use guide.'},
     notes:{say:'"There is no master key. Think about stakes, relationships and whether a decision can be undone."',demo:'Guided example. Suggested placements come with reasons. Disagreement is welcome.',facilitate:'Zoom in on cards that split the room.',misc:'That "AI helps" means "no review needed".',caveat:'Reasonable answers vary.',transition:'"Now: write your own principles."'}},
    {id:'c5-principles',type:'lab',title:'Try It: Your Guiding Principles',minutes:3,station:1220,sim:'principles',
     lab:{purpose:'Pick up to five principles and see which real situations they cover.',steps:['Choose five of the eight.','Switch among the three situations and see what your choices miss.','Copy your statement to adapt later.'],prompt:'Which principle did you leave out, and what is the cost?',classroom:'A starting point for a syllabus statement or department discussion.'},
     notes:{say:'"Anyone can write ‘we value everything.’ The work is choosing."',demo:'Your choices are saved only in your browser.',facilitate:'Compare statements around the room.',misc:'That a list of principles is a policy.',caveat:'Not legal advice.',transition:'"One last check."'}},
    {id:'c5-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l5a',level:'Warm-up',kind:'Scenario',q:'Which task should most clearly keep a person in charge?',opts:['Reformatting a rubric','Brainstorming discussion questions','Deciding a student’s eligibility for special services','Summarizing meeting notes'],ans:2,why:'High-stakes decisions about individual students involve law, care and accountability. AI may provide information, but a person decides.'},
      {id:'l5b',level:'Think it through',kind:'Scenario',q:'Before pasting student essays into a public AI tool, what is the best first step?',opts:['Remove the first name and go ahead','Check your school’s policy and the tool’s data terms, and use an approved tool','Assume it deletes everything','Ask the tool if it is safe'],ans:1,why:'Policy and data terms decide. Removing a name may not make the work anonymous, and the tool’s own assurance is not a compliance check.'},
      {id:'l5c',level:'Reflect',kind:'Reflection',reflect:true,q:'What should teachers and students keep doing themselves, even when AI can do it?',points:['Understanding enough to judge whether an answer makes sense.','Reasoning and explaining in your own words.','Checking sources and claims.','Care, ethics and responsibility for decisions.','Which of these to protect first is a local choice; reasonable educators differ.']}],
     notes:{say:'End with the reflection.',facilitate:'Press A to reveal.'}}
  ]
});

/* ---------------------------- CHAPTER 6 · RETURN TO CAMPUS ---------------------------- */
CHAPTERS.push({
  id:6,key:'closing',title:'Return to Campus',short:'Closing',env:'campus',fx:'dusk',
  essential:'What should students still learn to do themselves when AI can produce an answer?',
  objectives:['Pull the five ideas together.','Name one thing you will do differently.'],
  summary:['Know which kind of AI you are using.','Remember a chatbot writes one likely piece at a time.','Check important claims.','Keep checking even when a tool is usually right.','Keep people in charge of decisions about students.'],
  refs:['long2020','miao2023'],
  guide:{facilitation:'Leave time for silence after the final question. Return to the warm-up answers and ask what changed.',transitions:'Offer the revisit buttons for anything people want to explore again.'},
  scenes:[
    {id:'return',type:'cinema',cine:'return',title:'Back to Campus',minutes:1,
     cap:['The digital world fades. The campus is quiet at dusk.','Our student walks back across the quad, thinking.','The journey continues in every classroom.'],
     notes:{say:'"We are back where we started, and we see it a little differently."',transition:'Press →.'}},
    {id:'finale',type:'finale',title:'Final Reflection',minutes:2,
     notes:{say:'Read the central message slowly, pause, then ask the final question. Allow silence.',facilitate:'Reveal the summary last. Offer the revisit buttons.'}}
  ]
});
