'use strict';
/* =====================================================================
   APP (part 2): navigation, scene builders, HUD, pacing, dialogs, keyboard
   ===================================================================== */
const FINAL_MESSAGE='AI literacy is not simply knowing how to use artificial intelligence. It is understanding how AI works, critically evaluating its outputs, recognizing its limitations, and exercising responsible human judgment.';
const FINAL_QUESTION='What should students still learn to do themselves when AI can produce an answer?';
const SYNTH=[
  ['Four kinds of AI','Rules, learned patterns, deep networks and generative models differ in where behavior comes from, and so in what you must audit.'],
  ['Token by token','Language models turn text into tokens and sample the next one from a probability distribution. Fluent is not the same as true, and understanding remains debated.'],
  ['Hallucinations','Plausibility is not verification. Check sources independently, and make claims match their evidence.'],
  ['Automation bias','Meaningful oversight needs time, evidence and authority to override. Accountability stays with people.'],
  ['Human and machine','Design human-directed collaboration with verification; protect privacy, equity and agency; keep the thinking that matters human.']];

/* ---------- reusable multiple-choice component ---------- */
function MCQ(q,key,store,instant){
  const el=h('div');let pick=null,shown=false;
  const prev=store[key];if(prev&&instant){pick=prev.pick;shown=true;}
  function draw(){
    el.innerHTML='';
    q.opts.forEach((o,i)=>{
      let cls='opt';if(shown){if(i===q.ans)cls+=' right';else if(i===pick)cls+=' wrong';}else if(i===pick)cls+=' sel';
      el.appendChild(h('button',{class:cls,type:'button','aria-pressed':String(i===pick),onclick:()=>{if(shown&&instant)return;pick=i;if(instant)reveal();else draw();}},String.fromCharCode(65+i)+'.  '+o));
    });
    if(shown)el.appendChild(h('div',{class:'fb',role:'status'},h('b',{},pick==null?'Answer shown. ':pick===q.ans?'Correct. ':'Not quite. '),q.why));
  }
  function reveal(){shown=true;if(pick!=null){store[key]={pick,ok:pick===q.ans};saveState();if(pick===q.ans)Avatar.react();HUD.update();}draw();}
  function hide(){if(instant)return;shown=false;draw();}
  draw();
  return{el,reveal,toggle(){shown?hide():reveal();}};
}

