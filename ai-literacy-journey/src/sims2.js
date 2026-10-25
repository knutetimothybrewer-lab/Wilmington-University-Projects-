'use strict';
/* =====================================================================
   CHAPTER 3-5 LABS (verification, decision-making, collaboration)
   ===================================================================== */

/* ---------------- Ch3 · Lab A: Citation Detective ---------------- */
Sims.citation={kind:'script',title:'Laboratory A · The Citation Detective',
mount(el){
  const C=[
    {t:'Whitfield, R. A., & Nakamura-Obuya, T. (2021). Generative tutors and long-term retention in K-12 mathematics. Journal of Educational Cognition and Machine Learning, 14(3), 211-238. https://doi.org/10.1000/jecml.2021.0314',real:false,
     ev:'<b>FICTIONAL teaching example.</b> The DOI prefix 10.1000 belongs to the DOI Foundation itself and does not resolve to this article. The journal does not appear in major indexes. Warning signs: a perfect-sounding title that matches the claim you want, an unfamiliar journal, a DOI that fails to resolve.'},
    {t:'Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30. arXiv:1706.03762',real:true,
     ev:'<b>Verifiable.</b> The arXiv identifier resolves to the paper that introduced the Transformer architecture. Verification route: open arxiv.org/abs/1706.03762 and compare title, authors and year.'},
    {t:'Okafor-Lindqvist, P. (2020). Transformers in the classroom: A meta-analysis of 212 studies. Review of Educational Research, 90(4), 551-590.',real:false,
     ev:'<b>FICTIONAL teaching example.</b> A real, respected journal name with a plausible volume, issue and page range, but no such article exists. Warning signs: "real journal" camouflage, no DOI, an oddly large and round study count. Always search the journal\'s own site, not just a general web search.'},
    {t:'Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the dangers of stochastic parrots: Can language models be too big? In Proceedings of the 2021 ACM Conference on Fairness, Accountability, and Transparency (pp. 610-623). ACM. https://doi.org/10.1145/3442188.3445922',real:true,
     ev:'<b>Verifiable.</b> The DOI resolves to the FAccT 2021 conference paper. Verification route: paste the DOI at doi.org, confirm authors, pages and venue match.'},
    {t:'Marlowe, S. (2019). The Algorithmic Teacher: How Machines Learned to Instruct. Westbrook University Press. ISBN 978-0-00-000000-0',real:false,
     ev:'<b>FICTIONAL teaching example.</b> The ISBN 978-0-00-000000-0 is not a valid, assigned ISBN (check digits and publisher block do not correspond to a real title) and the press cannot be found in a library catalog. Warning signs: invalid identifiers, publisher you cannot locate, no catalog record in WorldCat or a library database.'},
    {t:'Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A., & Fung, P. (2023). Survey of hallucination in natural language generation. ACM Computing Surveys, 55(12), Article 248. https://doi.org/10.1145/3571730',real:true,
     ev:'<b>Verifiable.</b> A survey in ACM Computing Surveys on hallucination in text generation. Verification route: follow the DOI, confirm volume, issue and article number match.'},
    {t:'Duarte, L., Ng, S., & Haldane, K. (2022). Hallucination-free tutoring through self-consistency. arXiv:2299.01234',real:false,
     ev:'<b>FICTIONAL teaching example.</b> arXiv identifiers encode year and month (YYMM); "2299" would be month 99 of 2022, which cannot exist. The title also promises something implausibly absolute. Warning signs: malformed identifier, over-promising title.'},
    {t:'Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation: An attentional integration. Human Factors, 52(3), 381-410. https://doi.org/10.1177/0018720810376055',real:true,
     ev:'<b>Verifiable.</b> A widely cited review of automation complacency and automation bias in the journal Human Factors. Verification route: DOI lookup, then check the journal\'s volume 52 issue 3 table of contents.'}];
  const mark=C.map(()=>null);let revealed=C.map(()=>false);
  const list=h('div',{class:'grid2'}),score=h('div');
  function draw(){
    list.innerHTML='';
    C.forEach((c,i)=>{
      const card=h('div',{class:'card'},h('div',{style:{fontSize:'.8em',lineHeight:1.35}},c.t),
        h('div',{class:'row',style:{marginTop:'8px'}},
          h('button',{class:'btn sm'+(mark[i]==='real'?' on':''),type:'button',onclick:()=>{mark[i]='real';draw();}},'Looks real'),
          h('button',{class:'btn sm'+(mark[i]==='fake'?' on':''),type:'button',onclick:()=>{mark[i]='fake';draw();}},'Looks fabricated'),
          h('button',{class:'btn sm',type:'button',onclick:()=>{revealed[i]=!revealed[i];draw();}},revealed[i]?'Hide evidence':'Reveal evidence')));
      if(revealed[i]){const ok=mark[i]&&((mark[i]==='real')===c.real);card.append(h('div',{class:'callout '+(c.real?'good':'bad'),style:{marginTop:'8px',fontSize:'.8em'},html:(mark[i]?(ok?'✔ Your call matched. ':'✘ Your call did not match. '):'(no call made) ')+c.ev}));}
      list.appendChild(card);
    });
    const done=C.filter((c,i)=>revealed[i]&&mark[i]&&((mark[i]==='real')===c.real)).length,rev=revealed.filter(Boolean).length;
    score.innerHTML=rev?`Revealed ${rev} of ${C.length}. Correct calls among revealed: <b>${done}</b>. The lesson is not "spot fakes by feel": real and fabricated entries look equally polished. <b>The only reliable test is checking an independent source.</b>`:'Mark each citation, discuss, then reveal the evidence.';
  }
  el.append(UI.note('<b>Heads-up:</b> four of these eight entries are <b>fictional teaching examples</b>. The four real entries were chosen because they are well known; still confirm any citation yourself before relying on it.','warn'),list,h('div',{class:'row'},UI.btn('Reveal all',()=>{revealed=C.map(()=>true);draw();},'pri'),UI.btn('Reset',()=>{mark.fill(null);revealed=C.map(()=>false);draw();})),score);
  draw();
}};

