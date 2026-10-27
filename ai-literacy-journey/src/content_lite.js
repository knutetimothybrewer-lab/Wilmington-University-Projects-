'use strict';
/* =====================================================================
   LITE EDITION · "AI Made Simple": the story of AI for new teachers.
   Story flow: What is AI? -> kinds of AI -> where it came from -> machine learning
   -> LLMs and tokens -> data centers and training -> hallucinations and using AI wisely.
   Plain language, no math, mechanism-first. Same scene format as the full edition.
   Extra concept fields: steps:[[title, text],...] (visual:'steps'), timeline:[[year,title,text],...]
   (visual:'timeline'), labels:{...} to rename tabs.
   ===================================================================== */
const L_LABELS={def:'The idea',explain:'More detail',analogy:'Everyday example',mechanism:'Step by step',classroom:'In school',misconception:'Common mix-up',discuss:'Talk about it',check:'Quick check'};

/* ---------------------------- CHAPTER 0 · WELCOME ---------------------------- */
CHAPTERS.push({
  id:0,key:'campus',title:'Welcome to Campus',short:'Campus',env:'campus',fx:'campus',
  essential:'What do I need to know about AI to make good decisions in my classroom?',
  objectives:['See the story we will follow, from "What is AI?" to "How do I use it wisely?"','Share what you already believe about AI.'],
  summary:['AI is not magic and not a mind: it is a family of computer tools.','Our story: what AI is, where it came from, how machines learn, how chatbots write, where they live, and why they sometimes make things up.'],
  refs:['long2020','miao2023'],
  guide:{facilitation:'Assume no prior knowledge. Welcome questions of any kind. If jargon appears, ask the speaker to say it again in everyday words.',transitions:'Open the map, then walk to the first building.'},
  scenes:[
    {id:'open',type:'cinema',cine:'opening',title:'Welcome',minutes:1,
     cap:['Welcome to campus. No experience with AI needed.','Our student guide has one big question: what is AI, really?','Five buildings tell the story. Let’s start walking.'],
     notes:{say:'"Welcome. You do not need any background. Over five short stops we will follow the story of AI, from what it is to why it sometimes gets things wrong. At each stop you will try something hands-on."',demo:'A short animated welcome. Press S to skip.',transition:'Press → for the story map.'}},
    {id:'objectives',type:'concept',title:'The Story Ahead',minutes:1,station:420,
     concept:{term:'Five stops, one story',labels:L_LABELS,
       def:'We will follow AI like a story: what it is, where it came from, how machines learn, how chatbots write, where they live, and why they sometimes make things up.',
       analogy:'A campus tour. You learn more by walking into each building and trying things than by reading a brochure.',
       mechanism:'Each building has short, step-by-step explanations and something to try. The instructor steers. Later you can explore at your own pace.',
       classroom:'You do not need to become a programmer. You need enough understanding to ask good questions of a tool, a vendor, a colleague or a student.',
       misconception:'Many people think AI is either magic or dangerous. Mostly it is software with specific strengths and specific weak spots, which is what we will look at.',
       check:{q:'What is the goal of today’s session?',opts:['Learn to program AI','Understand how AI works well enough to use it wisely and check it','Decide that AI should be banned','Memorize technical terms'],ans:1,why:'The goal is practical understanding for your own decisions, not programming or vocabulary.'},
       visual:'roadmap'},
     notes:{say:'"Five stops, one story. At each: a simple explanation, something to try, and a quick check."',facilitate:'Show of hands: who has used an AI chatbot? Who has never tried one? Normalize both.',transition:'Next: one quick warm-up.'}},
    {id:'warmup',type:'discuss',title:'Warm-Up',minutes:1,station:900,
     prompts:['In your own words, finish this sentence: "AI is ______."','Where might you already use AI without calling it that? (spelling suggestions, video recommendations, voice assistants)'],
     moves:['Collect answers without judging them. You will return to them at the end.','Listen for words like magic, robot, brain, search engine: they are useful starting points.'],
     notes:{say:'"No wrong answers. I just want to hear where we are starting."',transition:'Open the map and head to Building 1.'}},
    {id:'hub',type:'hub',title:'Campus Hub',minutes:0,notes:{say:'Click a building sign, or press → to walk to the next one.'}}
  ]
});

