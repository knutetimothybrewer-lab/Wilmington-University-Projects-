'use strict';
/* =====================================================================
   APP (part 1): stage, views, captions, modals, notes, cinematics
   ===================================================================== */
const stage=$('#stage');
function fit(){const vw=innerWidth,vh=innerHeight,s=Math.min(vw/1920,vh/1080);stage.style.transform=`translate(${(vw-1920*s)/2}px,${(vh-1080*s)/2}px) scale(${s})`;stage.dataset.scale=s;}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2400);}
function announce(s){$('#live').textContent='';setTimeout(()=>{$('#live').textContent=s;},30);}
const Cap={set(t){const e=$('#cap');if(!t){e.classList.add('hidden');return;}e.textContent=t;e.classList.toggle('hidden',!S.prefs.captions);announce(t);}};
function fade(on,ms=450){const f=$('#fade');ms=S.prefs.reduced?0:ms;f.style.transitionDuration=ms+'ms';f.classList.toggle('on',on);return sleep(ms+20);}
async function fadeC(c,on,ms){
  fade(on,c&&c.skipping?0:ms);const total=S.prefs.reduced?0:ms;
  for(let t=0;t<total;t+=40){if(!c||c.skipping||c.dead)break;await sleep(40);}
  if(c&&(c.skipping||c.dead))$('#fade').style.transitionDuration='0ms';
}
function showTitle(html){const t=$('#title');if(!html){t.style.opacity=0;return;}t.innerHTML=html;t.style.opacity=1;}

/* ---------- views: campus world or interior environment ---------- */
const View={
  mode:'campus',
  showCampus(dusk=false){
    this.mode='campus';$('#campus').classList.remove('hidden');$('#env').classList.add('hidden');$('#env').style.transform='';
    Campus.setDusk(dusk);FX.set(dusk?'dusk':'campus');
    if(Avatar.el&&Avatar.el.parentNode!==Campus.near)Avatar.mount(Campus.near,Avatar.x>0&&Avatar.x<Campus.W?Avatar.x:300,135,.9);
    $('#hubcard').classList.add('hidden');
  },
  showEnv(name,fx){
    this.mode='env';$('#campus').classList.add('hidden');$('#env').classList.remove('hidden');$('#env').style.transform='';
    Env.set(name);FX.set(fx);
  },
  avatarCampus(x,opts={}){Avatar.mount(Campus.near,x,opts.bottom??135,opts.scale??.9);Avatar.el.style.opacity=1;},
  avatarEnv(x){Avatar.mount($('#avatarHost'),x,26,.8);Avatar.el.style.opacity=1;}
};

/* ---------- modal system ---------- */
const Modal={
  prevFocus:null,onClose:null,
  open(title,content,o={}){
    const ov=$('#overlay');this.prevFocus=document.activeElement;this.onClose=o.onClose||null;
    ov.innerHTML='';
    const m=h('div',{class:'modal',role:'dialog','aria-modal':'true','aria-labelledby':'mtitle',style:o.width?{width:o.width}:{}},
      h('button',{class:'btn x',type:'button',onclick:()=>Modal.close(),'aria-label':'Close dialog'},'Close ✕'),
      h('h2',{id:'mtitle'},title),content);
    ov.append(m);ov.classList.add('on');ov.onclick=e=>{if(e.target===ov)Modal.close();};
    setTimeout(()=>{const f=$('button, [href], input, select, textarea',m);if(f)f.focus();},30);
  },
  close(){
    const ov=$('#overlay');if(!ov.classList.contains('on'))return;
    ov.classList.remove('on');ov.innerHTML='';
    if(this.onClose){const f=this.onClose;this.onClose=null;f();}
    if(this.prevFocus&&this.prevFocus.focus)try{this.prevFocus.focus();}catch(e){}
  },
  get isOpen(){return $('#overlay').classList.contains('on');}
};

/* ---------- instructor notes: in-stage drawer + separate pop-out window ---------- */
const Notes={
  win:null,
  html(C,sc){
    const n=sc.notes||{};
    const sec=(t,x)=>x?`<h3>${t}</h3><p>${esc(x).replace(/\n/g,'<br>')}</p>`:'';
    const kind=sc.sim&&Sims[sc.sim]?KINDS[Sims[sc.sim].kind]:null;
    return `<h2 style="margin:6px 0 0">${esc(sc.title)}</h2><div>${esc(C.title)} · planned ${sc.minutes} min${sc.optional?' · OPTIONAL':''}</div>`+
      (kind?`<p><b>Demonstration type:</b> ${kind.label}. ${kind.tip}</p>`:'')+
      sec('Suggested narration',n.say)+sec('What the demonstration does',n.demo)+sec('Discussion facilitation',n.facilitate)+
      (sc.concept?sec('Discussion question',sc.concept.discuss):'')+(sc.lab?sec('Lab prompt',sc.lab.prompt):'')+
      sec('Anticipated misconceptions',n.misc)+sec('Follow-up questions',n.follow)+sec('Technical qualifications',n.caveat)+
      (sc.deeper?`<h3>Optional advanced material</h3><p>Dive Deeper (D): “${esc(sc.deeper.title)}”</p>`:'')+sec('Suggested transition',n.transition);
  },
  render(){
    const C=CHAPTERS[S.ch],sc=C.scenes[S.sc];
    const body=this.html(C,sc);
    const nb=$('#notes .nb');if(nb)nb.innerHTML=body;
    if(this.win&&!this.win.closed){try{this.win.document.getElementById('nb').innerHTML=body;this.win.document.title='Notes: '+sc.title;}catch(e){}}
  },
  toggle(force){const n=$('#notes');const on=force??!n.classList.contains('on');n.classList.toggle('on',on);n.setAttribute('aria-hidden',!on);if(on)this.render();},
  popout(){
    if(this.win&&!this.win.closed){this.win.focus();return;}
    const w=window.open('','ail-notes','width=720,height=900');
    if(!w){toast('Pop-up blocked: allow pop-ups, or use the in-page notes drawer.');return;}
    w.document.write('<!doctype html><meta charset="utf-8"><title>Presenter notes</title><style>body{font:18px/1.45 system-ui,Segoe UI,sans-serif;margin:0;background:#fffbe9;color:#1a1200}.bar{background:#1a5c3a;color:#fff;padding:8px 16px;font-weight:700}#nb{padding:6px 22px 40px}h3{color:#7a4b00;text-transform:uppercase;letter-spacing:.08em;font-size:14px;margin:16px 0 2px}p{margin:.3em 0}</style><div class="bar">PRESENTER NOTES: private window. Do not share this window.</div><div id="nb"></div>');
    w.document.close();this.win=w;this.render();toast('Notes window opened. Share only the lecture window.');
  }
};