/* ---------------- Ch3 · Lab B: Confidence versus accuracy ---------------- */
Sims.confidence={kind:'script',title:'Laboratory B · Confidence Versus Accuracy',
mount(el){
  const Q=[
    {c:'The Great Wall of China is easily visible to the naked eye from the Moon.',a:false,ev:'False. This is a long-standing myth; from the Moon no human-made structure is discernible by eye, and even from low Earth orbit the wall is hard to pick out.'},
    {c:'Matching instruction to each student\'s preferred learning style (visual, auditory, kinesthetic) reliably improves learning outcomes.',a:false,ev:'Not supported. A review by Pashler, McDaniel, Rohrer & Bjork (2008, Psychological Science in the Public Interest, 9(3), 105-119) found no adequate evidence for the "matching" hypothesis.'},
    {c:'Canberra is the capital city of Australia.',a:true,ev:'True. Sydney and Melbourne are larger, which is why the error is common.'},
    {c:'The 2001 revision of Bloom\'s taxonomy, edited by Anderson and Krathwohl, restated the cognitive categories as verbs.',a:true,ev:'True. The revision (A Taxonomy for Learning, Teaching, and Assessing) uses Remember, Understand, Apply, Analyze, Evaluate, Create.'},
    {c:'Humans use only about 10 percent of their brains.',a:false,ev:'False. Imaging and lesion studies show activity throughout the brain over a day; there is no dormant 90 percent.'},
    {c:'Water boils at a lower temperature at higher altitude.',a:true,ev:'True. Lower air pressure lowers the boiling point.'}];
  const pick=Q.map(()=>null);let shown=false;
  const list=h('div'),res=h('div');
  function draw(){
    list.innerHTML='';
    Q.forEach((q,i)=>{
      const card=h('div',{class:'card',style:{margin:'7px 0'}},h('div',{class:'row'},h('div',{class:'grow'},h('span',{class:'pill'},'AI-style claim '+(i+1)+' · tone: 100% certain'),h('div',{style:{fontSize:'1.02em',marginTop:'4px'}},'“'+q.c+'”')),
        h('button',{class:'btn sm'+(pick[i]===true?' on':''),type:'button',onclick:()=>{pick[i]=true;draw();}},'I predict TRUE'),h('button',{class:'btn sm'+(pick[i]===false?' on':''),type:'button',onclick:()=>{pick[i]=false;draw();}},'I predict FALSE')));
      if(shown){const ok=pick[i]===q.a;card.append(h('div',{class:'callout '+(q.a?'good':'bad'),style:{marginTop:'6px',fontSize:'.85em'},html:`<b>${q.a?'TRUE':'FALSE'}</b> ${pick[i]==null?'':ok?'(you predicted correctly)':'(you predicted incorrectly)'}. ${q.ev}`}));}
      list.appendChild(card);
    });
    if(shown){const right=Q.filter((q,i)=>pick[i]===q.a).length,truth=Q.filter(q=>q.a).length;
      res.innerHTML=`<div class="grid2"><div class="card"><div class="sub">How confident every claim sounded</div><div class="big">6 / 6</div></div><div class="card"><div class="sub">How many were actually true</div><div class="big">${truth} / 6</div></div></div>You predicted ${right} of 6 correctly. <b>Confident phrasing carried no information about accuracy.</b> A fluent model can state true and false claims in the same assured voice.`;}
    else res.innerHTML='';
  }
  el.append(UI.note('Predict first, then reveal. These are classroom-style claims written in the uniformly confident tone typical of AI output (they are scripted, not model outputs).'),list,h('div',{class:'row'},UI.btn('Reveal evidence',()=>{shown=true;draw();},'pri'),UI.btn('Reset',()=>{pick.fill(null);shown=false;draw();})),res);
  draw();
}};

/* ---------------- Ch3 · Lab C: Research verification challenge ---------------- */
Sims.verify={kind:'script',title:'Laboratory C · The Research Verification Challenge',
mount(el){
  const issues=[
    ['Effect size is inflated (a 40% gain vs. a 6-point difference)',true],
    ['"All students" overgeneralizes from a single school of 48 students',true],
    ['"Proved" is too strong: the difference was not statistically significant (p = .21)',true],
    ['Causal language ("raise") although students were not randomly assigned',true],
    ['The study year is probably wrong',false],
    ['The test used was invalid',false]];
  const sel=new Set();let done=false;
  const box=h('div'),fb=h('div');
  function draw(){
    box.innerHTML='';
    issues.forEach(([t,ok],i)=>{
      box.appendChild(h('button',{class:'opt'+(sel.has(i)?' sel':'')+(done?(ok?' right':sel.has(i)?' wrong':''):''),type:'button',onclick:()=>{if(done)return;sel.has(i)?sel.delete(i):sel.add(i);draw();}},(sel.has(i)?'☑ ':'☐ ')+t));
    });
    if(done){const good=issues.filter(([t,ok],i)=>ok===sel.has(i)).length;
      fb.innerHTML=`<div class="fb"><b>${good} of ${issues.length} judgments matched.</b> The excerpt says nothing about the year or the validity of the test, so claiming a problem there is itself an unsupported assumption. A supported rewrite: <i>"In one small pilot (48 students, one school), students who used an AI practice tool scored about 6 points higher on a unit test, but the difference was not statistically significant and students were not randomly assigned."</i></div>`;}
    else fb.innerHTML='';
  }
  el.append(h('div',{class:'grid2'},
    h('div',{class:'card'},h('h3',{},'Step 1 · The AI-style claim'),h('div',{class:'big',style:{fontSize:'26px'}},'“A 2022 study proved that AI tutors raise test scores by 40% for all students.”')),
    h('div',{class:'card'},h('h3',{},'Step 2 · The source, read carefully (fictional excerpt)'),h('div',{style:{fontSize:'.9em'}},'“In a pilot at one middle school (n = 48), students using an AI practice tool scored 6 percentage points higher on a unit test than a comparison group (p = .21, not statistically significant). Students were not randomly assigned. Effects were larger for students who completed more sessions. The authors caution that results may not generalize beyond this setting.”'))),
    h('h3',{},'Step 3 · Which problems can you SUPPORT using only this excerpt?'),box,
    h('div',{class:'row'},UI.btn('Check my judgments',()=>{done=true;draw();},'pri'),UI.btn('Reset',()=>{sel.clear();done=false;draw();})),fb,
    UI.note('<b>Verification routine:</b> (1) locate the source yourself, (2) read the passage the claim depends on, (3) compare numbers, scope and certainty, (4) rewrite the claim to match what the evidence supports.','good'));
  draw();
}};

