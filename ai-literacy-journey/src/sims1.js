'use strict';
/* =====================================================================
   SIMULATION ENGINE + CHAPTER 1-2 LABS
   Every sim registers in Sims{} with a kind:
     real   = runs the actual algorithm, at toy scale, on the data you see
     sim    = simplified mathematical simulation with illustrative numbers
     script = scripted conceptual demonstration (no model is running)
   NO sim here is a real large language model. Probabilities are labelled illustrative.
   ===================================================================== */
const KINDS0={
  real:{cls:'real',label:'REAL COMPUTATION (toy scale)',tip:'The actual algorithm runs on the data shown. It is tiny, so it demonstrates the idea, not the capability of production systems.'},
  sim:{cls:'sim',label:'SIMPLIFIED SIMULATION',tip:'Real arithmetic on illustrative numbers. The numbers are NOT outputs of a real language model.'},
  script:{cls:'script',label:'SCRIPTED DEMONSTRATION',tip:'A conceptual walk-through. No model is running; outcomes are scripted to illustrate the idea.'}
};
const KINDS=KINDS0;
if(EDITION.lite){KINDS.real.label='REAL, JUST SMALL';KINDS.sim.label='SIMPLIFIED MODEL';KINDS.script.label='GUIDED EXAMPLE';
  KINDS.real.tip='This really runs, but on a tiny scale so you can see how it works.';KINDS.sim.tip='Real arithmetic on made-up numbers. These are NOT outputs from a real chatbot.';KINDS.script.tip='A guided example. No AI is running; the results are written in advance to show the idea.';}
const Sims={};
const UI={
  slider(label,min,max,step,val,onInput,f=v=>v){
    const out=h('output'),inp=h('input',{type:'range',min,max,step,value:val,'aria-label':label});
    const upd=()=>{out.textContent=f(+inp.value);};
    inp.addEventListener('input',()=>{upd();onInput(+inp.value);});upd();
    return{el:h('div',{class:'ctl'},h('label',{},label),inp,out),input:inp,set(v){inp.value=v;upd();}};
  },
  btn:(label,fn,cls='')=>h('button',{class:'btn '+cls,type:'button',onclick:fn},label),
  note:(txt,cls='')=>h('div',{class:'callout '+cls,html:txt}),
  seg(opts,val,pick){
    const wrap=h('div',{class:'seg',role:'group'});
    const draw=v=>[...wrap.children].forEach(b=>b.classList.toggle('on',b.dataset.v===String(v)));
    opts.forEach(([v,l])=>wrap.appendChild(h('button',{type:'button','data-v':v,onclick:()=>{draw(v);pick(v);}},l)));
    draw(val);return wrap;
  }
};
function Bars(parent,labels,o={}){
  const f=o.fmt||(v=>pct(v,1));
  const rows=labels.map((lb,i)=>{
    const fl=h('div',{class:'fl'}),v=h('span',{class:'v'},f(0));
    const row=h('div',{class:'bar'+(o.pick?' pick':''),tabindex:o.pick?0:null,role:o.pick?'button':null,'aria-label':o.pick?('Choose '+lb):null,
      onclick:o.pick?()=>o.pick(i):null,onkeydown:o.pick?e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();o.pick(i);}}:null},
      h('span',{},lb),h('div',{class:'tr'},fl),v);
    parent.appendChild(row);return{row,fl,v,cur:0,tok:0};
  });
  return{rows,
    setLabels(ls){rows.forEach((r,i)=>{r.row.firstChild.textContent=ls[i]||'';});},
    set(vals,sel){rows.forEach((r,i)=>{const from=r.cur,to=vals[i]||0,tok=++r.tok;
      Anim.tween(380,p=>{if(r.tok!==tok)return;const v=lerp(from,to,p);r.cur=v;r.fl.style.width=clamp(v/(o.max||1),0,1)*100+'%';r.v.textContent=f(v);});
      r.row.classList.toggle('sel',sel===i);});}
  };
}
const softmax=(z,T=1)=>{if(T<=0){const m=Math.max(...z);const k=z.indexOf(m);return z.map((_,i)=>i===k?1:0);}const m=Math.max(...z);const e=z.map(v=>Math.exp((v-m)/T));const s=e.reduce((a,b)=>a+b,0);return e.map(v=>v/s);};
const sampleIdx=(p,r=Math.random)=>{let u=r(),a=0;for(let i=0;i<p.length;i++){a+=p[i];if(u<=a)return i;}return p.length-1;};