/* ---------- pacing ---------- */
const Pace={
  plan(){const o=[];CHAPTERS.forEach((C,ci)=>C.scenes.forEach((s,si)=>{if(s.minutes>0&&(!s.optional||S.target===EDITION.max))o.push({ci,si,m:s.minutes});}));return o;},
  factor(){const t=this.plan().reduce((a,b)=>a+b.m,0);return S.target/t;},
  endOf(ci,si){const f=this.factor();let acc=0;for(const e of this.plan()){acc+=e.m*f;if(e.ci===ci&&e.si===si)return acc;if(e.ci>ci||(e.ci===ci&&e.si>si))return acc-e.m*f;}return acc;},
  chapterMinutes(ci){const f=this.factor();return this.plan().filter(e=>e.ci===ci).reduce((a,b)=>a+b.m*f,0);},
  elapsedMin(){return S.timer.elapsed/60000;},
  tick(){
    if(S.timer.running){const n=performance.now();S.timer.elapsed+=n-S.timer.last;S.timer.last=n;}
    this.draw();
  },
  toggle(){if(S.timer.running){this.tick();S.timer.running=false;}else{S.timer.running=true;S.timer.last=performance.now();}this.draw();},
  reset(){S.timer.running=false;S.timer.elapsed=0;this.draw();},
  mmss(m){const s=Math.floor(m*60);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');},
  draw(){
    const e=$('#pace');if(!e)return;const sc=CHAPTERS[S.ch].scenes[S.sc],f=this.factor(),m=sc.minutes*f;
    const end=this.endOf(S.ch,S.sc),start=end-(sc.minutes>0&&(!sc.optional||S.target===EDITION.max)?m:0),el=this.elapsedMin();
    let st='on',head,tip;
    if(!S.timer.running&&S.timer.elapsed===0){head='Timer: click to start';tip='Scene budget '+(sc.minutes?m.toFixed(1):'0')+' min';st='';}
    else{
      if(el>end+1){st='behind';head='Behind '+(el-end).toFixed(0)+' min';tip='Consider skipping Dive Deeper or optional scenes';}
      else if(el<start-1){st='ahead';head='Ahead '+(start-el).toFixed(0)+' min';tip='Room for Dive Deeper or an optional scene';}
      else{head='On pace';tip='Scene budget '+m.toFixed(1)+' min';}
      head+=' · '+this.mmss(el)+(S.timer.running?'':' (paused)');
    }
    e.className=st;e.innerHTML=`<b>${head}</b>${tip} · plan ends ${this.mmss(end)} of ${S.target}:00`;
  }
};

/* ---------- navigation ---------- */
const Nav={
  navId:0,inited:false,beat:0,onAnswer:null,onBeat:null,handle:null,envCh:-1,
  skipOpt(){return S.mode==='instructor'&&S.target<EDITION.max;},
  seq(){const o=[];CHAPTERS.forEach((C,ci)=>C.scenes.forEach((s,si)=>{if(s.optional&&this.skipOpt())return;o.push([ci,si]);}));return o;},
  find(id){for(let c=0;c<CHAPTERS.length;c++){const i=CHAPTERS[c].scenes.findIndex(s=>s.id===id);if(i>=0)return[c,i];}return null;},
  isDone(ch){return CHAPTERS[ch].scenes.every((s,i)=>s.optional||S.visited[ch+':'+i]);},
  unlocked(ch){return S.mode==='instructor'||ch<=1||this.isDone(ch-1);},
  ord(c,s){return c*1000+s;},
  next(){
    if(Cine.active){Cine.skip();return;}
    const q=this.seq().filter(([c,s])=>this.ord(c,s)>this.ord(S.ch,S.sc))[0];
    if(!q){toast('End of the lecture. Use the map to revisit any chapter.');return;}
    this.go(q[0],q[1]);
  },
  prev(){
    const q=this.seq().filter(([c,s])=>this.ord(c,s)<this.ord(S.ch,S.sc)).pop();
    if(!q){toast('This is the first scene.');return;}
    this.go(q[0],q[1],{cut:q[0]===S.ch});
  },
  travelTo(i){this.go(i,0);},
  goScene(id){const f=this.find(id);if(f)this.go(f[0],f[1]);},
  hub(){this.go(0,CHAPTERS[0].scenes.length-1);},
  async go(ch,sc=0,o={}){
    ch=clamp(ch,0,CHAPTERS.length-1);sc=clamp(sc,0,CHAPTERS[ch].scenes.length-1);
    if(!this.unlocked(ch)){toast('Complete the previous chapter to unlock this building.');return;}
    const id=++this.navId;Cine.cancel();if(Avatar.cin)Avatar.cin.dead=true;
    const from=S.ch,travel=this.inited&&ch!==from&&!o.cut&&!(S.mode==='instructor'&&o.cut);
    if(travel){await this.travel(from,ch);if(id!==this.navId)return;}
    S.ch=ch;S.sc=sc;this.beat=0;
    await this.show(id);
  },
  /* walk out of the current building / across campus / into the next one */
  async travel(from,to){
    const fadeMs=350;
    await Cine.run(async c=>{
      const inEnv=View.mode==='env';
      if(inEnv){
        const door=Campus.centers[Math.max(0,Math.min(4,this.envCh-1))];
        await fadeC(c,true,fadeMs);
        View.showCampus(false);Campus.setDusk(false);
        View.avatarCampus(door,{bottom:195,scale:.62});Avatar.el.style.opacity=0;Avatar.face(-1);
        Campus.setCam(Campus.followTarget(door));Campus.openDoor(this.envCh,false);
        await fadeC(c,false,fadeMs);
        Campus.openDoor(this.envCh,true);await c.wait(450);
        await c.tween(650,p=>{Avatar.el.style.opacity=p;Avatar.el.style.setProperty('--sc',lerp(.62,.9,p));Avatar.el.style.bottom=lerp(195,135,p)+'px';});
        Campus.openDoor(this.envCh,false);this.envCh=-1;
      }else if(Avatar.el.parentNode!==Campus.near){View.avatarCampus(300);}
      if(to>=1&&to<=5){
        const tx=Campus.centers[to-1];Campus.highlight(to);
        await Avatar.walkTo(tx,{cin:c,onStep:x=>Campus.setCam(Campus.followTarget(x))});
        Campus.openDoor(to,true);await c.wait(400);
        await c.tween(550,p=>{Avatar.el.style.opacity=1-p;Avatar.el.style.setProperty('--sc',lerp(.9,.62,p));Avatar.el.style.bottom=lerp(135,195,p)+'px';});
        await fadeC(c,true,fadeMs);Campus.openDoor(to,false);
      }
    });
  },
  async show(id){
    const C=CHAPTERS[S.ch],sc=C.scenes[S.sc];
    S.visited[S.ch+':'+S.sc]=true;saveState();
    this.onAnswer=null;this.onBeat=null;this.handle=null;
    Cap.set('');showTitle('');$('#flash').style.opacity=0;
    const panel=$('#panel');panel.innerHTML='';panel.className='panel hidden';
    if(Avatar.el)Avatar.el.classList.remove('walking','wave','react');
    $('#hubcard').classList.add('hidden');
    document.body.dataset.type=sc.type;
    HUD.update();Notes.render();announce(`${C.title}. ${sc.title}`);
    const campusScene=C.env==='campus';
    if(sc.type==='cinema'){
      if(sc.cine==='opening')await Cinematics.opening(sc);else if(sc.cine==='portal'){await Cinematics.portal(sc);this.envCh=S.ch;}else await Cinematics.ret(sc);
      if(id!==this.navId)return;
      if(sc.cine==='portal')this.envCh=S.ch;
      $('#fade').classList.remove('on');return;
    }
    $('#fade').classList.remove('on');
    if(campusScene){
      const dusk=S.ch===6;
      if(View.mode!=='campus'||Avatar.el.parentNode!==Campus.near)View.showCampus(dusk);else{Campus.setDusk(dusk);FX.set(dusk?'dusk':'campus');}
      Avatar.el.style.setProperty('--sc',.9);Avatar.el.style.bottom='135px';Avatar.el.style.opacity=1;
      let tx=Avatar.x;
      if(sc.type==='hub'){const nxt=this.nextBuilding();tx=Campus.centers[nxt-1]-330;Campus.highlight(nxt);}
      else{Campus.highlight(0);tx=S.ch===6?520:(sc.station||520);if(tx>1500)tx=520;}
      if(Avatar.x>Campus.W)Avatar.setX(300);
      if(sc.type==='hub'){Avatar.setX(clamp(Avatar.x,0,Campus.W));}
      const walk=Avatar.walkTo(tx,{onStep:x=>Campus.setCam(Campus.followTarget(x))});
      if(S.prefs.reduced||Math.abs(tx-Avatar.x)<2)Campus.setCam(Campus.followTarget(tx));
      walk.then(()=>{if(id===this.navId){Campus.setCam(Campus.followTarget(Avatar.x));}});
    }else{
      const entering=this.envCh!==S.ch||View.mode!=='env';
      const envName=sc.env||C.env,fx=C.fx;
      if(View.mode!=='env'||Env.cur!==envName)View.showEnv(envName,fx);else FX.set(fx);
      if(entering||Avatar.el.parentNode!==$('#avatarHost')){View.avatarEnv(80);Avatar.face(1);}
      this.envCh=S.ch;
      Avatar.walkTo(sc.station||900);
    }
    // panel
    panel.className='panel'+(campusScene?' short':'');
    panel.setAttribute('aria-label',sc.title);
    const builders={concept:buildConcept,lab:buildLab,quiz:buildQuiz,discuss:buildDiscuss,finale:buildFinale};
    if(sc.type==='hub'){panel.classList.add('hidden');buildHub(C,sc);}
    else{
      try{panel.append(builders[sc.type](C,sc));}
      catch(e){console.error(e);panel.append(h('div',{class:'callout bad'},'This scene could not be displayed: '+e.message));}
    }
    HUD.update();
  },
  nextBuilding(){
    for(let i=1;i<=5;i++)if(!S.visited[i+':0']&&this.unlocked(i))return i;
    return clamp((S.lastCh||0)+1,1,5);
  },
  deeper(){
    const sc=CHAPTERS[S.ch].scenes[S.sc];
    if(!sc.deeper){toast('No Dive Deeper material for this scene.');return;}
    Modal.open('Dive Deeper: '+sc.deeper.title,h('div',{class:'tabbody',html:sc.deeper.html+'<p class="sub" style="font-size:.8em">Optional advanced material: skip it freely; the main lecture does not depend on it.</p>'}),{width:'1200px'});
  },
  revealNext(){if(this.onBeat)this.onBeat();},
  toggleAnswer(){if(this.onAnswer)this.onAnswer();else toast('Nothing to reveal in this scene.');},
  replay(){
    const sc=CHAPTERS[S.ch].scenes[S.sc];
    if(sc.type==='lab'&&this.handle&&this.handle.replay){this.handle.replay();return;}
    this.beat=0;this.go(S.ch,S.sc,{cut:true});
  }
};

/* ---------- scene builders ---------- */
function para(text){return String(text).split('\n').map(t=>h('p',{},t));}
function deeperBtn(sc){return sc.deeper?h('button',{class:'btn gold',type:'button',onclick:()=>Nav.deeper()},'▾ Dive Deeper ',h('kbd',{},'D')):null;}

function buildConcept(C,sc){
  const c=sc.concept;
  const ORDER=[['def','Define'],['explain','Explain'],['analogy','Analogy'],['mechanism','How it works'],['classroom','In the classroom'],['misconception','Misconception'],['discuss','Discuss'],['check','Check']].filter(t=>c[t[0]]).map(([k,l])=>[k,(c.labels&&c.labels[k])||l]);
  let cur=Math.min(Nav.beat||0,ORDER.length-1);const seen=new Set([0]);
  const body=h('div',{class:'tabbody',role:'tabpanel'}),tabs=h('div',{class:'tabs',role:'tablist','aria-label':'Concept layers'});
  const fig=h('div',{class:'fig'}),figBody=h('div',{class:'figbody'}),capEl=h('div',{class:'cap',role:'status'});
  let mcq=null;
  function paint(){
    tabs.innerHTML='';ORDER.forEach(([k,l],i)=>tabs.appendChild(h('button',{class:'tab'+(i===cur?' on':'')+(seen.has(i)?' seen':''),role:'tab','aria-selected':String(i===cur),type:'button',onclick:()=>{cur=i;Nav.beat=i;seen.add(i);paint();}},l)));
    body.innerHTML='';const k=ORDER[cur][0];mcq=null;Nav.onAnswer=null;
    if(k==='check'){body.append(h('div',{class:'q'},c.check.q));mcq=MCQ(c.check,sc.id+':check',S.checks,S.mode==='student');body.append(mcq.el);Nav.onAnswer=()=>mcq.toggle();}
    else if(k==='discuss'){body.append(h('div',{class:'kicker'},'Discussion question'),h('div',{class:'big',style:{fontSize:'30px'}},c.discuss));}
    else if(k==='def'){body.append(h('div',{class:'lead'},c.def));}
    else body.append(...para(c[k]));
  }
  Nav.onBeat=()=>{if(cur<ORDER.length-1){cur++;Nav.beat=cur;seen.add(cur);paint();}else toast('All layers revealed. Press → for the next scene.');};
  if(c.visual&&Vis[c.visual]){try{Vis[c.visual](figBody,sc,t=>{capEl.textContent=t;});}catch(e){console.error(e);figBody.textContent='Figure unavailable.';}}
  fig.append(figBody,capEl);
  paint();
  const demoGo=c.demo?h('button',{class:'btn pri',type:'button',onclick:()=>Nav.goScene(c.demo)},'Try the demonstration ▸'):null;
  return h('div',{class:'cols'},
    h('div',{class:'col'},h('div',{class:'kicker'},C.title+' · '+(C.topic||C.short)),h('h1',{},c.term),tabs,body,
      h('div',{class:'actions'},demoGo,deeperBtn(sc),h('button',{class:'btn instr',type:'button',onclick:()=>Nav.revealNext()},'Reveal next layer ',h('kbd',{},'Space')))),
    h('div',{class:'col'},fig));
}

function buildLab(C,sc){
  const sim=Sims[sc.sim],kind=KINDS[sim.kind],L=sc.lab;
  const main=h('div',{class:'labmain'});
  const rep=h('button',{class:'btn sm',type:'button',disabled:true,onclick:()=>Nav.replay()},'↻ Replay');
  function mount(){
    main.innerHTML='';Nav.handle=null;
    try{Nav.handle=sim.mount(main)||null;}catch(e){console.error(e);main.append(h('div',{class:'callout bad'},'This demonstration failed to load: '+e.message));}
    rep.disabled=!(Nav.handle&&Nav.handle.replay);
  }
  const prompt=h('div',{class:'callout',style:{display:S.mode==='student'?'block':'none'}},L.prompt);
  const side=h('div',{class:'labside'},
    h('div',{},h('h3',{},'Purpose'),L.purpose),
    h('div',{},h('h3',{},'Discussion prompt'),h('button',{class:'btn sm instr',type:'button',onclick:()=>{Nav.onAnswer();}},'Show / hide prompt ',h('kbd',{},'A')),prompt),
    h('div',{},h('h3',{},'What to try'),h('ol',{},L.steps.map(s=>h('li',{},s)))),
    h('div',{},h('h3',{},'In the classroom'),L.classroom),
    h('div',{class:'sub',style:{fontSize:'.85em'}},kind.tip));
  Nav.onAnswer=()=>{prompt.style.display=prompt.style.display==='none'?'block':'none';};
  Nav.onBeat=Nav.onAnswer;
  const head=h('div',{class:'labhead'},h('h2',{},sc.title),h('span',{class:'badge '+kind.cls,title:kind.tip},kind.label),sc.optional?h('span',{class:'badge optl'},'OPTIONAL'):null,h('span',{class:'sp'}),
    h('button',{class:'btn sm',type:'button',onclick:()=>{mount();toast('Demonstration reset');}},'Reset'),rep,deeperBtn(sc));
  mount();
  return h('div',{style:{height:'100%'}},head,h('div',{class:'labgrid'},main,side));
}

function buildQuiz(C,sc){
  let qi=0;const wrap=h('div',{style:{height:'100%',display:'flex',flexDirection:'column'}});
  const N=sc.questions.length;
  function draw(){
    wrap.innerHTML='';Nav.onAnswer=null;Nav.onBeat=null;
    if(qi>=N){
      const sq=sc.questions.filter(q=>!q.reflect),ok=sq.filter(q=>S.quiz[q.id]&&S.quiz[q.id].ok).length,ans=sq.filter(q=>S.quiz[q.id]).length;
      wrap.append(h('div',{class:'kicker'},'Summary'),h('h1',{},'You answered '+ans+' of '+sq.length+' scored questions'),h('div',{class:'big'},ok+' correct'),
        h('p',{class:'sub'},'Feedback appears with each answer. Scores are stored only in this browser. Revisit any question to review the explanation.'),
        h('div',{class:'row'},h('button',{class:'btn',type:'button',onclick:()=>{qi=0;draw();}},'Review questions'),h('button',{class:'btn pri',type:'button',onclick:()=>Nav.next()},'Continue ▸')));
      return;
    }
    const q=sc.questions[qi];
    wrap.append(h('div',{class:'row'},h('div',{class:'kicker'},`Question ${qi+1} of ${N}`),h('span',{class:'pill'},q.level),h('span',{class:'pill'},q.kind),h('span',{class:'sp grow'})),
      h('div',{class:'big',style:{fontSize:'32px',margin:'8px 0 12px'}},q.q));
    if(q.reflect){
      const ta=h('textarea',{rows:5,placeholder:'Optional: jot your thinking (stored only in this browser; please do not include names or identifying details).','aria-label':'Your reflection'});ta.value=S.reflect[q.id]||'';ta.addEventListener('input',()=>{S.reflect[q.id]=ta.value;saveState();});
      const pts=h('div',{class:'callout good',style:{display:'none'}},h('b',{},'Considerations (not an answer key): '),h('ul',{},q.points.map(p=>h('li',{},p))));
      Nav.onAnswer=()=>{pts.style.display=pts.style.display==='none'?'block':'none';};
      wrap.append(ta,h('div',{class:'row',style:{margin:'10px 0'}},h('button',{class:'btn',type:'button',onclick:()=>Nav.onAnswer()},'Show / hide considerations ',h('kbd',{},'A'))),pts,h('div',{class:'sub'},'Open-ended: thoughtful people can reasonably answer this differently.'));
    }else{
      const m=MCQ(q,q.id,S.quiz,S.mode==='student');wrap.append(m.el);Nav.onAnswer=()=>m.toggle();
      if(S.mode==='instructor')wrap.append(h('div',{class:'row',style:{margin:'8px 0'}},h('button',{class:'btn gold',type:'button',onclick:()=>m.toggle()},'Reveal / hide answer ',h('kbd',{},'A'))));
    }
    wrap.append(h('div',{class:'row',style:{marginTop:'auto'}},h('button',{class:'btn',type:'button',disabled:qi===0,onclick:()=>{qi--;draw();}},'◂ Previous question'),h('button',{class:'btn pri',type:'button',onclick:()=>{qi++;draw();}},qi===N-1?'Summary ▸':'Next question ▸')));
  }
  draw();return wrap;
}

function buildDiscuss(C,sc){
  const moves=h('div',{class:'callout good',style:{display:S.mode==='student'?'none':'none'}},h('b',{},'Facilitator moves: '),h('ul',{},sc.moves.map(m=>h('li',{},m))));
  Nav.onAnswer=()=>{moves.style.display=moves.style.display==='none'?'block':'none';};Nav.onBeat=Nav.onAnswer;
  const ta=h('textarea',{rows:3,'aria-label':'Your notes',placeholder:'Optional notes (stored only in this browser; no names please).'});ta.value=S.reflect[sc.id]||'';ta.addEventListener('input',()=>{S.reflect[sc.id]=ta.value;saveState();});
  return h('div',{},h('div',{class:'kicker'},C.title),h('h1',{},sc.title),
    ...sc.prompts.map((p,i)=>h('div',{class:'card',style:{margin:'10px 0',fontSize:'1.15em'}},h('b',{style:{color:'var(--gold)'}},(i+1)+'.  '),p)),
    h('div',{class:'row instr',style:{margin:'8px 0'}},h('button',{class:'btn',type:'button',onclick:()=>Nav.onAnswer()},'Show / hide facilitator moves ',h('kbd',{},'A'))),moves,
    h('div',{class:'stu'},ta));
}

function buildHub(C,sc){
  const hc=$('#hubcard');hc.classList.remove('hidden');hc.innerHTML='';
  const done=CHAPTERS.slice(1,6).filter((c,i)=>Nav.isDone(i+1)).length;
  hc.append(h('div',{class:'kicker'},'Campus hub'),h('div',{style:{font:'700 30px Georgia,serif'}},'Choose a building, or press → to walk to the next one'),
    h('div',{class:'chips',style:{marginTop:'8px'}},CHAPTERS.slice(1,6).map((c,i)=>{const lock=!Nav.unlocked(i+1);return h('button',{class:'btn hubchip'+(lock?' lock':''),type:'button','aria-disabled':String(lock),onclick:()=>Nav.travelTo(i+1)},`${i+1} · ${c.short}`+(Nav.isDone(i+1)?' ✔':lock?' \u{1F512}':''));})),
    h('div',{class:'sub',style:{fontSize:'.8em',marginTop:'6px'}},`${done} of 5 buildings completed · ${S.mode==='student'?'Student exploration mode':'Instructor mode'}`));
}

function buildFinale(C,sc){
  let step=0;const wrap=h('div',{class:'fin',style:{gap:'14px'}});
  function draw(){
    wrap.innerHTML='';
    wrap.append(h('div',{class:'kicker'},'The central message'),h('div',{class:'quote',style:{fontSize:'34px'}},'“'+FINAL_MESSAGE+'”'));
    if(step>=1){
      const ta=h('textarea',{rows:2,'aria-label':'Your final reflection',placeholder:'Optional private note (stored only in this browser).'});ta.value=S.reflect.final||'';ta.addEventListener('input',()=>{S.reflect.final=ta.value;saveState();});
      wrap.append(h('div',{class:'kicker'},'Final reflection'),h('div',{class:'big',style:{color:'var(--gold)',fontSize:'36px'}},FINAL_QUESTION),h('div',{class:'stu'},ta));
    }
    if(step>=2)wrap.append(h('div',{class:'synth'},(EDITION.synth||SYNTH).map(([t,d],i)=>h('div',{class:'card'},h('b',{style:{color:'var(--gold)'}},(i+1)+'. '+t),h('div',{},d),h('button',{class:'btn sm',type:'button',onclick:()=>Nav.travelTo(i+1)},'Revisit ▸')))));
    const row=h('div',{class:'row',style:{justifyContent:'center'}});
    if(step<2)row.append(h('button',{class:'btn gold',type:'button',onclick:()=>{step++;draw();}},step===0?'Reveal final reflection question ':'Reveal synthesis of the five chapters ',h('kbd',{},'Space')));
    row.append(h('button',{class:'btn',type:'button',onclick:openMap},'Open campus map (revisit any demonstration)'),h('button',{class:'btn pri',type:'button',onclick:()=>Cinematics.credits()},'Play closing sequence'));
    wrap.append(row);
  }
  Nav.onBeat=()=>{if(step<2){step++;draw();}};Nav.onAnswer=Nav.onBeat;
  draw();return wrap;
}

/* ---------- HUD ---------- */
const HUD={
  update(){
    const C=CHAPTERS[S.ch],sc=C.scenes[S.sc];
    $('#t1').textContent=(S.ch>=1&&S.ch<=5?'Chapter '+S.ch+' · ':'')+C.title;
    $('#t2').textContent=sc.title;
    const d=$('#dots');d.innerHTML='';
    C.scenes.forEach((s,i)=>{if(s.type==='hub')return;d.appendChild(h('button',{class:(S.visited[S.ch+':'+i]?'v ':'')+(i===S.sc?'cur ':'')+(s.optional?'opt':''),style:{all:'unset'},type:'button',title:s.title+(s.optional?' (optional)':''),'aria-label':'Scene '+(i+1)+': '+s.title,'aria-current':i===S.sc?'step':null,onclick:()=>Nav.go(S.ch,i,{cut:true})}));});
    $$('#dots button').forEach(b=>{b.style.cssText='width:13px;height:13px;border-radius:50%;border:2px solid '+(b.classList.contains('cur')?'var(--gold)':'var(--ink2)')+';background:'+(b.classList.contains('cur')?'var(--gold)':b.classList.contains('v')?'var(--ink2)':'transparent')+';cursor:pointer;padding:0;'+(b.classList.contains('opt')?'border-style:dashed;':'')+(b.classList.contains('cur')?'transform:scale(1.35);':'');});
    const plan=Pace.plan(),tot=S.target,end=Pace.endOf(S.ch,S.sc);
    $('#chbar b').style.width=clamp(end/tot*100,0,100)+'%';
    const total=CHAPTERS.reduce((a,c)=>a+c.scenes.filter(s=>s.type!=='hub').length,0),vis=Object.keys(S.visited).filter(k=>{const[c,s]=k.split(':');return CHAPTERS[c]&&CHAPTERS[c].scenes[s]&&CHAPTERS[c].scenes[s].type!=='hub';}).length;
    $('#prog').textContent=`Progress: ${vis} of ${total} scenes`;
    $('#modeBtn').textContent=S.mode==='instructor'?'Instructor mode':'Student mode';
    $('#pauseBtn').textContent=Anim.paused?'▶ Resume':'⏸ Pause';
    $('#pauseBtn').classList.toggle('on',Anim.paused);
    $('#viewBtn').classList.toggle('on',document.body.classList.contains('immersive'));
    $('#navR .nextlbl').textContent=Cine.active?'Skip':'Next';
    $('#revealBtn').classList.toggle('hidden',!Nav.onBeat);
    $('#prevBtn').disabled=!Nav.seq().some(([c,s])=>Nav.ord(c,s)<Nav.ord(S.ch,S.sc));
    Pace.draw();
  }
};

/* ---------- map, guide, settings, help ---------- */
function openMap(){
  const wrap=h('div',{style:{display:'grid',gridTemplateColumns:'1.15fr .85fr',gap:'20px'}});
  const map=h('div',{class:'mapwrap'});
  const pts=[[17,70],[34,32],[51,70],[68,32],[85,70]],ends=[[8,16],[92,16]];
  const route=[ends[0],...pts,ends[1]];
  const svg=h('svg',{viewBox:'0 0 100 100',preserveAspectRatio:'none',style:{position:'absolute',inset:0,width:'100%',height:'100%'}},h('polyline',{points:route.map(p=>p.join(',')).join(' '),fill:'none',stroke:'#38e1ff','stroke-width':3,'stroke-dasharray':'10 8','vector-effect':'non-scaling-stroke','stroke-linejoin':'round',opacity:.6,class:'flow'}));
  map.append(svg);
  CHAPTERS.slice(1,6).forEach((c,i)=>{
    const lock=!Nav.unlocked(i+1),cur=S.ch===i+1;
    map.append(h('div',{class:'mapnode',style:{left:pts[i][0]+'%',top:pts[i][1]+'%',width:'180px'}},h('button',{type:'button',class:(cur?'cur ':'')+(lock?'lock':''),onclick:()=>{Modal.close();Nav.travelTo(i+1);}},h('span',{class:'n'},String(i+1)),h('b',{},c.short),h('span',{class:'d'},Pace.chapterMinutes(i+1).toFixed(0)+' min planned'),h('span',{class:'st'},lock?'Locked':Nav.isDone(i+1)?'\u2714 Completed':cur?'You are here':'')) ));
  });
  map.append(h('div',{class:'mapnode',style:{left:ends[0][0]+'%',top:ends[0][1]+'%',width:'120px'}},h('button',{type:'button',onclick:()=>{Modal.close();Nav.hub();}},h('b',{},'Campus'))),h('div',{class:'mapnode',style:{left:ends[1][0]+'%',top:ends[1][1]+'%',width:'130px'}},h('button',{type:'button',class:Nav.unlocked(6)?'':'lock',onclick:()=>{Modal.close();Nav.go(6,0);}},h('b',{},'Closing'),h('span',{class:'d'},'Reflection'))));
  const idx=h('div',{style:{maxHeight:'650px',overflow:'auto'}});
  CHAPTERS.forEach((c,ci)=>{
    idx.append(h('h3',{style:{margin:'10px 0 4px',color:'var(--gold)'}},(ci>=1&&ci<=5?ci+'. ':'')+c.title));
    c.scenes.forEach((s,si)=>{if(s.type==='hub')return;const lock=!Nav.unlocked(ci);idx.append(h('button',{class:'btn sm',style:{margin:'2px',opacity:lock?.5:1},type:'button',onclick:()=>{Modal.close();Nav.go(ci,si);}},(S.visited[ci+':'+si]?'✔ ':'')+s.title+(s.optional?' (opt.)':'')));});
  });
  wrap.append(map,idx);
  const f=Pace.factor();
  const plan=h('table',{style:{marginTop:'14px'},html:`<tr><th>Segment</th><th>Planned minutes (${S.target}-min session${S.target===EDITION.max?', includes optional scenes':''})</th></tr>`+CHAPTERS.map((c,ci)=>`<tr><td>${esc(c.title)}</td><td>${Pace.chapterMinutes(ci).toFixed(1)}</td></tr>`).join('')+`<tr><th>Total</th><th>${S.target}</th></tr>`});
  const c=h('div',{},wrap,h('div',{class:'instr'},plan));
  Modal.open('Campus map and lecture plan',c,{width:'1600px'});
}

function openGuide(){
  const C=CHAPTERS[S.ch],G=C.guide||{},ins=S.mode==='instructor';
  const wrap=h('div',{class:'tabbody',style:{fontSize:'.9em'}});
  const sec=(t,items,ordered)=>{if(!items||!items.length)return;wrap.append(h('h3',{},t),h(ordered?'ol':'ul',{},items.map(i=>h('li',{},i))));};
  wrap.append(h('div',{class:'callout'},h('b',{},'Essential question: '),C.essential));
  sec('Objectives',C.objectives);sec('Chapter summary (review)',C.summary);
  if(ins){
    if(G.facilitation)wrap.append(h('h3',{},'Facilitation guidance'),h('p',{},G.facilitation));
    sec('Technical qualifications',G.qual);
    if(G.transitions)wrap.append(h('h3',{},'Suggested transitions'),h('p',{},G.transitions));
    wrap.append(h('h3',{},'Scene-by-scene teaching notes'));
    C.scenes.forEach(s=>{if(s.type==='hub')return;wrap.append(h('div',{class:'card',style:{margin:'8px 0',background:'#fffbe9',color:'#1a1200'},html:Notes.html(C,s)}));});
  }
  sec('References and further reading',(C.refs||[]).map(r=>REFS[r]));
  wrap.append(h('div',{class:'sub',style:{fontSize:'.85em'}},REFS_NOTE));
  const top=h('div',{class:'row',style:{marginBottom:'10px'}},ins?h('button',{class:'btn',type:'button',onclick:()=>Notes.popout()},'Open presenter notes in a separate window'):null,h('button',{class:'btn',type:'button',onclick:()=>window.print()},'Print this guide'));
  Modal.open((ins?'Teaching guide: ':'Study guide: ')+C.title,h('div',{},top,wrap),{width:'1500px'});
}

function openSettings(){
  const box=h('div',{class:'settings'});
  const chk=(label,get,set)=>{const i=h('input',{type:'checkbox',checked:get(),onchange:e=>{set(e.target.checked);applyPrefs();saveState();}});return h('label',{},i,label);};
  box.append(
    h('h3',{},'Mode'),UI.seg([['instructor','Instructor presentation'],['student','Student exploration']],S.mode,v=>{Modal.close();setMode(v);}),
    h('div',{class:'sub'},'Both modes use the same content and simulations. Student mode shows immediate feedback, hides instructor-only notes and pacing, and unlocks chapters as you complete them.'),
    h('h3',{style:{marginTop:'14px'}},'Session length (instructor pacing)'),UI.seg(EDITION.targets.map(t=>[t,t+' min'+(t===EDITION.def?' (default)':t===EDITION.max?' (adds optional scenes)':'')]),S.target,v=>{S.target=+v;saveState();HUD.update();}),
    h('h3',{style:{marginTop:'14px'}},'Animation and performance'),
    chk('Reduced motion (cross-fades only; avatar jumps instead of walking)',()=>S.prefs.reduced,v=>S.prefs.reduced=v),
    chk('Lower-performance mode (fewer particles, 30 fps)',()=>S.prefs.low,v=>S.prefs.low=v),
    h('h3',{style:{marginTop:'14px'}},'Display'),
    chk('High-contrast theme',()=>S.prefs.contrast,v=>S.prefs.contrast=v),
    chk('Show captions for cinematic scenes',()=>S.prefs.captions,v=>S.prefs.captions=v),
    h('div',{class:'row'},h('span',{},'Text size:'),UI.btn('A−',()=>{S.prefs.scale=clamp(+(S.prefs.scale-.1).toFixed(1),.8,1.4);applyPrefs();saveState();},'sm'),UI.btn('A+',()=>{S.prefs.scale=clamp(+(S.prefs.scale+.1).toFixed(1),.8,1.4);applyPrefs();saveState();},'sm'),UI.btn('Reset',()=>{S.prefs.scale=1;applyPrefs();saveState();},'sm')),
    h('h3',{style:{marginTop:'14px'}},'Data'),
    h('div',{class:'sub'},'Progress, quiz answers and optional notes are stored only in this browser (localStorage). Nothing is sent anywhere, and no names or identifiers are collected.'),
    h('div',{class:'row'},UI.btn('Reset lecture timer',()=>{Pace.reset();toast('Timer reset');},'sm'),UI.btn('Erase all saved progress',()=>{if(confirm('Erase saved progress, answers and notes on this device?')){try{localStorage.removeItem(STORE_KEY);}catch(e){}S.visited={};S.quiz={};S.checks={};S.reflect={};S.principles=[];saveState();HUD.update();toast('Progress erased');}},'sm')));
  Modal.open('Settings',box,{width:'900px'});
}

function openHelp(){
  const K=[['→ / PgDn','Next scene (during a cinematic: skip it)'],['← / PgUp','Previous scene'],['Space / ↓','Reveal next layer / step in the scene'],['A','Reveal or hide answer / prompt / facilitator moves'],['D','Dive Deeper (advanced explanation)'],['N','Instructor notes drawer'],['G','Teaching guide for this chapter'],['M','Campus map and lecture plan'],['H / Home','Return to campus hub'],['R','Replay animation or demonstration'],['S / Esc','Skip cinematic'],['P','Pause / resume animation'],['V','Hide / show the lesson panel (scene view)'],['F','Full screen'],['+ / −','Text size'],['?','This help']];
  Modal.open('Keyboard shortcuts',h('div',{},h('table',{html:K.map(([k,d])=>`<tr><td><span class="kbd">${esc(k)}</span></td><td>${esc(d)}</td></tr>`).join('')}),h('p',{class:'sub'},'Shortcuts are ignored while you type in a text box. Instructors: the notes drawer is visible if you share this window; use the pop-out button in the guide to keep notes on a private screen.')),{width:'900px'});
}

/* ---------- preferences, modes, fullscreen ---------- */
function applyPrefs(){
  const b=document.body;
  b.classList.toggle('reduce',!!S.prefs.reduced);b.classList.toggle('low',!!S.prefs.low);b.classList.toggle('contrast',!!S.prefs.contrast);
  b.classList.toggle('instructor',S.mode==='instructor');b.classList.toggle('student',S.mode==='student');
  stage.style.setProperty('--fs',(22*S.prefs.scale).toFixed(1)+'px');
  if(FX.cv){FX.resize();if(FX.themeName)FX.set(FX.themeName);}
}
function setMode(m){
  S.mode=m;saveState();applyPrefs();
  if(!Nav.unlocked(S.ch)){Nav.go(0,CHAPTERS[0].scenes.length-1);return;}
  Nav.beat=0;Nav.go(S.ch,S.sc,{cut:true});
}
function toggleFS(){
  try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>toast('Full screen is not available in this browser.'));}catch(e){toast('Full screen is not available.');}
}
function togglePause(){Anim.paused=!Anim.paused;document.body.classList.toggle('paused',Anim.paused);HUD.update();toast(Anim.paused?'Animations paused: content stays available':'Animations resumed');}
function toggleView(){document.body.classList.toggle('immersive');const on=document.body.classList.contains('immersive');if(on)Cap.set(CHAPTERS[S.ch].scenes[S.sc].title);else Cap.set('');HUD.update();}

