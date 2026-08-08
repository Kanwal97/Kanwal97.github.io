# Kanwaljeet Singh — Portfolio

A fast, dependency-free portfolio site with five games built in.
No build step, no framework, no npm install — just open `index.html`.

## The design

**"Newsstand"** — an editorial system with a single orange accent, in two themes:
near-black, and warm newsprint. The whole look rests on two rules:

1. **One accent, no second hue.** The orange *fill* (`#ff6f00` → `#ff9d31`) is
   byte-identical in both themes so the brand never shifts. Only orange-as-text
   darkens on paper, for contrast.
2. **Two type registers, with a floor.** Tracked micro-caps for *labels* and
   heavy display for *headlines*. The gap between them is the design — but
   taken literally it once pushed 417 elements below 12px, so the scale now
   has a hard floor (see below).

Change `--orange` in the `:root` block of `styles.css` and the entire site follows.

### Readability rules

These are load-bearing. The first version of this design was stylish and hard
to read; these three rules are what fixed it, and breaking them undoes it.

1. **Nothing below 11px.** Use the scale — `--t-micro` 11 / `--t-label` 12 /
   `--t-meta` 13 / `--t-small` 14 / `--t-body` 16 / `--t-lead` 18. Don't write
   raw px font sizes.
2. **Caps only for 1–3 word labels.** All-caps costs 10–20% reading speed and
   hurts dyslexic readers most, because every word becomes a rectangle — but
   it *helps* when you're glancing at a single word. So kickers, nav and chips
   are caps; titles, descriptions and any sentence are sentence case. The one
   deliberate exception is the hero display headline, which is glanceable.
3. **Prose stays between 45 and 75 characters.** `--t-body` at the widths used
   here means roughly `max-width: 58ch` for leads and `66ch` for body columns.

Related: interactive targets are 44px (WCAG 2.2 AA only requires 24×24, so
this is comfort, not compliance), and DOM order must match visual order —
don't reach for CSS `order` to rearrange card contents.

### How the two themes work

Every component is written **once**. Two mechanisms do almost all the flipping,
so adding a component rarely needs theme-specific CSS:

| Token | What it does |
|---|---|
| `--fg-rgb` | The ink channel. Every translucent tint is `rgb(var(--fg-rgb) / α)`, so white-on-black becomes ink-on-paper with no per-component work. |
| `--sh-k` | A shadow multiplier (`1` dark, `.3` light). Light needs far weaker shadows; this scales all of them at once. |

Only genuinely physical things get explicit per-theme values — the shelf metal
(`--metal`, `--post`, `--metal-edge`), the covers (`--cover-*`), and the bloom
strengths (`--bloom*`). They're all grouped in the two `:root` blocks.

Three things deliberately do **not** follow the theme:

- **The code terminal** stays dark in both. It's a screen, so its colours are
  intentionally literal rather than tokenised.
- **Metal highlights** (`--metal-edge`) stay white in both — the shelf is lit
  from above either way, and following `--fg-rgb` would groove the aluminium.
- **Dialog scrims** (`--scrim`) sit outside `--sh-k`, or light mode would thin
  them to nothing.

**Accessibility:** text tints are floored per theme — dark-on-light washes out
faster than light-on-dark, so light uses higher alphas. Every text pair clears
WCAG AA; the worst is 4.71:1. Use `--copy` / `--dim` / `--mute` for body,
secondary and tertiary text rather than inventing a new alpha, or you'll drop
below the floor. Hierarchy comes from size, weight and tracking anyway.

The theme is set by an **inline script in `<head>`** before first paint —
without it, light-mode visitors get a black flash. It follows the OS by
default; the toggle overrides and remembers in `localStorage`.

### Covers behave differently per theme

On black, a screenshot at 20% opacity glows out of the dark and reads as
texture. On white paper the same screenshot has nothing to contrast against, so
light mode uses `mix-blend-mode: multiply` instead of opacity — and blurs it,
because under multiply the screenshot's own text prints crisply and competes
with the cover typography. **On paper the ghost has to read as texture, not
content.** At rest the light cover is clean paper; hover sharpens and reveals
the real screenshot. `--cover-scale` overscans only in light, so the blurred
edge can't halo inside the cover's clip.

## What's in here

| File | What it does |
|---|---|
| `index.html` | All page content and structure |
| `styles.css` | Design tokens (both themes), every component, responsive rules |
| `games.js` | Snake, 2048, Memory Match, Tic-Tac-Toe (minimax AI) |
| `script.js` | Theme toggle, mobile menu, sticky rail, scroll reveals, stat counters, game modal, case-study modal, image lightbox, shelf filter |
| `projects.js` | Case-study data (challenge / solution / result / stack) for all 34 projects |
| `portfolio_images/` | Project screenshots (**required** — keep this folder) |
| `portfolio.md` | Source notes for the case studies (not used at runtime; optional to keep) |

