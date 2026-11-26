// Generates every animated SVG used by the profile README.
// Run: node tools/build-assets.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');
mkdirSync(OUT, { recursive: true });

// ---------------------------------------------------------------- palette
const C = {
  bg: '#0A0E14',
  panel: '#0F141C',
  panel2: '#121925',
  grid: '#151D29',
  line: '#223044',
  text: '#E6EDF3',
  muted: '#8B98A9',
  dim: '#4A5768',
  cyan: '#5EEAD4',
  amber: '#F5B841',
  coral: '#FF7A6B',
  violet: '#A78BFA',
  green: '#7EE787',
};
const SANS = "'Segoe UI Variable Display','Segoe UI','Inter','Helvetica Neue',Arial,sans-serif";
const MONO = "'JetBrains Mono','Cascadia Code','SF Mono',Consolas,'Liberation Mono',Menlo,monospace";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const save = (name, svg) => writeFileSync(join(OUT, name), svg.trim() + '\n');

const frame = (w, h, inner, { radius = 18, bg = C.bg, defs = '', style = '' } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" stroke="${C.grid}" stroke-width="1"/>
    </pattern>
    <clipPath id="card"><rect width="${w}" height="${h}" rx="${radius}"/></clipPath>
    ${defs}
  </defs>
  <style>
    .sans{font-family:${SANS}}
    .mono{font-family:${MONO}}
    ${style}
  </style>
  <g clip-path="url(#card)">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    ${inner}
  </g>
  <rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" rx="${radius}" stroke="${C.line}"/>
</svg>`;

// crop marks in the corners, like an engineering drawing
const cropMarks = (w, h, m = 18, l = 14, color = C.dim) => {
  const pts = [
    [m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1],
  ];
  return pts.map(([x, y, dx, dy]) =>
    `<path d="M${x} ${y + dy * l}V${y}H${x + dx * l}" stroke="${color}" stroke-width="1.5"/>`).join('');
};

// second-order step response: the control-engineering signature of the profile
const stepResponse = (x0, y0, w, h, zeta = 0.32, wn = 1, tMax = 22, n = 260) => {
  const wd = wn * Math.sqrt(1 - zeta * zeta);
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * tMax;
    const y = 1 - Math.exp(-zeta * wn * t) * (Math.cos(wd * t) + (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t));
    pts.push([x0 + (i / n) * w, y0 + h - (y / 1.5) * h]);
  }
  return 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
};

// ================================================================ HERO
{
  const W = 1200, H = 460;
  const scopeX = 60, scopeY = 300, scopeW = 1080, scopeH = 120;
  const step = stepResponse(scopeX + 20, scopeY + 8, scopeW - 40, scopeH - 18);
  const setY = scopeY + 8 + scopeH - 18 - (1 / 1.5) * (scopeH - 18);
  const inner = `
    <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".9"/>
    <circle class="glowA" cx="1010" cy="70" r="260" fill="url(#gA)"/>
    <circle class="glowB" cx="150" cy="420" r="300" fill="url(#gB)"/>
    ${cropMarks(W, H)}

    <text x="60" y="58" class="mono" font-size="13" fill="${C.muted}" letter-spacing="2">SYS://PROFILE <tspan fill="${C.cyan}">ONLINE</tspan></text>
    <circle cx="232" cy="53" r="4" fill="${C.cyan}" class="blink"/>
    <text x="${W - 60}" y="58" text-anchor="end" class="mono" font-size="13" fill="${C.muted}" letter-spacing="2">36.75&#176;N  5.06&#176;E  BÉJAÏA, ALGERIA</text>

    <g class="name sans">
      <text x="56" y="168" font-size="96" font-weight="800" letter-spacing="2" textLength="1088" lengthAdjust="spacingAndGlyphs">SLIMANE SAHNOUNE</text>
    </g>

    <g class="role">
      <text x="60" y="218" class="mono" font-size="21" fill="${C.amber}" letter-spacing=".5">Full-Stack Developer <tspan fill="${C.dim}">/</tspan> System Design <tspan fill="${C.dim}">/</tspan> AI Integration</text>
      <rect class="typer" x="58" y="194" width="760" height="34" fill="${C.bg}"/>
    </g>
    <text x="60" y="256" class="sans fadeIn" font-size="17" fill="${C.muted}">Control Engineering student (L2 Automatique), Abderrahmane Mira University of Béjaïa</text>

    <rect x="${scopeX}" y="${scopeY}" width="${scopeW}" height="${scopeH}" rx="10" fill="${C.panel}" stroke="${C.line}"/>
    <g opacity=".55">
      ${Array.from({ length: 17 }, (_, i) => `<path d="M${scopeX + 20 + i * 65} ${scopeY + 8}V${scopeY + scopeH - 10}" stroke="${C.grid}"/>`).join('')}
    </g>
    <path d="M${scopeX + 20} ${setY.toFixed(1)}H${scopeX + scopeW - 20}" stroke="${C.dim}" stroke-dasharray="4 6"/>
    <path class="trace" d="${step}" stroke="${C.cyan}" stroke-width="2.4" stroke-linecap="round" filter="url(#soft)"/>
    <text x="${scopeX + scopeW - 26}" y="${setY - 8}" text-anchor="end" class="mono" font-size="11" fill="${C.dim}">setpoint</text>
    <text x="${scopeX + 26}" y="${scopeY + scopeH - 14}" class="mono" font-size="11" fill="${C.muted}">y(t)  step response  <tspan fill="${C.amber}">zeta = 0.32</tspan>   overshoot, settle, ship.</text>
    <rect class="scan" x="${scopeX + 20}" y="${scopeY + 6}" width="2" height="${scopeH - 14}" fill="${C.amber}" opacity=".7"/>
  `;
  save('hero.svg', frame(W, H, inner, {
    defs: `
      <radialGradient id="gA"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".22"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gB"><stop offset="0" stop-color="${C.amber}" stop-opacity=".14"/><stop offset="1" stop-color="${C.amber}" stop-opacity="0"/></radialGradient>
      <linearGradient id="nameFill" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#DDE6EF"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
      <filter id="soft" x="-5%" y="-30%" width="110%" height="160%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
    style: `
      .name text{fill:url(#nameFill);stroke:${C.cyan};stroke-width:0;
        animation:draw 2.2s cubic-bezier(.6,.05,.3,1) both, fill 1s ease 1.8s both}
      @keyframes draw{from{stroke-dasharray:1400;stroke-dashoffset:1400}to{stroke-dasharray:1400;stroke-dashoffset:0}}
      @keyframes fill{from{fill-opacity:0;stroke-width:1.2}to{fill-opacity:1;stroke-width:0}}
      .typer{opacity:0;animation:type 2.4s steps(52, jump-start) 2.1s both}
      @keyframes type{from{transform:none;opacity:1}99.9%{opacity:1}to{transform:translateX(780px);opacity:0}}
      .fadeIn{animation:fadein 1s ease 4.4s both}
      @keyframes fadein{from{opacity:0}}
      .trace{animation:trace 6s ease-in-out 1s infinite both}
      @keyframes trace{0%{stroke-dasharray:2000;stroke-dashoffset:2000}55%{stroke-dasharray:2000;stroke-dashoffset:0}85%{stroke-dasharray:2000;stroke-dashoffset:0;opacity:1}100%{stroke-dasharray:2000;stroke-dashoffset:0;opacity:0}}
      .scan{animation:scan 6s ease-in-out 1s infinite}
      @keyframes scan{0%{transform:translateX(0);opacity:.8}55%{transform:translateX(1040px);opacity:.8}56%,100%{opacity:0;transform:translateX(1040px)}}
      .blink{animation:blink 1.4s steps(2) infinite}
      @keyframes blink{50%{opacity:0}}
      .glowA{animation:breathe 7s ease-in-out infinite}
      .glowB{animation:breathe 9s ease-in-out infinite reverse}
      @keyframes breathe{50%{opacity:.45}}`,
  }));
}

