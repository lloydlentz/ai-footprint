# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

No build step, no dependencies. Open directly or serve locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

The `antigravity/` variant is served at `http://localhost:8000/antigravity/`.

## Architecture

This repo contains two versions of the same carbon footprint calculator:

**`index.html`** — Fully self-contained single file. All CSS (including CSS custom properties, theming, responsive layout) and JavaScript are inlined. Easiest to share and deploy.

**`antigravity/`** — Split into three files:
- `index.html` — HTML structure only
- `styles.css` — All styling (uses Google Fonts: Outfit, Plus Jakarta Sans)
- `app.js` — All logic

### App logic (`antigravity/app.js`)

The entire app is driven by a single `updateCalculations()` function called on every input event. It:
1. Reads all DOM inputs into the `state` object
2. Computes five emission categories (housing, driving, flying, AI, lifestyle) using the `FACTORS` constants object
3. Updates all DOM outputs: animated number counter, SVG dial gauge, horizontal breakdown bars, screen-reader table, AI deep-dive metrics, and comparison verdict banner
4. Persists `state` to `localStorage`

**To change emission assumptions**, edit the `FACTORS` object at the top of `app.js` (or the equivalent `<script>` block in `index.html`). The two most significant factors are `gridCarbonIntensity` (lbs CO₂/kWh) and `aiTextWh` (Wh per prompt).

### Theming

Both versions support dark/light themes via a `light-theme` class toggled on `<body>`. Theme preference is persisted in `localStorage` under key `ecoTheme`. State is persisted under key `ecoFootprintState`.

### Deployment

The live site is GitHub Pages at `lloydlentz.github.io/ai-footprint/`. Pushing to `main` deploys automatically.