/* ---------------- Ch4 · Lab A: Student support recommendation ---------------- */
Sims.supportrec={kind:'script',title:'Laboratory A · The Student Support Recommendation',
mount(el){
  const facts=[
    ['Attendance context','9 of the recent absences fall within a documented family medical event; all are excused.'],
    ['Teacher observation','Quiz scores rose 14 points over two weeks; the student participates actively when present.'],
    ['Model limits','The risk model was trained on three prior years that did not include a remote-learning period. Its own uncertainty range is wide (0.55 to 0.97).'],
    ['Lower-intensity option','A Tier 2 weekly check-in plan preserves class access and can be escalated if progress stalls.']];
  let seen=0,decision=null;
  const infoBox=h('div'),out=h('div');
  function draw(){
    infoBox.innerHTML='';
    facts.slice(0,seen).forEach(([t,x])=>infoBox.appendChild(h('div',{class:'callout',style:{margin:'6px 0'},html:`<b>${t}:</b> ${x}`})));
    out.innerHTML='';
    if(decision){
      const inv=seen;let msg,cls;
      if(decision==='accept'&&inv===0){cls='bad';msg='<b>Accepted without checking.</b> This is the pattern automation bias describes: acting on a high-stakes recommendation without consulting information that was available. Acting on a flawed recommendation is an <b>error of commission</b>.';}
      else if(decision==='reject'&&inv===0){cls='warn';msg='<b>Rejected without checking.</b> Rejecting by reflex is not oversight either; it can be algorithm aversion. Oversight means weighing evidence, not choosing a side in advance.';}
      else if(inv>=3){cls='good';msg='<b>You reviewed the evidence before deciding.</b> Whether you accepted, rejected, or chose a middle path, the decision is now yours and can be explained to the family and your team. The key professional move: the AI informs, a person decides and is accountable.';}
      else{cls='warn';msg=`<b>You reviewed ${inv} of 4 items.</b> Partial review is better than none. Ask what you still do not know before a high-stakes referral.`;}
      out.append(h('div',{class:'callout '+cls,html:msg}));
    }
  }
  el.append(h('div',{class:'grid2'},
    h('div',{class:'card'},h('h3',{},'Fictional student profile'),h('table',{html:'<tr><th>Student</th><td>Jordan M., Grade 8</td></tr><tr><th>Attendance (30 days)</th><td>71%</td></tr><tr><th>Missing assignments</th><td>3</td></tr><tr><th>Quiz average</th><td>68%</td></tr>'})),
    h('div',{class:'card',style:{borderColor:'var(--cy)'}},h('h3',{},'AI recommendation (scripted)'),h('div',{class:'big',style:{fontSize:'28px'}},'Refer to Tier 3 intensive intervention.'),h('div',{class:'sub'},'Risk score 0.91 · "high confidence"'))),
    h('div',{class:'row'},UI.btn('Accept',()=>{decision='accept';draw();}),UI.btn('Reject',()=>{decision='reject';draw();}),UI.btn('Investigate: reveal next item',()=>{if(seen<4)seen++;draw();},'pri'),UI.btn('Reset scenario',()=>{seen=0;decision=null;draw();})),infoBox,out,
    UI.note('Suggested facilitation: have the class commit to Accept / Reject / Investigate before revealing anything. Then reveal one item at a time and ask who would change their decision.'));
  draw();
}};

/* ---------------- Ch4 · Lab B: AI assessment error ---------------- */
Sims.assesserror={kind:'script',title:'Laboratory B · The AI-Generated Test Questions',
mount(el){
  const I=[
    {q:'What is 3/4 ÷ 3/8?',key:'Answer key: 1/2',err:true,why:'Dividing by 3/8 multiplies by 8/3: (3/4)(8/3) = 24/12 = 2. The key (1/2) inverted the operation, a classic and subtle error.'},
    {q:'What causes the seasons on Earth?',key:'Answer key: B. The change in Earth\'s distance from the Sun',err:true,why:'Seasons are caused mainly by the tilt of Earth\'s axis. The distance explanation is a popular misconception, and it appears here with an authoritative answer key.'},
    {q:'Which number is prime? A) 21  B) 27  C) 29  D) 33',key:'Answer key: C',err:false,why:'Correct: 29 has no divisors other than 1 and itself; 21, 27 and 33 are multiples of 3.'},
    {q:'Choose the correct sentence.',key:'Answer key: The students finished their projects.',err:false,why:'Correct use of "their" as a possessive plural. (Nothing wrong here: not every AI output contains an error, which is why checking must be proportional, not paranoid.)'}];
  const pick=I.map(()=>null);let shown=false;const list=h('div'),res=h('div');
  function draw(){
    list.innerHTML='';
    I.forEach((it,i)=>{
      const card=h('div',{class:'card',style:{margin:'7px 0'}},h('div',{class:'row'},h('div',{class:'grow'},h('b',{},(i+1)+'. '+it.q),h('div',{class:'sub'},it.key)),
        h('button',{class:'btn sm'+(pick[i]===false?' on':''),type:'button',onclick:()=>{pick[i]=false;draw();}},'Looks fine'),h('button',{class:'btn sm'+(pick[i]===true?' on':''),type:'button',onclick:()=>{pick[i]=true;draw();}},'Contains an error')));
      if(shown)card.append(h('div',{class:'callout '+(it.err?'bad':'good'),style:{marginTop:'6px',fontSize:'.85em'},html:`<b>${it.err?'ERROR':'CORRECT'}</b> ${pick[i]==null?'':pick[i]===it.err?'(your judgment matched)':'(your judgment did not match)'}. ${it.why}`}));
      list.appendChild(card);
    });
    res.innerHTML=shown?`You matched ${I.filter((x,i)=>pick[i]===x.err).length} of ${I.length}. Fluent formatting and an answer key create <b>perceived authority</b>. Errors in generated assessments reach every student who takes them, which is why educator review is a professional responsibility, not a courtesy.`:'';
  }
  el.append(UI.note('An AI tool produced these four items for a quiz. Decide which have problems <b>before</b> revealing. (Items are scripted for teaching.)'),list,h('div',{class:'row'},UI.btn('Reveal',()=>{shown=true;draw();},'pri'),UI.btn('Reset',()=>{pick.fill(null);shown=false;draw();})),res);
  draw();
}};