// ================================================================ SECTION HEADERS
const sections = [
  ['01', 'PROFILE', 'who is behind the commits'],
  ['02', 'RECOGNITION', 'national hackathon'],
  ['03', 'SELECTED WORK', 'shipped and in use'],
  ['04', 'OPEN SOURCE', 'merged and in review upstream'],
  ['05', 'SYSTEM DESIGN', 'components added only when something breaks'],
  ['06', 'AI ENGINEERING', 'models wired into real products'],
  ['07', 'TECH STACK', 'what I actually used in my projects'],
  ['08', 'MORE BUILDS', 'side projects, scripts and hackathons'],
];
for (const [n, title, sub] of sections) {
  const W = 1200, H = 78;
  const titleW = title.length * 19.5;
  const lineStart = 120 + titleW + 30;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
  <style>
    .mono{font-family:${MONO}}
    .ln{animation:ln 1.6s cubic-bezier(.6,.05,.3,1) .2s both}
    @keyframes ln{from{stroke-dasharray:${W};stroke-dashoffset:${W}}to{stroke-dasharray:${W};stroke-dashoffset:0}}
    .dot{animation:run 5s ease-in-out infinite}
    @keyframes run{0%{transform:translateX(0);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateX(${W - 40 - lineStart}px);opacity:0}}
  </style>
  <text x="20" y="44" class="mono" font-size="15" fill="${C.amber}" letter-spacing="2">${n}</text>
  <path d="M58 30V50" stroke="${C.dim}" stroke-width="1.5"/>
  <text x="76" y="46" class="mono" font-size="28" font-weight="700" fill="${C.cyan}" letter-spacing="3">${esc(title)}</text>
  <path class="ln" d="M${lineStart} 37H${W - 20}" stroke="${C.line}" stroke-width="1.5"/>
  <circle class="dot" cx="${lineStart}" cy="37" r="3.5" fill="${C.cyan}"/>
  <text x="${W - 20}" y="66" text-anchor="end" class="mono" font-size="12" fill="${C.dim}" letter-spacing="1">// ${esc(sub)}</text>
</svg>`;
  save(`section-${n}.svg`, svg);
}

// ================================================================ TERMINAL / PROFILE
{
  const W = 1200, H = 410;
  const lines = [
    ['$', 'whoami', C.cyan],
    [' ', 'Slimane Sahnoune. Full-stack developer and control-engineering student in Béjaïa.', C.text],
    ['$', 'cat focus.txt', C.cyan],
    [' ', 'system design  |  AI workflows and LLM integration  |  product-grade interfaces', C.text],
    ['$', 'ls ./shipped', C.cyan],
    [' ', 'profscanner/  odej-kiosk/  wladz/  sadeem/  html-to-docx (mathml)/  salat/', C.amber],
    ['$', 'cat principles.txt', C.cyan],
    [' ', 'start simple, measure, add a component only when something actually breaks', C.text],
    ['$', 'echo $STATUS', C.cyan],
    [' ', 'open to internships, freelance missions and ambitious teams', C.green],
  ];
  let t = 0.6;
  const rows = lines.map(([p, s, col], i) => {
    const y = 108 + i * 28;
    const chars = s.length + 2;
    const dur = p === '$' ? Math.max(0.5, chars * 0.045) : 0.35;
    const delay = t;
    t += dur + (p === '$' ? 0.25 : 0.35);
    const w = chars * 9.2 + 40;
    return `
      <text x="52" y="${y}" class="mono" font-size="15.5" fill="${p === '$' ? C.amber : C.dim}">${p === '$' ? '$' : '&gt;'}</text>
      <text x="76" y="${y}" class="mono" font-size="15.5" fill="${col}">${esc(s)}</text>
      <rect x="70" y="${y - 19}" width="${w}" height="26" fill="${C.panel}" style="${p === '$' ? `transform:translateX(${W}px);animation:reveal ${dur.toFixed(2)}s steps(${chars}, jump-start) ${delay.toFixed(2)}s both` : `opacity:0;animation:hide .01s linear ${(delay + dur).toFixed(2)}s both`}"/>
      <rect x="20" y="${y - 19}" width="50" height="26" fill="${C.panel}" style="opacity:0;animation:hide .01s linear ${delay.toFixed(2)}s both"/>`;
  }).join('');
  const cursorY = 108 + lines.length * 28;
  const inner = `
    <rect width="${W}" height="${H}" fill="${C.panel}"/>
    <rect width="${W}" height="46" fill="${C.panel2}"/>
    <path d="M0 46H${W}" stroke="${C.line}"/>
    <circle cx="28" cy="23" r="6" fill="${C.coral}"/>
    <circle cx="50" cy="23" r="6" fill="${C.amber}"/>
    <circle cx="72" cy="23" r="6" fill="${C.green}"/>
    <text x="${W / 2}" y="28" text-anchor="middle" class="mono" font-size="13" fill="${C.muted}">slimane@bejaia: ~/profile</text>
    <text x="${W - 24}" y="28" text-anchor="end" class="mono" font-size="12" fill="${C.dim}">zsh  120x24</text>
    ${rows}
    <text x="52" y="${cursorY}" class="mono" font-size="15.5" fill="${C.amber}" style="animation:show .01s linear ${t.toFixed(2)}s both">$</text>
    <g style="animation:show .01s linear ${t.toFixed(2)}s both"><rect x="76" y="${cursorY - 15}" width="10" height="19" fill="${C.cyan}" class="cur"/></g>
  `;
  save('terminal.svg', frame(W, H, inner, {
    bg: C.panel,
    style: `
      @keyframes reveal{from{transform:none}to{transform:translateX(${W}px)}}
      @keyframes hide{from{opacity:1}to{opacity:0}}
      @keyframes show{from{opacity:0}to{opacity:1}}
      .cur{animation:cur 1.1s steps(2) infinite}
      @keyframes cur{0%{opacity:1}50%{opacity:0}}`,
  }));
}

// ================================================================ AWARD
{
  const W = 1200, H = 220;
  const inner = `
    <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".6"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#awardGlow)"/>
    <rect x="28" y="28" width="${W - 56}" height="${H - 56}" rx="12" stroke="url(#border)" stroke-width="1.5"/>
    <g transform="translate(88 110)">
      <circle r="58" stroke="${C.amber}" stroke-opacity=".25" stroke-width="1.5"/>
      <circle r="58" stroke="${C.amber}" stroke-width="2.5" stroke-dasharray="40 325" class="orbit"/>
      <circle r="44" fill="${C.panel}" stroke="${C.amber}" stroke-opacity=".6"/>
      <text y="14" text-anchor="middle" class="sans" font-size="40" font-weight="800" fill="url(#gold)">2</text>
      <text x="17" y="-8" class="sans" font-size="15" font-weight="700" fill="${C.amber}">ND</text>
    </g>
    <text x="180" y="80" class="mono" font-size="13" fill="${C.amber}" letter-spacing="3">SECOND PLACE  /  NATIONAL LEVEL</text>
    <text x="180" y="122" class="sans" font-size="31" font-weight="700" fill="url(#shine)">National Hackathon for Innovation and Digital Design</text>
    <text x="180" y="156" class="sans" font-size="16" fill="${C.muted}">Mostaganem, Algeria  <tspan fill="${C.dim}">|</tspan>  Project: <tspan fill="${C.text}">Sadeem</tspan>, a gamified learning platform for Algerian youth</text>
    <text x="${W - 60}" y="186" text-anchor="end" class="sans" font-size="15" fill="${C.dim}">&#1575;&#1604;&#1607;&#1575;&#1603;&#1575;&#1579;&#1608;&#1606; &#1575;&#1604;&#1608;&#1591;&#1606;&#1610; &#1604;&#1604;&#1575;&#1576;&#1578;&#1603;&#1575;&#1585; &#1608;&#1575;&#1604;&#1578;&#1589;&#1605;&#1610;&#1605; &#1575;&#1604;&#1585;&#1602;&#1605;&#1610;</text>
  `;
  save('award.svg', frame(W, H, inner, {
    defs: `
      <radialGradient id="awardGlow" cx=".08" cy=".5" r=".6"><stop offset="0" stop-color="${C.amber}" stop-opacity=".16"/><stop offset="1" stop-color="${C.amber}" stop-opacity="0"/></radialGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE29A"/><stop offset="1" stop-color="${C.amber}"/></linearGradient>
      <linearGradient id="border" x1="0" x2="1"><stop offset="0" stop-color="${C.amber}"/><stop offset=".5" stop-color="${C.line}"/><stop offset="1" stop-color="${C.cyan}" stop-opacity=".6"/></linearGradient>
      <linearGradient id="shine" x1="0" x2="1" gradientUnits="objectBoundingBox">
        <stop offset="0" stop-color="${C.text}"/><stop offset=".45" stop-color="${C.text}"/>
        <stop offset=".5" stop-color="#FFE29A"/><stop offset=".55" stop-color="${C.text}"/><stop offset="1" stop-color="${C.text}"/>
        <animate attributeName="x1" values="-1;1" dur="4.5s" repeatCount="indefinite"/>
        <animate attributeName="x2" values="0;2" dur="4.5s" repeatCount="indefinite"/>
      </linearGradient>`,
    style: `
      .orbit{transform-origin:0 0;animation:spin 6s linear infinite}
      @keyframes spin{to{transform:rotate(360deg)}}`,
  }));
}

// ================================================================ PROJECT CARDS
const chipRow = (x, y, items, color = C.muted) => {
  let cx = x;
  return items.map((s) => {
    const w = s.length * 7.3 + 20;
    const out = `<rect x="${cx}" y="${y}" width="${w}" height="24" rx="12" fill="${C.panel2}" stroke="${C.line}"/>
      <text x="${cx + w / 2}" y="${y + 16}" text-anchor="middle" class="mono" font-size="12" fill="${color}">${esc(s)}</text>`;
    cx += w + 8;
    return out;
  }).join('');
};

const card = (file, { kicker, title, lines, chips, accent, visual, defs = '', style = '' }) => {
  const W = 600, H = 400;
  const inner = `
    <rect width="${W}" height="210" fill="${C.panel}"/>
    <rect width="${W}" height="210" fill="url(#grid)" opacity=".7"/>
    ${visual}
    <path d="M0 210H${W}" stroke="${C.line}"/>
    <rect x="0" y="209" width="${W}" height="2" fill="${accent}" class="bar"/>
    <text x="28" y="248" class="mono" font-size="12" fill="${accent}" letter-spacing="2.5">${esc(kicker)}</text>
    <text x="28" y="282" class="sans" font-size="27" font-weight="700" fill="${C.text}">${esc(title)}</text>
    ${lines.map((l, i) => `<text x="28" y="${310 + i * 21}" class="sans" font-size="14.5" fill="${C.muted}">${esc(l)}</text>`).join('')}
    ${chipRow(28, 356, chips)}
  `;
  save(file, frame(W, H, inner, {
    defs,
    style: `.bar{transform-origin:0 0;animation:bar 1.4s cubic-bezier(.6,.05,.3,1) .3s both}
      @keyframes bar{from{transform:scaleX(0)}} ${style}`,
  }));
};

// ProfScanner: handwriting -> scan beam -> typed Word doc
card('card-profscanner.svg', {
  kicker: 'AI  /  DOCUMENTS  /  PWA',
  title: 'ProfScanner',
  lines: ['Photo of a handwritten exam in, editable .docx out, with', 'native Word equations. Arabic, French and English, any AI model.'],
  chips: ['React', 'TypeScript', 'Vision LLM', 'MathML>OMML', 'PWA'],
  accent: C.cyan,
  visual: `
    <g transform="translate(60 28)">
      <rect width="190" height="154" rx="6" fill="#F4EFE4" transform="rotate(-3 95 77)"/>
      <g stroke="#2B3A67" stroke-width="2.2" stroke-linecap="round" fill="none" transform="rotate(-3 95 77)">
        <path d="M18 30c10-6 18 4 26-2s14-5 22 0 16-4 26 1 12-3 20 0"/>
        <path d="M18 56c12-5 20 3 30-1s18-4 28 1"/>
        <path d="M60 84h40M66 102c6-8 12 8 18 0s10 6 14 0"/>
        <path d="M54 92h52"/>
        <path d="M18 128c10-4 20 3 30-1s16-3 26 1 14-4 24 0"/>
      </g>
      <rect class="beam" x="-6" y="-8" width="202" height="6" rx="3" fill="${C.cyan}" opacity=".85" filter="url(#glow)"/>
    </g>
    <g class="flow">
      <path d="M272 105H328" stroke="${C.cyan}" stroke-width="2" stroke-dasharray="5 6"/>
      <path d="M322 98l9 7-9 7" stroke="${C.cyan}" stroke-width="2" fill="none"/>
    </g>
    <g transform="translate(350 26)">
      <rect width="196" height="158" rx="6" fill="#FFFFFF"/>
      <rect width="196" height="20" rx="6" fill="#2B579A"/>
      <rect y="12" width="196" height="8" fill="#2B579A"/>
      <text x="10" y="14" class="mono" font-size="9" fill="#FFFFFF">exam_corrige.docx</text>
      <g class="typed">
        <rect x="16" y="34" width="120" height="7" rx="3" fill="#1F2937"/>
        <rect x="16" y="50" width="160" height="5" rx="2.5" fill="#9CA3AF"/>
        <rect x="16" y="62" width="140" height="5" rx="2.5" fill="#9CA3AF"/>
        <text x="98" y="98" text-anchor="middle" font-family="Cambria Math,'Times New Roman',serif" font-style="italic" font-size="17" fill="#111827">x = </text>
        <text x="138" y="88" text-anchor="middle" font-family="Cambria Math,'Times New Roman',serif" font-style="italic" font-size="14" fill="#111827">-b + &#8730;&#916;</text>
        <path d="M112 94h52" stroke="#111827" stroke-width="1.3"/>
        <text x="138" y="110" text-anchor="middle" font-family="Cambria Math,'Times New Roman',serif" font-style="italic" font-size="14" fill="#111827">2a</text>
        <rect x="16" y="126" width="164" height="5" rx="2.5" fill="#9CA3AF"/>
        <rect x="16" y="138" width="110" height="5" rx="2.5" fill="#9CA3AF"/>
      </g>
    </g>`,
  defs: `<filter id="glow" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
  style: `
    .beam{animation:beam 3.2s ease-in-out infinite}
    @keyframes beam{0%{transform:translateY(0);opacity:0}8%{opacity:.9}50%{transform:translateY(166px);opacity:.9}58%,100%{transform:translateY(166px);opacity:0}}
    .flow path:first-child{animation:dash 1s linear infinite}
    @keyframes dash{to{stroke-dashoffset:-11}}
    .typed{animation:typed 3.2s ease-in-out infinite}
    @keyframes typed{0%,40%{opacity:.15}60%,92%{opacity:1}100%{opacity:.15}}`,
});