/* ---------------------------- CHAPTER 1 · WHAT IS AI? KINDS · HISTORY ---------------------------- */
CHAPTERS.push({
  id:1,key:'discovery',title:'The AI Discovery Center',short:'What Is AI?',env:'museum',fx:'museum',door:1,topic:'What AI is, its kinds and its history',
  essential:'What counts as AI, and where did it come from?',
  objectives:['Say what AI is in everyday words, and name AI you already use.','Tell apart the main kinds of AI.','Describe, in a few milestones, how AI got here.'],
  summary:['AI: computer systems that do tasks we usually think need human intelligence.','Main kinds: rule-based, machine learning, deep learning, generative. They overlap and nest.','All AI today is "narrow": good at particular tasks.','The idea is about 70 years old; chatbots went mainstream in 2022.'],
  refs:['mccarthy1955','turing1950','shannon1948','lecun2015'],
  guide:{facilitation:'Let people try the rule machine before you explain it. Ask "what do you think will happen?" first. Keep the history light: three or four dates are enough.',transitions:'Bridge: "Three of those kinds learn from examples. How does a machine learn? Next building."',qual:['There is no single official definition of AI.','The kinds of AI are a teaching simplification; real products often combine them.','Dates and milestones are simplified; many people contributed and histories choose different milestones.']},
  scenes:[
    {id:'c1-what',type:'concept',title:'What Is AI?',minutes:2,station:420,
     concept:{term:'Artificial intelligence',labels:L_LABELS,
       def:'Artificial intelligence (AI) is the name for computer systems that do tasks we usually think need human intelligence, such as recognizing speech, spotting patterns, making recommendations, or writing text. There is no single official definition.',
       explain:'All AI today is "narrow": it can be very good at particular tasks and still fail at things a child finds easy. A "general" AI that matches people across everything does not exist today.',
       analogy:'A power tool. A drill is far better than your hand at making holes, but it cannot decide what to build or whether the wall is safe to drill.',
       classroom:'You already use AI: spelling and grammar suggestions, video and music recommendations, voice assistants, photo apps that group faces, and chatbots.',
       misconception:'"AI thinks like a person." AI systems find patterns or follow rules. Whether any of them "understands" is debated, but they do not think the way people do.',
       steps:[['Something goes in','A question, a photo, a sound, or a table of numbers.'],['The computer applies rules or learned patterns','Either a person wrote the rules, or the computer found the patterns in examples.'],['Something comes out','An answer, a label, a suggestion, or brand-new text or images.'],['People decide what to do with it','Is it useful? Is it right? That part is still ours.']],
       check:{q:'Which statement about AI today is most accurate?',opts:['It thinks exactly like a person','It is good at specific tasks and can fail at things that seem easy','It knows everything','It does not exist yet'],ans:1,why:'Today’s AI is "narrow": strong at particular tasks, but it can fail unexpectedly, and it does not think like a person.'},
       visual:'steps'},
     notes:{say:'"AI is a broad label for computer tools that do tasks we associate with intelligence. Let’s see how those tools work."',demo:'Click through the four steps on the right.',facilitate:'Ask them to name AI they used this morning.',misc:'That AI is one thing; that it thinks like a person.',caveat:'No single definition exists.',transition:'"There are different kinds."'}},
    {id:'c1-kinds',type:'concept',title:'Kinds of AI',minutes:3,station:820,
     concept:{term:'Four kinds of AI',labels:L_LABELS,
       def:'Rule-based AI follows rules a person wrote. Machine learning finds patterns in examples. Deep learning is machine learning with many layers of connections. Generative AI creates new text, images or sound. They overlap: deep learning is a kind of machine learning, and most generative AI today uses deep learning.',
       analogy:'A recipe card (follow the steps), an apprentice who tastes hundreds of dishes and learns what works (learn from examples), the same apprentice with a huge team of specialists (deep), and a chef who invents a new dish in that style (generative).',
       mechanism:'Rules: IF this THEN that. Machine learning: examples in, patterns out. Deep learning: the same, but stacked layers can pick up more complicated patterns. Generative: the patterns are used to build something new.',
       classroom:'Rule: "Email a reminder when homework is 3 days late." Machine learning: software that studies past data to spot who may need help. Deep learning: speech-to-text for captions. Generative: a chatbot drafting a rubric.',
       misconception:'"AI, machine learning and ChatGPT are the same thing." They nest: ChatGPT-style chatbots are generative AI, built with deep learning, which is a kind of machine learning, which is a kind of AI. Rule-based systems are AI that is not machine learning.',
       check:{q:'Which statement is most accurate?',opts:['The four kinds never overlap','Deep learning is a kind of machine learning, and most generative AI today uses deep learning','Generative AI is rule-based','Machine learning is a kind of deep learning'],ans:1,why:'The kinds nest and overlap. Deep learning is a subset of machine learning, and today’s generative systems are usually deep-learning models.'},
       visual:'venn',demo:'c1-rules'},
     notes:{say:'"Four kinds that nest inside each other. Rules sit outside machine learning; the other three nest."',demo:'Click each region of the diagram for a definition.',facilitate:'Ask people to place a tool they use on the diagram.',misc:'That the kinds are separate boxes.',caveat:'Teaching simplification.',transition:'"Let’s try the first kind, rules."'}},
    {id:'c1-rules',type:'lab',title:'Try It: A Rule Machine',minutes:2,station:1220,sim:'rules',
     lab:{purpose:'See a system that only does what its rules say.',steps:['Move the student sliders and watch which rule fires.','Change a rule number a little (for example 80 to 79). See how students are treated differently.','Look for students that no rule covers.'],prompt:'Who is responsible when two nearly identical students get different results?',classroom:'Gradebook alerts, filters and reminders are often rule-based.'},
     notes:{say:'"Every decision here can be traced to a rule you can read. That is a strength. The weakness: it only knows what someone thought of."',demo:'A real rule engine on made-up students. The first matching rule wins.',facilitate:'Invite someone to try to break the rules.',caveat:'Made-up student data.',transition:'"Now, where did all of this come from?"'}},
    {id:'c1-history',type:'concept',title:'Where AI Came From',minutes:3,station:1620,
     concept:{term:'A short history of AI',labels:L_LABELS,
       def:'AI is not new. People have worked on it for about 70 years, in waves of excitement and disappointment. What changed recently is three things arriving together: much more data, much faster computers, and a better design for handling text.',
       analogy:'Like flight: the idea was old, early attempts failed, and it only became everyday when engines, materials and know-how all came together.',
       mechanism:'Ideas (like the transformer design), data (huge amounts of text online) and computing power (special chips in data centers) all had to be ready. Chatbots became possible only when all three were.',
       classroom:'History is a defense against hype. Every wave had big promises. Asking "what can it really do today?" is the question teachers always ask about new tools.',
       misconception:'"ChatGPT invented AI." AI is about 70 years old. Chatbots became popular in 2022, but they stand on decades of earlier work.',
       timeline:[
        ['1948','Computers copy word patterns','Claude Shannon showed that picking each next letter or word from real English patterns makes English-looking text. It is an early version of "guess what comes next".'],
        ['1950','"Can machines think?"','Alan Turing proposed a test where a person chats with a hidden machine or person and tries to tell which is which.'],
        ['1956','The name "AI" is born','At a summer workshop at Dartmouth, researchers launched the field and called it artificial intelligence.'],
        ['1960s','The first chatbots','ELIZA (1966) pretended to be a therapist by matching patterns in what you typed. It understood nothing, yet many people found it convincing.'],
        ['1970s-90s','Big promises, then "AI winters"','Early hopes were bigger than what computers could do, and funding dried up more than once. In the 1980s large rule collections ("expert systems") had a short boom.'],
        ['1990s-2000s','Learning from examples wins','With more data and faster computers, learning from examples began to beat hand-written rules for many tasks.'],
        ['2012','Deep learning breaks through','A many-layered network won a big image-recognition contest by a wide margin, and this kind of AI took off.'],
        ['2017','A new design for text','Researchers introduced the "transformer", a design that handles text far better. Today’s chatbots are built on it.'],
        ['2018-2020','Language models get very large','Models trained on huge amounts of text became much more capable as they grew. These are called large language models, or LLMs.'],
        ['2022','Chatbots reach everyone','ChatGPT launched to the public in November 2022. Millions tried an LLM for the first time and AI arrived in classrooms.']],
       check:{q:'What made modern chatbots possible?',opts:['One sudden invention in 2022','Better designs, much more data and much faster computers coming together','Computers suddenly became conscious','Teachers asking for them'],ans:1,why:'Several ingredients matured and combined: new designs such as the transformer, huge amounts of text, and powerful hardware. The 2022 launch made the result public.'},
       visual:'timeline'},
     notes:{say:'"AI is about seventy years old. Chatbots arrived in 2022, but they stand on a long history of ideas, setbacks and progress."',demo:'Click any date, or use Earlier and Later.',facilitate:'Ask: which date surprised you?',misc:'That AI is brand new or that one company invented it.',caveat:'Simplified milestones; many people contributed.',transition:'"Three of those kinds learn from examples. How does a machine learn?"'}},
    {id:'c1-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l1a',level:'Warm-up',kind:'Multiple choice',q:'What is the main difference between a rule-following system and a learning system?',opts:['Learning systems are always more accurate','A person writes the rules in one; the other finds patterns in examples','Rule systems use the internet','There is no difference'],ans:1,why:'In rule systems people write the logic. In learning systems the pattern comes from examples, so the examples matter a great deal.'},
      {id:'l1b',level:'Think it through',kind:'Multiple choice',q:'Which of these is generative AI?',opts:['A calculator','A spam filter that labels email','A chatbot that drafts a lesson plan','A fixed attendance alert'],ans:2,why:'Generative AI creates new content such as text or images. A filter picks a label and an alert follows a rule.'},
      {id:'l1c',level:'Reflect',kind:'Reflection',reflect:true,q:'Knowing AI is about 70 years old, what do you think is genuinely new right now, and what is hype?',points:['New: much larger models, huge data, fast chips, and chatbots anyone can use.','Not new: the ideas of learning from examples and of predicting text.','Hype often claims a tool does more than it demonstrably does today.']}],
     notes:{say:'Give people a moment to think, then reveal and discuss.',facilitate:'Press A to reveal an answer.'}}
  ]
});

