<div align="center">

<img src="assets/hero.svg" alt="Slimane Sahnoune: full-stack developer, system design, AI integration" width="100%">

<br>

<a href="https://profscanner.netlify.app"><img src="https://img.shields.io/badge/LIVE-ProfScanner-0A0E14?style=for-the-badge&labelColor=5EEAD4&color=0F141C" alt="ProfScanner live"></a> <a href="https://odej-bejaia.netlify.app"><img src="https://img.shields.io/badge/LIVE-ODEJ%20Kiosk-0A0E14?style=for-the-badge&labelColor=7EE787&color=0F141C" alt="ODEJ Kiosk live"></a> <img src="https://img.shields.io/badge/BASED%20IN-B%C3%A9ja%C3%AFa%2C%20Algeria-0A0E14?style=for-the-badge&labelColor=F5B841&color=0F141C" alt="Based in Béjaïa, Algeria"> <img src="https://img.shields.io/badge/STATUS-open%20to%20opportunities-0A0E14?style=for-the-badge&labelColor=A78BFA&color=0F141C" alt="Open to opportunities">

</div>

<br>

<img src="assets/section-01.svg" alt="01 Profile" width="100%">

<img src="assets/terminal.svg" alt="Terminal: whoami, focus, shipped projects, principles" width="100%">

I study **Control Engineering (L2 Automatique)** at Abderrahmane Mira University of Béjaïa and I build software that ships. Control theory taught me to think in feedback loops: measure, compare, correct. I apply the same loop to products: start with the simplest system that works, watch where it fails, then add exactly the component that fixes it.

I work across the whole stack, from interfaces in **React, Next.js and TypeScript** to **Node.js** APIs and databases, and I integrate **AI models** where they remove real work: vision OCR, structured generation, agent-driven development workflows. My code has run on a touch kiosk at a national expo, ships as an installable PWA, and is proposed upstream in open-source libraries.

<br>

<img src="assets/section-02.svg" alt="02 Recognition" width="100%">

<img src="assets/award.svg" alt="Second place, National Hackathon for Innovation and Digital Design, Mostaganem" width="100%">

<br>

<img src="assets/section-03.svg" alt="03 Selected work" width="100%">

<table>
<tr>
<td width="50%" valign="top">
<a href="https://github.com/simoosh/profscanner"><img src="assets/card-profscanner.svg" alt="ProfScanner" width="100%"></a>
<p>
<b>Creator.</b> A vision model reads the page, a custom generator rebuilds it as OOXML with real, clickable Word equations. Local-first: no server, no account, keys never leave the browser.
<br><br>
<a href="https://profscanner.netlify.app"><b>Live demo</b></a> &nbsp;/&nbsp; <a href="https://github.com/simoosh/profscanner">Repository</a> &nbsp;/&nbsp; <a href="https://github.com/simoosh/profscanner/releases">Releases</a>
</p>
</td>
<td width="50%" valign="top">
<a href="https://github.com/simoosh/ODEJ_KIOSK"><img src="assets/card-odej.svg" alt="ODEJ Kiosk" width="100%"></a>
<p>
<b>Lead developer.</b> Self-hosted 3D terrain, progressive fog, frosted-glass UI, Remotion intro, a media pipeline to a CDN and an offline pack for the kiosk. Delivered in eight CI-gated steps.
<br><br>
<a href="https://odej-bejaia.netlify.app"><b>Live site</b></a> &nbsp;/&nbsp; <a href="https://github.com/simoosh/ODEJ_KIOSK">Repository</a>
</p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<img src="assets/card-wladz.svg" alt="Wladz" width="100%">
<p>
<b>Full-stack developer.</b> A hub of mini-games (story-driven open world, history of the 58 wilayas, math, prevention) with accounts, roadmaps, points and leaderboards. Session auth on SQLite with hashed tokens.
</p>
</td>
<td width="50%" valign="top">
<img src="assets/card-sadeem.svg" alt="Sadeem" width="100%">
<p>
<b>Developer.</b> Born at a hackathon, awarded second place nationally. Server-side answer validation, role-based spaces, a reactive mascot and a full RTL interface.
</p>
</td>
</tr>
</table>

<br>

<img src="assets/section-04.svg" alt="04 Open source" width="100%">

