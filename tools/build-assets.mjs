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

// ================================================================ HERO
// 8px grid, 64px outer padding, one left edge for every line of text.
{
  const W = 1200, H = 448, PAD = 64;
  const stats = [
    ['2nd', 'national hackathon', 'Mostaganem'],
    ['68', 'sites on a touch kiosk', 'national expo, Algiers'],
    ['4', 'upstream contributions', 'open source'],
    ['6+', 'AI providers', 'behind one adapter'],
  ];
  const colW = (W - 2 * PAD) / stats.length;
  const statSvg = stats.map(([v, l1, l2], i) => {
    const x = PAD + i * colW;
    return `
      <g class="stat" style="animation-delay:${(2.6 + i * 0.15).toFixed(2)}s">
        ${i ? `<path d="M${x} 328V404" stroke="${C.line}"/>` : ''}
        <text x="${x + (i ? 24 : 0)}" y="360" class="sans" font-size="34" font-weight="700" fill="${i === 0 ? C.amber : C.text}">${v}</text>
        <text x="${x + (i ? 24 : 0)}" y="382" class="mono" font-size="12.5" fill="${C.muted}" letter-spacing=".5">${esc(l1)}</text>
        <text x="${x + (i ? 24 : 0)}" y="402" class="mono" font-size="12.5" fill="${C.dim}" letter-spacing=".5">${esc(l2)}</text>
      </g>`;
  }).join('');
  const inner = `
    <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".9"/>
    <circle class="glowA" cx="1000" cy="40" r="280" fill="url(#gA)"/>
    <circle class="glowB" cx="120" cy="420" r="300" fill="url(#gB)"/>
    ${cropMarks(W, H)}

    <text x="${PAD}" y="64" class="mono" font-size="13" fill="${C.muted}" letter-spacing="2">SYS://PROFILE <tspan fill="${C.cyan}">ONLINE</tspan></text>
    <text x="${W - PAD}" y="64" text-anchor="end" class="mono" font-size="13" fill="${C.muted}" letter-spacing="2">36.75&#176;N  5.06&#176;E  BÉJAÏA, ALGERIA</text>

    <g class="name sans">
      <text x="${PAD - 4}" y="168" font-size="92" font-weight="800" letter-spacing="2" textLength="${W - 2 * PAD + 4}" lengthAdjust="spacingAndGlyphs">SLIMANE SAHNOUNE</text>
    </g>

    <g class="role">
      <text x="${PAD}" y="216" class="mono" font-size="21" fill="${C.amber}" letter-spacing=".5">Full-Stack Developer <tspan fill="${C.dim}">/</tspan> System Design <tspan fill="${C.dim}">/</tspan> AI Integration</text>
      <rect class="typer" x="${PAD - 2}" y="192" width="760" height="34" fill="${C.bg}"/>
    </g>
    <text x="${PAD}" y="248" class="sans fadeIn" font-size="17" fill="${C.muted}">Control Engineering student (L2 Automatique), Abderrahmane Mira University of Béjaïa</text>

    <path class="rule" d="M${PAD} 296H${W - PAD}" stroke="${C.line}"/>
    ${statSvg}
  `;
  save('hero.svg', frame(W, H, inner, {
    defs: `
      <radialGradient id="gA"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".2"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
      <radialGradient id="gB"><stop offset="0" stop-color="${C.amber}" stop-opacity=".12"/><stop offset="1" stop-color="${C.amber}" stop-opacity="0"/></radialGradient>
      <linearGradient id="nameFill" x1="0" x2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#DDE6EF"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>`,
    style: `
      .name text{fill:url(#nameFill);stroke:${C.cyan};stroke-width:0;
        animation:draw 2.2s cubic-bezier(.6,.05,.3,1) both, fill 1s ease 1.8s both}
      @keyframes draw{from{stroke-dasharray:1400;stroke-dashoffset:1400}to{stroke-dasharray:1400;stroke-dashoffset:0}}
      @keyframes fill{from{fill-opacity:0;stroke-width:1.2}to{fill-opacity:1;stroke-width:0}}
      .typer{opacity:0;animation:type 2.2s steps(52, jump-start) 1.9s both}
      @keyframes type{from{transform:none;opacity:1}99.9%{opacity:1}to{transform:translateX(780px);opacity:0}}
      .fadeIn{animation:fadein .8s ease 3.9s both}
      @keyframes fadein{from{opacity:0}}
      .rule{animation:rule 1.2s cubic-bezier(.6,.05,.3,1) 2.2s both}
      @keyframes rule{from{stroke-dasharray:1072;stroke-dashoffset:1072}to{stroke-dasharray:1072;stroke-dashoffset:0}}
      .stat{animation:stat .7s ease both}
      @keyframes stat{from{opacity:0;transform:translateY(8px)}}
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
  const W = 1200, H = 426;
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
    const y = 100 + i * 28;
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
  const cursorY = 100 + lines.length * 28;
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
  const W = 1200, H = 208;
  const inner = `
    <rect width="${W}" height="${H}" fill="url(#grid)" opacity=".6"/>
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#awardGlow)"/>
    <rect x="0" y="0" width="4" height="${H}" fill="${C.amber}"/>
    <g transform="translate(128 104)">
      <circle r="58" stroke="${C.amber}" stroke-opacity=".25" stroke-width="1.5"/>
      <circle r="58" stroke="${C.amber}" stroke-width="2.5" stroke-dasharray="40 325" class="orbit"/>
      <circle r="44" fill="${C.panel}" stroke="${C.amber}" stroke-opacity=".6"/>
      <text y="14" text-anchor="middle" class="sans" font-size="40" font-weight="800" fill="url(#gold)">2</text>
      <text x="17" y="-8" class="sans" font-size="15" font-weight="700" fill="${C.amber}">ND</text>
    </g>
    <text x="224" y="68" class="mono" font-size="13" fill="${C.amber}" letter-spacing="3">SECOND PLACE  /  NATIONAL LEVEL</text>
    <text x="224" y="112" class="sans" font-size="31" font-weight="700" fill="url(#shine)">National Hackathon for Innovation and Digital Design</text>
    <text x="224" y="146" class="sans" font-size="16" fill="${C.muted}">Mostaganem, Algeria  <tspan fill="${C.dim}">|</tspan>  Project: <tspan fill="${C.text}">Sadeem</tspan>, a gamified learning platform for Algerian youth</text>
    <text x="${W - 64}" y="68" text-anchor="end" class="sans" font-size="15" fill="${C.muted}">&#1575;&#1604;&#1607;&#1575;&#1603;&#1575;&#1579;&#1608;&#1606; &#1575;&#1604;&#1608;&#1591;&#1606;&#1610; &#1604;&#1604;&#1575;&#1576;&#1578;&#1603;&#1575;&#1585; &#1608;&#1575;&#1604;&#1578;&#1589;&#1605;&#1610;&#1605; &#1575;&#1604;&#1585;&#1602;&#1605;&#1610;</text>
  `;
  save('award.svg', frame(W, H, inner, {
    defs: `
      <radialGradient id="awardGlow" cx=".1" cy=".5" r=".55"><stop offset="0" stop-color="${C.amber}" stop-opacity=".16"/><stop offset="1" stop-color="${C.amber}" stop-opacity="0"/></radialGradient>
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