/* ---------------- Ch1 · Exhibit A: Rule-based machine (real) ---------------- */
Sims.rules={kind:'real',title:'Exhibit A · The Rule-Based Machine',
mount(el){
  const F={att:['Attendance %',0,100],miss:['Missing assignments',0,12],quiz:['Quiz average %',0,100]};
  const OUTS=['Needs outreach','Monitor','On track'];
  let rules=[{f:'att',op:'<',v:80,out:'Needs outreach'},{f:'miss',op:'>',v:4,out:'Needs outreach'},{f:'quiz',op:'<',v:60,out:'Monitor'}];
  const st={att:92,miss:2,quiz:78};
  const SAMPLE=[['Student A',95,0,88],['Student B',79.5,1,90],['Student C',92,5,74],['Student D',90,2,59],['Student E',60,9,45],['Student F',80,4,60],['Student G',99,0,61],['Student H',89,3,70]];
  const test=(r,s)=>r.op==='<'?s[r.f]<r.v:s[r.f]>r.v;
  const run=s=>{const hits=rules.map((r,i)=>test(r,s)?i:-1).filter(i=>i>=0);return{hits,out:hits.length?rules[hits[0]].out:'On track',fallback:!hits.length};};
  const res=h('div',{class:'card'}),ruleBox=h('div'),tbl=h('div'),insight=h('div');
  const gear=h('div',{class:'row'},);
  function draw(){
    const r=run(st);
    res.innerHTML=`<div class="row"><svg width="64" height="64" viewBox="-32 -32 64 64"><g class="spin"><circle r="22" fill="none" stroke="#ffe08a" stroke-width="10" stroke-dasharray="9 6"/><circle r="8" fill="#ffe08a"/></g></svg><div><div class="sub">Machine output for the student you configured</div><div class="big" style="font-size:34px">${esc(r.out)}</div><div class="sub">${r.fallback?'No rule matched: the machine fell through to its default.':'Rule '+(r.hits[0]+1)+' fired first'+(r.hits.length>1?' (also matched: '+r.hits.slice(1).map(i=>i+1).join(', ')+', ignored because first match wins)':'')+'.'}</div></div></div>`;
    ruleBox.innerHTML='';
    rules.forEach((ru,i)=>{
      const fs=h('select',{'aria-label':'Rule '+(i+1)+' field',onchange:e=>{ru.f=e.target.value;draw();}},Object.entries(F).map(([k,v])=>h('option',{value:k,selected:k===ru.f},v[0])));
      const op=h('select',{'aria-label':'operator',onchange:e=>{ru.op=e.target.value;draw();}},['<','>'].map(o=>h('option',{value:o,selected:o===ru.op},o)));
      const num=h('input',{type:'number',value:ru.v,style:{width:'80px'},'aria-label':'threshold',oninput:e=>{ru.v=+e.target.value;draw();}});
      const out=h('select',{'aria-label':'then',onchange:e=>{ru.out=e.target.value;draw();}},OUTS.map(o=>h('option',{value:o,selected:o===ru.out},o)));
      ruleBox.appendChild(h('div',{class:'row',style:{margin:'6px 0',padding:'4px 6px',borderRadius:'8px',background:r.hits.includes(i)?'#38d99633':'transparent'}},h('b',{},(i+1)+'. IF'),fs,op,num,h('b',{},'THEN'),out,
        UI.btn('↑',()=>{if(i>0){[rules[i-1],rules[i]]=[rules[i],rules[i-1]];draw();}},'sm'),UI.btn('✕',()=>{rules.splice(i,1);draw();},'sm')));
    });
    // sample table
    let conflicts=0,gaps=0;
    const rowsH=SAMPLE.map(([n,a,m,q])=>{const s={att:a,miss:m,quiz:q},x=run(s);if(x.hits.length>1)conflicts++;if(x.fallback)gaps++;
      return `<tr class="${x.fallback?'bad':x.hits.length>1?'hit':''}"><td>${n}</td><td>${a}</td><td>${m}</td><td>${q}</td><td><b>${x.out}</b></td><td>${x.fallback?'default (no rule)':'rule '+(x.hits[0]+1)+(x.hits.length>1?' +'+(x.hits.length-1)+' more':'')}</td></tr>`;}).join('');
    tbl.innerHTML=`<table><tr><th>Sample</th><th>Attend%</th><th>Missing</th><th>Quiz%</th><th>Output</th><th>Because</th></tr>${rowsH}</table>`;
    insight.innerHTML=`Rules are explicit and fully inspectable, but they only cover what their author imagined. <b>${gaps}</b> sample student(s) fell through to the default and <b>${conflicts}</b> matched more than one rule. Try changing 80 to 79.5: a student at 79.5% is treated completely differently from one at 80%.`;
  }
  const sliders=Object.entries(F).map(([k,[l,mn,mx]])=>UI.slider(l,mn,mx,1,st[k],v=>{st[k]=v;draw();}));
  el.append(h('div',{class:'grid2'},h('div',{class:'col'},h('h3',{},'1 · Describe a student'),...sliders.map(s=>s.el),res),
    h('div',{class:'col'},h('h3',{},'2 · Write the rules (first match wins)'),ruleBox,h('div',{class:'row'},UI.btn('+ Add rule',()=>{rules.push({f:'att',op:'<',v:70,out:'Monitor'});draw();},'pri sm')))),
    h('h3',{},'3 · Test on a class'),tbl,UI.note('',''));
  el.lastChild.replaceWith(insight);insight.className='callout';draw();
}};

/* ---------------- Ch1 · Exhibit B: Machine-learning lab (real kNN) ---------------- */
Sims.knn={kind:'real',title:'Exhibit B · The Machine-Learning Laboratory',
mount(el){
  const CW=700,CH=430,cls=[['On track','#38d996'],['Needs support','#ff9a6b']];
  let data=[],k=3,tool=0,test={x:55,y:55},showReg=true;
  function preset(name){
    const r=rng(name==='noisy'?7:name==='biased'?11:3);const g=(cx,cy,sd,c,n)=>{for(let i=0;i<n;i++){let a=0,b=0;for(let j=0;j<6;j++){a+=r();b+=r();}data.push({x:clamp(cx+(a-3)*sd*1.6,2,98),y:clamp(cy+(b-3)*sd*1.6,2,98),c});}};
    data=[];
    if(name==='biased'){g(72,72,9,0,22);g(25,28,6,1,3);}
    else{g(72,70,9,0,14);g(28,30,9,1,14);}
    if(name==='noisy'){g(30,30,6,0,4);g(70,70,6,1,4);}
  }
  preset('clean');
  const cv=h('canvas',{class:'sim',width:CW,height:CH,'aria-label':'Scatter plot of training examples. Click to add examples.'}),ctx=cv.getContext('2d');
  const out=h('div',{class:'card'}),loo=h('span');
  const X=x=>x/100*CW,Y=y=>CH-y/100*CH;
  function knn(p,self){
    const d=data.map((q,i)=>({i,q,d:Math.hypot(q.x-p.x,q.y-p.y)})).filter(o=>o.i!==self).sort((a,b)=>a.d-b.d).slice(0,k);
    const votes=[0,0];d.forEach(o=>votes[o.q.c]++);return{d,votes,pred:votes[1]>votes[0]?1:0,conf:Math.max(...votes)/Math.max(1,d.length)};
  }
  function draw(){
    ctx.clearRect(0,0,CW,CH);
    if(showReg&&data.length){const gx=44,gy=28;for(let i=0;i<gx;i++)for(let j=0;j<gy;j++){const p={x:(i+.5)/gx*100,y:(j+.5)/gy*100};ctx.fillStyle=knn(p,-1).pred?'#ff9a6b2e':'#38d9962e';ctx.fillRect(i/gx*CW,CH-(j+1)/gy*CH,CW/gx+1,CH/gy+1);}}
    ctx.strokeStyle='#ffffff22';ctx.strokeRect(0,0,CW,CH);ctx.fillStyle='#b9c8ea';ctx.font='14px sans-serif';ctx.fillText('Weekly practice minutes →',CW-190,CH-8);ctx.save();ctx.translate(14,150);ctx.rotate(-Math.PI/2);ctx.fillText('Quiz average →',0,0);ctx.restore();
    const r=knn(test,-1);
    if(data.length){ctx.strokeStyle='#ffe08a';ctx.lineWidth=2;r.d.forEach(o=>{ctx.beginPath();ctx.moveTo(X(test.x),Y(test.y));ctx.lineTo(X(o.q.x),Y(o.q.y));ctx.stroke();});}
    data.forEach(p=>{ctx.beginPath();ctx.arc(X(p.x),Y(p.y),7,0,6.3);ctx.fillStyle=cls[p.c][1];ctx.fill();ctx.strokeStyle='#0008';ctx.lineWidth=1.5;ctx.stroke();});
    ctx.save();ctx.translate(X(test.x),Y(test.y));ctx.rotate(Math.PI/4);ctx.fillStyle='#fff';ctx.fillRect(-9,-9,18,18);ctx.strokeStyle=data.length?cls[r.pred][1]:'#999';ctx.lineWidth=4;ctx.strokeRect(-9,-9,18,18);ctx.restore();
    let ok=0;data.forEach((p,i)=>{if(data.length>1&&knn(p,i).pred===p.c)ok++;});
    out.innerHTML=data.length?`<div class="sub">Prediction for the white diamond (a new student)</div><div class="big" style="font-size:32px;color:${cls[r.pred][1]}">${cls[r.pred][0]}</div>
      <div>Neighbors voting: <b>${r.votes[0]}</b> on track · <b>${r.votes[1]}</b> needs support → vote share ${pct(r.conf)}</div>
      <div class="sub">Training examples: ${data.length} (${data.filter(p=>!p.c).length} / ${data.filter(p=>p.c).length}). ${EDITION.lite?'':'Leave-one-out accuracy on this data: <b>'+(data.length>1?pct(ok/data.length):'n/a')+'</b>'}</div>`:'Add some training examples.';
  }
  function pos(e){const b=cv.getBoundingClientRect();return{x:clamp((e.clientX-b.left)/b.width*100,0,100),y:clamp(100-(e.clientY-b.top)/b.height*100,0,100)};}
  cv.addEventListener('pointerdown',e=>{
    const p=pos(e);
    if(tool===2){let bi=-1,bd=1e9;data.forEach((q,i)=>{const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;bi=i;}});if(bi>=0&&bd<6)data.splice(bi,1);}
    else if(tool===3)test=p;else data.push({x:p.x,y:p.y,c:tool});
    draw();
  });
  const seg=UI.seg([[0,'+ On track'],[1,'+ Needs support'],[2,'Erase'],[3,'Move test point']],0,v=>{tool=+v;});
  const ks=UI.slider('k (neighbors that vote)',1,9,2,k,v=>{k=v;draw();});
  if(EDITION.lite)ks.el.style.display='none';
  const reg=h('input',{type:'checkbox',checked:true,id:'regchk',onchange:e=>{showReg=e.target.checked;draw();}});
  el.append(h('div',{class:'row'},seg,UI.btn('Clean data',()=>{preset('clean');draw();},'sm'),UI.btn('Mislabeled examples',()=>{preset('noisy');draw();},'sm'),UI.btn('Unrepresentative sample',()=>{preset('biased');draw();},'sm'),UI.btn('Clear',()=>{data=[];draw();},'sm')),
    h('div',{class:'row'},h('div',{style:{flex:'0 0 auto'}},cv),h('div',{class:'grow col'},ks.el,h('label',{class:'row'},reg,(EDITION.lite?'Show the colored areas the computer learned':'Show learned decision regions')),out,UI.note('Nothing here was programmed with a rule like "below 60 means support." The boundary emerges from the examples you place. Change the examples and the same algorithm behaves differently.','good'))));
  draw();
}};