/* ---------------- Ch4 · Lab C: Trust experiment ---------------- */
Sims.trust={kind:'script',title:'Laboratory C · The Trust Experiment',
mount(el){
  const R=[
    'Move Maya from the 9:00 reading group to the 10:30 group. She has mastered the decoding skills assessed last week and would benefit from more advanced comprehension tasks.',
    'Delay the fractions unit for Period 3 by one week. Formative checks show many students still lack prerequisite skills with equivalent fractions.'];
  const labels=[['AI analytics assistant','Experienced instructional coach'],['Experienced instructional coach','AI analytics assistant']]; // round 1, round 2 label for R1 / R2
  const rating=[[null,null],[null,null]];  // [round][rec]
  let round=0;
  const area=h('div'),out=h('div');
  function draw(){
    area.innerHTML='';
    R.forEach((r,i)=>{
      const lab=round===0?[labels[0][0],labels[0][1]][i]:[labels[1][0],labels[1][1]][i];
      area.appendChild(h('div',{class:'card',style:{margin:'8px 0'}},h('div',{class:'row'},h('span',{class:'badge '+(lab.startsWith('AI')?'script':'real')},'Source: '+lab)),h('div',{style:{margin:'6px 0'}},'“'+r+'”'),
        h('div',{class:'row'},h('span',{class:'sub'},'How willing am I to follow this?'),...[1,2,3,4,5].map(n=>h('button',{class:'btn sm'+(rating[round][i]===n?' on':''),type:'button',onclick:()=>{rating[round][i]=n;draw();}},String(n))))));
    });
    out.innerHTML='';
    if(round===1&&rating.flat().every(x=>x!=null)){
      const d1=rating[1][0]-rating[0][0],d2=rating[1][1]-rating[0][1];
      out.append(h('div',{class:'callout',html:`The <b>text of each recommendation was identical</b> in both rounds; only the label changed. Recommendation 1: ${rating[0][0]} → ${rating[1][0]} (${d1>=0?'+':''}${d1}). Recommendation 2: ${rating[0][1]} → ${rating[1][1]} (${d2>=0?'+':''}${d2}). Any shift reflects the label, not the content. <b>Not a validated experiment:</b> a one-person demonstration cannot show what people in general do. Published research on reliance on automation and on "algorithm aversion/appreciation" is mixed and depends on the task, the stakes and prior experience (see Dietvorst et al., 2015; Logg et al., 2019).`}));
    }
  }
  el.append(UI.note('<b>Classroom demonstration, not a validated psychological experiment.</b> Rate each recommendation, then press "Swap the labels" and rate the same recommendations again.'),area,h('div',{class:'row'},UI.btn('Swap the labels →',()=>{round=1;draw();},'pri'),UI.btn('Reset',()=>{rating.forEach(r=>r.fill(null));round=0;draw();})),out);
  draw();
}};

/* ---------------- Ch5 · Lab A: Who should do the work? ---------------- */
Sims.sort={kind:'script',title:'Laboratory A · Who Should Do the Work?',
mount(el){
  const B=['AI can assist substantially','Human-led, with AI support','Human responsibility must remain central'];
  const A=[
    ['Reformatting a rubric into a student-friendly table',0,'Low stakes, easy to inspect.'],
    ['Summarizing a meeting transcript into action items',0,'Useful drafting help; still skim against the transcript.'],
    ['Brainstorming ten discussion-starter questions',0,'Generating options is a strength; you choose which to keep.'],
    ['Drafting a first version of a parent newsletter',0,'Teacher reviews tone and facts before sending.'],
    ['Creating practice quiz items for a unit',1,'Items can contain subtle errors (see Chapter 4); teacher verifies each one.'],
    ['Adapting a reading passage for different reading levels',1,'Check that meaning, accuracy and dignity of the text survive.'],
    ['Giving feedback on student essay drafts',1,'AI can suggest; the teacher knows the student and the learning goal.'],
    ['Translating routine family communications',1,'Helpful for access; verify meaning and confidentiality.'],
    ['Assigning final grades on high-stakes work',2,'Consequential, requires accountable human judgment and the ability to explain it.'],
    ['Deciding special-education eligibility or placement',2,'Legal duties, due process and individual context.'],
    ['Counseling a student in distress',2,'Relationship, care and duty of care cannot be delegated.'],
    ['Writing a student\'s recommendation letter',2,'It speaks for you from your knowledge of the student.']];
  let place=A.map(()=>-1),selI=-1,checked=false;
  const pool=h('div'),bk=B.map((b,i)=>h('div',{class:'bucket',tabindex:0,role:'button','aria-label':'Place in '+b}));
  const order=shuffle(A.map((_,i)=>i),rng(5));
  function draw(){
    pool.innerHTML='';bk.forEach((b,i)=>{b.innerHTML='';b.append(h('h4',{},B[i]));});
    order.forEach(i=>{
      const it=A[i];const ok=checked&&place[i]>=0&&place[i]===it[1];const no=checked&&place[i]>=0&&place[i]!==it[1];
      const btn=h('button',{class:'sortitem'+(selI===i?' sel':'')+(ok?' ok':'')+(no?' no':''),type:'button',draggable:'true',onclick:()=>{selI=selI===i?-1:i;draw();},ondragstart:e=>{e.dataTransfer.setData('text/plain',String(i));selI=i;}},it[0],checked&&place[i]>=0?h('div',{class:'sub',style:{fontSize:'.85em'}},(ok?'✔ ':'→ suggested: '+B[it[1]]+'. ')+it[2]):null);
      (place[i]<0?pool:bk[place[i]]).appendChild(btn);
    });
  }
  bk.forEach((b,i)=>{const drop=()=>{if(selI>=0){place[selI]=i;selI=-1;draw();}};b.addEventListener('click',e=>{if(e.target===b||e.target.tagName==='H4')drop();});b.addEventListener('keydown',e=>{if(e.key==='Enter'){drop();}});b.addEventListener('dragover',e=>{e.preventDefault();b.classList.add('over');});b.addEventListener('dragleave',()=>b.classList.remove('over'));b.addEventListener('drop',e=>{e.preventDefault();b.classList.remove('over');const k=+e.dataTransfer.getData('text/plain');place[k]=i;selI=-1;draw();});});
  const result=h('div');
  el.append(UI.note('<b>How:</b> click an activity, then click a column (or drag it). Defensible answers depend on context, policy and stakes, so use "Check" as a conversation starter, not a verdict.'),
    h('div',{class:'grid4',style:{alignItems:'start'}},h('div',{},h('h3',{},'Activities'),pool),...bk),
    h('div',{class:'row',style:{marginTop:'8px'}},UI.btn('Check placements',()=>{checked=true;draw();const n=A.filter((a,i)=>place[i]===a[1]).length;result.innerHTML=`<b>${n} of ${A.length}</b> placements match the suggested reasoning. Where you disagreed, what context would change the answer?`;},'pri'),UI.btn('Reset',()=>{place.fill(-1);selI=-1;checked=false;result.innerHTML='';draw();})),result);
  draw();
}};

