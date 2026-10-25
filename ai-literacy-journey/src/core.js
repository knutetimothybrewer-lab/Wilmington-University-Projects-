'use strict';
/* =====================================================================
   CORE ENGINE: utilities, central state, animation loop, cinematic runner,
   avatar, particle layer. No lecture content lives here (see content.js).
   ===================================================================== */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const SVGTAGS=new Set('svg g path circle rect line text defs linearGradient radialGradient stop polygon ellipse polyline use clipPath tspan marker filter feGaussianBlur'.split(' '));
function h(tag,attrs,...kids){
  const el=SVGTAGS.has(tag)?document.createElementNS('http://www.w3.org/2000/svg',tag):document.createElement(tag);
  for(const [k,v] of Object.entries(attrs||{})){
    if(v==null||v===false)continue;
    if(k==='style'&&typeof v==='object')Object.assign(el.style,v);
    else if(k==='html')el.innerHTML=v;
    else if(k.startsWith('on')&&typeof v==='function')el.addEventListener(k.slice(2),v);
    else el.setAttribute(k,v===true?'':v);
  }
  for(const c of kids.flat(Infinity)){if(c==null||c===false)continue;el.append(c.nodeType?c:document.createTextNode(c));}
  return el;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const easeInOut=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const easeOut=t=>1-Math.pow(1-t,3);
const lin=t=>t;
const fmt=(v,d=2)=>Number(v).toFixed(d);
const pct=(v,d=0)=>(v*100).toFixed(d)+'%';
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function shuffle(a,r=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ---------------- central application state ---------------- */
const STORE_KEY='wilmu-ail-journey-v2';
const S={
  mode:'instructor',ch:0,sc:0,target:75,
  visited:{},      // "ch:sc" -> true
  quiz:{},         // questionId -> {pick, ok}
  checks:{},       // concept check results
  reflect:{},      // free text reflections (local only, no identifiers requested)
  principles:[],   // chosen responsible-AI principles
  prefs:{reduced:false,low:false,contrast:false,scale:1,captions:true},
  timer:{running:false,elapsed:0,last:0}   // session-only, not persisted
};
const PERSIST=['mode','ch','sc','target','visited','quiz','checks','reflect','principles','prefs'];
function loadState(){
  try{
    const j=JSON.parse(localStorage.getItem(STORE_KEY)||'null');
    if(j)for(const k of PERSIST)if(j[k]!==undefined)S[k]=(typeof S[k]==='object'&&!Array.isArray(S[k]))?Object.assign(S[k],j[k]):j[k];
  }catch(e){}
  try{if(!localStorage.getItem(STORE_KEY)&&matchMedia('(prefers-reduced-motion: reduce)').matches)S.prefs.reduced=true;}catch(e){}
}
let saveT=0;
function saveState(){clearTimeout(saveT);saveT=setTimeout(()=>{try{const o={};for(const k of PERSIST)o[k]=S[k];localStorage.setItem(STORE_KEY,JSON.stringify(o));}catch(e){}},120);}

/* ---------------- animation engine ---------------- */
const CANCEL={cancelled:true};
const Anim={
  paused:false,tickers:new Map(),last:0,raf:0,uid:0,
  add(fn,id){id=id||('t'+(++this.uid));this.tickers.set(id,fn);this.kick();return id;},
  remove(id){this.tickers.delete(id);},
  kick(){if(!this.raf){this.last=performance.now();this.raf=requestAnimationFrame(this.frame);}},
  frame(ts){
    const A=Anim;A.raf=0;if(!A.tickers.size)return;
    let raw=ts-A.last;
    if(S.prefs.low&&raw<30){A.raf=requestAnimationFrame(A.frame);return;}
    A.last=ts;raw=Math.min(raw,100);
    const eff=A.paused?0:raw;
    for(const [id,fn] of [...A.tickers]){
      try{if(fn(eff,ts,raw)===false)A.tickers.delete(id);}catch(e){console.error(e);A.tickers.delete(id);}
    }
    A.raf=requestAnimationFrame(A.frame);
  },
  /* UI tween: ignores pause (so controls never freeze); instant under reduced motion */
  tween(dur,fn,ease=easeOut){
    return new Promise(res=>{
      if(S.prefs.reduced||dur<=0){fn(1);res();return;}
      let el=0;fn(0);
      this.add((d,t,raw)=>{el+=raw;const p=Math.min(1,el/dur);fn(ease(p));if(p>=1){res();return false;}});
    });
  }
};
class Cin{
  constructor(){this.skipping=false;this.dead=false;}
  _tick(test){
    return new Promise((res,rej)=>{
      Anim.add((dt)=>{
        if(this.dead){rej(CANCEL);return false;}
        if(this.skipping||S.prefs.reduced){res();return false;}
        if(test(dt)){res();return false;}
      });
    });
  }
  wait(ms){let el=0;return this._tick(dt=>(el+=dt)>=ms);}
  async tween(dur,fn,ease=easeInOut){let el=0;fn(0);await this._tick(dt=>{el+=dt;if(el<dur){fn(ease(el/dur));return false;}return true;});fn(1);}
  skip(){this.skipping=true;}
}
const Cine={
  cur:null,
  run(fn){
    this.cancel();const c=new Cin();this.cur=c;document.body.classList.add('cinema');
    return(async()=>{
      try{await fn(c);}catch(e){if(e!==CANCEL)console.error(e);}
      finally{if(this.cur===c){this.cur=null;document.body.classList.remove('cinema');}}
      return !c.dead;
    })();
  },
  cancel(){if(this.cur){this.cur.dead=true;this.cur=null;}document.body.classList.remove('cinema');},
  skip(){if(this.cur)this.cur.skip();if(Avatar.cin)Avatar.cin.skip();},
  get active(){return !!this.cur;}
};

/* ---------------- the student avatar ---------------- */
const Avatar={
  el:null,x:0,dir:1,cin:null,
  build(){
    const el=h('div',{id:'avatar','aria-hidden':'true'});
    el.innerHTML=`<svg viewBox="0 0 120 240"><ellipse cx="60" cy="234" rx="34" ry="6" fill="#0006"/>
    <g class="idle"><g class="bob">
      <g class="legL"><rect x="46" y="142" width="17" height="76" rx="8" fill="#26334d"/><path d="M41 214h28a5 5 0 0 1 5 6v6H41z" fill="#f2f2f2"/></g>
      <g class="legR"><rect x="62" y="142" width="17" height="76" rx="8" fill="#2f3f60"/><path d="M57 214h28a5 5 0 0 1 5 6v6H57z" fill="#ffffff"/></g>
      <g class="armB"><rect x="30" y="80" width="15" height="66" rx="7" fill="#04522f"/><circle cx="37" cy="148" r="8" fill="#d99b70"/></g>
      <rect x="28" y="84" width="22" height="62" rx="9" fill="#14532d" opacity=".95"/>
      <rect x="38" y="72" width="46" height="78" rx="14" fill="#00693C"/>
      <path d="M52 72l8 20 8-20z" fill="#fff"/><path d="M60 92l-4 56h8z" fill="#f2b705" opacity=".9"/>
      <rect x="47" y="108" width="26" height="20" rx="3" fill="#f2b705" opacity=".0"/>
      <g class="armF"><rect x="76" y="80" width="15" height="66" rx="7" fill="#00693C"/><circle cx="84" cy="148" r="8" fill="#e0ac82"/><rect x="82" y="140" width="22" height="30" rx="3" fill="#1d3a8a" transform="rotate(8 90 150)"/></g>
      <rect x="54" y="62" width="12" height="12" fill="#e0ac82"/>
      <circle cx="60" cy="42" r="24" fill="#e0ac82"/>
      <path d="M35 40c-2-22 14-30 27-28 16 1 26 12 22 30-4-9-9-14-20-15-10 3-21 4-29 13z" fill="#3a2418"/>
      <g class="eye"><circle cx="69" cy="42" r="3" fill="#1a1020"/></g><g class="eye"><circle cx="53" cy="42" r="3" fill="#1a1020"/></g>
      <path d="M54 54q7 6 14 0" stroke="#7a3f2a" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g></g></svg>`;
    this.el=el;return el;
  },
  mount(parent,x,bottomPx,scale=1){
    if(!this.el)this.build();
    parent.appendChild(this.el);
    this.el.style.bottom=bottomPx+'px';this.el.style.setProperty('--sc',scale);this.scale=scale;
    this.setX(x);
  },
  setX(x){this.x=x;this.el.style.left=x+'px';},
  face(d){this.dir=d;this.el.classList.toggle('flip',d<0);},
  async walkTo(x,opts={}){
    const speed=opts.speed||0.42; // px per ms
    const from=this.x,dist=Math.abs(x-from);
    if(this.cin)this.cin.dead=true;
    const c=opts.cin||(this.cin=new Cin());
    if(S.prefs.reduced||dist<2){this.setX(x);return;}
    this.face(x>=from?1:-1);
    this.el.classList.add('walking');
    try{
      await c.tween(dist/speed,p=>{this.setX(from+(x-from)*p);if(opts.onStep)opts.onStep(this.x);},lin);
    }catch(e){if(e!==CANCEL)throw e;return;}
    finally{if(!c.dead||c===this.cin)this.el.classList.remove('walking');}
  },
  react(kind){
    const e=this.el;if(!e)return;e.classList.remove('react','wave');void e.offsetWidth;
    e.classList.add(kind==='wave'?'wave':'react');
    setTimeout(()=>e.classList.remove('react','wave'),kind==='wave'?2200:700);
  }
};

/* ---------------- particle layer (one canvas, themed) ---------------- */
const FX={
  cv:null,cx:null,theme:null,parts:[],id:null,W:960,H:540,
  themes:{
    campus:{n:26,col:['#d6f5a0','#fff3a0','#ffffff'],vx:[-.03,-.01],vy:[.01,.03],r:[2,4],kind:'dot'},
    dusk:{n:34,col:['#fff5a0','#ffd37a'],vx:[-.01,.01],vy:[-.01,.01],r:[2,4],kind:'glow'},
    museum:{n:38,col:['#38e1ff','#9a7bff','#ffffff'],vx:[-.01,.01],vy:[-.03,-.008],r:[1.5,3.5],kind:'glow'},
    lab:{n:30,col:['#38d996','#7fe7ff'],vx:[-.005,.005],vy:[.02,.05],r:[9,13],kind:'bit'},
    digital:{n:30,col:['#38e1ff','#ff5ec4','#9a7bff','#ffe08a'],vx:[.05,.12],vy:[-.01,.01],r:[12,16],kind:'token'},
    library:{n:40,col:['#ffe08a','#ffd27a','#fff'],vx:[-.01,.01],vy:[-.02,-.005],r:[1.5,3.5],kind:'glow'},
    obs:{n:32,col:['#7fe7ff','#6fa8ff','#fff'],vx:[-.02,.02],vy:[-.02,.02],r:[3,6],kind:'sq'},
    collab:{n:34,col:['#ffb84d','#38e1ff','#38d996','#ff5ec4'],vx:[-.03,.03],vy:[-.03,.03],r:[3,6],kind:'glow'}
  },
  words:['the','teach','##er','learn','5021','▮','AI','token','0.82','of','class','data','→','P(x)','Δ','query'],
  init(){
    this.cv=$('#fx');this.cx=this.cv.getContext('2d');this.resize();
  },
  resize(){
    const s=S.prefs.low?.5:1;this.W=Math.round(960*s);this.H=Math.round(540*s);
    this.cv.width=this.W;this.cv.height=this.H;this.k=this.W/960;
  },
  set(name){
    this.themeName=name;this.theme=this.themes[name]||null;this.parts=[];
    if(this.id){Anim.remove(this.id);this.id=null;}
    this.cx.clearRect(0,0,this.W,this.H);
    if(!this.theme||S.prefs.reduced)return;
    const r=Math.random;const n=Math.round(this.theme.n*(S.prefs.low?.5:1));
    for(let i=0;i<n;i++)this.parts.push(this.spawn(true));
    this.id=Anim.add((dt)=>{if(dt>0)this.draw(dt);});
  },
  spawn(init){
    const t=this.theme,r=Math.random,rg=(a)=>lerp(a[0],a[1],r());
    return{x:r()*960,y:init?r()*540:(t.vy[0]>0?-10:550),vx:rg(t.vx),vy:rg(t.vy),r:rg(t.r),c:t.col[Math.floor(r()*t.col.length)],ph:r()*6.28,w:this.words[Math.floor(r()*this.words.length)]};
  },
  draw(dt){
    const cx=this.cx,t=this.theme,k=this.k;cx.clearRect(0,0,this.W,this.H);
    for(let i=0;i<this.parts.length;i++){
      const p=this.parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.ph+=dt*.002;
      if(p.x<-60||p.x>1020||p.y<-30||p.y>570){Object.assign(p,this.spawn(false));if(t.vx[0]>.03)p.x=-40;}
      const x=p.x*k,y=p.y*k,r=p.r*k;
      cx.globalAlpha=.55+.4*Math.sin(p.ph);cx.fillStyle=p.c;
      if(t.kind==='dot'){cx.beginPath();cx.arc(x,y,r,0,6.3);cx.fill();}
      else if(t.kind==='glow'){cx.globalAlpha*=.8;cx.beginPath();cx.arc(x,y,r,0,6.3);cx.fill();cx.globalAlpha*=.25;cx.beginPath();cx.arc(x,y,r*3,0,6.3);cx.fill();}
      else if(t.kind==='sq'){cx.fillRect(x,y,r,r);}
      else if(t.kind==='bit'){cx.font=`${r*1.2}px monospace`;cx.fillText(p.ph>3?'1':'0',x,y);}
      else if(t.kind==='token'){
        cx.font=`${r*k*1.0}px monospace`;const w=cx.measureText(p.w).width+10*k;
        cx.globalAlpha=.28;cx.fillRect(x,y-r,w,r*1.5);cx.globalAlpha=.9;cx.strokeStyle=p.c;cx.strokeRect(x,y-r,w,r*1.5);cx.fillStyle='#fff';cx.fillText(p.w,x+5*k,y+r*.2);
      }
    }
    cx.globalAlpha=1;
  }
};