/* ---------------- Ch1 · Exhibit C: Neural network (real forward pass; hand-set weights) ---------------- */
Sims.nn={kind:'real',title:'Exhibit C · The Neural Network Simulator',
mount(el){
  const L=[3,4,3,1],names=['Attendance','Work completion','Quiz average'];
  const DW=[
    [[-2.4,0,0],[0,-2.4,0],[0,0,-2.4],[-1.2,-1.2,-1.2]],
    [[1.2,.5,.2,.8],[.3,1.2,.6,.5],[.2,.4,1.3,.9]],
    [[1.6,1.4,1.5]]
  ],DB=[[1.4,1.4,1.4,1.8],[-.3,-.2,-.4],[-.2]];
  const W=DW.map(m=>m.map(r=>[...r])),B=DB.map(r=>[...r]);
  const inp=[.9,.8,.85];let sel=null;
  const act=(l,x)=>l===3?1/(1+Math.exp(-x)):Math.tanh(x);
  function forward(){const A=[inp.slice()],Z=[[]];for(let l=1;l<L.length;l++){const a=[],z=[];for(let j=0;j<L[l];j++){let s=B[l-1][j];for(let i=0;i<L[l-1];i++)s+=W[l-1][j][i]*A[l-1][i];z.push(s);a.push(act(l,s));}A.push(a);Z.push(z);}return{A,Z};}
  const VW=760,VH=470,xs=[110,330,550,700];
  const pos=(l,j)=>({x:xs[l],y:VH/2+(j-(L[l]-1)/2)*(l===0?120:l===3?0:96)});
  const svg=h('svg',{viewBox:`0 0 ${VW} ${VH}`,width:VW,height:VH,role:'img','aria-label':'Neural network diagram: 3 inputs, two hidden layers, one output'});
  const detail=h('div',{class:'card'}),outEl=h('div');
  let edges=[],nodes=[];
  function build(){
    svg.innerHTML='';edges=[];nodes=[];
    for(let l=1;l<L.length;l++)for(let j=0;j<L[l];j++)for(let i=0;i<L[l-1];i++){const a=pos(l-1,i),b=pos(l,j);const p=h('path',{d:`M${a.x} ${a.y}L${b.x} ${b.y}`,fill:'none','stroke-linecap':'round'});svg.appendChild(p);edges.push({p,l,j,i});}
    for(let l=0;l<L.length;l++)for(let j=0;j<L[l];j++){const p=pos(l,j);const c=h('circle',{cx:p.x,cy:p.y,r:l===3?30:24,stroke:'#fff','stroke-width':3,class:'node',tabindex:0,role:'button','aria-label':`${l===0?names[j]:l===3?'Output':'Hidden layer '+l+' node '+(j+1)}. Activate for details.`,onclick:()=>{sel={l,j};render();},onkeydown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sel={l,j};render();}}});
      const t=h('text',{x:p.x,y:p.y+5,'text-anchor':'middle',fill:'#fff','font-size':14,'font-weight':700,'pointer-events':'none'});svg.append(c,t);nodes.push({c,t,l,j});}
    [['Inputs (0 to 1)',xs[0]],['Hidden layer 1',xs[1]],['Hidden layer 2',xs[2]],['Output',xs[3]]].forEach(([s,x])=>svg.appendChild(h('text',{x,y:22,'text-anchor':'middle',fill:'#ffe08a','font-size':16,'font-weight':700},s)));
    names.forEach((n,j)=>svg.appendChild(h('text',{x:xs[0],y:pos(0,j).y-34,'text-anchor':'middle',fill:'#b9c8ea','font-size':14},n)));
    svg.appendChild(h('text',{x:xs[3]+40,y:pos(3,0).y+56,'text-anchor':'end',fill:'#ffe08a','font-size':15},'support-need score'));
  }
  function render(){
    const{A,Z}=forward();
    edges.forEach(e=>{const w=W[e.l-1][e.j][e.i],a=A[e.l-1][e.i],strength=Math.abs(w*a);const isSel=sel&&sel.l===e.l&&sel.j===e.j;
      e.p.setAttribute('stroke',w>=0?'#4aa3ff':'#ff9a4a');e.p.setAttribute('stroke-width',(.6+Math.abs(w)*1.8).toFixed(2));e.p.setAttribute('stroke-opacity',isSel?1:clamp(.12+strength*.55,.1,.8));
      e.p.setAttribute('class',strength>.25?'flow':'');e.p.setAttribute('stroke-dasharray',strength>.25?'':'none');});
    nodes.forEach(n=>{const a=A[n.l][n.j];const v=n.l===0||n.l===3?a:(a+1)/2;n.c.setAttribute('fill',`hsl(${n.l===3?30:210} 85% ${18+v*45}%)`);n.c.setAttribute('stroke',sel&&sel.l===n.l&&sel.j===n.j?'#ffe08a':'#fff');n.c.setAttribute('stroke-width',sel&&sel.l===n.l&&sel.j===n.j?6:2.5);n.t.textContent=a.toFixed(2);});
    const o=A[3][0];
    outEl.innerHTML=`<div class="sub">Network output (0 to 1)</div><div class="big" style="font-size:36px;color:${o>.5?'#ff9a6b':'#38d996'}">${o.toFixed(2)} · ${o>.66?'strong signal: check in with this student':o>.4?'uncertain':'low concern'}</div>`;
    detailRender(A,Z);
  }
  function detailRender(A,Z){
    detail.innerHTML='';
    if(!sel){detail.innerHTML='<b>Click any node</b> to see exactly how its value was computed, and edit its incoming weights.';return;}
    const{l,j}=sel;if(l===0){detail.innerHTML=`<b>Input node: ${names[j]}</b><br>Value ${inp[j].toFixed(2)} (the slider, scaled 0 to 1). Inputs are not computed; they are the data fed in.`;return;}
    const terms=W[l-1][j].map((w,i)=>`${w.toFixed(2)} × ${A[l-1][i].toFixed(2)}`).join(' + ');
    detail.append(h('div',{html:`<b>${l===3?'Output':'Hidden '+l+'.'+(j+1)}</b>: weighted sum = ${terms} + bias ${B[l-1][j].toFixed(2)} = <b>${Z[l][j].toFixed(2)}</b><br>${l===3?'sigmoid':'tanh'}(${Z[l][j].toFixed(2)}) = <b>${A[l][j].toFixed(2)}</b>`}));
    W[l-1][j].forEach((w,i)=>detail.append(UI.slider(`weight from node ${i+1}`,-3,3,.1,w,v=>{W[l-1][j][i]=v;render();},v=>v.toFixed(1)).el));
    detail.append(h('div',{class:'sub',style:{marginTop:'6px'}},'Blue = positive weight, orange = negative. Training would adjust these numbers automatically; here they are hand-set and you can edit them.'));
  }
  build();
  const sl=names.map((n,i)=>UI.slider(n+' (%)',0,100,1,Math.round(inp[i]*100),v=>{inp[i]=v/100;render();}));
  el.append(h('div',{class:'row',style:{alignItems:'flex-start'}},h('div',{style:{flex:'0 0 auto'}},svg),h('div',{class:'grow col'},...sl.map(s=>s.el),outEl,detail,UI.btn('Reset weights',()=>{for(let l=0;l<W.length;l++)for(let j=0;j<W[l].length;j++)W[l][j]=[...DW[l][j]];sel=null;render();},'sm'))));
  render();
  return{replay(){sel=null;sl.forEach((s,i)=>{s.set(100);inp[i]=1;});render();let t=0;Anim.tween(2200,p=>{sl.forEach((s,i)=>{const v=Math.round(100*(1-p));s.set(v);inp[i]=v/100;});render();});}};
}};