// ODEJ Kiosk: topographic map with pulsing establishments
{
  const contours = [];
  const cx = 300, cy = 118;
  for (let k = 0; k < 7; k++) {
    const r = 22 + k * 15;
    const pts = [];
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const wob = 1 + 0.16 * Math.sin(3 * a + k * 0.7) + 0.08 * Math.cos(5 * a - k);
      pts.push([cx + Math.cos(a) * r * 1.9 * wob, cy + Math.sin(a) * r * 0.78 * wob]);
    }
    contours.push(`<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z" stroke="${C.green}" stroke-opacity="${(0.55 - k * 0.06).toFixed(2)}" stroke-width="1.2"/>`);
  }
  const pins = [[150, 70], [210, 140], [260, 90], [330, 150], [380, 82], [440, 128], [300, 118], [175, 120], [470, 70], [230, 60], [405, 170], [120, 160]];
  const pinSvg = pins.map(([x, y], i) => `
    <circle cx="${x}" cy="${y}" r="9" fill="${C.green}" opacity="0" class="ping" style="animation-delay:${(i * 0.31).toFixed(2)}s;transform-origin:${x}px ${y}px"/>
    <circle cx="${x}" cy="${y}" r="3.6" fill="${i === 6 ? C.amber : C.green}"/>`).join('');
  card('card-odej.svg', {
    kicker: 'GEOSPATIAL  /  KIOSK  /  BILINGUAL',
    title: 'ODEJ Kiosk',
    lines: ['Touch-screen kiosk deployed at a national expo in Algiers: a 3D', 'map of Béjaïa and its 67 youth establishments, in AR and EN.'],
    chips: ['React 19', 'MapLibre GL', 'Remotion', 'Vitest', 'CI/CD'],
    accent: C.green,
    visual: `
      <path d="M0 192 C 90 176, 160 196, 250 182 S 420 170, 600 186" stroke="${C.cyan}" stroke-opacity=".5" stroke-width="1.5"/>
      <text x="586" y="202" text-anchor="end" class="mono" font-size="10" fill="${C.dim}">MEDITERRANEAN SEA</text>
      <g class="tilt">${contours.join('')}</g>
      ${pinSvg}
      <text x="24" y="30" class="mono" font-size="11" fill="${C.muted}">BÉJAÏA  /  67 SITES  /  7 CATEGORIES</text>`,
    style: `
      .ping{animation:ping 3.7s ease-out infinite}
      @keyframes ping{0%{opacity:.7;transform:scale(.4)}70%,100%{opacity:0;transform:scale(2.4)}}
      .tilt{transform-origin:300px 118px;animation:tilt 9s ease-in-out infinite}
      @keyframes tilt{50%{transform:scale(1.04) translateY(-3px)}}`,
  });
}

