# ⬡ NexaSphere
### GL Bajaj Group of Institutions, Mathura
**Student-Driven Tech Ecosystem**

> Built with React + Vite · Hosted on GitHub Pages · Auto-deployed via GitHub Actions

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-NexaSphere-00d4ff?style=for-the-badge)](https://ayushh-sharmaa.github.io/NexaSphere/)
[![GitHub Repo](https://img.shields.io/badge/📦_Repo-GitHub-6366f1?style=for-the-badge)](https://github.com/Ayushh-Sharmaa/NexaSphere)
[![WhatsApp](https://img.shields.io/badge/💬_Community-WhatsApp-25d366?style=for-the-badge)](https://chat.whatsapp.com/Jjc5cuUKENu0RC1vWSEs20)
[![LinkedIn](https://img.shields.io/badge/🔗_LinkedIn-NexaSphere-0a66c2?style=for-the-badge)](https://www.linkedin.com/showcase/glbajaj-nexasphere/)

---

## 📌 Table of Contents

- [Quick Links](#-quick-links)
- [Tech Stack](#️-tech-stack)
- [Folder Structure](#-folder-structure)
- [Data Files](#-data-files--srcdata)
- [Components](#-components--srccomponents)
- [Styles](#-styles--srcstyles)
- [Root Files](#️-root-files)
- [Common Tasks — Quick Reference](#-common-tasks--quick-reference)
- [Core Team](#-core-team)
- [Activities](#-activities)
- [Deployment](#-deployment)

---

## 🔗 Quick Links

| Label | URL |
|---|---|
| 🌐 Live Website | https://ayushh-sharmaa.github.io/NexaSphere/ |
| 📦 GitHub Repo | https://github.com/Ayushh-Sharmaa/NexaSphere |
| 💬 WhatsApp Community | https://chat.whatsapp.com/Jjc5cuUKENu0RC1vWSEs20 |
| 🔗 LinkedIn Page | https://www.linkedin.com/showcase/glbajaj-nexasphere/ |
| 📋 Core Team Application | https://forms.gle/nhUxj9SP8tJ3McfG8 |
| 📄 Core Team Roles | https://tinyurl.com/NexaSphere-CTR |
| 📜 Code of Conduct | https://tinyurl.com/NexaSphere-COD |
| 📏 Rules & Regulations | https://tinyurl.com/NexaSphere-Rules |
| 📝 Terms & Conditions | https://tinyurl.com/NexaSphere-TNC |

---

## ⚙️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| GitHub Actions | latest | Auto-deploy CI/CD |
| GitHub Pages | — | Free hosting |
| Orbitron | Google Fonts | Heading font |
| Rajdhani | Google Fonts | Body font |

---

## 📁 Folder Structure

> Every file the website uses lives inside `src/`. Root files control build & deploy only.

```
NexaSphere/
├── public/
│   └── favicon.ico                        ← Browser tab icon
│
├── src/
│   ├── assets/
│   │   ├── hero-bg.jpg                    ← Hero section background photo
│   │   └── images/
│   │       ├── logos/
│   │       │   ├── nexasphere-logo.png    ← NexaSphere logo (transparent bg)
│   │       │   └── glbajaj-logo.png       ← GL Bajaj logo (transparent bg)
│   │       └── team/
│   │           ├── ayush.png
│   │           ├── tanishk.png
│   │           ├── tushar.png
│   │           ├── swayam.png
│   │           ├── aryan.png
│   │           ├── vartika.png
│   │           └── placeholder.png        ← Default for members without photo
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ActivitiesSection.jsx
│   │   ├── EventsSection.jsx
│   │   ├── AboutSection.jsx
│   │   ├── TeamSection.jsx
│   │   ├── TeamMemberCard.jsx
│   │   ├── TeamMemberModal.jsx
│   │   ├── ParticleBackground.jsx
│   │   └── Footer.jsx
│   │
│   ├── data/
│   │   ├── teamData.js                    ← All team member info
│   │   ├── eventsData.js                  ← All events info
│   │   └── activitiesData.js              ← Activities cards data
│   │
│   ├── styles/
│   │   ├── globals.css                    ← CSS variables, reset, fonts
│   │   ├── animations.css                 ← All keyframe animations
│   │   └── components.css                 ← All component styles
│   │
│   ├── App.jsx                            ← Root component
│   └── main.jsx                           ← React entry point
│
├── .github/
│   └── workflows/
│       └── deploy.yml                     ← Auto-deploy to GitHub Pages
│
├── index.html                             ← HTML shell, page title, font imports
├── vite.config.js                         ← Build config (base path for GitHub Pages)
└── package.json                           ← Dependencies & npm scripts
```

---

## 📊 Data Files — `src/data/`

> **This is where all website content lives.** You never need to touch component code to update text, add members, or add events.

---

### `teamData.js` — Team Members

**Path:** `src/data/teamData.js`

Controls everything shown on the **Team page** and inside each member's **modal popup**.

#### Fields for each member

| Field | Type | What it does | If `null` |
|---|---|---|---|
| `id` | number | Unique ID (do not repeat) | — |
| `name` | string | Full name on card & modal | — |
| `role` | string | Role shown in cyan below name | — |
| `year` | string | e.g. `"1st Year"` | — |
| `branch` | string | e.g. `"CSE (AI & ML)"` | — |
| `section` | string | e.g. `"F"` | — |
| `photo` | import | Circular profile photo | Shows placeholder |
| `linkedin` | string | Opens LinkedIn in new tab | Button hidden |
| `email` | string | Click → shows email + copy button | Button hidden |
| `whatsapp` | string | Click → shows link + copy button | Button hidden |
| `instagram` | string | Opens Instagram in new tab | Button hidden |

#### How to add a new member

1. Add their photo to `src/assets/images/team/yourname.png` *(circular crop, 300×300px, transparent background)*
2. Add the import at the **top** of `teamData.js`:
   ```js
   import yournameImg from '../assets/images/team/yourname.png';
   ```
3. Copy any existing member block, give it a **new unique `id`**, and fill in the details
4. Set unused social fields to `null` — the button will automatically disappear

#### How to change member order

Simply **reorder the objects** in the `teamMembers` array — the grid follows array order exactly.

---

### `eventsData.js` — Events Timeline

**Path:** `src/data/eventsData.js`

Controls the **Events tab**. Each object is one event card on the timeline.

| Field | Type | What it does |
|---|---|---|
| `id` | number | Unique ID |
| `name` | string | Full event name (shown as card title) |
| `shortName` | string | Short name / abbreviation |
| `date` | string | Display date e.g. `"March 14, 2025"` |
| `description` | string | Paragraph shown in the event card |
| `status` | `"completed"` \| `"upcoming"` | `"completed"` = filled dot + green badge. `"upcoming"` = pulsing dot |
| `icon` | emoji | Large emoji shown beside the event name |
| `tags` | `string[]` | Small tag chips shown below the description |

#### How to add a new event

1. Open `src/data/eventsData.js`
2. Copy the existing KSS block, increment the `id`, and fill in the details
3. Set `status: "upcoming"` before the event happens, change to `"completed"` afterward

---

### `activitiesData.js` — Activity Cards

**Path:** `src/data/activitiesData.js`

Controls the **7 cards** on the Activities tab.

| Field | What it does |
|---|---|
| `id` | Unique ID |
| `icon` | Large emoji at top of card |
| `title` | Bold card heading in cyan |
| `description` | Body text below the heading |

---

## 🧩 Components — `src/components/`

> Components are UI building blocks. Edit these only for **visual or layout changes**, not content changes.

| File | What it renders | When to edit |
|---|---|---|
| `Navbar.jsx` | Top navigation bar (desktop + mobile) | Add/remove nav tabs, change logo sizes, adjust scroll behavior |
| `HeroSection.jsx` | Full-screen landing section | Change hero title, tagline, button labels or links, floating shapes |
| `ActivitiesSection.jsx` | Grid of activity cards | Change layout, card hover effects, or section heading |
| `EventsSection.jsx` | Timeline of events | Change timeline layout, dot styles, or section heading |
| `AboutSection.jsx` | About text + social buttons | Update about paragraph text, add/remove buttons |
| `TeamSection.jsx` | Grid of team cards + modal trigger | Change grid layout or number of columns |
| `TeamMemberCard.jsx` | Individual team card with 3D tilt effect | Change card size, photo size, click-hint text |
| `TeamMemberModal.jsx` | Popup shown when a card is clicked | Change modal layout, add new social button types, copy popup behavior |
| `ParticleBackground.jsx` | Canvas particle animation (background) | Adjust particle count, speed, colors, connection distance |
| `Footer.jsx` | Bottom footer with logos + copyright | Update copyright text, add footer links |

---

## 🎨 Styles — `src/styles/`

---

### `globals.css`

All **CSS variables** (colors, spacing, shadows), body reset, fonts, scrollbar, scroll progress bar, back-to-top button, and cursor glow.

#### To change colors site-wide — edit `:root {}` at the top of `globals.css`

```css
--cyan:       #00d4ff;   /* Primary accent — headings, borders, glows */
--indigo:     #6366f1;   /* Secondary accent */
--purple:     #a855f7;   /* Tertiary accent */
--bg-primary: #04060f;   /* Page background */
--bg-card:    #0d1229;   /* Card background */
```

---

### `animations.css`

All `@keyframe` animations. Includes:
- **Scroll-reveal** — `.reveal` and `.visible` classes, stagger delay helpers
- **Gradient text** — cycling cyan → indigo → purple on the hero title
- **Floating shapes** — hero background geometric shapes
- **Shimmer** — card hover sweep effect
- **Pulse ring** — upcoming event dot animation
- **Modal entrance** — scale + translateY animation when modal opens

#### To adjust scroll reveal speed

Find `.reveal` in `animations.css` and change the `transition` duration:
```css
.reveal {
  transition: opacity 0.65s ...,   /* ← change this value */
              transform 0.65s ...;
}
```

---

### `components.css`

Styles for **every component** — buttons, navbar, cards, modal, timeline, hero, about, footer, and the copy popup. If something looks visually wrong, this is usually the first file to check.

---

## 🗂️ Root Files

| File | Purpose | When to edit |
|---|---|---|
| `src/App.jsx` | Root component. Manages splash screen, scroll progress, back-to-top, cursor glow, active tab tracking, and renders all sections | Rarely — only if adding a completely new section or changing scroll behavior |
| `src/main.jsx` | React entry point. Mounts `<App />` into `index.html` | Almost never |
| `index.html` | HTML shell — sets page title, favicon link, and font imports | To change the browser tab title or add meta tags |
| `vite.config.js` | Sets `base: "/NexaSphere/"` for GitHub Pages — required for assets to load correctly | Only if the repo is renamed |
| `package.json` | Lists dependencies and npm scripts | To add/remove npm packages |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD — auto-builds and deploys to `gh-pages` branch on every push to `main` | Only if changing Node version or deploy branch |

---

## ✅ Common Tasks — Quick Reference

| Task | File to edit | What to change |
|---|---|---|
| Add a team member | `src/data/teamData.js` | Add new object to `teamMembers` array + import photo |
| Add a member photo | `src/assets/images/team/` | Add circular PNG (300×300px, transparent bg) |
| Update member LinkedIn | `src/data/teamData.js` | Set `linkedin: "https://..."` for that member |
| Update member email | `src/data/teamData.js` | Set `email: "name@example.com"` for that member |
| Update member WhatsApp | `src/data/teamData.js` | Set `whatsapp: "https://wa.me/..."` for that member |
| Change member role text | `src/data/teamData.js` | Edit the `role:` field |
| Reorder team members | `src/data/teamData.js` | Reorder objects in `teamMembers` array |
| Add a new event | `src/data/eventsData.js` | Add new object to `events` array |
| Mark event as completed | `src/data/eventsData.js` | Change `status: "upcoming"` → `status: "completed"` |
| Edit activity description | `src/data/activitiesData.js` | Edit the `description:` field for that activity |
| Change site accent color | `src/styles/globals.css` | Edit `--cyan`, `--indigo`, or `--purple` in `:root {}` |
| Change page background | `src/styles/globals.css` | Edit `--bg-primary` in `:root {}` |
| Change hero background photo | `src/assets/hero-bg.jpg` | Replace the file (keep same filename) |
| Change logos | `src/assets/images/logos/` | Replace `nexasphere-logo.png` or `glbajaj-logo.png` |
| Change browser tab title | `index.html` | Edit the `<title>` tag |
| Change footer text | `src/components/Footer.jsx` | Edit the JSX text in the footer |
| Add a new nav tab | `src/components/Navbar.jsx` + `src/App.jsx` | Add tab name to `TABS` array in Navbar, add section in App |
| Change WhatsApp community link | `src/components/HeroSection.jsx` + `src/components/AboutSection.jsx` | Update `WHATSAPP_URL` constant at top of each file |
| Change particle count/speed | `src/components/ParticleBackground.jsx` | Edit `COUNT`, `dx`/`dy` range, or connection distance (`110`) |
| Rename the GitHub repo | `vite.config.js` | Update `base: "/NewRepoName/"` to match the new repo name |

---

## 👥 Core Team

| Name | Role | Year | Branch | Section |
|---|---|---|---|---|
| Ayush Sharma | Organiser | 1st | CSE (AI & ML) | F |
| Tanishk Bansal | Co-organiser | 1st | CSE | E |
| Tushar Goswami | Core Team Member | 1st | CSE (AI & ML) | J |
| Swayam Dwivedi | Core Team Member | 1st | CSE | E |
| Aryan Singh | Core Team Member | 1st | CS (AI & ML) | F |
| Vartika Sharma | Core Team Member | 1st | CS | J |
| Arya Kaushik | Core Team Member | 1st | CS (AI & ML) | F |
| Astha Shukla | Core Team Member | 1st | CS (AI & ML) | G |
| Ankit Singh | Core Team Member | 1st | CS | F |
| Vikas Kumar Sharma | Core Team Member | 1st | CSE | E |
| Suryjeet Singh | Core Team Member | 1st | CS | J |
| Roshni Gupta | Core Team Member | 2nd | CST | E |

---

## ⚡ Activities

| Activity | Description |
|---|---|
| Hackathon | Intense coding marathons — teams build solutions to real-world problems under time pressure |
| Codathon | Competitive programming challenges testing algorithmic thinking and code efficiency |
| Ideathon | Idea generation competitions where creativity and strategic thinking take center stage |
| Workshop | Hands-on learning sessions on cutting-edge tools, frameworks, and emerging technologies |
| Insight Session | Deep-dive talks exploring industry trends, career paths, and the future of technology |
| Open Source Day | Dedicated events encouraging open-source contributions and real-world dev experience |
| Tech Debate | Structured debates on controversial tech topics sharpening critical thinking skills |

---

## 🚀 Deployment

> The site **auto-deploys** every time you push a commit to the `main` branch. No manual steps needed.

### How it works

1. You push a commit to `main` on GitHub
2. GitHub Actions runs `.github/workflows/deploy.yml` automatically
3. It installs dependencies, runs `npm run build` (Vite), and publishes the `dist/` folder to the `gh-pages` branch
4. GitHub Pages serves the `gh-pages` branch at `https://Ayushh-Sharmaa.github.io/NexaSphere/`
5. The whole process takes about **1–2 minutes**

### Run locally

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

### If the site breaks after a commit

1. Go to the **Actions** tab on GitHub — the failed step will be shown in red
2. Most common cause: a syntax error in JSX or a missing import
3. Fix the error, commit again — it will re-deploy automatically

---

<div align="center">

Built with ❤️ by the **NexaSphere Core Team**

GL Bajaj Group of Institutions, Mathura

*Proposed by Tanishk Bansal & Ayush Sharma*

</div>