/* ---------------- Ch1 · Exhibit D: Generative vs classification (real tiny bigram model) ---------------- */
Sims.gen={kind:'real',title:'Exhibit D · The Generative AI Demonstrator',
mount(el){
  const CORPUS=['Great job on your essay and keep practicing every day .','Your essay shows strong ideas and clear thinking .','Keep practicing your writing and check each step carefully .','Great work on your project and your effort shows every day .','Your project shows clear thinking and careful work .','Please review the steps and keep working carefully .','Strong effort on your quiz and keep reviewing each day .','Your ideas are strong and your writing is clear .','Check your work and keep practicing every day .','Great thinking on your quiz and keep up the effort .','Your effort on this essay shows strong thinking .'];
  const bi={};CORPUS.forEach(s=>{const w=['<s>',...s.split(' ')];for(let i=0;i<w.length-1;i++){(bi[w[i]]=bi[w[i]]||{})[w[i+1]]=((bi[w[i]]||{})[w[i+1]]||0)+1;}});
  const dist=w=>{const o=bi[w]||{'.':1};const t=Object.values(o).reduce((a,b)=>a+b,0);return Object.entries(o).map(([k,v])=>[k,v/t]).sort((a,b)=>b[1]-a[1]);};
  // classifier: fixed label set
  const POS='great strong clear good excellent careful improved effort thinking ideas'.split(' '),NEG='missing late wrong confused careless incomplete poor weak failed'.split(' ');
  const inp=h('input',{type:'text',value:'Great ideas but several answers were incomplete',style:{width:'100%'},'aria-label':'Feedback sentence to classify'});
  const clsOut=h('div',{class:'card'});
  function classify(){const w=inp.value.toLowerCase().split(/\W+/).filter(Boolean);const p=w.filter(x=>POS.includes(x)).length,n=w.filter(x=>NEG.includes(x)).length;const lab=p>n?'Positive':n>p?'Negative':'Mixed / neutral';
    clsOut.innerHTML=`<div class="sub">Output: exactly ONE label from a fixed menu</div><div class="big" style="font-size:30px">${lab}</div><div class="sub">word counts: ${p} positive, ${n} negative</div>`;}
  inp.addEventListener('input',classify);classify();
  // generator
  const gen=h('div',{class:'card mono',style:{minHeight:'64px',fontSize:'1.15em'}}),cands=h('div'),status=h('div',{class:'sub'});
  let busy=0;
  async function generate(first){
    const id=++busy;gen.textContent='';let w=first||'<s>',guard=0,words=[];
    if(first){words.push(first);gen.textContent=first;}
    while(guard++<16){
      const d=dist(w);
      cands.innerHTML='<div class="sub">Candidates for the next token, computed from counts in the 11-sentence corpus:</div>'+d.slice(0,5).map(([t,p])=>`<span class="chip" style="background:#9a7bff">${esc(t)} ${pct(p)}</span>`).join('');
      const nx=d[sampleIdx(d.map(x=>x[1]))][0];
      await Anim.tween(S.prefs.reduced?0:420,()=>{});if(id!==busy)return;
      if(nx==='.'){words.push('.');gen.textContent=words.join(' ').replace(' .','.');break;}
      words.push(nx);gen.textContent=words.join(' ');w=nx;
    }
    status.textContent='Generated a sequence that may not appear in the corpus. Press again for a different one.';
  }
  const starts=['(any)','Great','Your','Keep','Strong'];
  const sg=UI.seg(starts.map(s=>[s,s]),'(any)',v=>{});
  el.append(h('div',{class:'grid2'},
    h('div',{class:'col'},h('h3',{},'Classification: choose from a menu'),h('div',{class:'sub'},'Type a teacher comment:'),inp,clsOut,UI.note('Predictive / classification AI maps an input to one of a fixed set of answers.')),
    h('div',{class:'col'},h('h3',{},'Generation: build new text'),h('div',{class:'row'},sg,UI.btn('Generate ▶',()=>{const v=$('.on',sg);const f=v&&v.dataset.v!=='(any)'?v.dataset.v:null;generate(f);},'pri')),gen,cands,status,UI.note('This is a tiny bigram model (each next word depends only on the previous word). Large language models use neural networks, billions of learned parameters and long contexts, but the core move is the same: sample the next token from a distribution.','warn'))));
  return{replay(){$('.btn.pri',el).click();}};
}};