/* ---------------- Ch5 · Lab B: Three collaboration models ---------------- */
Sims.collab={kind:'sim',title:'Laboratory B · Three Collaboration Models',
mount(el){
  const v={eH:6,eA:15,d:70,tH:12,tA:2,tR:4},N=100;
  const out=h('div');
  function draw(){
    const M=[['Human-only',N*v.eH/100,N*v.tH/60,'#ffb84d','Strong skill practice; slower; human error remains'],
             ['AI output accepted uncritically',N*v.eA/100,N*v.tA/60,'#ff6b6b','Fastest; AI errors pass straight through; little practice or ownership'],
             ['Human-directed AI + verification',N*v.eA/100*(1-v.d/100),N*(v.tA+v.tR)/60,'#38d996','Faster than solo; remaining errors depend on how well you verify']];
    const maxE=Math.max(...M.map(m=>m[1]),1),maxT=Math.max(...M.map(m=>m[2]),1);
    out.innerHTML='<div class="grid3">'+M.map(m=>`<div class="card" style="border-color:${m[3]}"><b>${m[0]}</b><div class="sub">Errors remaining in ${N} tasks</div><div style="height:20px;background:#fff1;border-radius:6px"><div style="height:100%;width:${m[1]/maxE*100}%;background:${m[3]};border-radius:6px;transition:width .4s"></div></div><b>${m[1].toFixed(1)}</b><div class="sub">Time (hours)</div><div style="height:20px;background:#fff1;border-radius:6px"><div style="height:100%;width:${m[2]/maxT*100}%;background:#7fa8ff;border-radius:6px;transition:width .4s"></div></div><b>${m[2].toFixed(1)} h</b><div class="sub" style="margin-top:6px">${m[4]}</div></div>`).join('')+'</div>';
  }
  const sls=[['Human-only error rate (%)','eH',0,30],['AI draft error rate (%)','eA',0,40],['Reviewer catches this % of AI errors','d',0,100],['Minutes per task: human alone','tH',2,30],['Minutes per task: AI draft','tA',1,10],['Minutes per task: review/verification','tR',0,15]].map(([l,k,mn,mx])=>UI.slider(l,mn,mx,1,v[k],x=>{v[k]=x;draw();}));
  el.append(UI.note('<b>Simplified simulation with made-up parameters:</b> it makes no claim about real error rates, which vary enormously by task, tool and person. Its point is structural: verification is what separates model 2 from model 3, and the model that saves the most time may also remove the most practice.','warn'),h('div',{class:'grid2'},...sls.map(s=>s.el)),out,
    UI.note('Not modeled: learning. Who retains the skill and understanding in each model? That depends on how the task is designed, and is where educators\' choices matter most.'));
  draw();
}};

