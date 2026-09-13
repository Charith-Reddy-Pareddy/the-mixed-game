# The Mixed Game

An interactive companion site to
[soccer-markov-nash](https://github.com/Charith-Reddy-Pareddy/soccer-markov-nash) —
a discrete soccer Markov game, solved exactly, that pins down precisely when a
Nash equilibrium requires a mixed strategy instead of a deterministic move.

**Live:** <https://charith-reddy-pareddy.github.io/the-mixed-game/>

Two documents, by design: this site is deliberately non-technical --
plain-language explanations, figures, and one live table, aimed at a reader
who does not want to read a research paper -- while the research repo linked
above is the technical notebook: every proof, every experiment, reproducible
from its own code. Neither is a stub of the other, and content flows one way
only: `scripts/sync_assets.py` pulls this site's figures and live tournament
table straight from the research repo's own `docs/figures/png/` and
`experiments/*.csv`, so nothing here is a hand-copied number that can drift
from the solver's output.

## Stack

- **React** (Vite) for the page itself — `src/App.jsx` / `src/App.css`.
- **Python** (`scripts/sync_assets.py`) to pull the figures this site displays
  and the live tournament table straight from the research repo's own
  `docs/figures/png/` and `experiments/*.csv`, so nothing here is a
  hand-copied number that can drift from the solver's output.
- Plain HTML/CSS otherwise — no component library, no Tailwind.

## Developing

```bash
npm install
python3 scripts/sync_assets.py --source /path/to/soccer-markov-nash
npm run dev
```

## Building / deploying

```bash
npm run build   # writes docs/ (the GitHub Pages source for this repo)
git add docs && git commit -m "Rebuild site" && git push
```

GitHub Pages is configured to serve from `main` / `docs`.