/* ---------------- Ch1 (optional) · Decision tree (real) ---------------- */
Sims.tree={kind:'real',title:'Optional · Build a Decision Tree',
mount(el){
  const ST=[['A',95,0,88,'On track'],['B',78,1,90,'Monitor'],['C',92,5,74,'Needs outreach'],['D',90,2,55,'Monitor'],['E',60,9,45,'Needs outreach'],['F',82,4,60,'Needs outreach'],['G',99,0,61,'Monitor'],['H',86,3,70,'On track'],['I',70,6,80,'Needs outreach'],['J',97,1,92,'On track']];
  const T={att:85,quiz:70,miss:3};let selS=0;
  const classify=s=>s[1]>=T.att?(s[3]>=T.quiz?['On track',[0,1,3]]:['Monitor',[0,1,4]]):(s[2]>=T.miss?['Needs outreach',[0,2,5]]:['Monitor',[0,2,6]]);
  const svg=h('svg',{viewBox:'0 0 640 340',width:640,height:340}),acc=h('div',{class:'card'}),tbl=h('div');
  function draw(){
    const [pred,path]=classify(ST[selS]);
    const N=[[320,40,`Attendance ≥ ${T.att}%?`],[170,140,`Quiz avg ≥ ${T.quiz}%?`],[470,140,`Missing ≥ ${T.miss}?`],[90,270,'On track'],[250,270,'Monitor'],[390,270,'Needs outreach'],[550,270,'Monitor']];
    const E=[[0,1,'yes'],[0,2,'no'],[1,3,'yes'],[1,4,'no'],[2,5,'yes'],[2,6,'no']];
    svg.innerHTML='';
    E.forEach(([a,b,l])=>{const on=path.includes(a)&&path.includes(b);svg.append(h('line',{x1:N[a][0],y1:N[a][1],x2:N[b][0],y2:N[b][1],stroke:on?'#ffe08a':'#6a7fb0','stroke-width':on?6:2}),h('text',{x:(N[a][0]+N[b][0])/2+(l==='yes'?-18:18),y:(N[a][1]+N[b][1])/2,fill:'#b9c8ea','font-size':14,'text-anchor':'middle'},l));});
    N.forEach(([x,y,t],i)=>{const leaf=i>2,on=path.includes(i);svg.append(h('rect',{x:x-70,y:y-20,width:140,height:40,rx:leaf?20:8,fill:on?'#00693C':'#16284f',stroke:on?'#ffe08a':'#6a7fb0','stroke-width':on?4:2}),h('text',{x,y:y+5,fill:'#fff','font-size':15,'text-anchor':'middle'},t));});
    let ok=0;const rowsH=ST.map((s,i)=>{const p=classify(s)[0],good=p===s[4];if(good)ok++;return `<tr class="${i===selS?'hit':''}" data-i="${i}" style="cursor:pointer"><td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td>${s[3]}</td><td>${s[4]}</td><td>${p}</td><td>${good?'✔':'✘'}</td></tr>`;}).join('');
    tbl.innerHTML=`<table><tr><th>Stu.</th><th>Att%</th><th>Miss</th><th>Quiz</th><th>Counselor said</th><th>Tree says</th><th></th></tr>${rowsH}</table>`;
    $$('tr[data-i]',tbl).forEach(r=>r.addEventListener('click',()=>{selS=+r.dataset.i;draw();}));
    acc.innerHTML=`Tree agrees with the counselor on <b>${ok} of ${ST.length}</b> students. Selected student ${ST[selS][0]} → <b>${pred}</b> (path highlighted).`;
  }
  const s1=UI.slider('Attendance cut-off',50,100,1,T.att,v=>{T.att=v;draw();},v=>v+'%'),s2=UI.slider('Quiz cut-off',40,100,1,T.quiz,v=>{T.quiz=v;draw();},v=>v+'%'),s3=UI.slider('Missing-work cut-off',1,10,1,T.miss,v=>{T.miss=v;draw();});
  el.append(h('div',{class:'row',style:{alignItems:'flex-start'}},h('div',{style:{flex:'0 0 auto'}},svg),h('div',{class:'grow col'},s1.el,s2.el,s3.el,acc,UI.note('Decision trees are a classic machine-learning model. Here you choose the cut-offs by hand; learning algorithms choose them automatically to fit examples. Click a row to trace a student through the tree.'))),tbl);
  draw();
}};