// Wladz: game roadmap lighting up node by node
{
  const nodes = [[70, 150], [150, 92], [240, 140], [320, 76], [400, 128], [470, 66], [540, 110]];
  const path = 'M' + nodes.map(([x, y]) => `${x} ${y}`).join('L');
  const n = nodes.length;
  const nodeSvg = nodes.map(([x, y], i) => `
    <circle cx="${x}" cy="${y}" r="17" fill="${C.panel2}" stroke="${C.line}" stroke-width="2"/>
    <circle cx="${x}" cy="${y}" r="17" fill="none" stroke="${C.violet}" stroke-width="2.5" class="lit" style="animation-delay:${(i * 0.5).toFixed(1)}s"/>
    <text x="${x}" y="${y + 4.5}" text-anchor="middle" class="mono" font-size="12" fill="${C.text}">${i + 1}</text>`).join('');
  card('card-wladz.svg', {
    kicker: 'EDTECH  /  GAMES HUB  /  NEXT.JS',
    title: 'Wladz',
    lines: ['Hub of educational games for Algerian kids aged 7 to 15:', 'prevention, civics, history. Built for the Ministry of Youth.'],
    chips: ['Next.js', 'Three.js', 'GSAP', 'SQLite auth', 'Tailwind'],
    accent: C.violet,
    visual: `
      <path d="${path}" stroke="${C.line}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
      <path d="${path}" stroke="${C.violet}" stroke-width="3" stroke-linecap="round" class="road"/>
      ${nodeSvg}
      <text x="24" y="30" class="mono" font-size="11" fill="${C.muted}">ROADMAP  /  LEVELS  /  LEADERBOARD</text>
      <rect x="380" y="172" width="196" height="10" rx="5" fill="${C.panel2}" stroke="${C.line}"/>
      <rect x="380" y="172" width="196" height="10" rx="5" fill="${C.violet}" class="xp"/>
      <text x="372" y="181" text-anchor="end" class="mono" font-size="10" fill="${C.muted}">XP</text>`,
    style: `
      .road{animation:road ${n * 0.5 + 1.5}s ease-in-out infinite}
      @keyframes road{0%{stroke-dasharray:700;stroke-dashoffset:700}70%,100%{stroke-dasharray:700;stroke-dashoffset:0}}
      .lit{animation:lit ${n * 0.5 + 1.5}s ease-in-out infinite both}
      @keyframes lit{0%{opacity:0}8%,80%{opacity:1}100%{opacity:0}}
      .xp{transform-origin:380px 0;animation:xp ${n * 0.5 + 1.5}s ease-in-out infinite}
      @keyframes xp{0%{transform:scaleX(0)}70%,100%{transform:scaleX(1)}}`,
  });
}

