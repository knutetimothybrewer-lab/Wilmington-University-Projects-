'use strict';
/* =====================================================================
   ART: the reusable virtual campus (2.5D parallax), interior environments,
   and concept figures. Reusable for future course modules: add a building
   to CAMPUS_SPOTS in content.js and an env below.
   ===================================================================== */
const Campus={
  W:5300,F:[.2,.5,1,1.3],cam:0,root:null,layers:[],built:false,
  centers:[760,1720,2680,3640,4600],
  groundY:880,
  build(root){
    this.root=root;const W=this.W;
    const mk=(f,svg)=>{const w=Math.round(1920+(W-1920)*f);const d=h('div',{class:'plx'});d.style.width=w+'px';d.innerHTML=`<svg width="${w}" height="1080" viewBox="0 0 ${w} 1080">${svg(w)}</svg>`;root.appendChild(d);this.layers.push({d,f});return d;};
    root.innerHTML=`<div class="layer" id="skyDay" style="background:linear-gradient(#69b7ff,#bfe6ff 55%,#fff1c9)"></div>
    <div class="layer" id="skyDusk" style="background:linear-gradient(#1a1250,#6b3a8f 45%,#ff9a6b 85%,#ffd27a);opacity:0;transition:opacity 2.5s"></div>
    <svg class="layer" id="skyFx" viewBox="0 0 1920 1080">
      <g id="stars" style="opacity:0;transition:opacity 2.5s">${Array.from({length:70},(_,i)=>{const r=rng(i+7);return `<circle class="tw" cx="${r()*1920}" cy="${r()*520}" r="${1+r()*2}" fill="#fff" style="animation-delay:${r()*3}s"/>`}).join('')}</g>
      <circle id="sun" cx="1500" cy="190" r="86" fill="#fff6c2"/><circle cx="1500" cy="190" r="140" fill="#fff6c2" opacity=".28"/>
      <g opacity=".92" fill="#fff">${[0,1,2,3].map(i=>`<g class="cloud" style="animation-delay:${-i*34}s;animation-duration:${120+i*25}s"><ellipse cx="${200+i*80}" cy="${130+i*55}" rx="150" ry="38"/><ellipse cx="${300+i*80}" cy="${105+i*55}" rx="100" ry="40"/><ellipse cx="${120+i*80}" cy="${142+i*55}" rx="90" ry="30"/></g>`).join('')}</g>
    </svg>`;
    // far: hills + skyline
    mk(.2,w=>{let s=`<path d="M0 760 Q300 560 700 700 T1500 650 T2300 720 T${w} 640 V1080 H0Z" fill="#8fb4d9"/><path d="M0 820 Q400 680 900 790 T1800 760 T${w} 790 V1080H0Z" fill="#7aa4a0"/>`;const r=rng(3);for(let x=100;x<w;x+=160+r()*120){const hh=120+r()*160;s+=`<rect x="${x}" y="${760-hh}" width="${70+r()*60}" height="${hh}" fill="#7c97bd" opacity=".55"/>`;}return s;});
    // mid: tree line + lamp windows
    mk(.5,w=>{let s='';const r=rng(11);for(let x=40;x<w;x+=120+r()*90){const t=70+r()*60;s+=`<rect x="${x+t*.45}" y="${820-t*.6}" width="${t*.16}" height="${t*.9}" fill="#4b3a2a"/><circle cx="${x+t*.5}" cy="${760-t*.4}" r="${t}" fill="#2f8a52"/><circle cx="${x+t*.1}" cy="${790-t*.3}" r="${t*.7}" fill="#3aa15f"/><circle cx="${x+t*.9}" cy="${790-t*.3}" r="${t*.7}" fill="#2a7a49"/>`;}
      s+=`<g transform="translate(${w*.42} 400)"><rect width="120" height="420" fill="#b98c6a"/><polygon points="-14,0 60,-80 134,0" fill="#8a3b2e"/><circle cx="60" cy="70" r="34" fill="#fff6dd" stroke="#6b4a2a" stroke-width="5"/><path d="M60 70V48M60 70l16 8" stroke="#33231a" stroke-width="4"/></g>`;return s;});
    // near: ground + buildings
    mk(1,w=>this.nearSVG());
    // foreground bushes
    mk(1.3,w=>{let s='';const r=rng(21);for(let x=-60;x<w;x+=170+r()*180){const rr=60+r()*50;s+=`<ellipse cx="${x}" cy="1085" rx="${rr*1.5}" ry="${rr}" fill="#1f6f3e"/><ellipse cx="${x+rr*.5}" cy="1075" rx="${rr}" ry="${rr*.7}" fill="#2a8a4d"/>`;if(r()>.6)s+=`<circle cx="${x}" cy="${1010}" r="9" fill="#ff6fa5"/><circle cx="${x+30}" cy="1022" r="8" fill="#ffd54a"/>`;}return s;});
    this.near=this.layers[2].d;
    this.dusk=h('div',{class:'layer',id:'duskTint',style:{background:'linear-gradient(rgba(60,20,110,.45),rgba(255,120,60,.25))',opacity:0,transition:'opacity 2.5s',pointerEvents:'none',zIndex:3}});
    root.appendChild(this.dusk);
    this.built=true;this.setCam(0);
    // sign interactions
    $$('.sign',root).forEach(g=>{const act=()=>Nav.travelTo(+g.dataset.i);g.addEventListener('click',act);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
  },
  door(cx,i){return `<g class="door" id="door${i}"><rect x="${cx-70}" y="636" width="140" height="244" rx="6" fill="#ffeaa3"/><rect x="${cx-70}" y="636" width="140" height="244" rx="6" fill="url(#doorGlow)"/><rect class="dl" x="${cx-70}" y="636" width="70" height="244" fill="#4a2f1d"/><rect class="dr" x="${cx}" y="636" width="70" height="244" fill="#5a3a24"/><rect x="${cx-74}" y="632" width="148" height="252" rx="8" fill="none" stroke="#2a1a10" stroke-width="6"/><circle cx="${cx-14}" cy="760" r="5" fill="#f2b705"/><circle cx="${cx+14}" cy="760" r="5" fill="#f2b705"/></g>`;},
  sign(cx,i,name){return `<g class="sign" data-i="${i}" tabindex="0" role="button" aria-label="Enter building ${i}: ${esc(name)}"><rect class="glow" x="${cx-218}" y="524" width="436" height="88" rx="16" fill="#ffe27a"/><rect class="plq" x="${cx-210}" y="530" width="420" height="76" rx="12" fill="#fff" stroke="#00693C" stroke-width="6"/><circle cx="${cx-172}" cy="568" r="28" fill="#00693C"/><text x="${cx-172}" y="580" text-anchor="middle" font-size="34" font-weight="700" fill="#fff">${i}</text><text x="${cx+22}" y="574" text-anchor="middle" font-size="26" font-weight="700" fill="#0b2a1a">${esc(name)}</text></g>`;},
  nearSVG(){
    const W=this.W,C=this.centers,gy=this.groundY;
    let s=`<defs><linearGradient id="doorGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff9d0"/><stop offset="1" stop-color="#ffcf70"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfefff" stop-opacity=".9"/><stop offset="1" stop-color="#5fb4e8" stop-opacity=".75"/></linearGradient>
      <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58b765"/><stop offset="1" stop-color="#2f8a4a"/></linearGradient></defs>
      <rect x="0" y="${gy-30}" width="${W}" height="260" fill="url(#grass)"/>
      <rect x="0" y="${gy+18}" width="${W}" height="120" fill="#d9d4c7"/><rect x="0" y="${gy+16}" width="${W}" height="8" fill="#bdb7a8"/><rect x="0" y="${gy+138}" width="${W}" height="8" fill="#bdb7a8"/>
      <rect x="0" y="${gy+146}" width="${W}" height="140" fill="url(#grass)"/>`;
    for(let x=60;x<W;x+=240)s+=`<rect x="${x}" y="${gy+78}" width="90" height="4" fill="#c7c1b2"/>`;
    // welcome sign
    s+=`<g transform="translate(150 ${gy-190})"><rect x="0" y="0" width="12" height="190" fill="#4b3a2a"/><rect x="190" y="0" width="12" height="190" fill="#4b3a2a"/><rect x="-18" y="-10" width="238" height="120" rx="12" fill="#00693C" stroke="#fff" stroke-width="5"/><text x="101" y="40" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">WILMINGTON</text><text x="101" y="68" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">UNIVERSITY</text><text x="101" y="96" text-anchor="middle" fill="#ffe08a" font-size="16">AI Literacy for Educators</text></g>`;
    // building 1: Discovery Center (glass dome)
    let c=C[0];
    s+=`<g><rect x="${c-340}" y="520" width="680" height="${gy-520}" fill="#e6f0f3"/><path d="M${c-230} 520A230 230 0 0 1 ${c+230} 520Z" fill="url(#glass)" stroke="#2a8a9a" stroke-width="6"/>
      <g stroke="#2a8a9a" stroke-width="3" fill="none"><path d="M${c-230} 520Q${c} 150 ${c+230} 520"/><path d="M${c-120} 520Q${c} 240 ${c+120} 520"/><path d="M${c} 300V520"/></g>
      ${[[-110,420],[0,380],[110,420],[-60,470],[60,470]].map(([x,y],k)=>`<circle class="flick" cx="${c+x}" cy="${y}" r="9" fill="#38e1ff" style="animation-delay:${k*.4}s"/>`).join('')}
      <path d="M${c-110} 420L${c} 380L${c+110} 420M${c-60} 470L${c} 380L${c+60} 470M${c-110} 420L${c-60} 470M${c+110} 420L${c+60} 470" stroke="#38e1ff" stroke-width="3" fill="none"/>
      ${[-290,-210,210,290].map(x=>`<rect x="${c+x-30}" y="600" width="60" height="200" fill="url(#glass)" stroke="#2a8a9a" stroke-width="4"/>`).join('')}
      <rect x="${c-340}" y="${gy-24}" width="680" height="24" fill="#2a8a9a"/></g>${this.door(c,1)}${this.sign(c,1,'AI Discovery Center')}`;
    // building 2: Computer Lab
    c=C[1];
    s+=`<g><rect x="${c-330}" y="400" width="660" height="${gy-400}" fill="#2a3550"/><rect x="${c-330}" y="400" width="660" height="22" fill="#38e1ff"/>
      <rect x="${c-150}" y="300" width="300" height="100" rx="10" fill="#0b1226" stroke="#38e1ff" stroke-width="5"/><text x="${c}" y="372" text-anchor="middle" fill="#38e1ff" font-size="52" font-family="monospace" font-weight="700">&lt;/AI&gt;</text>
      ${Array.from({length:12},(_,k)=>{const col=k%6,row=Math.floor(k/6);return `<rect class="${(k*7)%3?'':'flick'}" x="${c-300+col*100}" y="${440+row*76}" width="76" height="52" fill="${(k*5)%4?'#7fe7ff':'#ffe08a'}" opacity=".85" style="animation-delay:${k*.3}s"/>`}).join('')}
      <rect x="${c-340}" y="${gy-24}" width="680" height="24" fill="#16203a"/></g>${this.door(c,2)}${this.sign(c,2,'Language Machine Lab')}`;
    // building 3: Library
    c=C[2];
    s+=`<g><polygon points="${c-360},470 ${c},340 ${c+360},470" fill="#c9b27a" stroke="#8c7a4a" stroke-width="5"/><circle cx="${c}" cy="425" r="30" fill="#fff6dd" stroke="#8c7a4a" stroke-width="4"/>
      <rect x="${c-340}" y="470" width="680" height="${gy-470}" fill="#e3d2a4"/>${[-300,-200,-100,100,200,300].map(x=>`<rect x="${c+x-22}" y="480" width="44" height="${gy-500}" fill="#f4ead0" stroke="#b79d5e" stroke-width="3"/>`).join('')}
      <rect x="${c-360}" y="${gy-24}" width="720" height="24" fill="#b79d5e"/><rect x="${c-380}" y="${gy-8}" width="760" height="10" fill="#9a8450"/>
      ${[-250,250].map(x=>`<g class="float" style="animation-delay:${x/100}s"><rect x="${c+x-30}" y="660" width="60" height="44" rx="4" fill="#8a3b2e"/><rect x="${c+x-24}" y="666" width="48" height="32" fill="#fff6dd"/></g>`).join('')}</g>${this.door(c,3)}${this.sign(c,3,'Digital Library')}`;
    // building 4: School / Observatory
    c=C[3];
    s+=`<g><rect x="${c-340}" y="440" width="680" height="${gy-440}" fill="#a2503f"/><rect x="${c-340}" y="440" width="680" height="16" fill="#6e2f24"/>
      <rect x="${c-70}" y="270" width="140" height="170" fill="#b45b49"/><polygon points="${c-90},270 ${c},190 ${c+90},270" fill="#6e2f24"/><circle cx="${c}" cy="332" r="38" fill="#fff6dd" stroke="#4a1f18" stroke-width="5"/><path d="M${c} 332V306M${c} 332l18 10" stroke="#222" stroke-width="4"/>
      <path d="M${c-290} 440A60 60 0 0 1 ${c-170} 440Z" fill="#cfd8e6" stroke="#6e7d96" stroke-width="4"/><rect x="${c-232}" y="395" width="6" height="45" fill="#6e7d96"/>
      ${Array.from({length:8},(_,k)=>`<rect x="${c-300+(k%4)*150+(k%4>1?140:0)}" y="${k<4?480:640}" width="62" height="86" fill="${(k*3)%5?'#cfe9ff':'#ffe08a'}" stroke="#fff" stroke-width="5"/>`).join('')}
      <rect x="${c+250}" y="250" width="6" height="190" fill="#ddd"/><path d="M${c+256} 252h70v44h-70z" fill="#00693C"/></g>${this.door(c,4)}${this.sign(c,4,'Decision Observatory')}`;
    // building 5: Collaboration Center
    c=C[4];
    s+=`<g><path d="M${c-350} ${gy}V540Q${c-350} 360 ${c} 330Q${c+350} 360 ${c+350} 540V${gy}Z" fill="#dff3ea" stroke="#00693C" stroke-width="6"/>
      <path d="M${c-350} 540Q${c-350} 360 ${c} 330Q${c+350} 360 ${c+350} 540" fill="none" stroke="#00693C" stroke-width="22"/>
      <rect x="${c-300}" y="640" width="130" height="190" fill="url(#glass)" stroke="#00693C" stroke-width="4"/><rect x="${c+170}" y="640" width="130" height="190" fill="url(#glass)" stroke="#00693C" stroke-width="4"/>
      <circle cx="${c-235}" cy="700" r="20" fill="#00693C"/><rect x="${c-262}" y="725" width="54" height="75" rx="18" fill="#00693C"/>
      <rect x="${c+205}" y="680" width="62" height="58" rx="12" fill="#38a8c8"/><rect x="${c+220}" y="660" width="32" height="20" rx="6" fill="#38a8c8"/><rect x="${c+198}" y="740" width="76" height="60" rx="10" fill="#38a8c8"/>
      <path d="M${c-170} 730h340" stroke="#f2b705" stroke-width="5" stroke-dasharray="12 10" class="flow"/></g>${this.door(c,5)}${this.sign(c,5,'Human–Machine Center')}`;
    // lamp posts
    for(let x=1240;x<W;x+=960)s+=`<g><rect x="${x}" y="${gy-220}" width="10" height="250" fill="#2a2f3a"/><circle class="lamp" cx="${x+5}" cy="${gy-232}" r="20" fill="#fff4b0" opacity=".9"/></g>`;
    return s;
  },
  setCam(x){
    this.cam=clamp(x,0,this.W-1920);
    for(const L of this.layers)L.d.style.transform=`translate3d(${-this.cam*L.f}px,0,0)`;
  },
  followTarget(ax){return clamp(ax-900,0,this.W-1920);},
  setDusk(on,instant){
    const t=instant?'none':'';
    $('#skyDusk').style.opacity=on?1:0;$('#stars').style.opacity=on?1:0;this.dusk.style.opacity=on?1:0;
    $('#sun').style.opacity=on?0:1;
    $$('.lamp',this.root).forEach(l=>l.style.filter=on?'drop-shadow(0 0 30px #ffe58a)':'none');
  },
  highlight(i){$$('.sign',this.root).forEach(g=>g.classList.toggle('next',+g.dataset.i===i));},
  openDoor(i,open=true){const d=$('#door'+i,this.root);if(d)d.classList.toggle('open',open);}
};

/* =====================  INTERIOR ENVIRONMENTS  ===================== */
const stars=(n,seed,h=600)=>Array.from({length:n},(_,i)=>{const r=rng(seed+i);return `<circle class="tw" cx="${r()*1920}" cy="${r()*h}" r="${.8+r()*2}" fill="#fff" style="animation-delay:${r()*3}s"/>`}).join('');
const Envs={
  museum:()=>`<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b2646"/><stop offset="1" stop-color="#1b4a74"/></linearGradient><linearGradient id="mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a5c88"/><stop offset="1" stop-color="#0b2240"/></linearGradient></defs>
    <rect width="1920" height="1080" fill="url(#mw)"/>
    <g stroke="#38e1ff" stroke-opacity=".25" stroke-width="3" fill="none">${[0,1,2,3,4,5,6].map(i=>`<path d="M${i*320} 80Q960 -140 ${1920-i*320} 80"/>`).join('')}</g>
    ${[200,640,1080,1520].map(x=>`<rect x="${x}" y="120" width="200" height="680" fill="#16385f" stroke="#38e1ff" stroke-opacity=".35" stroke-width="3"/>`).join('')}
    ${stars(30,5,500)}
    <rect y="880" width="1920" height="200" fill="url(#mf)"/><path d="M0 880H1920" stroke="#38e1ff" stroke-width="4"/>
    ${[420,820,1220,1620].map((x,i)=>`<g><ellipse cx="${x}" cy="1000" rx="110" ry="22" fill="#38e1ff" opacity=".25"/><rect x="${x-70}" y="930" width="140" height="70" rx="10" fill="#10284a" stroke="#38e1ff" stroke-width="3"/>
      <g class="float" style="animation-delay:${i*.7}s" transform="translate(${x} 880)">${[
      `<g class="spin"><circle r="30" fill="none" stroke="#ffe08a" stroke-width="10" stroke-dasharray="12 8"/><circle r="10" fill="#ffe08a"/></g>`,
      `<g>${[[-20,10],[0,-18],[20,8],[-8,22],[16,-10]].map(([a,b],k)=>`<circle cx="${a}" cy="${b}" r="6" fill="${k%2?'#ff9a6b':'#38d996'}"/>`).join('')}</g>`,
      `<g stroke="#9a7bff" stroke-width="3">${[[-24,-14],[-24,14],[0,-20],[0,0],[0,20],[24,0]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="6" fill="#9a7bff"/>`).join('')}<path d="M-24 -14L0 0M-24 14L0 0M0 -20L24 0M0 20L24 0"/></g>`,
      `<g fill="#ff5ec4">${[-20,-8,4,16].map((y,k)=>`<rect x="-26" y="${y-6}" width="${52-k*9}" height="7" rx="3"/>`).join('')}</g>`][i]}</g>
      <text x="${x}" y="975" text-anchor="middle" fill="#aef" font-size="22" font-weight="700">${['A · RULES','B · LEARNING','C · NEURAL','D · GENERATIVE'][i]}</text></g>`).join('')}
  </svg>`,
  lab:()=>`<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" id="labsvg"><defs><linearGradient id="lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101a33"/><stop offset="1" stop-color="#1c2b52"/></linearGradient><radialGradient id="scr"><stop offset="0" stop-color="#2cf0c8"/><stop offset="1" stop-color="#0a5a7a"/></radialGradient></defs>
    <rect width="1920" height="1080" fill="url(#lw)"/>
    ${[0,1,2].map(i=>`<rect x="${120+i*60}" y="${200+i*10}" width="300" height="40" fill="#1e2f5a" opacity=".6"/>`).join('')}
    <g id="mon"><rect x="610" y="190" width="700" height="440" rx="22" fill="#0a0f1e" stroke="#4a5b8a" stroke-width="10"/><rect x="636" y="214" width="648" height="392" rx="10" fill="url(#scr)"/>
      ${Array.from({length:9},(_,i)=>`<rect x="${660+(i%3)*8}" y="${240+i*38}" width="${180+((i*53)%300)}" height="14" rx="5" fill="#eafffb" opacity=".8"/>`).join('')}
      <rect x="930" y="630" width="60" height="70" fill="#4a5b8a"/><rect x="820" y="696" width="280" height="22" rx="8" fill="#4a5b8a"/></g>
    <rect y="860" width="1920" height="220" fill="#0e1630"/><rect x="0" y="860" width="1920" height="12" fill="#38e1ff" opacity=".6"/>
    ${[260,1500].map(x=>`<g><rect x="${x}" y="770" width="260" height="22" fill="#2e3f70"/><rect x="${x+20}" y="792" width="14" height="80" fill="#2e3f70"/><rect x="${x+226}" y="792" width="14" height="80" fill="#2e3f70"/><rect x="${x+60}" y="690" width="140" height="80" rx="6" fill="#0a0f1e" stroke="#4a5b8a" stroke-width="5"/><rect x="${x+68}" y="698" width="124" height="64" fill="#2cf0c8" opacity=".5"/></g>`).join('')}
  </svg>`,
  digital:()=>`<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14083a"/><stop offset=".6" stop-color="#2a1170"/><stop offset="1" stop-color="#0a1e5a"/></linearGradient></defs>
    <rect width="1920" height="1080" fill="url(#dg)"/>${stars(60,40,700)}
    <g fill="none" stroke="#38e1ff" stroke-opacity=".5">${[0,1,2,3,4,5].map(i=>`<ellipse cx="960" cy="470" rx="${60+i*90}" ry="${40+i*60}" stroke-width="${3-i*.3}" stroke-opacity="${.9-i*.13}"/>`).join('')}</g>
    <g stroke="#ff5ec4" stroke-opacity=".5" stroke-width="2">${Array.from({length:14},(_,i)=>`<line x1="960" y1="470" x2="${960+Math.cos(i/14*6.28)*620}" y2="${470+Math.sin(i/14*6.28)*420}"/>`).join('')}</g>
    <g stroke="#38e1ff" stroke-opacity=".28" stroke-width="2">${Array.from({length:19},(_,i)=>`<line x1="960" y1="760" x2="${-1500+i*270}" y2="1080"/>`).join('')}${[790,830,880,950,1040].map(y=>`<line x1="0" y1="${y}" x2="1920" y2="${y}"/>`).join('')}</g>
    <g>${Array.from({length:26},(_,i)=>{const r=rng(i*13+2);const w=['token','##ing','P=0.31','embed','[512]','the','attn','logit','0.07','↦'][i%10];return `<g class="${i%2?'float':'float2'}" style="animation-delay:${-r()*6}s" transform="translate(${r()*1800+40} ${r()*620+90})"><rect width="${w.length*13+22}" height="34" rx="9" fill="${['#38e1ff','#ff5ec4','#9a7bff','#ffe08a'][i%4]}" fill-opacity=".22" stroke="${['#38e1ff','#ff5ec4','#9a7bff','#ffe08a'][i%4]}" stroke-width="2"/><text x="11" y="23" fill="#fff" font-size="19" font-family="monospace">${w}</text></g>`}).join('')}</g>
    <g fill="none" stroke-width="3">${[0,1,2,3].map(i=>`<path class="flow" d="M-20 ${200+i*150}C500 ${100+i*160} 900 ${420+i*60} 1940 ${300+i*140}" stroke="${['#38e1ff','#ff5ec4','#9a7bff','#ffe08a'][i]}" stroke-opacity=".5"/>`).join('')}</g>
  </svg>`,
  library:()=>`<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="lb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1230"/><stop offset="1" stop-color="#3a2416"/></linearGradient></defs>
    <rect width="1920" height="1080" fill="url(#lb)"/>
    ${[0,1,2,3,4,5].map(i=>`<g><path d="M${60+i*310} 880V260Q${60+i*310} 130 ${215+i*310} 130Q${370+i*310} 130 ${370+i*310} 260V880Z" fill="#2a1a10" stroke="#8a6a3a" stroke-width="5"/>${[0,1,2,3,4].map(r=>`<g>${Array.from({length:7},(_,k)=>`<rect x="${90+i*310+k*38}" y="${280+r*115}" width="28" height="${70+((i+k+r)*13)%34}" fill="${['#8a3b2e','#2e5a8a','#3a7a4a','#c9a24a','#6a3a8a'][(i+k+r)%5]}" transform="translate(0 ${100-70-((i+k+r)*13)%34+34})"/>`).join('')}<rect x="${80+i*310}" y="${375+r*115}" width="270" height="8" fill="#8a6a3a"/></g>`).join('')}</g>`).join('')}
    ${[[300,420],[820,300],[1300,460],[1650,330],[560,620],[1080,600]].map(([x,y],i)=>`<g class="${i%2?'float':'float2'}" style="animation-delay:${-i}s" transform="translate(${x} ${y}) rotate(${i*9-20})"><rect width="92" height="64" rx="5" fill="#fff6dd" stroke="#8a3b2e" stroke-width="5"/><path d="M46 0V64" stroke="#8a3b2e" stroke-width="4"/><rect x="8" y="12" width="30" height="5" fill="#8a3b2e"/><rect x="8" y="24" width="24" height="5" fill="#8a3b2e"/><rect x="8" y="36" width="28" height="5" fill="#8a3b2e"/></g>`).join('')}
    ${[[130,200],[1700,180],[980,160]].map(([x,y],i)=>`<g class="flick" style="animation-delay:${i*.6}s" transform="translate(${x} ${y})"><rect width="210" height="120" rx="12" fill="#38e1ff" fill-opacity=".12" stroke="#38e1ff" stroke-width="3"/><rect x="16" y="18" width="150" height="9" rx="4" fill="#38e1ff"/><rect x="16" y="40" width="110" height="9" rx="4" fill="#9fe"/><rect x="16" y="62" width="170" height="9" rx="4" fill="#9fe"/><text x="16" y="105" fill="#ffe08a" font-size="18" font-family="monospace">DOI: ?? [verify]</text></g>`).join('')}
    <rect y="880" width="1920" height="200" fill="#2a1a10"/><rect y="880" width="1920" height="10" fill="#c9a24a"/>
  </svg>`,
  obs:()=>`<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="ob" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1d3a"/><stop offset="1" stop-color="#1d3a64"/></linearGradient></defs>
    <rect width="1920" height="1080" fill="url(#ob)"/>${stars(40,80,420)}
    <path d="M360 380A600 380 0 0 1 1560 380" stroke="#6fa8ff" stroke-width="6" fill="none" opacity=".5"/>
    ${[[110,170],[1500,170],[800,130]].map(([x,y],i)=>`<g class="${i%2?'float':'float2'}" transform="translate(${x} ${y})"><rect width="310" height="200" rx="14" fill="#38e1ff" fill-opacity=".1" stroke="#38e1ff" stroke-width="3"/>${[0,1,2,3].map(k=>`<rect x="20" y="${26+k*40}" width="${60+((k*71+i*47)%190)}" height="16" rx="6" fill="${k===2?'#ffb84d':'#7fe7ff'}" opacity=".85"/>`).join('')}<circle cx="270" cy="30" r="10" fill="#ffb84d" class="flick"/></g>`).join('')}
    <rect y="880" width="1920" height="200" fill="#0d1a30"/><rect y="880" width="1920" height="8" fill="#6fa8ff"/>
    ${[260,640,1280,1660].map(x=>`<g><rect x="${x-90}" y="950" width="180" height="16" fill="#27406a"/><rect x="${x-70}" y="966" width="12" height="70" fill="#27406a"/><rect x="${x+58}" y="966" width="12" height="70" fill="#27406a"/></g>`).join('')}
  </svg>`,
  collab:()=>`<svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="cb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2a14"/><stop offset=".5" stop-color="#12304a"/><stop offset="1" stop-color="#0b3a5a"/></linearGradient><radialGradient id="cm"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <rect width="1920" height="1080" fill="url(#cb)"/>
    <g opacity=".85" transform="translate(220 250)"><circle cx="120" cy="90" r="64" fill="#ffb84d" opacity=".3"/><circle cx="120" cy="80" r="42" fill="none" stroke="#ffd27a" stroke-width="6"/><path d="M30 330Q30 190 120 190Q210 190 210 330Z" fill="none" stroke="#ffd27a" stroke-width="6"/><text x="120" y="390" text-anchor="middle" fill="#ffd27a" font-size="26" font-weight="700">JUDGMENT · CARE</text></g>
    <g opacity=".85" transform="translate(1450 250)"><rect x="50" y="30" width="140" height="120" rx="26" fill="none" stroke="#7fe7ff" stroke-width="6"/><circle cx="95" cy="90" r="9" fill="#7fe7ff"/><circle cx="145" cy="90" r="9" fill="#7fe7ff"/><rect x="40" y="180" width="160" height="150" rx="20" fill="none" stroke="#7fe7ff" stroke-width="6"/><text x="120" y="390" text-anchor="middle" fill="#7fe7ff" font-size="26" font-weight="700">SPEED · PATTERNS</text></g>
    <circle class="flick" cx="960" cy="400" r="180" fill="url(#cm)" opacity=".5"/>
    <g fill="none" stroke-width="4">${[0,1,2].map(i=>`<path class="flow" d="M450 ${340+i*70}Q960 ${200+i*150} 1470 ${340+i*70}" stroke="${['#ffb84d','#fff','#38e1ff'][i]}" stroke-opacity=".7"/>`).join('')}</g>
    <rect y="880" width="1920" height="200" fill="#0c2236"/><rect y="880" width="960" height="8" fill="#ffb84d"/><rect x="960" y="880" width="960" height="8" fill="#38e1ff"/>
  </svg>`
};
Envs.finale=Envs.museum;

const Env={
  cur:null,
  set(name){
    if(this.cur===name)return;this.cur=name;
    $('#env').innerHTML=Envs[name]?Envs[name]():'';
  }
};
