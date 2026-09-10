# Elements — source code

A static straightedge-and-compass game with 45 construction challenges from Euclid, geometric validation, earned tools, hints, and a free canvas.

This is the published game's editable HTML, CSS, and JavaScript, together with its geometry tests. No API keys, backend, or installation is needed to run the game.

## Local preview

From this folder, run:

```sh
python -m http.server --directory dist 8000
```

Open http://localhost:8000. Use an HTTP server rather than opening index.html directly, because the application uses JavaScript modules.

## Contents

| Path | Purpose |
| --- | --- |
| `dist/` | All editable game source; deploy this folder |
| `dist/index.html` | Page structure and metadata |
| `dist/style.css` | Styling and responsive layout |
| `dist/app.js` | Interaction, progress, and tool unlocking |
| `dist/geometry.js` | Intersections and geometric operations |
| `dist/propositions.js` | Challenge setups, construction tools, validators |
| `dist/content.js` | Proposition descriptions and hints |
| `dist/source-notes.txt` | Edition and scope notes |
| `tests/geometry.test.mjs` | 103 geometric checks covering all 45 challenges |
| `.github/workflows/pages.yml` | Ready-to-use GitHub Pages deployment workflow |
| `DEPLOY.md` | Deployment instructions |

Although named dist, this folder contains the complete, unbundled source. There is no separate compilation step. Asset references are relative, so the game can run at a domain root or a GitHub repository subpath.

## Geometry checks

With Node.js installed, run:

```sh
node tests/geometry.test.mjs
```

The included package.json marks the JavaScript as ES modules and also provides `npm test`. There are no npm dependencies.

The checks cover all 45 completed constructions, unsolved seed states, a primitive-only equilateral construction, finite and extended intersections, hidden centers, and extended-boundary solutions. Game validation is numerical, not a formal proof checker. Browser UI testing and hosted deployment on your own Pages account have not been performed.

## Play and storage

Start with Line, Extend, and Circle. Click existing points or computed intersections to snap precisely. Check a completed proposition to unlock its tool. Earned tools work in all challenges and in Free canvas.

Shortcuts: L line, E extend, C circle, H pan, F flip an earned construction, Esc cancel, Ctrl/Command Z undo. Scroll to zoom; Space + drag to pan.

Progress is saved in localStorage for each browser and site origin. Moving to a new domain starts fresh progress. Optional Google Fonts are loaded by the stylesheet; system font fallbacks are provided. The optional WebMCP tools are feature-detected and do not require an OpenAI connection to play.
