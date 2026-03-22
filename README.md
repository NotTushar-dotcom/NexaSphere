# NexaSphere — GL Bajaj Group of Institutions, Mathura

**Live Site:** https://Ayushh-Sharmaa.github.io/NexaSphere/  
**Contact:** nexasphere@glbajajgroup.org  
**LinkedIn:** https://www.linkedin.com/showcase/glbajaj-nexasphere/  
**WhatsApp:** https://chat.whatsapp.com/Jjc5cuUKENu0RC1vWSEs20

## Tech Stack
React 18 + Vite 5 → GitHub Pages (via GitHub Actions)

## Project Structure
```
src/
  components/     All React UI components
  data/           Team, events, activity page data
  assets/         Images, logos, hero background
  styles/         globals.css, animations.css, components.css
```

## Development
```bash
npm install
npm run dev
```

## Deployment
Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.

## Key Links
- Core Team Application: https://forms.gle/4M5w1dfD6un6tmGz5
- Join NexaSphere Form: https://forms.gle/NWb49scknwD6PP769
- Code of Conduct: https://tinyurl.com/NexaSphere-COD
- Rules: https://tinyurl.com/NexaSphere-Rules

## Adding Content
| Task | File |
|---|---|
| Add team member | `src/data/teamData.js` |
| Add activity event | `src/data/activities/<name>.js` |
| Add KSS session | `src/data/activities/insightSession.js` |
| Change hero stats | `src/components/HeroSection.jsx` → `StatsBar` |
| Add photo/video link | `insightSession.js` → `photoLink`/`videoLink` |