/* ---------------------------- CHAPTER 2 · MACHINE LEARNING ---------------------------- */
CHAPTERS.push({
  id:2,key:'mllab',title:'The Machine Learning Lab',short:'Machine Learning',env:'lab',fx:'lab',door:2,topic:'Machine learning and deep learning',
  essential:'How can a machine learn something nobody wrote down as a rule?',
  objectives:['Describe the steps of machine learning in everyday words.','See that the examples shape what is learned.','Explain what "deep" means in deep learning.','Contrast picking a label with creating new content.'],
  summary:['Machine learning: collect examples, let the computer find patterns, test on new cases, improve.','Good tools need good, representative examples.','Deep learning stacks many layers of simple steps.','Generative AI builds new content from the patterns it learned.'],
  refs:['mitchell1997','lecun2015','kasneci2023'],
  guide:{facilitation:'Ask for a prediction before every preset. The central idea is "same method, different examples, different behavior".',transitions:'Bridge: "A chatbot is a kind of learning system for language. How does it write? Next building."',qual:['The demos are tiny. Real systems use far more data and are far more complex, but depend on their examples in the same way.']},
  scenes:[
    {id:'c2-ml',type:'concept',title:'Machine Learning: Learning From Examples',minutes:2,station:420,
     concept:{term:'Machine learning',labels:L_LABELS,
       def:'Machine learning is when a computer finds patterns in examples instead of being given rules. You show it many examples, and it learns what tends to go with what, so it can handle new cases.',
       explain:'Three common ways machines learn: from examples that come with the right answers (like photos labeled "cat"), from examples without answers (finding groups on its own), and by trial and error with rewards (like learning a game).',
       analogy:'Teaching a child to recognize dogs. You do not list rules about ears and tails. You point at lots of dogs, and the child works out the pattern.',
       classroom:'An early-warning tool studies past student records to spot patterns. A reading app learns which practice sets help. Both are only as good as the records they learned from.',
       misconception:'"The computer figured it out, so it must be objective." It learned from examples people chose, so gaps and mistakes in the examples can become gaps and mistakes in the tool.',
       steps:[['1. Collect examples','Many past cases: photos, records, sentences.'],['2. Add the right answers','Each example gets a label, such as "on track" or "needs support".'],['3. Find patterns','The computer looks for what the labeled examples have in common.'],['4. Test on new cases','It is tried on examples it has not seen, to see if the pattern holds.'],['5. Fix and repeat','Better examples and adjustments make it better.']],
       check:{q:'A learning tool was built from examples that mostly came from one kind of school. What is the main concern?',opts:['None: more data is always better','It may work poorly for students unlike those in the examples','It will refuse to run','It must be rule-based'],ans:1,why:'A learning system reflects its examples. If they are one-sided, the tool may be less reliable for other students.'},
       visual:'steps',demo:'c2-knn'},
     notes:{say:'"Nobody types the rule. We show examples and the computer finds the pattern."',demo:'Walk through the five steps on the right.',facilitate:'Ask: what could go wrong in step 1 or step 2?',misc:'That the result is automatically objective.',caveat:'Simplified.',transition:'"Let’s watch a computer learn."'}},
    {id:'c2-knn',type:'lab',title:'Try It: Learning From Examples',minutes:3,station:820,sim:'knn',
     lab:{purpose:'Watch a computer find a pattern from examples, and see how it changes when the examples change.',steps:['Notice the green and orange areas: the computer drew them from the examples.','Click "Move test point", then click somewhere: see how the computer decides.','Try "Mislabeled examples" and "Unrepresentative sample". See how the result changes.','Add your own examples.'],prompt:'The computer’s method never changed, only the examples. What does that say about who is responsible for a learning tool?',classroom:'A tool trained on past students inherits any gaps or mistakes in past records.'},
     notes:{say:'"Nobody typed the rule. The computer worked it out from examples. Now let’s see how easily it can be misled."',demo:'A real (very simple) learning method: a new point is labelled by the three most similar examples.',facilitate:'Ask for a prediction before each preset: "Which way will the boundary move?"',misc:'"More data always fixes it." Not if the data is wrong or one-sided.',caveat:'Real systems are far larger.',transition:'"Now: what does deep learning add?"'}},
    {id:'c2-deep',type:'concept',title:'Deep Learning: Many Layers',minutes:2,station:1220,
     concept:{term:'Deep learning',labels:L_LABELS,
       def:'Deep learning is machine learning that uses a "neural network" with many layers. Each layer does a simple step and passes its result to the next, so together they can pick up complicated patterns.',
       analogy:'An assembly line of inspectors. The first spots simple things (edges in a photo), the next combines them (shapes), the next combines those (a face).',
       classroom:'Deep learning powers speech-to-text for captions, face grouping in photo apps, translation, and the chatbots we meet next.',
       misconception:'"A neural network is a digital brain." The name was inspired by brain cells, but a neural network is mostly multiplication and addition, repeated many times.',
       steps:[['Numbers go in','A photo or a sentence is turned into numbers.'],['Layer 1 finds simple patterns','Each connection has a strength. Numbers are multiplied by strengths and added up.'],['Later layers combine them','Simple patterns become bigger patterns.'],['The last layer gives an answer','A label, a score, or the next piece of text.'],['Learning adjusts the strengths','Training nudges millions or billions of strengths so answers get better.']],
       check:{q:'In deep learning, what does "deep" refer to?',opts:['How smart the system is','The number of layers in the network','How much data is stored','How long it was trained'],ans:1,why:'"Deep" means many layers stacked one after another.'},
       visual:'steps',demo:'c2-nn'},
     notes:{say:'"A neural network is multiply, add, repeat, through many layers. Learning means adjusting the strengths of the connections."',demo:'Walk through the steps, then try the network.',misc:'That it works like a brain.',caveat:'Simplified.',transition:'"Want to see one? Here is a tiny one."'}},
    {id:'c2-nn',type:'lab',title:'Try It: A Tiny Neural Network',minutes:2,station:1620,sim:'nn',
     lab:{purpose:'See how many simple steps stacked together can produce an answer.',steps:['Move the three sliders and watch the numbers flow left to right.','Click a circle to see how its number was worked out.','Change one connection strength and see what happens to the answer.'],prompt:'We can see every number here. Why is that hard for a system with billions of connections?',classroom:'Real networks work the same way, only far larger.'},
     notes:{say:'"A neural network is multiply, add, repeat. Notice we can read every number. Imagine billions."',demo:'A real working network. The connection strengths were set by hand, not learned.',caveat:'Not trained; made for teaching.',transition:'"Learning can also create. Next demo."'}},
    {id:'c2-gen',type:'lab',title:'Try It: Picking vs. Creating',minutes:2,station:420,sim:'gen',
     lab:{purpose:'Compare choosing from a fixed menu with building something new.',steps:['On the left, change the sentence and see the single label it gets.','On the right, press Generate several times.','Notice: which side can say something it has never seen before?'],prompt:'Why is it harder to check a created answer than a menu choice?',classroom:'Drafting a rubric or email has many acceptable answers, so checking takes judgment.'},
     notes:{say:'"The left side picks from a menu. The right side builds a sentence one word at a time."',demo:'A tiny word-by-word generator built from 11 teacher comments. It really runs.',facilitate:'Ask: "Is the generated sentence true?" That leads into later chapters.',caveat:'Much simpler than real chatbots.',transition:'"Quick check, then we visit the Word Library."'}},
    {id:'c2-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l2a',level:'Warm-up',kind:'Multiple choice',q:'In machine learning, where does the pattern come from?',opts:['A programmer writes it as a rule','The computer finds it in examples','The internet','A teacher'],ans:1,why:'In machine learning, the computer finds the pattern in examples, which is why the examples matter so much.'},
      {id:'l2b',level:'Think it through',kind:'Scenario',q:'Same learning method, new examples with more mislabeled data. What happens?',opts:['Nothing changes','The learned pattern gets worse or changes','It becomes rule-based','It fixes the labels itself'],ans:1,why:'The method learns whatever the examples show, including mistakes. Better examples mean better learning.'},
      {id:'l2c',level:'Reflect',kind:'Reflection',reflect:true,q:'What changes when a computer learns from examples instead of following instructions?',points:['Behavior comes from the examples, not from written rules.','Mistakes or gaps in the examples can become mistakes in the tool.','Someone needs to check how it works for different students.']}],
     notes:{say:'Pair discussion for the reflection.',facilitate:'Press A to reveal.'}}
  ]
});

