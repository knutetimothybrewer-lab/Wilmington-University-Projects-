import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const files=['src/utils/dom.js','src/utils/storage.js','src/content/references.js','src/content/scenarios.js','src/content/modules.js','src/components/environment.js','src/components/scenes.js','src/components/module.js','src/interactions/activities.js','src/animations/story.js','src/main.js'];
const scripts=[];
for(const file of files){let source=await readFile(new URL(file,root),'utf8');source=source.replace(/^import .*?;\s*$/gm,'').replace(/\bexport (?=(?:const|let|function)\b)/g,'');scripts.push(source);}
const css=await readFile(new URL('src/styles/main.css',root),'utf8');
let page=await readFile(new URL('index.html',root),'utf8');
page=page.replace(/<link rel="icon"[^>]*>/,'').replace('<link rel="stylesheet" href="src/styles/main.css">',()=>'<style>'+css+'</style>').replace('<script type="module" src="src/main.js"></script>','');
page=page.replace('</body>',()=>'<script>\n(()=>{\n'+scripts.join('\n')+'\n})();\n</script>\n</body>');
await writeFile(new URL('view-presentation.html',root),page);
console.log('Created view-presentation.html — double-click to open; no server or dependencies.');
