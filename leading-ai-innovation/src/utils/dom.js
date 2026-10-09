export const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function announce(text){document.querySelector('#announcement').textContent=text;}
export function download(name,text,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function feedback(container,text){const output=container.querySelector('.feedback');output.textContent=text;output.hidden=false;}
export function html(strings,...values){return strings.reduce((s,p,i)=>s+p+(i<values.length?escape(values[i]):''),'');}