// Sadeem: planets orbiting, gamified learning
card('card-sadeem.svg', {
  kicker: 'GAMIFIED LEARNING  /  2ND PLACE NATIONAL',
  title: 'Sadeem',
  lines: ['Arabic-first learning platform for ages 5 to 17: XP, streaks,', 'hearts, 6 mini-game types, student, teacher and parent spaces.'],
  chips: ['React', 'R3F', 'Express', 'MongoDB', 'JWT'],
  accent: C.amber,
  visual: `
    <g transform="translate(300 122)">
      <ellipse rx="150" ry="44" stroke="${C.line}" stroke-width="1.3"/>
      <ellipse rx="230" ry="62" stroke="${C.line}" stroke-width="1.1" stroke-dasharray="3 6"/>
      <circle r="30" fill="url(#planet)"/>
      <ellipse rx="44" ry="10" stroke="${C.amber}" stroke-opacity=".7" stroke-width="2" transform="rotate(-14)"/>
      <circle r="9" fill="${C.cyan}"><animateMotion dur="7s" repeatCount="indefinite" path="M150 0A150 44 0 1 1 -150 0A150 44 0 1 1 150 0"/></circle>
      <circle r="7" fill="${C.violet}"><animateMotion dur="13s" repeatCount="indefinite" path="M-230 0A230 62 0 1 0 230 0A230 62 0 1 0 -230 0"/></circle>
      <g class="orbC"><circle cx="0" cy="44" r="5" fill="${C.coral}"/></g>
    </g>
    <text x="24" y="30" class="mono" font-size="11" fill="${C.muted}">STREAK 12  /  XP 2,480  /  HEARTS 5</text>
    ${Array.from({ length: 22 }, (_, i) => {
      const x = (i * 97) % 600, y = 20 + ((i * 53) % 180);
      return `<circle cx="${x}" cy="${y}" r="1.2" fill="${C.text}" class="star" style="animation-delay:${(i * 0.23).toFixed(2)}s"/>`;
    }).join('')}`,
  defs: `<radialGradient id="planet" cx=".35" cy=".35"><stop offset="0" stop-color="#FFE29A"/><stop offset="1" stop-color="#C77D12"/></radialGradient>`,
  style: `
    .orbC{animation:pulse 2.4s ease-in-out infinite}
    @keyframes pulse{50%{opacity:.3}}
    .star{animation:pulse 3s ease-in-out infinite}`,
});

