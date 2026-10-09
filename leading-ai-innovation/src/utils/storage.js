const KEY='med7830-leading-ai-v1';
const fresh=()=>({mode:'presenter',motion:false,completed:[],reflections:{},activities:{},manifesto:{}});
export let state=fresh();
export let storageAvailable=true;
try{const parsed=JSON.parse(localStorage.getItem(KEY));if(parsed&&typeof parsed==='object'){
 state.mode=parsed.mode==='study'?'study':'presenter';state.motion=parsed.motion===true;
 state.completed=Array.isArray(parsed.completed)?parsed.completed.filter(n=>Number.isInteger(n)&&n>=1&&n<=15):[];
 for(const key of ['reflections','activities','manifesto']) if(parsed[key]&&typeof parsed[key]==='object'&&!Array.isArray(parsed[key]))state[key]=parsed[key];
}}catch{storageAvailable=false;}
export function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{storageAvailable=false;document.querySelectorAll('.storage-status').forEach(e=>e.textContent='Browser storage unavailable. Work remains in this session; export anything you want to keep.');return false;}}
export function reset(){state=fresh();save();}
export function activityState(id,fallback){const result=state.activities[id];return result&&typeof result==='object'?result:fallback;}
export function setActivity(id,value){state.activities[id]=value;save();}