/* ---------- keyboard ---------- */
addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const t=e.target,tag=t.tagName,typing=tag==='TEXTAREA'||tag==='SELECT'||(tag==='INPUT'&&!['checkbox','button'].includes(t.type));
  if(e.key==='Escape'){if(Modal.isOpen)Modal.close();else if(Cine.active)Cine.skip();else if($('#notes').classList.contains('on'))Notes.toggle(false);return;}
  if(typing)return;
  if(Modal.isOpen&&e.key!=='?')return;
  const onBtn=tag==='BUTTON'||tag==='A';
  if((e.key===' '||e.key==='Enter')&&onBtn)return;
  const k=e.key;
  if(k==='ArrowRight'||k==='PageDown'){e.preventDefault();Nav.next();}
  else if(k==='ArrowLeft'||k==='PageUp'){e.preventDefault();Nav.prev();}
  else if(k===' '||k==='ArrowDown'){e.preventDefault();Nav.revealNext();}
  else if(k==='a'||k==='A')Nav.toggleAnswer();
  else if(k==='d'||k==='D')Nav.deeper();
  else if((k==='n'||k==='N')&&S.mode==='instructor')Notes.toggle();
  else if(k==='g'||k==='G')openGuide();
  else if(k==='m'||k==='M')openMap();
  else if(k==='h'||k==='H'||k==='Home')Nav.hub();
  else if(k==='r'||k==='R')Nav.replay();
  else if(k==='s'||k==='S')Cine.skip();
  else if(k==='p'||k==='P')togglePause();
  else if(k==='v'||k==='V')toggleView();
  else if(k==='f'||k==='F')toggleFS();
  else if(k==='+'||k==='='){S.prefs.scale=clamp(+(S.prefs.scale+.1).toFixed(1),.8,1.4);applyPrefs();saveState();}
  else if(k==='-'){S.prefs.scale=clamp(+(S.prefs.scale-.1).toFixed(1),.8,1.4);applyPrefs();saveState();}
  else if(k==='?'||k==='/')openHelp();
});