// ================================================================ SYSTEM DESIGN
{
  const W = 1200, H = 640;
  const box = (x, y, w, h, label, sub, color, cls = '') => `
    <g class="${cls}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${C.panel}" stroke="${color}" stroke-opacity=".75" stroke-width="1.5"/>
      <text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" class="sans" font-size="16" font-weight="700" fill="${C.text}">${esc(label)}</text>
      <text x="${x + w / 2}" y="${y + h / 2 + 17}" text-anchor="middle" class="mono" font-size="11" fill="${C.muted}">${esc(sub)}</text>
    </g>`;
  const P = {
    in: 'M210 245H290',
    a: 'M440 245C475 245 475 145 520 145',
    b: 'M440 245C475 245 475 345 520 345',
    ac: 'M680 145H770',
    bd: 'M680 345H770',
    ad: 'M680 160C720 160 730 330 770 330',
    bc: 'M680 330C720 330 730 160 770 160',
    rep: 'M930 345H1010',
    bak: 'M930 320C970 320 960 160 1010 160',
  };
  const flow = (d, color, dur, delay = 0, r = 4.5) =>
    `<circle r="${r}" fill="${color}" opacity="0">
      <animateMotion dur="${dur}s" begin="${delay}s" repeatCount="indefinite" path="${d}"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="${dur}s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  const failure = (x, n, title, fix, trade, color) => `
    <g transform="translate(${x} 470)">
      <rect width="360" height="138" rx="12" fill="${C.panel}" stroke="${C.line}"/>
      <rect width="4" height="138" rx="2" fill="${color}"/>
      <text x="24" y="32" class="mono" font-size="12" fill="${color}" letter-spacing="2">FAILURE ${n}</text>
      <text x="24" y="60" class="sans" font-size="18" font-weight="700" fill="${C.text}">${esc(title)}</text>
      <text x="24" y="88" class="sans" font-size="14" fill="${C.muted}"><tspan fill="${C.cyan}">fix</tspan>   ${esc(fix)}</text>
      <text x="24" y="114" class="sans" font-size="14" fill="${C.muted}"><tspan fill="${C.amber}">cost</tspan>  ${esc(trade)}</text>
    </g>`;
  const inner = `
    <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".8"/>
    ${cropMarks(W, H)}
    <text x="48" y="64" class="mono" font-size="13" fill="${C.amber}" letter-spacing="2">EVOLUTIONARY ARCHITECTURE</text>
    <text x="48" y="96" class="sans" font-size="24" font-weight="700" fill="${C.text}">Start on one $2 server. Add a component only when something breaks.</text>
    <text x="${W - 48}" y="64" text-anchor="end" class="mono" font-size="12" fill="${C.dim}">live traffic simulation</text>

    <g stroke-width="1.6">
      <path d="${P.in}" stroke="${C.line}"/>
      <path d="${P.a}" stroke="${C.line}"/><path d="${P.b}" stroke="${C.line}"/>
      <path d="${P.ac}" stroke="${C.line}"/><path d="${P.bd}" stroke="${C.line}"/>
      <path d="${P.ad}" stroke="${C.line}" stroke-dasharray="3 5"/><path d="${P.bc}" stroke="${C.line}" stroke-dasharray="3 5"/>
      <path d="${P.rep}" stroke="${C.violet}" stroke-opacity=".6" stroke-dasharray="6 5" class="march"/>
      <path d="${P.bak}" stroke="${C.coral}" stroke-opacity=".6" stroke-dasharray="6 5" class="march"/>
    </g>

    ${box(60, 210, 150, 70, 'Users', 'web / mobile', C.muted)}
    ${box(290, 210, 150, 70, 'Load Balancer', 'round robin + health', C.cyan, 'lb')}
    ${box(520, 110, 160, 70, 'App Server A', 'stateless', C.cyan)}
    ${box(520, 310, 160, 70, 'App Server B', 'stateless', C.cyan)}
    ${box(770, 110, 160, 70, 'Cache', 'hot reads in RAM', C.amber)}
    ${box(770, 310, 160, 70, 'Database', 'primary', C.green)}
    ${box(1010, 310, 150, 70, 'Replica', 'async, read-only', C.violet)}
    ${box(1010, 125, 150, 70, 'Backups', 'daily snapshots', C.coral)}
    <text x="970" y="365" text-anchor="middle" class="mono" font-size="10" fill="${C.dim}">replicate</text>
    <rect x="290" y="210" width="150" height="70" rx="10" stroke="${C.cyan}" stroke-width="2" class="hb"/>

    ${flow(P.in, C.text, 1.6, 0)}${flow(P.in, C.text, 1.6, 0.8)}
    ${flow(P.a, C.cyan, 1.6, 0.4)}${flow(P.b, C.cyan, 1.6, 1.2)}
    ${flow(P.ac, C.amber, 1.2, 0.9)}${flow(P.bc, C.amber, 1.8, 1.7)}
    ${flow(P.bd, C.green, 1.4, 1.5)}${flow(P.ad, C.green, 2, 0.6)}
    ${flow(P.rep, C.violet, 1.8, 0.3, 3.5)}${flow(P.bak, C.coral, 3.5, 1, 3.5)}

    <g class="mono" font-size="11">
      <rect x="48" y="412" width="12" height="3" fill="${C.amber}"/><text x="68" y="417" fill="${C.muted}">cache hit</text>
      <rect x="160" y="412" width="12" height="3" fill="${C.green}"/><text x="180" y="417" fill="${C.muted}">cache miss, read from DB</text>
      <rect x="380" y="412" width="12" height="3" fill="${C.violet}"/><text x="400" y="417" fill="${C.muted}">replication</text>
      <rect x="510" y="412" width="12" height="3" fill="${C.coral}"/><text x="530" y="417" fill="${C.muted}">backup stream</text>
    </g>
    <path d="M48 440H${W - 48}" stroke="${C.line}"/>

    ${failure(48, '01', 'CPU and RAM saturated', 'second server behind a load balancer', 'servers must stay stateless', C.cyan)}
    ${failure(420, '02', 'Database overloaded', 'cache the popular data in memory', 'invalidation and stale reads', C.amber)}
    ${failure(792, '03', 'The machine dies', 'replication and backups, no single point', 'replica lag, failover logic', C.coral)}
  `;
  save('system-design.svg', frame(W, H, inner, {
    style: `
      .march{animation:march 1.2s linear infinite}
      @keyframes march{to{stroke-dashoffset:-22}}
      .hb{animation:hb 2s ease-out infinite;transform-origin:365px 245px}
      @keyframes hb{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(1.18,1.4)}}`,
  }));
}

// ================================================================ AI PIPELINE
{
  const W = 1200, H = 300;
  const stages = [
    ['01', 'Capture', 'photo / scan / PDF', C.muted],
    ['02', 'Vision LLM', 'any provider, your key', C.cyan],
    ['03', 'Structure', 'HTML + MathML + RTL', C.violet],
    ['04', 'Convert', 'MathML to OMML', C.amber],
    ['05', 'Deliver', '.docx, native equations', C.green],
  ];
  const sw = 196, gap = 30, x0 = 48;
  const st = stages.map(([n, t, s, col], i) => {
    const x = x0 + i * (sw + gap);
    return `
      <g class="st" style="animation-delay:${(i * 0.7).toFixed(1)}s">
        <rect x="${x}" y="110" width="${sw}" height="96" rx="12" fill="${C.panel}" stroke="${col}" stroke-opacity=".7" stroke-width="1.5"/>
        <text x="${x + 18}" y="138" class="mono" font-size="12" fill="${col}" letter-spacing="2">${n}</text>
        <text x="${x + 18}" y="167" class="sans" font-size="19" font-weight="700" fill="${C.text}">${esc(t)}</text>
        <text x="${x + 18}" y="190" class="mono" font-size="11.5" fill="${C.muted}">${esc(s)}</text>
      </g>`;
  }).join('');
  const lineY = 158;
  const pulse = `<circle r="5" fill="${C.cyan}" filter="url(#g2)">
      <animateMotion dur="3.5s" repeatCount="indefinite" path="M${x0} 222H${x0 + 5 * sw + 4 * gap}"/>
    </circle>`;
  const connectors = stages.slice(0, -1).map((_, i) => {
    const x = x0 + i * (sw + gap) + sw;
    return `<path d="M${x} ${lineY}H${x + gap}" stroke="${C.line}" stroke-width="2"/>`;
  }).join('');
  const providers = ['Gemini', 'Claude', 'NVIDIA NIM', 'Mistral', 'OpenRouter', 'Ollama (local)', 'any OpenAI-compatible API'];
  const inner = `
    <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".8"/>
    <text x="48" y="54" class="mono" font-size="13" fill="${C.amber}" letter-spacing="2">PIPELINE  /  PROFSCANNER</text>
    <text x="48" y="84" class="sans" font-size="21" font-weight="700" fill="${C.text}">Handwriting to an editable Word document, entirely in the browser.</text>
    ${connectors}
    <path d="M${x0} 222H${x0 + 5 * sw + 4 * gap}" stroke="${C.line}" stroke-dasharray="2 6"/>
    ${st}
    ${pulse}
    ${chipRow(48, 244, providers, C.cyan)}
  `;
  save('ai-pipeline.svg', frame(W, H, inner, {
    defs: `<filter id="g2" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
    style: `
      .st{animation:st 3.5s ease-in-out infinite}
      @keyframes st{0%,100%{opacity:.75}12%{opacity:1}}`,
  }));
}