/* ---------------------------- CHAPTER 3 · LLMs AND TOKENS ---------------------------- */
CHAPTERS.push({
  id:3,key:'language',title:'The Word Library',short:'LLMs & Tokens',env:'digital',fx:'digital',door:3,topic:'Large language models and tokens',
  essential:'If a chatbot builds its answer one small piece at a time, what does that explain about how it behaves?',
  objectives:['Say what a large language model (LLM) is.','Explain what a token is.','Describe the steps a chatbot takes to produce a reply.','Explain why the same question can get different answers.','Explain why a chatbot can lose track of earlier text.'],
  summary:['An LLM is a very large program trained to predict the next piece of text.','Text is split into tokens, turned into numbers, scored, and one token is chosen at a time.','The "creativity dial" changes how adventurous the choice is, not how much it knows.','A chatbot can only use text that fits in its window.'],
  refs:['vaswani2017','jurafsky','holtzman2020'],
  guide:{facilitation:'Keep to the five steps. Add detail only if someone asks. The aim is a clear mental picture, not vocabulary.',transitions:'Bridge: "Where does this program run, and how did it learn all this? Next building."',qual:['No lab here is a real chatbot. The splitting is approximate, and all probabilities are made-up numbers for teaching.','"One piece at a time" describes how text is produced. It does not by itself settle what these systems can or cannot do; experts still debate that.']},
  scenes:[
    {id:'c3-portal',type:'cinema',cine:'portal',title:'Into the Words',minutes:1,
     cap:['The Word Library. A monitor glows in the corner.','The camera moves toward the screen…','…and passes through it.','Inside: pieces of text, guesses and streams of data.'],
     notes:{say:'"Let’s step inside the machine. This picture is a metaphor, not a literal view."',demo:'Animated metaphor. Press S to skip.',transition:'Press →.'}},
    {id:'c3-llm',type:'concept',title:'What Is a Large Language Model?',minutes:2,station:420,
     concept:{term:'Large language model (LLM)',labels:L_LABELS,
       def:'A large language model, or LLM, is a very large program trained on huge amounts of text to predict what piece of text comes next. Chatbots such as ChatGPT, Claude and Gemini are built on LLMs. "Large" means billions of adjustable numbers inside it.',
       explain:'Because it learned from so much text, predicting the next piece lets it write essays, answer questions, translate and summarize. It is a deep-learning model: the "many layers" idea from the last building, built for language.',
       analogy:'Your phone’s "suggested next word", but vastly more powerful. It picks a word, adds it, then suggests again, hundreds of times.',
       classroom:'This is why a chatbot can write a smooth paragraph about almost anything, and also why it can be smoothly wrong.',
       misconception:'"It searches a database of facts." Usually it does not: it generates text from learned patterns. (Some products add a web search or document lookup as an extra step.)',
       steps:[['1. Split','Your text is cut into small pieces called tokens.'],['2. Turn into numbers','Each piece becomes a number, because computers work with numbers.'],['3. Score what comes next','The model gives every possible next piece a score for how likely it is.'],['4. Pick one','One piece is chosen, usually a likely one, with some chance involved.'],['5. Add it and repeat','The new piece joins the text and the loop runs again until the reply is done.']],
       check:{q:'What is the best description of how a chatbot produces a reply?',opts:['It looks up the answer in a library','It builds text one piece at a time, choosing likely next pieces','It thinks about the question like a person','It copies a stored answer'],ans:1,why:'Standard chatbots generate text step by step from learned patterns. They are not looking up a stored answer unless extra tools are added.'},
       visual:'steps',demo:'c3-tokenizer'},
     notes:{say:'"Five steps, over and over. Everything else about chatbots grows out of this loop."',demo:'Click Next step or Play all on the right.',facilitate:'Ask: "Where could a wrong fact sneak in?" (Steps 3 and 4: likely is not the same as true.)',misc:'That it looks facts up; that it thinks like a person.',caveat:'Simplified. Products add steps such as safety filters, instructions and search.',transition:'"Step 1 first: what is a token?"'}},
    {id:'c3-tokens',type:'concept',title:'Tokens: The Pieces of Text',minutes:1,station:820,
     concept:{term:'Tokens',labels:L_LABELS,
       def:'A token is a small piece of text a model works with: a whole word, part of a word, or a punctuation mark. Each token gets a number (an ID), and the model only ever sees those numbers.',
       analogy:'LEGO bricks. Common words are one big brick. A rare word is built from several small bricks.',
       classroom:'Limits and costs for AI tools are counted in tokens, not words. That is why a tool can "cut off" a long essay. Tools trained mostly on English may need more tokens for other languages.',
       misconception:'"The model reads words like I do." It works on token numbers. That is one reason it can stumble on spelling or counting letters.',
       check:{q:'Why can a chatbot struggle with "How many r’s are in strawberry?"',opts:['It cannot count','It works with tokens, not individual letters, so letters are hidden inside the pieces','It refuses','The word is too long'],ans:1,why:'Words are split into tokens that can hide individual letters. Newer models do better, but the token view explains the stumble.'},
       visual:'tokenstream',demo:'c3-tokenizer'},
     notes:{say:'"Before it does anything, your words are chopped into pieces and turned into numbers."',demo:'Figure: text to tokens to IDs to vectors (illustrative numbers).',facilitate:'Ask for a guess how many tokens their name uses, then test it in the next lab.',caveat:'Exact splits depend on the specific model.',transition:'"Try it."'}},
    {id:'c3-tokenizer',type:'lab',title:'Try It: Splitting Text Into Pieces',minutes:2,station:1220,sim:'tokenizer',
     lab:{purpose:'See how text is cut into pieces (step 1).',steps:['Click "Rare word" and notice how an unusual word breaks into several pieces.','Try "Non-English" and compare how many pieces it needs.','Switch to "Show token IDs": this number list is all the model receives.'],prompt:'Why might a chatbot struggle with spelling or counting letters if it never sees letters?',classroom:'A limit like "the tool cut off my essay" is measured in pieces, not words.'},
     notes:{say:'"Type anything. Common words stay whole. Rare words split up."',demo:'Approximate splitting with a small vocabulary; the numbers are made up.',facilitate:'Try the instructor’s own name.',caveat:'Not any real chatbot’s exact splitting.',transition:'"Now steps 3 and 4: choosing what comes next."'}},
    {id:'c3-next',type:'lab',title:'Try It: Choosing the Next Word',minutes:2,station:1620,sim:'nexttoken',
     lab:{purpose:'See that at every step there are many possible next words, each with a different chance.',steps:['Look at the bars: taller means more likely.','Click a bar to choose that word. Try a short bar.','Notice how your choice changes what comes next.','Try "Sample" and "Greedy: most likely".'],prompt:'Why might the most likely sentence not be the best one?',classroom:'The same question can have many reasonable answers, so a chatbot can give a different one each time.'},
     notes:{say:'"At each step there is a list of candidates. We choose one, and the list changes."',demo:'The percentages are made up for teaching. They are not from a real chatbot.',facilitate:'Have the class vote on each choice.',misc:'That the numbers come from a real chatbot.',caveat:'A real chatbot scores tens of thousands of possible pieces at each step.',transition:'"What if we turn up the randomness?"'}},
    {id:'c3-temp',type:'lab',title:'Try It: The Creativity Dial',minutes:2,station:420,sim:'temperature',
     lab:{purpose:'See how a setting called "temperature" changes how adventurous the choice is (step 4).',steps:['Turn the dial to 0 and press "Generate 10".','Turn it up to 1, then 2, and generate again.','Watch how unlikely words (like pizza) start to appear.'],prompt:'When would you want a safe, predictable answer? When a surprising one?',classroom:'This is why asking the same question twice can give different answers.'},
     notes:{say:'"A low dial always picks the top choice. A high dial gives other choices a chance. The dial changes how it picks, not how much it knows."',demo:'Real arithmetic on made-up scores for one prompt.',misc:'That higher means smarter, or lower means more truthful.',caveat:'Many products hide this setting.',transition:'"One more limit: how much it can see at once."'}},
    {id:'c3-context',type:'lab',title:'Try It: How Much It Can See',minutes:2,station:820,sim:'context',
     lab:{purpose:'See that a chatbot can only use the text that fits in its window.',steps:['Slide the window smaller until the quiz message is greyed out.','Read how the reply changes.','Press "Repeat key fact near the end" to see one fix.'],prompt:'In a long chat, what should you repeat or re-paste?',classroom:'Explains why a very long conversation or document may be handled badly.'},
     notes:{say:'"If it is not in the window, the chatbot cannot use it. And a plausible guess can sound just as sure as a fact."',demo:'Guided example: no AI is running. Counts are approximate.',caveat:'Real behaviour varies by tool.',transition:'"Time for a check."'}},
    {id:'c3-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l3a',level:'Warm-up',kind:'Multiple choice',q:'What is a large language model (LLM)?',opts:['A search engine','A very large program trained on lots of text to predict what text comes next','A database of facts','A type of website'],ans:1,why:'An LLM is a large model trained on text to predict the next piece. Chatbots are built on top of it.'},
      {id:'l3b',level:'Think it through',kind:'Prediction',q:'You turn the "creativity dial" way up. What is most likely?',opts:['Answers become more accurate','Answers become more varied and more surprising','Every answer becomes identical','The chatbot learns from you'],ans:1,why:'A higher dial gives less likely words a better chance, so replies vary more. It does not add knowledge or accuracy.'},
      {id:'l3c',level:'Reflect',kind:'Reflection',reflect:true,q:'If a chatbot builds its answer one piece at a time, what does that explain about how it behaves?',points:['It can sound smooth and sure even when it is wrong.','Different runs can give different answers.','It can only use what is in its window.','What it means for such a system to "understand" is still debated.']}],
     notes:{say:'Pair discussion for the reflection.',facilitate:'Press A to reveal.'}}
  ]
});