/* ---------------- Ch5 · Lab C: Responsible AI principles ---------------- */
Sims.principles={kind:'script',title:'Laboratory C · Build Your Responsible AI Principles',
mount(el){
  const P=[
    ['accountability','Accountability','A named person remains responsible for every consequential decision, whatever tools were used.'],
    ['verification','Verification','We check AI output against reliable sources before it informs students, grades or policy.'],
    ['privacy','Privacy & data protection','We do not enter identifiable student information into tools without approval and a clear data agreement.'],
    ['equity','Equity & accessibility','We test whether tools work fairly for all learners and use AI to widen, not narrow, access.'],
    ['transparency','Transparency','We tell students and families when and how AI is used, and expect the same disclosure from students.'],
    ['agency','Student agency','Students keep meaningful choices, voice and the chance to do the thinking themselves.'],
    ['purpose','Pedagogical purpose','We use AI only when it serves a learning goal that we can name.'],
    ['wellbeing','Safety & well-being','We consider emotional, developmental and safety effects, especially for younger learners.']];
  const SC=[
    ['A vendor offers a free AI tutor that asks for students\' names and writing samples.',['privacy','transparency','accountability','purpose']],
    ['An AI essay scorer gives systematically lower scores to multilingual learners.',['equity','verification','accountability','agency']],
    ['Students submit reflections drafted entirely by AI.',['agency','purpose','transparency','verification']]];
  const MAX=5;let scn=0;
  const grid=h('div',{class:'grid4'}),stmt=h('div',{class:'card',style:{whiteSpace:'pre-wrap'}}),test=h('div'),cnt=h('div',{class:'sub'});
  function draw(){
    grid.innerHTML='';
    P.forEach(([id,n,d])=>{const on=S.principles.includes(id);grid.appendChild(h('button',{class:'principle'+(on?' on':''),type:'button','aria-pressed':on,onclick:()=>{if(on)S.principles=S.principles.filter(x=>x!==id);else if(S.principles.length<MAX)S.principles.push(id);else toast(`Choose at most ${MAX}: that is the point, principles compete.`);saveState();draw();}},h('b',{},(on?'✔ ':'')+n),d));});
    cnt.textContent=`${S.principles.length} of ${MAX} selected`;
    const chosen=P.filter(p=>S.principles.includes(p[0]));
    stmt.textContent=chosen.length?'In our classroom, AI use will be guided by these commitments:\n'+chosen.map((p,i)=>`${i+1}. ${p[1]}: ${p[2]}`).join('\n'):'Select principles to generate your statement.';
    const s=SC[scn],missing=s[1].filter(x=>!S.principles.includes(x));
    test.innerHTML=`<div class="callout"><b>Stress test:</b> ${s[0]}<br>Relevant principles: ${s[1].map(x=>`<b style="color:${S.principles.includes(x)?'#38d996':'#ffb84d'}">${P.find(p=>p[0]===x)[1]}</b>`).join(', ')}. ${missing.length?`Your statement does not yet cover: ${missing.map(x=>P.find(p=>p[0]===x)[1]).join(', ')}. Is that a deliberate trade-off?`:'Your statement covers all of them.'}</div>`;
  }
  el.append(UI.note('Choose up to five principles to prioritize. Real policies must balance competing values, so you cannot take them all.'),cnt,grid,h('div',{class:'row'},h('span',{class:'sub'},'Stress-test scenario:'),UI.seg(SC.map((s,i)=>[i,'Scenario '+(i+1)]),0,v=>{scn=+v;draw();})),test,h('h3',{},'Your draft statement'),stmt,
    h('div',{class:'row'},UI.btn('Copy statement',async()=>{try{await navigator.clipboard.writeText(stmt.textContent);toast('Copied');}catch(e){const r=document.createRange();r.selectNodeContents(stmt);const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Select + copy (Ctrl+C)');}},'pri'),UI.btn('Clear',()=>{S.principles=[];saveState();draw();})));
  draw();
}};

/* ===================== CONCEPT FIGURES (Vis) ===================== */
const Vis={};
Vis.roadmap=(b,sc,cap)=>{
  const items=CHAPTERS.slice(1,6),svg=h('svg',{viewBox:'0 0 560 470'});
  svg.append(h('path',{d:'M60 60C260 40 320 120 480 100S300 220 100 250 520 400 500 420',fill:'none',stroke:'#38e1ff','stroke-width':4,class:'flow'}));
  const pts=[[60,60],[300,100],[470,160],[110,250],[480,415]];
  items.forEach((c,i)=>{const[x,y]=pts[i];svg.append(h('g',{class:'node',tabindex:0,role:'button','aria-label':'Go to '+c.title,onclick:()=>Nav.travelTo(i+1),onkeydown:e=>{if(e.key==='Enter')Nav.travelTo(i+1);}},h('circle',{cx:x,cy:y,r:30,fill:'#00693C',stroke:'#ffe08a','stroke-width':4}),h('text',{x,y:y+10,'text-anchor':'middle',fill:'#fff','font-size':30,'font-weight':700},String(i+1)),h('text',{x:x+(x>400?-40:40),y:y+6,'text-anchor':x>400?'end':'start',fill:'#fff','font-size':19},c.short)));});
  b.append(svg);cap('Five stops on the campus tour. Click a stop to walk there.');
};
Vis.venn=(b,sc,cap)=>{
  const T={ai:'Artificial intelligence: the broad goal of systems that perform tasks associated with human intelligence. It includes many methods.',rule:'Rule-based (symbolic) AI: experts write explicit IF-THEN logic. Transparent, but brittle outside what the author anticipated.',ml:'Machine learning: the system fits a model to example data instead of following hand-written rules.',dl:'Deep learning: machine learning with multi-layer neural networks; the engine behind modern speech, vision and language systems.',gen:'Generative AI: models that produce new content (text, images, audio). Most current systems are built with deep learning.'};
  const svg=h('svg',{viewBox:'0 0 560 450'});const g=(k,el)=>{el.classList.add('node');el.setAttribute('tabindex',0);el.setAttribute('role','button');el.setAttribute('aria-label',T[k].split(':')[0]);el.addEventListener('click',()=>cap(T[k]));el.addEventListener('keydown',e=>{if(e.key==='Enter')cap(T[k]);});return el;};
  svg.append(g('ai',h('rect',{x:10,y:10,width:540,height:430,rx:30,fill:'#14305f',stroke:'#7fa8ff','stroke-width':3})),h('text',{x:30,y:42,fill:'#ffe08a','font-size':20,'font-weight':700,'pointer-events':'none'},'Artificial intelligence'),
    g('rule',h('rect',{x:28,y:70,width:170,height:90,rx:14,fill:'#3a2a14',stroke:'#ffb84d','stroke-width':3})),h('text',{x:113,y:122,'text-anchor':'middle',fill:'#fff','font-size':18,'pointer-events':'none'},'Rule-based'),
    g('ml',h('ellipse',{cx:350,cy:250,rx:195,ry:160,fill:'#1d4a7a',stroke:'#38e1ff','stroke-width':3})),h('text',{x:350,y:122,'text-anchor':'middle',fill:'#fff','font-size':20,'font-weight':700,'pointer-events':'none'},'Machine learning'),
    g('dl',h('ellipse',{cx:350,cy:278,rx:145,ry:105,fill:'#2b3d96',stroke:'#9a7bff','stroke-width':3})),h('text',{x:350,y:208,'text-anchor':'middle',fill:'#fff','font-size':19,'font-weight':700,'pointer-events':'none'},'Deep learning'),
    g('gen',h('ellipse',{cx:350,cy:318,rx:100,ry:52,fill:'#6a2b8a',stroke:'#ff5ec4','stroke-width':3})),h('text',{x:350,y:324,'text-anchor':'middle',fill:'#fff','font-size':18,'font-weight':700,'pointer-events':'none'},'Generative AI'));
  b.append(svg);cap('Click a region. These are teaching categories, not rigid scientific boxes: they overlap and blur.');
};
Vis.tokenstream=(b,sc,cap)=>{
  const toks=['Teach','ers',' love',' learn','ing'],ids=[12874,364,1842,3218,278];
  const svg=h('svg',{viewBox:'0 0 560 450'});
  svg.append(h('text',{x:280,y:44,'text-anchor':'middle',fill:'#fff','font-size':26},'“Teachers love learning”'));
  toks.forEach((t,i)=>{const x=40+i*98;svg.append(h('path',{d:`M280 60L${x+40} 110`,stroke:'#38e1ff','stroke-width':2,class:'flow',fill:'none'}),h('rect',{x,y:110,width:84,height:44,rx:9,fill:`hsl(${i*60} 80% 72%)`}),h('text',{x:x+42,y:140,'text-anchor':'middle',fill:'#111','font-size':19,'font-family':'monospace'},t.replace(' ','·')),
    h('path',{d:`M${x+42} 156V196`,stroke:'#ffe08a','stroke-width':2,class:'flow',fill:'none'}),h('rect',{x,y:198,width:84,height:40,rx:9,fill:'#16284f',stroke:'#ffe08a','stroke-width':2}),h('text',{x:x+42,y:225,'text-anchor':'middle',fill:'#ffe08a','font-size':18,'font-family':'monospace'},String(ids[i])),
    h('path',{d:`M${x+42} 240V280`,stroke:'#ff5ec4','stroke-width':2,class:'flow',fill:'none'}));
    [0,1,2,3].forEach(k=>svg.append(h('rect',{x:x+10+k*17,y:284+(((i*7+k*5)%5)*6),width:12,height:70-(((i*7+k*5)%5)*6),rx:3,fill:'#ff5ec4',opacity:.85,class:'flick',style:{animationDelay:(i*.2+k*.1)+'s'}})));});
  svg.append(h('text',{x:280,y:395,'text-anchor':'middle',fill:'#ffe08a','font-size':17},'text → tokens → integer IDs → embedding vectors'),h('text',{x:280,y:420,'text-anchor':'middle',fill:'#b9c8ea','font-size':14},'(IDs and bars are illustrative)'));
  b.append(svg);cap('Figure: the model never reads letters. Text becomes tokens, then ID numbers, then vectors of numbers.');
};
Vis.transformer=(b,sc,cap)=>{
  const L=[['Next-token probabilities (softmax)','Scores for every vocabulary token are turned into probabilities. Sampling then picks one.','#ff5ec4'],['Repeat N times: Feed-forward network','Each position is transformed by a small neural network. Facts and patterns are stored distributed across these weights.','#9a7bff'],['Repeat N times: Self-attention','Each token looks at other tokens and mixes in the information that seems relevant, weighted by learned scores.','#38e1ff'],['Embeddings + position','Each token ID becomes a learned vector; position information tells the model word order.','#ffe08a'],['Input token IDs','Your prompt after tokenization.','#38d996']];
  const svg=h('svg',{viewBox:'0 0 560 450'});
  L.forEach(([t,d,c],i)=>{const y=20+i*84;svg.append(h('g',{class:'node',tabindex:0,role:'button','aria-label':t,onclick:()=>cap(t+': '+d),onkeydown:e=>{if(e.key==='Enter')cap(t+': '+d);}},h('rect',{x:70,y,width:420,height:56,rx:12,fill:c,'fill-opacity':.2,stroke:c,'stroke-width':3}),h('text',{x:280,y:y+34,'text-anchor':'middle',fill:'#fff','font-size':19,'font-weight':600},t)));
    if(i<4)svg.append(h('path',{d:`M280 ${y+84-26}V${y+82}`,stroke:'#fff','stroke-width':3,class:'flow',fill:'none'}));});
  svg.append(h('path',{d:'M500 95V240',stroke:'#9a7bff','stroke-width':3,class:'flow',fill:'none'}),h('text',{x:520,y:170,fill:'#9a7bff','font-size':20},'×N'));
  b.append(svg);cap('Click a block. Conceptual diagram of a decoder-style transformer language model.');
};
Vis.pipeline=(b,sc,cap)=>{
  const svg=h('svg',{viewBox:'0 0 560 450'}),lanes=[];
  const box=(x,y,t,c)=>[h('rect',{x,y,width:230,height:46,rx:10,fill:c,'fill-opacity':.25,stroke:c,'stroke-width':3}),h('text',{x:x+115,y:y+29,'text-anchor':'middle',fill:'#fff','font-size':17},t)];
  const T=h('g',{id:'laneT'}),I=h('g',{id:'laneI'});
  T.append(h('text',{x:20,y:28,fill:'#ffe08a','font-size':20,'font-weight':700},'TRAINING (once, expensive)'),...box(30,44,'Huge text dataset','#ffe08a'),h('path',{d:'M145 92V114',stroke:'#fff','stroke-width':3,class:'flow'}),...box(30,116,'Predict next token','#ffe08a'),h('path',{d:'M145 164V186',stroke:'#fff','stroke-width':3,class:'flow'}),...box(30,188,'Compare to the real next token','#ffe08a'),h('path',{d:'M260 210H300V140H264',stroke:'#fff','stroke-width':3,class:'flow',fill:'none'}),h('text',{x:310,y:180,fill:'#ffe08a','font-size':16},'adjust weights'));
  I.append(h('text',{x:20,y:262,fill:'#38e1ff','font-size':20,'font-weight':700},'INFERENCE (each time you chat)'),...box(30,278,'Your prompt → tokens','#38e1ff'),h('path',{d:'M145 326V348',stroke:'#fff','stroke-width':3,class:'flow'}),...box(30,350,'Frozen weights → probabilities','#38e1ff'),h('path',{d:'M260 372H300V300H264',stroke:'#fff','stroke-width':3,class:'flow',fill:'none'}),h('text',{x:310,y:340,fill:'#38e1ff','font-size':16},'pick token, append,'),h('text',{x:310,y:360,fill:'#38e1ff','font-size':16},'repeat'));
  svg.append(T,I);b.append(svg);
  cap('Training changes the weights. Inference uses them (the model does not learn from your chat by updating its weights).');
};
Vis.halluc=(b,sc,cap)=>{
  let supported=true;const wrap=h('div',{style:{padding:'8px 12px',display:'flex',flexDirection:'column',gap:'14px',height:'100%',justifyContent:'center'}}),m1=h('div'),m2=h('div');
  const bar=(label,c)=>{const f=h('div',{style:{height:'100%',width:'0%',background:c,borderRadius:'8px'}}),v=h('b'),box=h('div',{},h('div',{class:'row'},h('span',{},label),v),h('div',{style:{height:'26px',background:'#fff1',borderRadius:'8px',overflow:'hidden'}},f));return{box,set(p){Anim.tween(500,t=>{f.style.width=(p*t*100)+'%';v.textContent=Math.round(p*t*100)+'%';});}};};
  const a=bar('How plausible it sounds','#9a7bff'),c=bar('Supported by a checked source','#38d996');
  const quote=h('div',{class:'card mono',style:{fontSize:'.85em'}},'“As Dr. Elena Voss argued in 2019, “students retain 83% more when taught by adaptive AI.” (p. 142)”  ');
  const btnS=UI.btn('Source supports it',()=>{supported=true;run();},'sm'),btnU=UI.btn('Source does not exist',()=>{supported=false;run();},'sm');
  function run(){a.set(.93);c.set(supported?.9:.04);cap(supported?'When checking finds a matching source, support rises. The wording was just as smooth either way.':'Plausible and unsupported at the same time: fluency did not change when verification failed.');}
  wrap.append(h('div',{class:'sub',style:{fontSize:'.8em'}},'Fictional AI-style output:'),quote,a.box,c.box,h('div',{class:'row'},btnS,btnU));b.append(wrap);run();
};
Vis.autobias=(b,sc,cap)=>{
  const v={acc:88,rely:80},catchP=.8,N=100;const out=h('div'),wrap=h('div',{style:{padding:'6px 10px',display:'flex',flexDirection:'column',gap:'8px'}});
  function draw(){
    const errs=N*(1-v.acc/100),rel=v.rely/100,passed=errs*(rel+(1-rel)*(1-catchP)),checks=N*(1-rel);
    out.innerHTML=`<table><tr><th>AI errors made</th><td><b>${errs.toFixed(1)}</b></td></tr><tr><th>Errors that reach students</th><td><b style="color:${passed>6?'#ff6b6b':'#38d996'}">${passed.toFixed(1)}</b></td></tr><tr><th>Decisions I double-checked</th><td><b>${checks.toFixed(0)}</b> of ${N}</td></tr></table>`;
    cap(`With ${v.acc}% accuracy and ${v.rely}% unchecked reliance, about ${passed.toFixed(1)} errors per 100 decisions pass through. Trust should track reliability and stakes.`);
  }
  wrap.append(UI.slider('AI accuracy',50,99,1,v.acc,x=>{v.acc=x;draw();},x=>x+'%').el,UI.slider('Accepted without checking',0,100,5,v.rely,x=>{v.rely=x;draw();},x=>x+'%').el,out,h('div',{class:'sub',style:{fontSize:'.78em'}},'Simplified simulation: when I check a recommendation, I catch 80% of its errors (made-up value). Drag "accepted without checking" to see how automation bias scales with AI error.'));
  b.append(wrap);draw();
};
Vis.biases=(b,sc,cap)=>{
  const wrap=h('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',padding:'6px',height:'100%'}});
  const c=(t,d,col)=>h('button',{class:'card',type:'button',style:{borderColor:col,textAlign:'left'},onclick:()=>cap(d)},h('b',{style:{color:col}},t),h('div',{style:{fontSize:'.85em',marginTop:'4px'}},d));
  wrap.append(c('Algorithmic bias','Systematic unfairness that originates in the data, design or deployment of a system (system-side). Example: a scorer trained on narrow data that disadvantages some groups.','#ffb84d'),c('Automation bias','Over-reliance on automated output so that one stops checking or ignores contradicting evidence (human-side). Example: accepting a flagged referral without looking.','#38e1ff'),
    h('div',{class:'callout',style:{gridColumn:'1 / 3',alignSelf:'center'},html:'<b>They compound:</b> a biased output plus a deferential human equals unchecked harm. Fixing one does not remove the need to address the other.'}));
  b.append(wrap);cap('Click a card. Two different problems with different remedies.');
};
Vis.perfunder=(b,sc,cap)=>{
  const S2=[['Student drafts, then asks AI for feedback and revises',.8,.78],['AI writes it; student submits',.95,.15],['Student writes alone',.6,.65]];
  const wrap=h('div',{style:{padding:'8px 12px',display:'flex',flexDirection:'column',gap:'12px'}}),bx=h('div');let bars=null;
  const lv=v=>v>.66?'High':v>.33?'Medium':'Low';
  const sg=UI.seg(S2.map((s,i)=>[i,s[0].split(',')[0].split(';')[0]]),0,v=>show(+v));
  const sc2=h('div',{class:'sub',style:{fontSize:'.9em'}});
  bars=Bars(bx,['Polished product','Understanding the student can show alone'],{fmt:lv});
  function show(i){bars.set([S2[i][1],S2[i][2]]);sc2.textContent=S2[i][0];}
  wrap.append(sg,sc2,bx,h('div',{class:'callout warn',style:{fontSize:'.8em'},html:'<b>Scripted conceptual illustration, not data.</b> It shows why performance (a good product) and understanding (what a learner can do unaided) can come apart.'}));
  b.append(wrap);show(0);cap('Performance with AI is not the same as understanding. Design tasks so the thinking still happens.');
};
Vis.pillars=(b,sc,cap)=>{
  const P=[['Understand','How AI works, what it can and cannot do.'],['Evaluate','Check outputs, sources and claims; notice bias.'],['Use wisely','Choose tasks, tools and prompts for a learning purpose.'],['Decide','Keep human judgment, ethics and accountability central.']];
  const wrap=h('div',{style:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',alignItems:'end',height:'100%',padding:'8px'}});
  P.forEach(([t,d],i)=>wrap.append(h('button',{class:'card',type:'button',style:{height:(52+i*14)+'%',textAlign:'center',borderColor:['#38e1ff','#9a7bff','#38d996','#ffe08a'][i]},onclick:()=>cap(t+': '+d)},h('b',{},t))));
  b.append(wrap);cap('Four pillars of AI literacy. Click a pillar.');
};
Vis.rag=(b,sc,cap)=>{
  const DOCS=[['District AI policy (draft)','Student work may not be uploaded to external AI tools without administrator approval.'],['Vendor marketing page','Our tutor transforms results for every learner.'],['Peer-reviewed study excerpt (fictional)','A small pilot found no significant effect on test scores.']];
  let on=true;const use=[true,false,false];const out=h('div',{class:'card'});
  const wrap=h('div',{style:{padding:'4px 8px',display:'flex',flexDirection:'column',gap:'8px'}});
  const docs=h('div');
  function draw(){
    docs.innerHTML='';DOCS.forEach((d,i)=>docs.appendChild(h('button',{class:'opt'+(use[i]&&on?' sel':''),style:{fontSize:'.78em',padding:'6px 10px',margin:'3px 0',opacity:on?1:.4},type:'button','aria-pressed':use[i],onclick:()=>{use[i]=!use[i];draw();}},(use[i]?'☑ ':'☐ ')+'['+(i+1)+'] '+d[0])));
    let a;
    if(!on)a='“Generally yes; many tools accept pasted text, so you can paste student essays for feedback.” <span class="sub">(ungrounded: no source consulted)</span>';
    else if(use[0])a='“Per [1], student work may not be uploaded to external AI tools without administrator approval. Please request approval first.”';
    else if(use[1]||use[2])a='“The retrieved documents do not address uploading student work, so I cannot answer this from them.” <span class="sub">(a well-designed system says so)</span>';
    else a='“No documents retrieved.” <span class="sub">(nothing to ground the answer)</span>';
    out.innerHTML='<div class="sub" style="font-size:.75em">Question: “Can I paste student essays into an AI tool for feedback?”</div>'+a;
    cap(on?'Retrieval-augmented generation fetches documents first and asks the model to answer from them, with citations you can check. It reduces, but does not eliminate, unsupported statements.':'Without retrieval the model answers from patterns in its weights alone: fluent, but with no source to verify.');
  }
  wrap.append(h('div',{class:'row'},UI.seg([[1,'Retrieval ON'],[0,'Retrieval OFF']],1,v=>{on=v==='1'||v===1;draw();})),docs,out,h('div',{class:'sub',style:{fontSize:'.72em'}},'Scripted demonstration: answers are scripted to illustrate grounding. No model or search is running.'));
  b.append(wrap);draw();
};

/* Generic step-by-step mechanism figure: concept.steps = [[title, plain-language description], ...] */
Vis.steps=(b,sc,cap)=>{
  const st=sc.concept.steps;let cur=0,tok=0;
  const wrap=h('div',{style:{display:'flex',flexDirection:'column',gap:'6px',padding:'4px 8px',height:'100%',overflow:'auto'}}),list=h('div',{style:{display:'flex',flexDirection:'column',gap:'4px'}});
  function draw(){
    list.innerHTML='';
    st.forEach(([t,d],i)=>{
      const on=i===cur,seen=i<cur;
      list.appendChild(h('button',{type:'button',onclick:()=>{tok++;cur=i;draw();},style:{display:'flex',gap:'12px',alignItems:'center',textAlign:'left',padding:'8px 12px',borderRadius:'12px',border:'2px solid '+(on?'var(--gold)':'var(--line)'),background:on?'#f2b7052a':'var(--panel2)',opacity:i>cur?.55:1,font:'inherit',color:'inherit',cursor:'pointer'}},
        h('span',{style:{flex:'0 0 34px',height:'34px',borderRadius:'50%',background:seen||on?'var(--wu)':'#fff2',display:'grid',placeItems:'center',fontWeight:700}},seen?'✔':String(i+1)),
        h('span',{style:{fontSize:'.9em'}},h('b',{},t),on?h('div',{class:'sub',style:{fontSize:'.85em'}},d):null)));
    });
    cap(st[cur][1]);
  }
  const play=()=>{const my=++tok;cur=0;draw();const step=()=>{if(my!==tok||!b.isConnected)return;if(cur<st.length-1){cur++;draw();setTimeout(step,S.prefs.reduced?400:1700);}};setTimeout(step,S.prefs.reduced?400:1700);};
  wrap.append(list,h('div',{class:'row'},UI.btn('Next step ▸',()=>{tok++;if(cur<st.length-1)cur++;draw();},'pri sm'),UI.btn('▶ Play all',play,'sm'),UI.btn('Start over',()=>{tok++;cur=0;draw();},'sm')));
  b.append(wrap);draw();
};
