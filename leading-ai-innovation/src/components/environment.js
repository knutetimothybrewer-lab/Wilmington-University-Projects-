// Original vector environment; no external assets or university logo.
export function environment(variant='opening') {
const id=variant.replace(/[^a-z0-9]/gi,'');
return `<svg class="school-environment" viewBox="0 0 760 680" role="img" aria-labelledby="env-title-${id} env-desc-${id}">
<title id="env-title-${id}">An open, sunlit learning environment</title><desc id="env-desc-${id}">A cutaway classroom connects a library, collaborative tables, an accessible walkway, and a school planning display. People and shared learning remain at the center.</desc>
<defs><linearGradient id="sky-${id}" x2="0" y2="1"><stop stop-color="#e2eff7"/><stop offset="1" stop-color="#f8f7f3"/></linearGradient><linearGradient id="wall-${id}" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#ede9dd"/></linearGradient><linearGradient id="floor-${id}" x2="0" y2="1"><stop stop-color="#dfd7c6"/><stop offset="1" stop-color="#f4eee0"/></linearGradient><filter id="shadow-${id}" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="0" dy="20" stdDeviation="14" flood-color="#163a63" flood-opacity=".1"/></filter><pattern id="grain-${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M0 48L48 0" stroke="#fff" stroke-opacity=".14"/></pattern></defs>
<rect width="760" height="680" rx="80" fill="url(#sky-${id})"/>
<circle class="sun" cx="580" cy="120" r="90" fill="#efdba5" opacity=".56"/>
<g class="depth-back"><path d="M35 342L188 256 355 350 206 438Z" fill="#c5d8d5" opacity=".55"/><path d="M574 260l129 74-128 75-129-75z" fill="#ccdfda"/>
<g fill="#84aca0"><ellipse cx="91" cy="295" rx="35" ry="67"/><ellipse cx="656" cy="285" rx="36" ry="71"/></g><path d="M91 282v111M656 277v111" stroke="#65897d" stroke-width="6"/>
<path d="M110 450L358 306 671 486 424 629Z" fill="#bcced1" opacity=".3"/></g>
<g class="depth-room" filter="url(#shadow-${id})">
<path d="M108 408L353 267 657 442 412 584Z" fill="#aeb6b4"/><path d="M108 393L353 252 657 427 412 568Z" fill="url(#floor-${id})"/>
<path d="M108 393V190L353 49v203Z" fill="#ecede5"/><path d="M353 49L657 224V427L353 252Z" fill="url(#wall-${id})"/>
<path d="M108 190L353 49 657 224" fill="none" stroke="#fff" stroke-width="12"/>
<path d="M148 198l67-39v121l-67 39zM239 146l67-39v121l-67 39z" fill="#bad7e8" stroke="#fff" stroke-width="10"/>
<path d="M179 180v119M272 128v119M148 259l67-39M239 207l67-39" stroke="#fff" stroke-width="6"/>
<path d="M153 321L293 241 448 331 307 412Z" fill="#fff6d8" opacity=".4"/>
<path d="M393 118L558 213v103l-165-95z" fill="#163a63" stroke="#eee9df" stroke-width="9"/>
<g transform="matrix(1 .577 0 1 405 145)"><text x="0" y="5" fill="#b8dbe8" font-family="Arial,sans-serif" font-size="11" letter-spacing="2">OUR SHARED PURPOSE</text><path d="M2 21h102M2 35h71" stroke="#f8f7f3" stroke-width="4"/><circle cx="17" cy="65" r="11" fill="#65b6b1"/><circle cx="54" cy="65" r="11" fill="#d5ae52"/><circle cx="91" cy="65" r="11" fill="#a4bcd8"/><path d="M28 65h15M65 65h15" stroke="#fff" stroke-width="2"/></g>
<path d="M586 283l43 25v91l-43-25z" fill="#b29873"/><path d="M589 305l38 22M589 331l38 22M589 357l38 22" stroke="#8c785f" stroke-width="3"/>
<g stroke-width="5"><path d="M598 302v17M608 309v17M619 315v17" stroke="#163a63"/><path d="M599 329v17M609 335v17M620 341v17" stroke="#65b6b1"/><path d="M599 354v17M609 360v17M620 366v17" stroke="#f5e8c7"/></g>
<g class="table-group"><path d="M238 377v62M345 390v64M439 374v55" stroke="#7e8b88" stroke-width="8"/><path d="M218 371l98-57 141 81-98 57z" fill="#8eaaa9"/><path d="M218 363l98-57 141 81-98 57z" fill="#e3ede8" stroke="#fff" stroke-width="2"/>
<path d="M286 349l25-14 36 21-25 14z" fill="#fff"/><path d="M336 372l27-16 29 17-27 16z" fill="#e8c96e"/><path d="M363 350l30-17 36 21-30 17z" fill="#163a63"/><path d="M363 350v-25l36 21v25z" fill="#507a9a"/><path d="M369 336l23 13" stroke="#cde6ed" stroke-width="3"/></g>
<g class="learner"><path d="M247 414v35M279 430v36" stroke="#748b94" stroke-width="6"/><path d="M238 395l40 23v23l-40-23z" fill="#163a63"/><ellipse cx="262" cy="391" rx="19" ry="25" fill="#d4ac88"/><path d="M246 406q18-7 36 19v24l-39-22z" fill="#d5ae52"/><path d="M247 377q20-22 31 6v12q-8-12-29-8z" fill="#34475b"/></g>
<g class="educator"><ellipse cx="453" cy="313" rx="17" ry="22" fill="#ab7859"/><path d="M438 332q22-7 33 24l-4 51-40-21z" fill="#4b8294"/><path d="M437 382v57M460 395v58" stroke="#34475b" stroke-width="10"/><path d="M441 343l-34 14M461 349l29-13" stroke="#ab7859" stroke-width="9" stroke-linecap="round"/><path d="M439 303q15-24 28 8" stroke="#34475b" stroke-width="12" stroke-linecap="round"/></g>
<g class="learner"><ellipse cx="331" cy="463" rx="17" ry="21" fill="#a7795b"/><path d="M314 477l36 19v35l-39-23z" fill="#759a93"/><path d="M318 516v32M344 530v32" stroke="#34475b" stroke-width="8"/><path d="M315 451q16-23 29 4" stroke="#34475b" stroke-width="10"/></g>
<path d="M510 449l45-26 61 35-45 26z" fill="#e4cf9a"/><path d="M523 446l26-15 47 27-26 15z" fill="#fff"/><path d="M524 453v35M597 465v30" stroke="#a89b7a" stroke-width="6"/>
<g class="plant"><path d="M173 359l22 13v32l-22-13z" fill="#d5ae52"/><path d="M184 365v-44" stroke="#628e7a" stroke-width="4"/><path d="M184 344q-31-31-12-39 23 7 12 39M184 336q26-30 31-10-7 16-31 10" fill="#709e88"/></g>
<path class="connection-line" d="M177 435L413 572 646 438" fill="none" stroke="#17669b" stroke-width="2" stroke-dasharray="4 8" opacity=".4"/>
</g>
<g class="floating-note" transform="translate(480 510)"><rect width="212" height="72" rx="12" fill="#fff"/><circle cx="28" cy="30" r="11" fill="#dcecf6"/><path d="M23 30l4 4 7-9" fill="none" stroke="#17669b" stroke-width="2"/><text x="49" y="29" fill="#163a63" font-family="Arial,sans-serif" font-size="12" font-weight="bold">People before platforms</text><text x="49" y="48" fill="#526778" font-family="Arial,sans-serif" font-size="10">Purpose · Access · Human judgment</text></g>
<g fill="#163a63" opacity=".45" font-family="Arial,sans-serif" font-size="10" letter-spacing="2"><text x="48" y="582">THE LEARNING ENVIRONMENT</text><path d="M48 598h97" stroke="#163a63" stroke-width="1"/></g>
</svg>`;
}