| Repository | Contribution | Status |
|:--|:--|:--:|
| [**TurboDocx/html-to-docx**](https://github.com/TurboDocx/html-to-docx) | Exports MathML `<math>` elements as native Word equations (OMML) instead of images or raw text. | [In review](https://github.com/TurboDocx/html-to-docx/pull/271) |
| [**RyanTech00/claude-telemetry**](https://github.com/RyanTech00/claude-telemetry) | Tracks the reasoning effort of every request, per model and per machine, across the dashboard. | [In review](https://github.com/RyanTech00/claude-telemetry/pull/6) |
| [**linuxcoding-ADAM/Salat**](https://github.com/linuxcoding-ADAM/Salat) | Rust, Ratatui: prayer times and Adhan for the Linux terminal. Curated city data for the offline search. | [Merged](https://github.com/linuxcoding-ADAM/Salat/pull/2) |
| [**linuxcoding-ADAM/salat-website**](https://github.com/linuxcoding-ADAM/salat-website) | Landing page interactions: font-swap text effects, pixel state, hero layout, navigation hover. | [3 merged](https://github.com/linuxcoding-ADAM/salat-website/pulls?q=is%3Apr+author%3Asimoosh) |

<br>

<img src="assets/section-05.svg" alt="05 System design" width="100%">

<img src="assets/system-design.svg" alt="Evolutionary architecture: load balancer, stateless servers, cache, database, replica, backups" width="100%">

Every component has a reason to exist and a price to pay. I reason about systems the way they grow in production:

| Symptom | Component | What it costs |
|:--|:--|:--|
| One server saturates on CPU and RAM | **Horizontal scaling** behind a **load balancer** with health checks | Servers must be stateless, sessions move to a shared store |
| The database becomes the bottleneck | **In-memory cache** for hot, read-heavy data | Cache invalidation, stale reads, warm-up |
| A machine dies and takes the data with it | **Replication** and **backups**, no single point of failure | Replica lag, failover logic, restore drills |
| Static media slows every page | **CDN** in front of object storage (as on ODEJ Kiosk) | Cache busting, versioned asset URLs |

<br>

<img src="assets/section-06.svg" alt="06 AI engineering" width="100%">

<img src="assets/ai-pipeline.svg" alt="ProfScanner AI pipeline" width="100%">

- **Model-agnostic integration.** One adapter layer over OpenAI-compatible APIs: switch between Gemini, Claude, NVIDIA NIM, Mistral, OpenRouter or a local Ollama without touching the product.
- **Structured output you can trust.** Prompts that return constrained HTML and MathML, then deterministic code that validates and converts them. The model reads, the code decides.
- **Agentic development workflows.** Repositories set up for AI agents: written conventions, isolated worktrees per task, step-by-step pull requests gated by CI and human review.
- **Automation where it pays.** From a Python file-watcher that auto-saves AutoCAD 2007 drawings to media pipelines that optimize images and publish them to a CDN.

<br>

<img src="assets/section-07.svg" alt="07 Tech stack" width="100%">

<div align="center">
<img src="https://skillicons.dev/icons?i=ts,js,py,rust,c,bash,react,nextjs,vite,tailwind,threejs,nodejs,express&perline=13" alt="Languages and frameworks">
<br>
<img src="https://skillicons.dev/icons?i=mongodb,mysql,sqlite,prisma,firebase,docker,githubactions,netlify,vercel,cloudflare,linux,git,vscode&perline=13" alt="Data and infrastructure">
</div>

<br>

<img src="assets/stack.svg" alt="Full technology inventory" width="100%">

<br>

<img src="assets/section-08.svg" alt="08 More builds" width="100%">

| Project | What it is | Stack |
|:--|:--|:--|
| **Maghamer** | Educational game platform on Algerian history and civic values: missions, quizzes, rewards, 9 server-validated mini-game types. Hackathon build. | React, Vite, Express, MongoDB, MySQL, JWT |
| **Forsati** | Connects Algerian youth to youth establishments: recommendations, event registration, QR ticketing. Team build at ECOHACK26. | Next.js, Firebase, QR codes |
| **Boutique Rayane** | E-commerce front with a product customizer on canvas and image compression in the browser. | React, Fabric.js, Firebase, Zustand, Zod |
| **Salat landing** | Animated landing page for the Salat terminal app, pixel and mono typography. | React, Vite, TypeScript |
| **AutoCAD auto-save** | Python watchdog plus AutoLISP `SAVETIME` so drawings are never lost on legacy Windows 7 machines. | Python, AutoLISP |
| **Annuaire Étudiants** | Benchmarks of data structures for a student directory, with plotted results. | C, Python, Gnuplot, Make |

**Hackathons:** National Hackathon for Innovation and Digital Design, Mostaganem (**2nd place**, Sadeem) &nbsp;/&nbsp; Hackathon Akbou &nbsp;/&nbsp; ECOHACK26, Ichelladen.

**Frequent collaborator:** [Adem Mila](https://github.com/linuxcoding-ADAM), on Salat, its website and several hackathon teams.

<br>

<img src="assets/footer.svg" alt="Built in Béjaïa, Algeria" width="100%">
