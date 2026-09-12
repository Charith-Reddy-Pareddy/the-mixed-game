"""Pull the figures and result numbers this site displays from the main
research repo (soccer-markov-nash), so the site never hand-copies a number
that could drift from the solver's own output.

    python scripts/sync_assets.py [--source path/to/soccer-markov-nash]

Copies a curated set of PNGs into public/figures/ and writes public/data/
*.json from the repo's own experiments/*.csv and docs pages. Run this after
regenerating figures in the main repo, before `npm run build`.
"""
from __future__ import annotations

import argparse
import csv
import json
import pathlib
import shutil

HERE = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_SOURCE = HERE.parent / "Soccer Markov Nash Equilibria"

FIGURES = [
    "kickoff.png",
    "showcase.png",
    "positions_web.png",
    "positions_web_matrix.png",
    "mechanism.png",
    "rps_vs_soccer.png",
    "rule_fingerprints.png",
    "generalize.png",
    "tournament4.png",
    "occupancy.png",
]


def sync_figures(source: pathlib.Path) -> None:
    out = HERE / "public" / "figures"
    out.mkdir(parents=True, exist_ok=True)
    src_dir = source / "docs" / "figures" / "png"
    for name in FIGURES:
        src = src_dir / name
        if not src.exists():
            print(f"  MISSING {src}")
            continue
        shutil.copy(src, out / name)
        print(f"  copied {name}")


def sync_tournament4(source: pathlib.Path) -> None:
    csv_path = source / "experiments" / "tournament4.csv"
    if not csv_path.exists():
        print(f"  MISSING {csv_path}")
        return
    rows = list(csv.DictReader(csv_path.open()))
    out = HERE / "public" / "data" / "tournament4.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(rows, indent=2))
    print(f"  wrote {out} ({len(rows)} rows)")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--source", type=pathlib.Path, default=DEFAULT_SOURCE,
                     help="path to the soccer-markov-nash checkout")
    args = ap.parse_args()
    if not args.source.exists():
        raise SystemExit(f"source repo not found: {args.source}")

    print("figures:")
    sync_figures(args.source)
    print("data:")
    sync_tournament4(args.source)


if __name__ == "__main__":
    main()