/* ---------------- Ch2 · Lab A: Tokenizer (approximate) ---------------- */
Sims.tokenizer={kind:'sim',title:'Laboratory A · The Tokenizer',
mount(el){
  const WORDS=('the a an of to and in is it that for on with as are was be this by from or at not but have has had you your we they he she his her their our can will would should could do does did so if then than about into over after before each every more most some any all one two three four five new old good great high low first last other many much very also just only up out no yes how what when where why who which while teacher teachers student students class classes classroom lesson lessons learn learning learner school grade grades test tests quiz exam essay reading writing math science history book books read write think thinking question questions answer answers feedback help use used using make made work works working time year day days people language model models data information system systems write chat photosynthesis plants plant food make energy sun light water these those there here also because always never really important education educator educators computer computers artificial intelligence expect surprise understand explain example examples practice effort project homework paper papers teach taught tutor').split(/\s+/);
  const PIECES='un re in im dis pre mis non over under out sub inter ing ed er est ly tion sion ment ness able ible ful less al ous ive ize ise ity ies es s en y ch th sh ph st tr gr pl bl cl ca ma pa ta la na ra sa ba da fa ga ha ja ka wa ex ec ect ected pect'.split(' ');
  const V=new Set([...WORDS,...PIECES].map(x=>x.toLowerCase()));
  const hash=s=>{let x=2166136261;for(const c of s){x^=c.codePointAt(0);x=Math.imul(x,16777619);}return(x>>>0)%50000;};
  function piecesOf(word){const lw=word.toLowerCase(),out=[];let i=0;while(i<word.length){let j=word.length,found=0;while(j>i){if(V.has(lw.slice(i,j))&&(j-i>1||/[aiy]/.test(lw[i]))){found=j;break;}j--;}if(!found)found=i+1;out.push(word.slice(i,found));i=found;}return out;}
  function tokenize(t){const toks=[];const re=/(\s*)([A-Za-z]+|\d{1,3}|[^\sA-Za-z\d])/gu;let m;while((m=re.exec(t))){const sp=m[1]?' ':'';const w=m[2];if(/^[A-Za-z]+$/.test(w)){piecesOf(w).forEach((p,k)=>toks.push({s:(k===0?sp:'')+p}));}else toks.push({s:sp+w});}toks.forEach(x=>{x.id=hash(x.s);});return toks;}
  const ta=h('textarea',{rows:3,'aria-label':'Text to tokenize'},'Teachers use ChatGPT unexpectedly!'),view=h('div',{class:'card tokflow',style:{lineHeight:'2.1',minHeight:'110px'}}),stats=h('div',{class:'row'});
  let showIds=false;
  function draw(){
    const text=ta.value,toks=tokenize(text);view.innerHTML='';
    toks.forEach((t,i)=>view.appendChild(h('span',{class:'chip',style:{background:`hsl(${(i*47)%360} 80% 72%)`},title:'ID '+t.id},showIds?t.id:t.s.replace(/ /g,'·'))));
    const words=(text.match(/\S+/g)||[]).length;
    stats.innerHTML=`<span class="pill">${text.length} characters</span><span class="pill">${words} words</span><span class="pill"><b>${toks.length} tokens</b></span><span class="pill">${toks.length?(text.length/toks.length).toFixed(1):0} chars/token</span>`;
  }
  ta.addEventListener('input',draw);
  const ex=[['Teachers use ChatGPT unexpectedly!','Rare word'],['Photosynthesis is how plants make food.','Science sentence'],['Antidisestablishmentarianism','Very long word'],['Born 2008-09-15; pi is 3.14159','Numbers'],['La enseñanza es importante','Non-English'],['Strawberry','Counting letters?']];
  el.append(h('div',{class:'row'},ex.map(([t,l])=>UI.btn(l,()=>{ta.value=t;draw();},'sm'))),ta,h('div',{class:'row'},UI.seg([['t','Show tokens'],['i','Show token IDs']],'t',v=>{showIds=v==='i';draw();}),stats),view,
    UI.note(EDITION.lite?'<b>Approximate demo:</b> real chatbots also split text into pieces, but from a much bigger list learned from data. The numbers shown here are made up.':'<b>Approximate demo:</b> this uses a small built-in vocabulary and a greedy longest-match rule inspired by subword tokenizers. Real tokenizers (for example byte-pair encoding) learn tens of thousands of pieces from data. The numeric IDs shown here are illustrative hashes, not any real model\'s IDs.','warn'),
    UI.note('Notice: the model never sees "letters" or "words" directly, only token IDs. That is one reason letter-counting and spelling can trip models up, and why text in languages poorly covered by a tokenizer\'s training data tends to need more tokens.','good'));
  draw();
}};

/* ---------------- Ch2 · Embedding map (sim; optional) ---------------- */
Sims.embed={kind:'sim',title:'Optional · The Embedding Map',
mount(el){
  const P={man:[2,2],woman:[2,4],king:[6,2],queen:[6,4],boy:[1,0.5],girl:[1,2.4],teacher:[-4,3],student:[-1.5,4],classroom:[-2.8,1.8],lesson:[-4.6,4.6],exam:[-1.2,5.8],homework:[-3.4,5.6],france:[-6,-4],paris:[-3.5,-4],italy:[-6,-6],rome:[-3.5,-6],dog:[6,-4],cat:[7.6,-3],puppy:[6.4,-5.6],banana:[2,-7]};
  const names=Object.keys(P);let a=null,b=null;
  const VW=720,VH=470,sx=x=>VW/2+x*38,sy=y=>VH/2-y*34;
  const svg=h('svg',{viewBox:`0 0 ${VW} ${VH}`,width:VW,height:VH,role:'img','aria-label':'2D map of word positions'}),info=h('div',{class:'card'});
  const dist=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]),cos=(p,q)=>(p[0]*q[0]+p[1]*q[1])/(Math.hypot(...p)*Math.hypot(...q));
  let arrow=null;
  function draw(){
    svg.innerHTML='<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8z" fill="#ffe08a"/></marker></defs>';
    if(arrow)arrow.forEach(([p,q])=>svg.append(h('line',{x1:sx(p[0]),y1:sy(p[1]),x2:sx(q[0]),y2:sy(q[1]),stroke:'#ffe08a','stroke-width':3,'marker-end':'url(#ah)'})));
    names.forEach(n=>{const p=P[n],on=n===a||n===b;svg.append(h('g',{class:'node',tabindex:0,role:'button','aria-label':n,onclick:()=>pick(n),onkeydown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(n);}}},h('circle',{cx:sx(p[0]),cy:sy(p[1]),r:on?11:8,fill:on?'#ffe08a':'#7fe7ff',stroke:'#fff','stroke-width':2}),h('text',{x:sx(p[0])+12,y:sy(p[1])+5,fill:'#fff','font-size':17},n)));});
    if(a&&b&&!arrow)svg.append(h('line',{x1:sx(P[a][0]),y1:sy(P[a][1]),x2:sx(P[b][0]),y2:sy(P[b][1]),stroke:'#ffe08a','stroke-width':2,'stroke-dasharray':'6 5'}));
  }
  function pick(n){arrow=null;if(!a||(a&&b))[a,b]=[n,null];else b=n;draw();upd();}
  function upd(){info.innerHTML=a&&b?`<b>${a}</b> ↔ <b>${b}</b><br>Distance: <b>${dist(P[a],P[b]).toFixed(2)}</b> · Cosine similarity: <b>${cos(P[a],P[b]).toFixed(2)}</b><div class="sub">Closer in the map = more similar in how the word is used (in this toy).</div>`:a?`Selected <b>${a}</b>. Click a second word.`:'Click two words to compare them.';}
  function analogy(A,B,C){const t=[P[A][0]-P[B][0]+P[C][0],P[A][1]-P[B][1]+P[C][1]];let best=null,bd=1e9;names.forEach(n=>{if([A,B,C].includes(n))return;const d=dist(P[n],t);if(d<bd){bd=d;best=n;}});
    arrow=[[P[B],P[A]],[P[C],t]];a=b=null;draw();info.innerHTML=`<b>${A} − ${B} + ${C}</b> lands at (${t.map(v=>v.toFixed(1)).join(', ')}). Nearest word: <b>${best}</b>.<div class="sub">The same offset (the arrow) separates the pairs. Real embeddings show approximate regularities like this in some cases, but not reliably.</div>`;}
  el.append(h('div',{class:'row',style:{alignItems:'flex-start'}},h('div',{style:{flex:'0 0 auto'}},svg),h('div',{class:'grow col'},info,h('div',{class:'row'},UI.btn('king − man + woman',()=>analogy('king','man','woman'),'sm'),UI.btn('paris − france + italy',()=>analogy('paris','france','italy'),'sm'),UI.btn('Clear',()=>{a=b=null;arrow=null;draw();upd();},'sm')),
    UI.note('<b>Simplified simulation:</b> positions are hand-placed in 2 dimensions. Real embeddings are learned vectors with hundreds to thousands of dimensions, and no single dimension has a tidy human label.','warn'))));
  draw();upd();
}};