// ================================================================ STACK
{
  const W = 1200;
  const groups = [
    ['LANGUAGES', C.cyan, ['TypeScript', 'JavaScript', 'Python', 'Rust', 'C', 'SQL', 'Bash', 'HTML / CSS', 'AutoLISP', 'Pascal']],
    ['FRONTEND', C.violet, ['React 19', 'Next.js', 'Vite', 'Tailwind CSS', 'Three.js', 'React Three Fiber', 'GSAP', 'Framer Motion', 'MapLibre GL', 'Remotion', 'Fabric.js', 'PWA', 'RTL / i18n']],
    ['BACKEND & DATA', C.green, ['Node.js', 'Express', 'REST APIs', 'JWT / sessions', 'MongoDB', 'Mongoose', 'MySQL', 'SQLite', 'Prisma', 'Firebase', 'Zod', 'Zustand']],
    ['AI & AUTOMATION', C.amber, ['LLM APIs', 'Vision OCR pipelines', 'Gemini', 'Claude', 'Claude Code', 'NVIDIA NIM', 'Mistral', 'OpenRouter', 'Ollama', 'Agentic workflows', 'Prompt engineering', 'Python automation']],
    ['DOCS & MEDIA', C.coral, ['OOXML / DOCX', 'MathML to OMML', 'Pandoc', 'JSZip', 'sharp', 'Cheerio']],
    ['INFRA & DELIVERY', C.cyan, ['Git / GitHub', 'GitHub Actions', 'Docker', 'Netlify', 'Vercel', 'Render', 'Cloudflare Pages', 'Vitest', 'ESLint / Prettier', 'Linux', 'systemd']],
    ['ENGINEERING', C.violet, ['System design', 'Load balancing', 'Caching', 'Replication', 'Control systems', 'Web security audits', 'Technical writing']],
  ];
  const labelW = 210, left = 48 + labelW, right = W - 48, rowH = 32;
  let y = 40, out = '', idx = 0;
  for (const [label, col, items] of groups) {
    const startY = y;
    let x = left, lines = 1;
    let chips = '';
    for (const s of items) {
      const w = s.length * 7.6 + 24;
      if (x + w > right) { x = left; y += rowH; lines++; }
      chips += `<g class="chip" style="animation-delay:${(idx++ * 0.04).toFixed(2)}s">
        <rect x="${x}" y="${y}" width="${w}" height="24" rx="6" fill="${C.panel2}" stroke="${col}" stroke-opacity=".35"/>
        <text x="${x + w / 2}" y="${y + 16.5}" text-anchor="middle" class="mono" font-size="12.5" fill="${C.text}">${esc(s)}</text></g>`;
      x += w + 8;
    }
    out += `
      <rect x="48" y="${startY + 4}" width="3" height="16" fill="${col}"/>
      <text x="62" y="${startY + 17}" class="mono" font-size="12.5" fill="${col}" letter-spacing="2">${esc(label)}</text>
      ${chips}`;
    y += rowH + 18;
    out += `<path d="M48 ${y - 12}H${right}" stroke="${C.grid}"/>`;
  }
  const H = y + 14;
  save('stack.svg', frame(W, H, `<rect width="${W}" height="${H}" fill="url(#grid)" opacity=".5"/>${out}`, {
    style: `
      .chip{animation:chip .5s ease both}
      @keyframes chip{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`,
  }));
}