/* ---------- boot ---------- */
function boot(){
  loadState();
  FX.init();Campus.build($('#campus'));Avatar.build();
  applyPrefs();fit();addEventListener('resize',fit);
  $('#homeBtn').onclick=()=>Nav.hub();$('#mapBtn').onclick=openMap;$('#modeBtn').onclick=()=>setMode(S.mode==='instructor'?'student':'instructor');
  $('#pauseBtn').onclick=togglePause;$('#replayBtn').onclick=()=>Nav.replay();$('#viewBtn').onclick=toggleView;
  $('#notesBtn').onclick=()=>Notes.toggle();$('#guideBtn').onclick=openGuide;$('#fsBtn').onclick=toggleFS;$('#setBtn').onclick=openSettings;$('#helpBtn').onclick=openHelp;
  $('#revealBtn').onclick=()=>Nav.revealNext();$('#prevBtn').onclick=()=>Nav.prev();$('#nextBtn').onclick=()=>Nav.next();$('#skip').onclick=()=>Cine.skip();
  $('#notesClose').onclick=()=>Notes.toggle(false);$('#notesPop').onclick=()=>Notes.popout();
  $('#pace').onclick=e=>{if(e.altKey)Pace.reset();else Pace.toggle();};
  setInterval(()=>Pace.tick(),1000);
  if(!CHAPTERS[S.ch]||!CHAPTERS[S.ch].scenes[S.sc]){S.ch=0;S.sc=0;}
  if(!Nav.unlocked(S.ch)){S.ch=0;S.sc=0;}
  Nav.show(++Nav.navId).then(()=>{Nav.inited=true;});
  Nav.inited=true;
  window.__ail={S,Nav,CHAPTERS,Sims,Vis,Anim,Cine,Avatar,Campus};
}