/* ---------------- Ch2 · Attention (sim; optional) ---------------- */
Sims.attention={kind:'sim',title:'Optional · Attention: Who Looks at Whom?',
mount(el){
  const toks=['The','trophy','didn\'t','fit','in','the','suitcase','because','it','was','too','big'];
  const K=[[0,.2],[1.8,.5],[.1,.1],[.3,.6],[0,.2],[0,.2],[1.5,.4],[.2,.3],[.9,.4],[.1,.2],[.1,.3],[.6,1.4]];
  const Q={8:[1.2,.2],11:[.4,1.2]};let q=8,sharp=1.4;
  const VW=1000,VH=320,x=i=>60+i*(VW-120)/(toks.length-1);
  const svg=h('svg',{viewBox:`0 0 ${VW} ${VH}`,width:'100%',role:'img','aria-label':'Attention weights from the selected word to other words'}),info=h('div',{class:'card'});
  function weights(){const qv=Q[q]||[.3,.5];const sc=K.map(k=>(qv[0]*k[0]+qv[1]*k[1])/Math.sqrt(2)*sharp);return softmax(sc,1);}
  function draw(){
    const w=weights();svg.innerHTML='';
    w.forEach((v,i)=>{if(i===q)return;const mx=(x(q)+x(i))/2,dy=40+Math.abs(i-q)*20;svg.append(h('path',{d:`M${x(q)} 170Q${mx} ${170-dy*2} ${x(i)} 170`,fill:'none',stroke:'#ffe08a','stroke-width':1+v*26,'stroke-opacity':clamp(.12+v*1.6,.12,.95)}));});
    toks.forEach((t,i)=>{svg.append(h('g',{class:'node',tabindex:0,role:'button','aria-label':'Use '+t+' as the query word',onclick:()=>{q=i;draw();},onkeydown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();q=i;draw();}}},h('rect',{x:x(i)-40,y:176,width:80,height:36,rx:9,fill:i===q?'#00693C':'#16284f',stroke:i===q?'#ffe08a':'#6a7fb0','stroke-width':i===q?4:2}),h('text',{x:x(i),y:200,'text-anchor':'middle',fill:'#fff','font-size':18},t)),h('text',{x:x(i),y:240,'text-anchor':'middle',fill:'#ffe08a','font-size':16,'font-family':'monospace'},i===q?'query':(w[i]*100).toFixed(0)+'%'));});
    const top=w.map((v,i)=>[v,i]).filter(p=>p[1]!==q).sort((a,b)=>b[0]-a[0]).slice(0,3);
    info.innerHTML=`Query word: <b>${toks[q]}</b>. Strongest attention: ${top.map(([v,i])=>`<b>${toks[i]}</b> (${(v*100).toFixed(0)}%)`).join(', ')}.`;
  }
  const sh=UI.slider('Sharpness (scale of scores)',0.2,4,.1,sharp,v=>{sharp=v;draw();},v=>v.toFixed(1));
  el.append(UI.note('Click a word. Try <b>it</b> (what does "it" refer to?) and <b>big</b>. Attention weights come from softmax(q·k / √d) over each word\'s key vector.'),svg,sh.el,info,UI.note('<b>Simplified simulation:</b> key and query vectors are hand-set 2D numbers chosen so "it" attends to "trophy". The formula is the real scaled dot-product attention; a trained transformer learns these vectors, uses many heads and layers, and does not give one human-readable answer.','warn'));
  draw();
}};

/* ---------------- Ch2 · Lab B: Next-token predictor (illustrative) ---------------- */
Sims.nexttoken={kind:'sim',title:'Laboratory B · The Next-Token Predictor',
mount(el){
  const D={'^':[['graded',.34],['papers',.27],['exams',.14],['assignments',.12],['quizzes',.08],['banana',.05]],
    graded:[['papers',.46],['exams',.24],['assignments',.18],['essays',.12]],papers:[['.',.4],['and',.22],['before',.15],['to',.13],['with',.10]],
    exams:[['.',.38],['and',.25],['before',.15],['to',.12],['early',.10]],assignments:[['.',.42],['and',.2],['after',.14],['to',.14],['with',.10]],
    quizzes:[['.',.4],['and',.25],['to',.2],['before',.15]],essays:[['.',.4],['and',.3],['with',.2],['to',.1]],banana:[['.',.5],['peels',.3],['and',.2]],
    and:[['the',.3],['asked',.25],['reminded',.2],['smiled',.15],['walked',.10]],before:[['the',.5],['class',.3],['lunch',.2]],to:[['the',.4],['each',.35],['students',.25]],
    with:[['comments',.45],['feedback',.35],['stickers',.2]],after:[['class',.5],['lunch',.3],['school',.2]],early:[['.',.6],['today',.4]],the:[['class',.3],['students',.3],['next',.2],['room',.2]]};
  const base='The teacher handed back the'.split(' ');let chosen=[];
  const sent=h('div',{class:'card',style:{fontSize:'1.35em'}}),prob=h('div',{class:'card mono'}),barsBox=h('div');
  let bars=null,curDist=null;
  const key=()=>chosen.length?chosen[chosen.length-1].t:'^';
  const getDist=()=>{const k=key();if(k==='.')return null;return D[k]||[['.',.5],['again',.3],['today',.2]];};
  function render(){
    curDist=getDist();
    sent.innerHTML=base.join(' ')+' '+chosen.map(c=>`<b style="color:#ffe08a">${esc(c.t)}</b>`).join(' ')+(curDist?' <span class="sub">▮</span>':'');
    const P=chosen.reduce((a,c)=>a*c.p,1);
    prob.innerHTML=chosen.length?`P(continuation) = ${chosen.map(c=>c.p.toFixed(2)).join(' × ')} = <b>${P<.001?P.toExponential(2):P.toFixed(4)}</b>`:'Chain rule: P(w₁…wₙ) = P(w₁)·P(w₂|w₁)·… Pick tokens to build the product.';
    barsBox.innerHTML='';
    if(!curDist){barsBox.append(UI.note('End of sentence token reached. Press Restart to explore a different path.','good'));return;}
    bars=Bars(barsBox,curDist.map(d=>d[0]),{pick:i=>choose(i),fmt:v=>pct(v,0)});
    bars.set(curDist.map(d=>d[1]));
  }
  function choose(i){chosen.push({t:curDist[i][0],p:curDist[i][1]});render();}
  el.append(UI.note('Context so far. In a real model the distribution covers ~100,000 possible tokens; here we show only a few <b>illustrative</b> candidates. <b>Click a bar to choose the next token.</b>'),sent,
    h('h3',{},EDITION.lite?'How likely is each next word? (made-up numbers)':'P(next token | everything so far)  ·  illustrative values'),barsBox,prob,
    h('div',{class:'row'},UI.btn('Sample from distribution',()=>{if(curDist)choose(sampleIdx(curDist.map(d=>d[1])));},'pri'),UI.btn('Greedy: most likely',()=>{if(curDist)choose(0);}),UI.btn('Undo',()=>{chosen.pop();render();}),UI.btn('Restart',()=>{chosen=[];render();})),
    UI.note('Notice: the most likely word is not always the "right" word, and each choice changes every later distribution. Because the numbers are invented for teaching, no part of this screen says what any real model would output.','warn'));
  if(EDITION.lite)prob.style.display='none';
  render();
  return{replay(){chosen=[];render();let n=0;const step=()=>{if(!curDist||n++>5)return;choose(sampleIdx(curDist.map(d=>d[1])));setTimeout(step,S.prefs.reduced?0:700);};setTimeout(step,500);}};
}};