/* ---------------------------- CHAPTER 4 · DATA CENTERS AND TRAINING ---------------------------- */
CHAPTERS.push({
  id:4,key:'datacenter',title:'The Data Center',short:'Data Centers',env:'datacenter',fx:'lab',door:4,topic:'Where LLMs live and how they are trained',
  essential:'Where does a chatbot actually live, and how did it learn to write?',
  objectives:['Explain what a data center is and why chatbots run there.','Follow a message from your device to a data center and back.','Describe, in steps, how an LLM is trained.','Name the privacy and resource questions this raises for schools.'],
  summary:['Large chatbots run in data centers: buildings of servers with special chips, not on your laptop.','Training an LLM means guessing the next word billions of times and adjusting its numbers.','Training happens once (for a long time); chatting uses the finished model.','Messages travel to a company’s computers, so privacy matters, and data centers use a lot of electricity and cooling.'],
  refs:['bender2021','miao2023'],
  guide:{facilitation:'Keep to the journey of one message and the training steps. Avoid quoting specific energy or cost numbers unless you have a current, sourced figure.',transitions:'Bridge: "Everything is built to predict likely text, so what happens when likely is wrong? Last building."',qual:['Some small AI models run on your own device. The largest ones generally run in data centers.','Training details (data sources, duration, hardware) vary by company and are not always public. The environmental effects are real and still being measured; no figures are given here on purpose.']},
  scenes:[
    {id:'c4-where',type:'concept',title:'Where Does a Chatbot Live?',minutes:2,station:420,
     concept:{term:'Data centers',labels:L_LABELS,
       def:'A data center is a large building full of computers, called servers, that run websites and apps. Large chatbots run in data centers on special chips that can do enormous amounts of arithmetic at the same time.',
       explain:'The model itself is a huge file of numbers, far too big and too slow to run well on a normal laptop. So when you type, your message is sent over the internet to a data center, processed there, and the reply comes back.',
       analogy:'A power plant. You flip a switch at home, but the electricity is made somewhere else and delivered to you.',
       classroom:'Because messages travel to a company’s computers, what students type leaves the classroom. That is why school privacy rules matter. Data centers also use a lot of electricity and cooling water; how much varies, and researchers are still measuring it.',
       misconception:'"The AI is inside my laptop or phone." For the big chatbots, it is usually in a data center far away. (Smaller models can run on your own device.)',
       steps:[['You type a question','On your laptop or phone.'],['It travels over the internet','As small packets of data.'],['A data center receives it','A building of servers in rows of racks.'],['Many chips share the work','They score the next pieces of text, over and over.'],['The reply returns','Streamed back to you a few pieces at a time.']],
       check:{q:'Why does it matter for schools that big chatbots run in data centers?',opts:['It does not matter','What students type is sent to a company’s computers, so privacy rules apply','The chatbot is more accurate','It makes the chatbot free'],ans:1,why:'Messages leave the device. Check policy and data terms before students type anything personal.'},
       visual:'steps',demo:'c4-send'},
     notes:{say:'"The AI is not in the laptop. It is in a building full of computers, and your message travels there."',demo:'Walk through the five steps, then follow a message in the next scene.',facilitate:'Ask: what do your students type into AI tools? Where does it go?',misc:'That the AI is local; that "the cloud" is not a physical place.',caveat:'Some models run locally. Energy and water use vary and are still being studied; no numbers are quoted.',transition:'"Let’s follow one message."'}},
    {id:'c4-send',type:'lab',title:'Try It: Follow a Message',minutes:2,station:820,sim:'datacenter',
     lab:{purpose:'Follow a message from your device to a data center and back.',steps:['Press "Send a question" and watch each stage light up.','Use "Step: next stage" to go one stage at a time.','Slide "How busy is the data center?" and see what changes at stage 4.'],prompt:'What should students never type into a chatbot, and why?',classroom:'A good starting rule: nothing that identifies a student or family.'},
     notes:{say:'"Five stages. Notice where your words leave the building you are in."',demo:'Guided example. No AI is running.',facilitate:'Ask what privacy rules your school has for AI tools.',caveat:'Simplified; real systems have more steps.',transition:'"So how did it learn to write?"'}},
    {id:'c4-train',type:'concept',title:'How It Gets Trained',minutes:3,station:1220,
     concept:{term:'Training an LLM',labels:L_LABELS,
       def:'Training is how an LLM learns. It reads a huge amount of text, practices guessing the next word, and gets its internal numbers adjusted every time it is wrong. This is done on thousands of chips in data centers.',
       explain:'Training happens once, before you ever chat, and for the largest models can take weeks or months. Afterward the numbers are frozen. When you chat, the model uses what it learned; it does not learn from your conversation unless the company later chooses to train a new version using it.',
       analogy:'Years of studying for an exam, then sitting the exam. Your chat is the exam: the studying is done.',
       classroom:'Where the training text came from (books, websites, code, other sources) is debated, including questions about copyright and privacy. Ask vendors what their tools were trained on.',
       misconception:'"The chatbot learns from me as we talk." In normal use its numbers do not change during a chat. A product may remember your history, but that is storage, not learning.',
       steps:[['1. Gather text','A very large collection: books, articles, websites, code and more.'],['2. Hide the next word','Take a sentence and cover up the word that comes next.'],['3. Let it guess','The model predicts the missing word.'],['4. Compare with the real word','How wrong was the guess?'],['5. Adjust its numbers','Nudge billions of internal numbers so the guess would be a bit better.'],['6. Repeat, a vast number of times','This is the part that needs data centers and a lot of electricity.'],['7. Fine-tune with people','People rate answers so it becomes more helpful and safer. Then it is released.']],
       check:{q:'When you chat with a finished chatbot, what happens to its learned numbers?',opts:['They change with every message','They stay fixed; it uses what it learned during training','They are erased','They are copied to your device'],ans:1,why:'Training is done. In normal use the numbers are fixed, even if a product stores your history.'},
       visual:'steps'},
     notes:{say:'"Guess the next word, check, adjust, and repeat an enormous number of times. That is training."',demo:'Click through the seven steps.',facilitate:'Ask: what do you want to know about a vendor’s training data?',misc:'That chats train the model in real time.',caveat:'Details vary by company and many are not public. Policies on using chats for future training differ; read the terms.',transition:'"Everything so far is built to make likely text. Let’s see what that means for accuracy."'}},
    {id:'c4-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l4a',level:'Warm-up',kind:'Multiple choice',q:'Where do the largest chatbots usually run?',opts:['On your own phone','In data centers full of servers and special chips','Inside the school server closet','Nowhere in particular'],ans:1,why:'The largest models run on special chips in data centers. Smaller models can run on a personal device.'},
      {id:'l4b',level:'Think it through',kind:'Multiple choice',q:'Which step is the core of training an LLM?',opts:['A person writes every answer','The model guesses the next word, is compared with the real word, and its numbers are adjusted','It copies text word for word','It is told the rules of grammar'],ans:1,why:'Guess, compare, adjust, repeat. It is learning from examples of real text.'},
      {id:'l4c',level:'Reflect',kind:'Reflection',reflect:true,q:'Knowing a chatbot runs in a data center, what would you want to ask before students use one?',points:['Where does the data go and who can see it?','Is it used to train future models?','Is there an approved school version?','What age or consent rules apply?']}],
     notes:{say:'Pair discussion for the reflection.',facilitate:'Press A to reveal.'}}
  ]
});