## Page structure

| Section | What it is |
|---|---|
| Route header | Tall banner — brand, nav, statement card, CTA card, and a checkpoint rail carrying availability / response time / location. Not sticky. |
| Sticky rail | Slim bar that slides in once the banner scrolls past. Duplicates the nav, so it is `aria-hidden` with unfocusable links; the banner is the real nav. |
| Masthead hero | Display headline, stat rail, code terminal, stack marquee |
| Selected work | Featured Decision-Support Terminal case study as a magazine spread |
| **The rack** | All 34 case studies as 2:3 covers on CSS shelves. They're *case studies*, not magazine "issues" — the metaphor is the shelf, not the content. |
| The arcade | 5 games as cartridges on a second shelf |
| About ("The Masthead") | About copy + seven numbered skill columns |
| Contact | Four direct links, numbered |
| Footer | Numbered 01 / 02 / 03 columns |

## How the shelf works

Worth knowing before you touch it. The shelf is **not** one element per row — each
slot draws its own segment:

```
.mag-slot::before   the 72px metal plinth
.mag-slot::after    the 23px front retaining bar
```

Both are inset `left: -13px; right: -13px`, which is more than half the 24px grid
gap, so adjacent segments overlap into one continuous shelf. This is deliberate:
a per-row wrapper would break the category filter, because a filtered row can end
up holding a single card. With per-slot segments the shelf simply re-flows.

The lifting part (`.mag-lift`) is a **separate child** from the shelf pseudo-elements,
so hovering raises the cover without dragging the shelf with it. On hover it takes
`z-index: 20` to clear the neighbouring slots' retaining bars.

Covers are generated from each project's own data — case-study number, category
kicker, title and metric (title leads, metric supports) — with the screenshot ghosted behind them (see *Covers behave
differently per theme* above). The full screenshot lives in the case-study modal.

## Naming

Navigation and kickers use **plain words** (Work / Games / About / Contact) so the
page can be scanned without decoding a metaphor. The magazine framing lives in the
display headings ("The Rack", "The Arcade", "The Masthead"), the shelf itself and
the `CASE STUDY 01` tags. Keep that split: metaphor for flavour, plain words for
wayfinding.

## Editing the content

- **Projects** — `projects.js` holds the copy; the covers in `index.html` are
  `<article class="mag-slot">` blocks. The two must stay in the same order:
  `script.js` derives the case-study number from a project's index in `projects.js`.
- **Featured spread** — the `<article class="spread">` block in `#work`.
- **Shelf filter counts** — hardcoded in the `.shelf-tabs` buttons; update them if
  you add or remove a project.
- **Skills** — the `.skill-col` blocks in `#about`.
- **Contact links** — the `.direct-link` anchors in `#contact`.

## Adding a project

1. Append an entry to `window.PROJECTS` in `projects.js`.
2. Append a matching `<article class="mag-slot">` to `#rackTier`, with the next
   number in `.mag-no` and `.mag-case`.
3. Bump the `ALL` count and the relevant category count in `.shelf-tabs`.

## Deploy to GitHub Pages

Create a repo named **`Kanwal97.github.io`** and your site lives at
`https://kanwal97.github.io` — no extra config.

```bash
cd d:/project/AI/kanwal
git add .
git commit -m "Portfolio site with games"
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save.**
First build takes about a minute.

> Prefer a different repo name (e.g. `portfolio`)? Same steps — the URL just becomes
> `https://kanwal97.github.io/portfolio/`. Everything uses relative paths, so it works
> either way. Only the `og:*` / `canonical` tags in `<head>` hardcode the domain.

## Notes

- Games save high scores to `localStorage`, so they persist per browser.
- The Snake canvas is painted from CSS variables read at draw time (`--orange`,
  `--orange-lt`, `--game-food`, `--line`), so it re-themes on the next frame.
  If you rename those tokens, update `games.js` too — it falls back to hardcoded
  dark-mode colours, which are invisible on paper.
- Fonts load from Google Fonts (Montserrat 500–900, JetBrains Mono 500/700 plus
  italic 500 for code comments). The italic face is requested deliberately — the
  CSS uses `font-style: italic` there, and without a real face the browser fakes
  a slanted oblique.
- Respects `prefers-reduced-motion` — animations turn off for users who ask.
- The only always-on animations are the marquee and the header's route flow. Both
  freeze via `.motion-paused` when the tab is hidden or a dialog is open, so the
  page costs nothing at idle.
- On phones the rack and arcade become horizontal scroll-snap shelves, and the
  hover tab moves into the empty art band so it can't collide with the cover footer.