// ================================================================ FOOTER
{
  const W = 1200, H = 170;
  const wave = (amp, k, phase) => {
    const pts = [];
    for (let x = 0; x <= W * 2; x += 8) {
      const env = 1;
      pts.push(`${x} ${(86 + amp * env * Math.sin(k * x + phase)).toFixed(1)}`);
    }
    return 'M' + pts.join('L');
  };
  const inner = `
    <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".6"/>
    <g class="w1"><path d="${wave(16, Math.PI*2/400, 0)}" stroke="${C.cyan}" stroke-opacity=".55" stroke-width="2"/></g>
    <g class="w2"><path d="${wave(10, Math.PI*2/600, 1.3)}" stroke="${C.amber}" stroke-opacity=".4" stroke-width="1.6"/></g>
    <g class="w3"><path d="${wave(6, Math.PI*2/300, 2.1)}" stroke="${C.violet}" stroke-opacity=".35" stroke-width="1.3"/></g>
    <rect x="370" y="58" width="460" height="56" rx="28" fill="${C.bg}" stroke="${C.line}"/>
    <text x="600" y="92" text-anchor="middle" class="mono" font-size="14" fill="${C.text}" letter-spacing="1.5">built in <tspan fill="${C.amber}">Béjaïa, Algeria</tspan>  /  simoosh</text>
    <text x="600" y="150" text-anchor="middle" class="mono" font-size="11" fill="${C.dim}" letter-spacing="2">IF IT WORKS, MEASURE IT. THEN MAKE IT SCALE.</text>
  `;
  save('footer.svg', frame(W, H, inner, {
    style: `
      .w1{animation:slide 9s linear infinite}
      .w2{animation:slide 14s linear infinite}
      .w3{animation:slide 6s linear infinite}
      @keyframes slide{to{transform:translateX(-1200px)}}`,
  }));
}

console.log('assets written to', OUT);