/* ---------------------------- CHAPTER 5 · HALLUCINATIONS AND USING AI WISELY ---------------------------- */
CHAPTERS.push({
  id:5,key:'factcheck',title:'The Fact-Check Center',short:'Hallucinations',env:'library',fx:'library',door:5,topic:'Hallucinations and using AI wisely',
  essential:'Why can a chatbot give a convincing answer that is wrong, and what should I do about it?',
  objectives:['Explain what an AI "hallucination" is.','Explain why smooth wording is not evidence of accuracy.','Use a simple routine to check a source.','List a few habits for using AI wisely in school.'],
  summary:['Chatbots pick likely words, not verified facts, so they can state wrong things confidently.','Check important claims in a trusted source you find yourself.','Giving a chatbot documents to answer from helps, but you still check.','Use AI for drafts and ideas; keep people in charge of decisions about students.'],
  refs:['ji2023','lewis2020','mata2023','pashler2008','parasuraman2010'],
  guide:{facilitation:'Aim for calibrated trust, not cynicism. Chatbots are useful drafting tools; the skill is knowing what to verify.',transitions:'Close with the final reflection back on campus.',qual:['Four of the eight citations in the Citation Detective are fictional teaching examples (stated on screen). The four real ones are well known; confirm any citation before reusing it.','How often a given chatbot makes things up varies by tool and task; avoid quoting exact rates.']},
  scenes:[
    {id:'c5-why',type:'concept',title:'Why Chatbots Make Things Up',minutes:2,station:420,
     concept:{term:'Made-up answers (hallucinations)',labels:L_LABELS,
       def:'An AI "hallucination" is an answer that sounds right but is not supported by real sources. It can be a wrong fact, an invented quotation, or a reference to a book or article that does not exist.',
       analogy:'A confident improv actor playing a librarian can sound completely convincing and invent a call number on the spot. Sounding right and being right are different things.',
       classroom:'A chatbot may invent a reading list, a quotation for a lesson, or a research study. In 2023 lawyers submitted a legal brief containing cases a chatbot had invented, and a court sanctioned them.',
       misconception:'"If it gives a source, it must have looked it up." Not unless it is connected to a real search or document tool, and even then it can describe the source wrongly.',
       steps:[['It learned patterns','Citations, quotes and facts follow familiar shapes in the text it learned from.'],['You ask for one','You ask for a source or a fact.'],['It picks likely pieces','It builds something that fits the shape. There is no built-in "I could not find it" check.'],['It sounds sure','The reply reads smoothly and confidently, true or not.'],['You check','Only you can confirm it, in a source you find yourself.']],
       check:{q:'A chatbot gives a perfectly formatted citation. What does the format tell you?',opts:['The article exists','It looks like a citation. You still have to confirm it exists','The journal approved it','The chatbot searched the web'],ans:1,why:'Formatting is easy to imitate. Look the source up in a library database or on the publisher’s site.'},
       visual:'steps',demo:'c5-citation'},
     notes:{say:'"A chatbot is built to sound right. That is not the same as being right."',demo:'Walk through the five steps.',facilitate:'Ask for a time a tool or a person gave them something plausible but wrong.',misc:'That newer chatbots never do this. They do it less in some cases, but it remains a known limitation.',caveat:'Some experts prefer "fabrication" or "confabulation".',transition:'"Can you spot a fake citation?"'}},
    {id:'c5-citation',type:'lab',title:'Try It: Real or Fake Citation?',minutes:2,station:820,sim:'citation',
     lab:{purpose:'Judge eight citations (four real, four fictional), then see the evidence.',steps:['Mark each as real or fabricated.','Talk with a neighbor about what you looked at.','Reveal the evidence and compare.'],prompt:'Which clues were reliable? What is your routine for checking a source?',classroom:'A ready-made activity: have students check citations from an AI-written bibliography.'},
     notes:{say:'"Real and fake look equally polished. The only reliable test is checking an independent source."',demo:'Four entries are fictional teaching examples. The other four are real, well-known works.',facilitate:'Look up one real citation live (doi.org or a library database).',caveat:'Confirm real citations yourself before reusing them.',transition:'"Does sounding confident mean it is right?"'}},
    {id:'c5-confidence',type:'lab',title:'Try It: Sounds Sure, Is It Right?',minutes:2,station:1220,sim:'confidence',
     lab:{purpose:'Guess which equally confident statements are true.',steps:['Choose true or false for each.','Reveal the evidence.','Compare how sure each sounded with how accurate it was.'],prompt:'If tone does not show reliability, what does?',classroom:'Students can write and swap their own true/false sets.'},
     notes:{say:'"Every statement is written with total certainty. Let’s see how many deserve it."',demo:'Written by a person in a confident chatbot style. Not real chatbot output.',facilitate:'Take a show of hands before each reveal.',caveat:'A real chatbot may or may not get these particular ones right.',transition:'"So how do we reduce the risk?"'}},
    {id:'c5-check',type:'concept',title:'How To Check',minutes:1,station:1620,
     concept:{term:'Giving it something to quote',labels:L_LABELS,
       def:'One way to reduce made-up answers is to give the chatbot trusted documents and ask it to answer only from them, with references you can open. This is sometimes called "retrieval."',
       analogy:'An open-book exam instead of a closed-book one: you can point to the page, but the student can still misread the page.',
       classroom:'A district assistant that answers from the district’s own policy files and shows where each answer came from is easier to check than a general chatbot.',
       misconception:'"If it shows sources, it must be correct." A source shows where to check. It does not prove the answer matches it.',
       check:{q:'A chatbot answers from your policy documents and cites them. What should you still do?',opts:['Nothing: it is guaranteed correct','Open the cited passage and confirm it says what the chatbot claims','Turn off the documents','Ask the chatbot if it is sure'],ans:1,why:'Grounding helps, but the answer can still misstate the source. Compare the claim to the passage.'},
       visual:'rag'},
     notes:{say:'"Give it something to quote, then check the quote."',demo:'Toggle Retrieval on and off and pick documents. Guided example: no AI or search is running.',caveat:'Quality depends on the documents and the setup.',transition:'"Last idea: how to use all this wisely."'}},
    {id:'c5-wise',type:'concept',title:'Using AI Wisely',minutes:2,station:420,
     concept:{term:'Five habits for using AI in school',labels:L_LABELS,
       def:'AI can save time on drafts and ideas. Using it wisely means checking what matters, keeping people in charge of decisions about students, protecting student data, and being open about when AI was used.',
       analogy:'A calculator. It is great for the arithmetic, but you still teach number sense so students can tell when an answer looks wrong.',
       classroom:'Plan for evidence of thinking: a short spoken explanation, drafts, or a note about how AI was used. A polished AI-assisted essay shows a good product, not necessarily what the student understands.',
       misconception:'"If a tool is usually right, I can stop checking." That is exactly when people stop paying attention, which researchers call automation bias. Keep checking the important things.',
       steps:[['1. Use it for drafts and ideas','Brainstorming, first drafts, rewording, and formatting.'],['2. Check the facts','Especially names, numbers, quotations and sources.'],['3. Keep people in charge of decisions','Grades, placements and support for students need a person who can explain the decision.'],['4. Protect student data','Do not paste in names or identifiable work unless your school has approved the tool.'],['5. Be open about it','Say when AI helped, and expect the same from students.']],
       check:{q:'Which task should most clearly keep a person in charge?',opts:['Reformatting a rubric','Brainstorming discussion questions','Deciding a student’s eligibility for special services','Summarizing meeting notes'],ans:2,why:'High-stakes decisions about individual students involve law, care and accountability. AI may inform, but a person decides.'},
       visual:'steps',demo:'c5-sort'},
     notes:{say:'"Five habits. If you remember only one: check what matters."',demo:'Walk through the five habits.',facilitate:'Ask each person to write one habit they will use this month.',misc:'That "AI helps" means "no review needed".',caveat:'Laws and district policies differ. This is not legal advice.',transition:'"Quick check, then we head back to campus."'}},
    {id:'c5-quiz',type:'quiz',title:'Quick Check',minutes:2,station:900,
     questions:[
      {id:'l5a',level:'Warm-up',kind:'Multiple choice',q:'Which best describes a hallucination?',opts:['A picture glitch','An answer that sounds right but is not supported by real sources','Any answer you dislike','A deliberate lie'],ans:1,why:'It is unsupported or invented content presented smoothly. It is not intentional deception.'},
      {id:'l5b',level:'Think it through',kind:'Scenario',q:'A chatbot gives a citation for a study that supports your lesson. What is the best next step?',opts:['Use it: it has authors and a journal name','Ask the same chatbot if it is real','Find the article yourself in a library database or on the publisher site','Check that the formatting looks right'],ans:2,why:'Verify independently. Asking the same chatbot is weak evidence because it can confirm things smoothly too.'},
      {id:'l5c',level:'Reflect',kind:'Reflection',reflect:true,q:'What should teachers and students keep doing themselves, even when AI can do it?',points:['Understanding enough to judge whether an answer makes sense.','Reasoning and explaining in your own words.','Checking sources and claims.','Care, ethics and responsibility for decisions.','Which to protect first is a local choice; reasonable educators differ.']}],
     notes:{say:'End with the reflection.',facilitate:'Press A to reveal.'}},
    {id:'c5-sort',type:'lab',title:'Optional: Who Should Do the Work?',minutes:2,optional:true,station:820,sim:'sort',
     lab:{purpose:'Optional. Sort twelve school tasks by how much a person must stay in charge.',steps:['Click a task, then click a column.','Press Check and read the reasons.','Argue: what would change your answer?'],prompt:'Which placements depend on grade level, stakes or local policy?',classroom:'Teams can build their own sort to draft a school AI-use guide.'},
     notes:{say:'Optional. There is no master key. Think about stakes and whether a decision can be undone.',demo:'Guided example with reasons. Disagreement is welcome.',caveat:'Reasonable answers vary.'}}
  ]
});

/* ---------------------------- CHAPTER 6 · RETURN TO CAMPUS ---------------------------- */
CHAPTERS.push({
  id:6,key:'closing',title:'Return to Campus',short:'Closing',env:'campus',fx:'dusk',
  essential:'What should students still learn to do themselves when AI can produce an answer?',
  objectives:['Pull the story together.','Name one thing you will do differently.'],
  summary:['What AI is, and its kinds and history.','How machines learn from examples.','How LLMs write one token at a time.','Where they live and how they are trained.','Why they hallucinate, and how to use them wisely.'],
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
