export function avatarSVG(id = "student-avatar") {
  return `<g id="${id}" class="student-avatar" role="img" aria-label="Student guide wearing a green sweater, glasses, and a gold backpack"><ellipse class="avatar-shadow" cx="0" cy="3" rx="19" ry="7" fill="#133c2e" opacity=".16"/><g class="avatar-person"><g class="leg leg-back"><path d="M-7-29L-9-7" stroke="#263c48" stroke-width="8" stroke-linecap="round"/><path d="M-9-7l-7 2" stroke="#18303c" stroke-width="8" stroke-linecap="round"/></g><g class="leg leg-front"><path d="M7-29L9-7" stroke="#334b58" stroke-width="8" stroke-linecap="round"/><path d="M9-7l9 2" stroke="#18303c" stroke-width="8" stroke-linecap="round"/></g><path d="M-17-60q-13 4-10 26l11 7 7-23z" fill="#d5ad55" stroke="#a47f30" stroke-width="1.5"/><path d="M-10-58q11-8 23 0l3 31q-16 7-31-1z" fill="#176449"/><path d="M-5-54q1 12 0 25" stroke="#d5ad55" stroke-width="3"/><g class="arm arm-back"><path d="M-13-53l-7 21" stroke="#195740" stroke-width="8" stroke-linecap="round"/><circle cx="-21" cy="-31" r="4" fill="#b97f59"/></g><g class="arm arm-front"><path d="M12-52l8 19" stroke="#237c59" stroke-width="8" stroke-linecap="round"/><circle cx="20" cy="-31" r="4" fill="#c5916b"/></g><text x="6" y="-38" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="7" fill="#f5edcf">WU</text><path d="M-4-64v8h12v-8" fill="#b97f59"/><ellipse cx="3" cy="-77" rx="15" ry="18" fill="#c5916b"/><path d="M-12-78q-4-18 12-21 17-4 20 15l-4 10-3-14q-8 8-23 5z" fill="#26332f"/><g fill="#26332f"><circle cx="-8" cy="-91" r="7"/><circle cx="2" cy="-96" r="7"/><circle cx="12" cy="-91" r="7"/></g><g stroke="#263c3e" stroke-width="1.6" fill="none"><circle cx="-2" cy="-77" r="5"/><circle cx="10" cy="-77" r="5"/><path d="M3-77h2M-7-78l-5-2"/></g><path d="M2-66q5 3 8-1" stroke="#81523b" fill="none" stroke-width="1.4"/></g></g>`;
}
const tree = (x, y, s = 1, tone = 0) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="11" cy="10" rx="26" ry="10" fill="#244e36" opacity=".1"/><path d="M0-43V8" stroke="#a4936e" stroke-width="6"/><path d="M0-29l-11-12M0-38l12-17" stroke="#a4936e" stroke-width="3"/><ellipse cy="-63" rx="31" ry="42" fill="${tone ? "#829970" : "#50866a"}"/><ellipse cx="-9" cy="-72" rx="21" ry="29" fill="${tone ? "#a0af7d" : "#72a181"}"/><ellipse cx="10" cy="-61" rx="18" ry="28" fill="${tone ? "#8fa36f" : "#639576"}"/></g>`;
function building(c) {
  const { x, y } = c.position;
  const n = c.number;
  let house = "";
  const shadow =
    '<path d="M-110 74L-25 125 150 48 58 6z" fill="#315d47" opacity=".1"/>';
  const windows = (color = "#6f9f9c") =>
    [0, 1, 2, 3]
      .map(
        (i) =>
          `<path d="M${-78 + i * 42} 12v42l25 14V26z" fill="${color}"/><path d="M${-67 + i * 42} 19v42" stroke="#d6ece2" opacity=".6"/>`,
      )
      .join("");
  if (c.kind === "museum")
    house = `<path d="M-104-18l104-58 104 58L0 40z" fill="#efe8d5"/><path d="M-104-18v104L0 143V40z" fill="#e1dbc5"/><path d="M0 40l104-58V86L0 143z" fill="#f9f6e8"/><path d="M-113-30L0-104 113-30 0 35z" fill="#8b9b8f"/><path d="M-113-30L0-88 113-30 0 29z" fill="#cdd5c4"/><path d="M-94-30L0-79 94-30 0 18z" fill="#e6e6d5"/><path d="M-58-29L0-64 60-29 0 4z" fill="#f9f7e9"/>${[-76, -42, -9].map((a) => `<path d="M${a} 20v72l12 6V26z" fill="#faf7e8"/>`).join("")}<path d="M-23 78l44-25 24 14-44 25z" fill="#c2c8b2"/><path d="M-23 85l44-25 24 14-44 25z" fill="#d5d9c3"/><path d="M5 78V31l28-16v47z" fill="#225b49" class="building-door"/><circle cx="25" cy="47" r="2" fill="#d4af5a"/>`;
  if (c.kind === "lab")
    house = `<path d="M-110-34L4-93 115-29 1 33z" fill="#e3eee5"/><path d="M-110-34v121L1 149V33z" fill="#598982"/><path d="M1 33l114-62V89L1 149z" fill="#bcd7cb"/><path d="M-102-23L-7 31v96l-95-52z" fill="#83aea1"/><path d="M12 39l92-51v91l-92 51z" fill="#bce0d0"/><g stroke="#dcefe3" stroke-width="4">${[-72, -39].map((a) => `<path d="M${a}-5V92"/>`).join("")}<path d="M-102 18l95 53M-102 51l95 53M43 20v93M75 2v93M12 69l92-50M12 100l92-50"/></g><path d="M-86-38L1-84 72-43-15 3z" fill="#315b58"/>${[0, 1, 2].map((i) => `<path d="M${-76 + i * 24} ${-34 + i * 14}l72-39" stroke="#85b2a3" stroke-width="2"/>`).join("")}<path d="M35 110V72l24-14v38z" fill="#286953" class="building-door"/><path d="M76-80v-39M76-100l19-12" stroke="#587d6c" stroke-width="3"/><circle cx="76" cy="-120" r="5" fill="#d6a744"/>`;
  if (c.kind === "library")
    house = `<path d="M-103-28L0-83 106-24 0 35z" fill="#e7d4b6"/><path d="M-103-28v107L0 139V35z" fill="#bca07e"/><path d="M0 35l106-59V82L0 139z" fill="#ddc5a2"/>${windows("#577c70")}<path d="M15 31v43l22-13V18zM49 12v43l22-13V-1zM82-7v43l16-10V-17z" fill="#73968a"/><path d="M-110-32L0-96 113-31 0 32z" fill="#5a7163"/><path d="M-78-34L0-77 80-32 0 13z" fill="#9bac8e"/><path d="M13 105V77q17-29 33-19v29z" fill="#385a4c" class="building-door"/><path d="M-32-87v-16l32-19 32 19v16L0-104z" fill="#c3c6a1"/><path d="M0-104v-18" stroke="#f9f6e6" stroke-width="3"/>`;
  if (c.kind === "observatory")
    house = `<path d="M-100 25L2-33 109 27 6 85z" fill="#f0e7d2"/><path d="M-100 25v61L6 148V85z" fill="#c2c6b1"/><path d="M6 85l103-58v62L6 148z" fill="#e0e1cb"/><path d="M-90 20q-5-113 93-113 102 0 101 115L6 77z" fill="#547b71"/><path d="M-65 6q-4-81 70-91 72 9 77 91L6 48z" fill="#759b87"/><path d="M-10-82q33 48 30 128l21-12q7-68-22-113z" fill="#d5dfc6"/><path d="M7-81q31 46 28 118" stroke="#a8c6a5" stroke-width="4" fill="none"/><path d="M-66 73v33M-36 90v33" stroke="#57786a" stroke-width="12"/><path d="M27 127V94l27-15v32z" fill="#315b48" class="building-door"/><path d="M-48-62l-29-24" stroke="#a5b8a1" stroke-width="5"/><circle cx="-80" cy="-90" r="8" fill="#d2ad58"/>`;
  if (c.kind === "collaboration")
    house = `<ellipse cy="18" rx="110" ry="57" fill="#d7deca"/><path d="M-110 14v74q110 69 220 0V14" fill="#81ab96"/><ellipse cy="14" rx="110" ry="57" fill="#e9ecdc"/><ellipse cy="7" rx="102" ry="51" fill="#b5c7ab"/><ellipse cy="-5" rx="85" ry="43" fill="#d5dfc3"/><path d="M-99 32v52M-64 53v50M-24 66v51M21 66v51M64 53v50M99 32v52" stroke="#e7f0dc" stroke-width="5"/><path d="M-108 53q109 66 216 0" fill="none" stroke="#c5ddc6" stroke-width="3"/><path d="M-16 115V78q18-7 33 0v37" fill="#2c6650" class="building-door"/><path d="M0-50v-37" stroke="#456f53" stroke-width="4"/><path d="M0-87h41v22H0" fill="#d6a744"/><path d="M13-80h17M13-73h12" stroke="#fff9df" stroke-width="2"/>`;
  return `<g class="building" id="building-${c.id}" data-building="${c.id}" transform="translate(${x} ${y})" role="button" tabindex="0" aria-label="Visit chapter ${n}: ${c.name}. ${c.topic}."><title>${c.name} — ${c.topic}</title>${shadow}<g class="building-architecture">${house}</g><g class="building-plaque" transform="translate(0 ${c.kind === "collaboration" ? 146 : 171})"><rect x="-113" y="-18" width="226" height="47" rx="9" fill="#fffdf5" stroke="#dadfce"/><circle cx="-93" cy="4" r="10" fill="#17543e"/><text x="-93" y="8" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">${n}</text><text x="-75" y="0" font-size="14" font-weight="600" fill="#234737">${c.name}</text><text x="-75" y="17" font-size="10" fill="#617467">${c.topic}</text></g></g>`;
}
export function campusSVG(chapters) {
  return `<svg id="campus-world" viewBox="0 0 1440 860" role="group" aria-labelledby="campus-title campus-desc"><title id="campus-title">The Intelligence Campus</title><desc id="campus-desc">An original university-inspired campus with five academic buildings linked by paths around a fountain. A student in a green sweater and gold backpack walks to each chapter. Use the five chapter cards below as an equivalent keyboard-accessible map.</desc><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#e6eee4"/><stop offset="1" stop-color="#f7f5e9"/></linearGradient><linearGradient id="lawn" x2="1" y2="1"><stop stop-color="#e0e7cf"/><stop offset="1" stop-color="#d0dec3"/></linearGradient><radialGradient id="sunlight"><stop stop-color="#fff4c8" stop-opacity=".8"/><stop offset="1" stop-color="#fff4c8" stop-opacity="0"/></radialGradient><pattern id="paving" width="20" height="12" patternUnits="userSpaceOnUse"><path d="M0 0h20M0 6h20M0 12h20M0 0v6M10 6v6M20 0v6" stroke="#c5cfb6" stroke-width=".6"/></pattern><filter id="building-shadow" x="-35%" y="-25%" width="180%" height="190%"><feDropShadow dx="4" dy="12" stdDeviation="10" flood-color="#31533c" flood-opacity=".07"/></filter></defs>
<rect width="1440" height="860" fill="url(#sky)"/><circle cx="1150" cy="105" r="190" fill="url(#sunlight)"/><g class="clouds" fill="#fffdf4" opacity=".65"><ellipse cx="780" cy="70" rx="100" ry="15"/><ellipse cx="840" cy="55" rx="53" ry="18"/><ellipse cx="1230" cy="150" rx="140" ry="17"/></g><path d="M0 258Q235 189 480 234T920 206T1440 245V860H0Z" fill="#d7e2d0" opacity=".45"/><g id="campus-camera"><path d="M201 468Q223 289 586 164T1260 277Q1531 475 1210 733T535 805Q169 730 201 468Z" fill="url(#lawn)"/><path d="M242 470Q290 331 606 212T1242 309" fill="none" stroke="#c7d7bd" stroke-width="3"/><path d="M215 558Q451 726 794 761T1306 560" fill="none" stroke="#c7d7bd" stroke-width="2"/>
<g class="campus-paths" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M755 770L775 538 575 427M775 538L915 365M775 538L1205 495M775 538L1050 731M775 538L465 711" stroke="#bcc9ae" stroke-width="44"/><path d="M755 770L775 538 575 427M775 538L915 365M775 538L1205 495M775 538L1050 731M775 538L465 711" stroke="#f0ecdb" stroke-width="37"/><path d="M755 770L775 538 575 427M775 538L915 365M775 538L1205 495M775 538L1050 731M775 538L465 711" stroke="url(#paving)" stroke-width="36"/></g>
<g class="landscape-back">${[
    [430, 220, 0.8, 0],
    [680, 200, 0.8, 1],
    [1100, 205, 0.8, 0],
    [1280, 260, 0.8, 1],
    [345, 390, 1, 0],
    [1360, 435, 1, 0],
    [1180, 660, 0.85, 1],
    [690, 740, 0.85, 0],
    [335, 620, 1, 1],
    [660, 370, 0.6, 1],
    [1015, 430, 0.7, 0],
    [1140, 540, 0.65, 1],
    [545, 520, 0.7, 0],
  ]
    .map((t) => tree(...t))
    .join("")}</g>
<g id="campus-fountain" transform="translate(780 495)"><ellipse cx="12" cy="26" rx="86" ry="42" fill="#63846a" opacity=".12"/><ellipse rx="75" ry="37" fill="#d8d6bc"/><path d="M-75 0v10q75 49 150 0V0" fill="#bcc5ab"/><ellipse cy="-5" rx="66" ry="30" fill="#8eb8ac"/><ellipse cy="-5" rx="52" ry="22" fill="#b3d4c2"/><ellipse cy="-6" rx="30" ry="12" fill="none" stroke="#dfecda" stroke-width="2" class="water-ring"/><path d="M-9-10v-42h18v42" fill="#b4c6a7"/><ellipse cy="-52" rx="25" ry="10" fill="#dfdfc5"/><path d="M-22-51q-10 28-25 39M22-51q10 28 25 39M0-56v-20" fill="none" stroke="#eaf4e2" stroke-width="2.5"/></g>
<g class="garden-details"><g transform="translate(682 560)"><path d="M-37-8l45 25 23-13-45-25z" fill="#bcaa7a"/><path d="M-28-3v15M16 17v14" stroke="#7c9271" stroke-width="3"/></g><g transform="translate(950 490)"><path d="M-37-8l45 25 23-13-45-25z" fill="#bcaa7a"/><path d="M-28-3v15M16 17v14" stroke="#7c9271" stroke-width="3"/></g><path d="M730 685v-32M730 653l37-14v20l-37 14" fill="#fffdf0" stroke="#8b9f7c" stroke-width="2"/><text x="735" y="658" font-size="7" fill="#31533d" transform="rotate(-19 735 658)">CAMPUS HUB</text><g fill="#d8b25b">${[
    [630, 470],
    [640, 476],
    [980, 555],
    [990, 559],
    [575, 682],
    [560, 678],
    [1100, 620],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`)
    .join("")}</g></g>
<g filter="url(#building-shadow)">${chapters.map(building).join("")}</g><path id="journey-trail" d="" stroke="#c39e45" stroke-width="3" stroke-dasharray="4 8" fill="none"/>
${avatarSVG()}<g class="foreground-trees">${[
    [1240, 760, 1.25, 0],
    [260, 750, 1.1, 0],
    [1410, 650, 1, 1],
  ]
    .map((t) => tree(...t))
    .join("")}</g></g></svg>`;
}
