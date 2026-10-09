import {mkdir,rm,cp,readFile,writeFile} from 'node:fs/promises';import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));const dist=path.join(root,'dist');await rm(dist,{recursive:true,force:true});await mkdir(dist,{recursive:true});
for(const name of ['index.html','src','public'])await cp(path.join(root,name),path.join(dist,name),{recursive:true});await writeFile(path.join(dist,'.nojekyll'),'');
const page=await readFile(path.join(dist,'index.html'),'utf8');if(/(?:src|href)="\//.test(page))throw new Error('Root-relative asset path breaks repository Pages.');console.log('Production output: dist/ — static ES modules, relative paths, no runtime dependencies.');