/* ---------- cinematics (all skippable, all pausable) ---------- */
const Cinematics={
  async opening(sc){
    const done=await Cine.run(async c=>{
      View.showCampus(false);Campus.setCam(0);View.avatarCampus(-120);Avatar.face(1);Campus.highlight(0);
      Cap.set('');showTitle('');$('#fade').classList.add('on');
      showTitle('<div class="kicker" style="font-size:24px">Wilmington University</div><div class="tt">Journey Through the Intelligence Machine</div><div class="ts">AI Literacy for Educators</div>');
      await fadeC(c,false,1400);await c.wait(2200);
      showTitle('');Cap.set(sc.cap[0]);await c.wait(1600);
      Cap.set(sc.cap[1]);
      await Avatar.walkTo(520,{cin:c,onStep:x=>Campus.setCam(Campus.followTarget(x))});
      Avatar.react('wave');await c.wait(1500);
      Cap.set(sc.cap[2]);Campus.highlight(1);
      await Avatar.walkTo(1000,{cin:c,onStep:x=>Campus.setCam(Campus.followTarget(x))});
      await c.wait(900);
    });
    if(done){Cap.set('Press → or Next to continue.');showTitle('');}
  },
  async portal(sc){
    const done=await Cine.run(async c=>{
      View.showEnv('lab','lab');$('#env').style.transformOrigin='960px 410px';
      View.avatarEnv(80);Avatar.face(1);Cap.set('');$('#fade').classList.add('on');
      await fadeC(c,false,900);Cap.set(sc.cap[0]);
      await Avatar.walkTo(640,{cin:c});Avatar.react('wave');
      Cap.set(sc.cap[1]);await Avatar.walkTo(930,{cin:c});await c.wait(500);
      Cap.set(sc.cap[2]);
      await c.tween(3200,p=>{$('#env').style.transform=`scale(${1+p*p*5.2})`;Avatar.el.style.opacity=clamp(1-p*2.4,0,1);},easeInOut);
      $('#flash').style.opacity=1;$('#flash').style.transition='opacity .35s';await sleep(S.prefs.reduced||c.skipping?0:400);
      Env.cur=null;View.showEnv('digital','digital');$('#env').style.transformOrigin='960px 470px';$('#env').style.transform='scale(2.4)';
      View.avatarEnv(420);Avatar.face(1);
      Cap.set(sc.cap[3]);
      $('#flash').style.opacity=0;
      await c.tween(1800,p=>{$('#env').style.transform=`scale(${lerp(2.4,1,p)})`;Avatar.el.style.opacity=p;},easeOut);
      $('#env').style.transform='';
    });
    if(done)Cap.set('Press → or Next to continue.');
  },
  async ret(sc){
    const done=await Cine.run(async c=>{
      View.showCampus(false);Campus.dusk.style.opacity=0;
      if(Avatar.x<3800||Avatar.el.parentNode!==Campus.near){View.avatarCampus(Campus.centers[4]);}
      Campus.setCam(Campus.followTarget(Avatar.x));Avatar.face(-1);
      $('#fade').classList.remove('on');
      Cap.set(sc.cap[0]);await c.wait(300);
      Campus.setDusk(true);FX.set('dusk');await c.wait(1800);
      Cap.set(sc.cap[1]);
      await Avatar.walkTo(900,{cin:c,speed:.8,onStep:x=>Campus.setCam(Campus.followTarget(x))});
      Cap.set(sc.cap[2]);Avatar.face(1);Avatar.react('wave');await c.wait(1800);
    });
    if(done)Cap.set('Press → or Next to continue.');
  },
  async credits(){
    const done=await Cine.run(async c=>{
      Cap.set('');showTitle('');
      Campus.setCam(0);await Avatar.walkTo(520,{cin:c,speed:.6,onStep:x=>Campus.setCam(Campus.followTarget(x))});Avatar.face(1);
      Avatar.react('wave');
      showTitle('<div class="kicker" style="font-size:24px">Wilmington University</div><div class="tt">AI Literacy for Educators</div><div class="ts">Understand · Evaluate · Question · Decide</div>');
      await c.wait(4500);showTitle('');Cap.set('Thank you.');await c.wait(1800);
    });
    if(done){Cap.set('');showTitle('');}
  }
};