/* ---------------- Ch2 · Lab C: Temperature (softmax on illustrative logits) ---------------- */
Sims.temperature={kind:'sim',title:'Laboratory C · The Temperature Simulator',
mount(el){
  const toks=['curiosity','feedback','practice','sleep','patience','pizza'],logits=[3.0,2.6,2.4,1.5,1.1,-.5];
  let T=1,counts=toks.map(()=>0),total=0,last=[];
  const b1=h('div'),b2=h('div'),stat=h('div',{class:'card'}),list=h('div',{class:'card mono',style:{minHeight:'54px',maxHeight:'130px',overflow:'auto'}});
  const bars1=Bars(b1,toks,{fmt:v=>pct(v,1)}),bars2=Bars(b2,toks,{fmt:v=>pct(v,0)});
  function draw(){
    const p=softmax(logits,T),H=-p.reduce((a,v)=>a+(v>0?v*Math.log2(v):0),0);
    bars1.set(p,p.indexOf(Math.max(...p)));bars2.set(counts.map(c=>total?c/total:0));
    stat.innerHTML=`T = <b>${T===0?'0 (greedy)':T.toFixed(2)}</b> · top token share <b>${pct(Math.max(...p),1)}</b> · entropy <b>${H.toFixed(2)} bits</b> (max for 6 options = 2.58)`;
    list.innerHTML=last.length?last.map(i=>`<span class="chip" style="background:hsl(${i*55} 75% 72%)">${toks[i]}</span>`).join(''):'<span class="sub">Generated completions appear here.</span>';
  }
  function gen(n){const p=softmax(logits,T);last=[];for(let i=0;i<n;i++){const k=sampleIdx(p);counts[k]++;total++;last.push(k);}draw();}
  const sl=UI.slider(EDITION.lite?'Creativity dial':'Temperature T',0,2,.05,T,v=>{T=v;counts=toks.map(()=>0);total=0;last=[];draw();},v=>v===0?'greedy':v.toFixed(2));
  el.append(h('div',{class:'mono card',html:'Prompt: <b>"The most important thing for a learner is ___"</b> <span class="sub">(logits are illustrative)</span>'}),sl.el,
    h('div',{class:'grid2'},h('div',{},h('h3',{},'Probability after softmax(z / T)'),b1),h('div',{},h('h3',{},'Observed choices (sampled)'),b2)),stat,
    h('div',{class:'row'},UI.btn('Generate 1',()=>gen(1),'pri'),UI.btn('Generate 10',()=>gen(10),'pri'),UI.btn('Generate 200',()=>gen(200)),UI.btn('Reset tally',()=>{counts=toks.map(()=>0);total=0;last=[];draw();})),list,
    UI.note('Low T sharpens the distribution toward the top token (T→0 is greedy decoding: always the same answer). High T flattens it, so unlikely tokens like <i>pizza</i> appear more often. Temperature changes <b>how we sample</b>, not what the model "knows".','good'));
  if(EDITION.lite)stat.style.display='none';
  draw();
  return{replay(){counts=toks.map(()=>0);total=0;gen(10);}};
}};

/* ---------------- Ch2 · Lab D: Context window (scripted) ---------------- */
Sims.context={kind:'script',title:'Laboratory D · The Context Window Experiment',
mount(el){
  const base=[
    {t:'Teacher: Reminder for next week: the unit quiz is on FRIDAY, not Thursday.',key:true},
    {t:'Teacher: Please return the field-trip permission slips by Monday.'},
    {t:'Student: Can we use calculators on the quiz?'},
    {t:'Teacher: Yes, basic calculators are fine. Bring your own.'},
    {t:'Teacher: The robotics club moves to room 214 this week.'},
    {t:'Student: Is the library open during lunch?'},
    {t:'Teacher: Yes, it is open from 11:30 to 12:15 daily.'},
    {t:'Teacher: Our class photo will be taken after lunch on Tuesday.'},
    {t:'Student: Which day is the unit quiz?',q:true}];
  let msgs=base.map(m=>({...m})),limit=240,reminded=false;
  const tok=m=>Math.ceil(m.t.split(/\s+/).length*1.3);
  const box=h('div',{class:'card',style:{maxHeight:'420px',overflow:'auto'}}),reply=h('div',{class:'card'}),meter=h('div',{class:'sub'});
  function draw(){
    let used=0;const vis=new Array(msgs.length).fill(false);
    for(let i=msgs.length-1;i>=0;i--){const c=tok(msgs[i]);if(used+c<=limit){used+=c;vis[i]=true;}else break;}
    box.innerHTML='';msgs.forEach((m,i)=>box.appendChild(h('div',{class:'msg'+(vis[i]?'':' out')+(m.key?' key':'')},m.t,h('span',{class:'sub',style:{float:'right'}},tok(m)+' tok'))));
    const keyVisible=msgs.some((m,i)=>m.key&&vis[i]);
    meter.innerHTML=`Window: the most recent <b>${limit}</b> tokens fit (${used} used). Greyed messages are outside the window and cannot influence the reply.`;
    reply.innerHTML=`<div class="sub">Scripted reply to "Which day is the unit quiz?"</div><div class="big" style="font-size:28px;color:${keyVisible?'#38d996':'#ffb84d'}">${keyVisible?'“The unit quiz is on Friday.”':'“The unit quiz is usually held on Thursday, based on typical schedules.”'}</div><div class="sub">${keyVisible?'The key fact is inside the window, so the reply can use it.':'The key fact fell out of the window. A real model may then produce a fluent, plausible guess instead of saying it lacks the information.'}</div>`;
  }
  const sl=UI.slider('Context window size (tokens)',20,260,10,limit,v=>{limit=v;draw();});
  el.append(UI.note('<b>Scripted demonstration:</b> no model is running. Token counts are approximated (≈1.3 per word) and the reply is scripted to show the principle that a model can only condition on text inside its context window.','warn'),sl.el,meter,box,reply,
    h('div',{class:'row'},UI.btn('Repeat key fact near the end',()=>{if(!reminded){msgs.splice(msgs.length-1,0,{t:'Teacher: (repeat) The unit quiz is on FRIDAY.',key:true});reminded=true;draw();}},'pri'),UI.btn('Reset conversation',()=>{msgs=base.map(m=>({...m}));reminded=false;draw();})));
  draw();
  return{replay(){let l=260;Anim.tween(2600,p=>{limit=Math.round((260-240*p)/10)*10;sl.set(limit);draw();});}};
}};
