# Kanwaljeet Singh — Portfolio

A fast, dependency-free portfolio site with four playable games built in.
No build step, no framework, no npm install — just open `index.html`.

## What's in here

| File | What it does |
|---|---|
| `index.html` | All page content and structure |
| `styles.css` | Design system ("Sunrise warmth"), light + dark themes, responsive layout |
| `games.js` | Snake, 2048, Memory Match, Tic-Tac-Toe (minimax AI) |
| `script.js` | Theme toggle, nav, scroll reveals, stat counters, game modal, case-study modal, image lightbox |
| `projects.js` | Case-study data (challenge / solution / result / stack) for all 14 projects |
| `portfolio_images/` | Project screenshots (**required** — keep this folder) |
| `portfolio.md` | Source notes for the case studies (not used at runtime; optional to keep) |

The Work section has two parts: a featured **Decision-Support Terminal** case study, and a
filterable gallery of **34 real projects** (AI, Backend, Full-stack, Frontend, Mobile,
E-commerce). Each card opens a **case-study modal** showing the challenge, what was built,
and the result — edit that content in `projects.js`. The screenshot inside the modal opens
full-size in a lightbox. Category filter tabs above the gallery are driven by each project's
`cat` field in `projects.js`.

## Deploy to GitHub Pages

Create a repo named **`Kanwal97.github.io`** and your site lives at
`https://kanwal97.github.io` — no extra config.

```bash
cd d:/project/AI/kanwal
git init
git add .
git commit -m "Portfolio site with games"
git branch -M main
git remote add origin https://github.com/Kanwal97/Kanwal97.github.io.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save.**
First build takes about a minute.

> Prefer a different repo name (e.g. `portfolio`)? Same steps — the URL just becomes
> `https://kanwal97.github.io/portfolio/`. Everything here uses relative paths, so it works either way.

## Adding your own game

The last card in the games section is already wired as a placeholder.
Once your game repo is deployed, open `index.html`, find the comment
`<!-- Slot for your own game repo -->`, and update that card:

```html
<a class="game-card reveal" href="https://kanwal97.github.io/your-game/" target="_blank" rel="noopener">
  <span class="game-art art-soon" aria-hidden="true"><b>🎯</b></span>
  <span class="game-body">
    <span class="game-name">Your Game Name</span>
    <span class="game-desc">One line about what it does.</span>
    <span class="game-meta"><span class="chip">Canvas</span></span>
  </span>
</a>
```

Remove `game-soon` and `aria-disabled="true"` from the class/attributes so it becomes clickable.

## Editing the content

Everything is plain HTML — no templating to learn.

- **Projects** — each `<article class="gcard">` in the gallery. Copy one, point `data-full` / `img src` at a file in `portfolio_images/`, and edit the title, metric, description and tags.
- **Featured case study** — the `<article class="case">` block at the top of `#work`.
- **Skills** — the `.skill-list` blocks in `#about`.
- **Contact links** — the `.contact-link` anchors in `#contact`.
- **Colors** — the `:root` block at the top of `styles.css`. Change `--coral` and `--amber` and the whole site follows.

## Notes

- Games save high scores to `localStorage`, so they persist per browser.
- Dark mode follows the OS by default; the toggle overrides and remembers.
- Fonts load from Google Fonts. To go fully offline, self-host them and drop the `<link>` tags.
- Respects `prefers-reduced-motion` — animations turn off for users who ask.
