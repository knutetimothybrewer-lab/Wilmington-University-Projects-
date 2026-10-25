import { avatarSVG } from "./art.js";
export function interiorSVG(c, scene) {
  const accent = c.accent;
  const active = scene.stage === "exhibits";
  const person = avatarSVG("interior-avatar");
  const frame = (art, dark = false) =>
    `<svg id="interior-world" class="${dark ? "dark-room" : ""}" viewBox="0 0 1440 860" role="img" aria-labelledby="interior-art-title interior-art-description"><title id="interior-art-title">${c.name}: ${scene.name}</title><desc id="interior-art-description">${scene.body} This is original conceptual artwork for the foundation, not a running AI simulation.</desc><defs><linearGradient id="room-light" x2="0" y2="1"><stop stop-color="${dark ? "#183a39" : "#edf0e3"}"/><stop offset="1" stop-color="${dark ? "#0e2929" : "#f8f4e7"}"/></linearGradient><linearGradient id="floor-light" x2="0" y2="1"><stop stop-color="${dark ? "#27514a" : "#e4e3cf"}"/><stop offset="1" stop-color="${dark ? "#173b36" : "#f4f0df"}"/></linearGradient><radialGradient id="exhibit-glow"><stop stop-color="${accent}" stop-opacity=".24"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="860" fill="url(#room-light)"/><g class="room-camera"><path d="M0 860L390 410H1110L1440 860Z" fill="url(#floor-light)"/><path d="M390 410V60M1110 410V60M0 860L390 410H1110L1440 860" stroke="${dark ? "#487267" : "#d3d7c2"}" stroke-width="2" fill="none"/>${art}<g class="interior-avatar-position" transform="translate(420 710) scale(1.5)">${person}</g><ellipse cx="825" cy="697" rx="245" ry="69" fill="url(#exhibit-glow)"/></g></svg>`;
  if (c.kind === "museum")
    return frame(
      `<path d="M460 375V160Q750-58 1040 160V375" fill="#f9f5e5" stroke="#d8dac2" stroke-width="7"/><path d="M490 364V178Q750-11 1010 178V364" fill="#dce7d4"/><circle cx="752" cy="163" r="65" fill="#f7f0ce"/><path d="M718 162l21 22 44-49" fill="none" stroke="#829c71" stroke-width="5"/>${[
        "EXPLICIT RULES",
        "LEARNED PATTERNS",
        "DEEP NETWORKS",
        "GENERATION",
      ]
        .map((name, i) => {
          const x = 470 + i * 205;
          return `<g class="exhibit-station ${active ? "station-active" : ""}" style="--delay:${i * 90}ms" transform="translate(${x} ${460 + (i % 2) * 68})"><ellipse cy="60" rx="72" ry="25" fill="#b9c7a8" opacity=".2"/><path d="M-65 10v44q65 35 130 0V10" fill="#d0d5bb"/><ellipse cy="8" rx="65" ry="25" fill="#f5f2df"/><g transform="translate(-45 -95)"><rect width="90" height="95" rx="8" fill="#e6efe0" stroke="#7f9c7c" stroke-width="2"/>${i === 0 ? '<path d="M20 23h50M20 45h35M20 67h50" stroke="#507b59" stroke-width="5"/>' : i === 1 ? '<g fill="#4f8869"><circle cx="25" cy="30" r="6"/><circle cx="38" cy="45" r="6"/><circle cx="24" cy="60" r="6"/></g><g fill="#c6a44b"><circle cx="63" cy="27" r="6"/><circle cx="63" cy="60" r="6"/></g>' : i === 2 ? '<path d="M20 25L45 20 70 35 45 50 20 70 45 77 70 60M20 25L45 50 70 60M20 70L45 20 70 35" stroke="#749880" fill="none"/><g fill="#326b51"><circle cx="20" cy="25" r="5"/><circle cx="20" cy="70" r="5"/><circle cx="45" cy="20" r="5"/><circle cx="45" cy="50" r="5"/><circle cx="45" cy="77" r="5"/><circle cx="70" cy="35" r="5"/><circle cx="70" cy="60" r="5"/></g>' : '<path d="M20 27h25M20 45h49M20 63h36" stroke="#507b59" stroke-width="5"/><path d="M64 23l5 7-5 7" fill="none" stroke="#c4a14b" stroke-width="3"/>'}</g><text y="99" text-anchor="middle" font-size="12" letter-spacing="1.3" fill="#38533c">${name}</text></g>`;
        })
        .join(
          "",
        )}<text x="752" y="300" text-anchor="middle" fill="#5a7555" font-size="13" letter-spacing="4">THE DISCOVERY COLLECTION</text>`,
    );
  if (c.kind === "lab")
    return frame(
      `<g stroke="#3c6b62" fill="none" opacity=".6">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<path d="M${150 + i * 190} 860L750 250"/>`).join("")}${[470, 540, 630, 745].map((y) => `<path d="M0 ${y}h1440"/>`).join("")}</g><circle cx="880" cy="335" r="240" fill="url(#exhibit-glow)"/><path d="M575 575V140h610v435z" fill="#15332f" stroke="#78a997" stroke-width="4"/><path d="M595 550V160h570v390z" fill="#0d2929"/><path d="M815 576v61M944 576v61M763 643h226" stroke="#668f7a" stroke-width="12"/><g class="token-landscape ${active ? "station-active" : ""}">${["The", "next", "idea", "begins", "with", "context"].map((t, i) => `<g transform="translate(${650 + (i % 3) * 160} ${230 + Math.floor(i / 3) * 135})"><rect x="-15" y="-30" width="125" height="63" rx="8" fill="${i % 2 ? "#40695d" : "#244d45"}" stroke="#85a993"/><text x="47" y="8" text-anchor="middle" fill="#e0ebcd" font-size="23" font-family="Georgia,serif">${t}</text></g>`).join("")}<path d="M685 290L835 345 1000 290M685 425L835 480 1000 425" stroke="#c7ad62" stroke-width="2" stroke-dasharray="5 8" fill="none"/></g><text x="879" y="517" text-anchor="middle" font-size="10" letter-spacing="2" fill="#aac6b2">CONCEPTUAL TOKEN LANDSCAPE · NO MODEL RUNNING</text>`,
      true,
    );
  if (c.kind === "library")
    return frame(
      `<path d="M480 410V142Q780-75 1150 142V410" fill="#e3d9bd" stroke="#c6baa0" stroke-width="5"/><path d="M681 389V151q123-145 246 0v238" fill="#b8c9b1" stroke="#f8efd6" stroke-width="15"/><path d="M804 74v315M681 224h246" stroke="#f8efd6" stroke-width="9"/>${[475, 1040].map((x) => `<g transform="translate(${x} 180)"><rect width="150" height="290" rx="6" fill="#aa9473"/>${[20, 92, 165, 238].map((y, j) => `<path d="M10 ${y + 50}h130" stroke="#806d50" stroke-width="7"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${14 + i * 14}" y="${y}" width="10" height="46" rx="2" fill="${["#4e705b", "#b8bb8b", "#cfb673", "#789380"][(i + j) % 4]}"/>`).join("")}`).join("")}</g>`).join("")}<g class="floating-books ${active ? "station-active" : ""}">${[
        [690, 430, -12],
        [950, 425, 12],
        [815, 285, -7],
      ]
        .map(
          ([x, y, r], i) =>
            `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M-70-25q35-22 70-1 35-21 70 1v76q-35-20-70-1-35-19-70 1z" fill="#fff9e7" stroke="#b2ac89" stroke-width="2"/><path d="M0-26v77M-55-5h40M-55 10h35M15-5h40M15 10h30" stroke="#a8ac8a" stroke-width="2"/></g>`,
        )
        .join(
          "",
        )}</g><path d="M600 649l220-85 261 85-220 90z" fill="#d1bb8e"/><path d="M630 661v86M1045 663v84" stroke="#a78f64" stroke-width="15"/><text x="830" y="643" text-anchor="middle" font-size="12" letter-spacing="3" fill="#52664a">TRACE · VERIFY · UNDERSTAND</text>`,
    );
  if (c.kind === "observatory")
    return frame(
      `<path d="M380 434Q390 65 820 47q425 18 428 388" fill="none" stroke="#76a58f" stroke-width="9"/><path d="M500 421Q505 114 820 63q310 52 312 360M820 57v365M420 246h797" fill="none" stroke="#557e6b" stroke-width="3"/><path d="M418 431h802" stroke="#83a38c" stroke-width="5"/><g opacity=".6" fill="#436b60"><path d="M500 425V310h110v115M637 425V267h135v158M807 425V331h127v94M970 425V290h139v135"/></g><g transform="translate(845 435)"><ellipse cy="190" rx="235" ry="63" fill="#244f43"/><path d="M-235 120v65q235 130 470 0v-65" fill="#456e5c"/><ellipse cy="120" rx="235" ry="63" fill="#769780"/><path d="M-165 64v-210H165V64" fill="#29534a" fill-opacity=".72" stroke="#83b29b" stroke-width="2"/><text y="-109" text-anchor="middle" font-size="15" letter-spacing="3" fill="#deebcd">HUMAN OVERSIGHT</text><g class="decision-path ${active ? "station-active" : ""}" stroke="#a5b88c" fill="none" stroke-width="2"><path d="M0-70v45M0-25L-100 22M0-25L100 22"/><circle cy="-70" r="18" fill="#7eaa8c"/><rect x="-132" y="14" width="64" height="28" rx="4" fill="#496f5c"/><rect x="68" y="14" width="64" height="28" rx="4" fill="#496f5c"/></g><text x="-100" y="67" text-anchor="middle" font-size="10" fill="#deebcd">INVESTIGATE</text><text x="100" y="67" text-anchor="middle" font-size="10" fill="#deebcd">CONTEXT</text></g>`,
      true,
    );
  return frame(
    `<path d="M400 419V165Q830-63 1250 165v254" fill="#d5e4cf" stroke="#b3c9b1" stroke-width="5"/>${[500, 660, 820, 980, 1140].map((x) => `<path d="M${x} 110v300" stroke="#f9f6e7" stroke-width="8"/>`).join("")}<path d="M420 270h813" stroke="#f9f6e7" stroke-width="8"/><g transform="translate(835 480)"><ellipse cy="135" rx="220" ry="66" fill="#a7bfa3" opacity=".3"/><path d="M-200 70v80q200 110 400 0V70" fill="#b8c7a8"/><ellipse cy="70" rx="200" ry="65" fill="#eee7cd"/><g class="collaboration-rings ${active ? "station-active" : ""}"><circle cx="-82" cy="-74" r="67" fill="#bdd7bf" stroke="#4f8c69" stroke-width="2"/><circle cx="82" cy="-74" r="67" fill="#e8d9a6" stroke="#b39c53" stroke-width="2"/><path d="M-13-74h26" stroke="#4e7e5c" stroke-width="3"/><g stroke="#487456" stroke-width="4" fill="none"><circle cx="-82" cy="-90" r="15"/><path d="M-109-50q27-35 54 0"/></g><g stroke="#9d8641" stroke-width="3" fill="none"><rect x="61" y="-96" width="43" height="43" rx="7"/><path d="M71-107v11M94-107v11M71-53v11M94-53v11M50-84h11M104-84h11"/></g></g><text x="-82" y="42" text-anchor="middle" font-size="11" letter-spacing="1" fill="#365c42">HUMAN JUDGMENT</text><text x="82" y="42" text-anchor="middle" font-size="11" letter-spacing="1" fill="#77683c">AI ASSISTANCE</text></g><g transform="translate(1190 570)"><path d="M0 50v-80" stroke="#8d9f75" stroke-width="9"/><ellipse cx="-18" cy="-60" rx="29" ry="55" fill="#87a67b"/><ellipse cx="15" cy="-40" rx="25" ry="48" fill="#a0b78b"/><path d="M-35 18h70l-12 68h-46z" fill="#cbb78c"/></g>`,
  );
}
