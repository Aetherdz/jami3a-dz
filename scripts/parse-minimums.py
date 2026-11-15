#!/usr/bin/env python3
"""
Rebuild `data/minimums.json` and `data/trends.json` from the MESRS PDFs.

The ministry publishes one PDF per session, with the same table layout:
    Code Etb | Etablissement | Code Fil | Filiere | Min1 | Min2 | Min3
The parser reads that table line by line, keeps "NC" and "--" exactly as
printed, and never guesses a missing value.

Usage:
    # PDFs are not committed (2 MB each). Download them first, then:
    python3 scripts/parse-minimums.py --pdf-dir /path/to/pdfs --out-dir data

Expected file names: bac-<year>.pdf (e.g. bac-2026.pdf, bac-2025.pdf).
Session 2026 must be the *final* file (after phase 2), the one where "NC" has
been replaced by the real minimums.

Requires: pypdf  (`pip install pypdf`)
"""
from __future__ import annotations

import argparse
import json
import re
import statistics
from pathlib import Path

ETB = re.compile(r"^[A-Z]\d{2}$")
FIL = re.compile(r"^[A-Z]\d{2}[A-Z]{3}\d{1,2}$")
NUM = re.compile(r"^\d{2}[.,]\d{2}$")
QUOTA = re.compile(r"\s*--\s*pour bacheliers.*$", re.I)
SKIP = {
    "Code",
    "Etb",
    "Etab",
    "Etablissement",
    "Code Fil",
    "Code",
    "Fil",
    "Filiere",
    "Filière",
    "Min1",
    "Min2",
    "Min3",
}
NOISE = (
    "Moyennes minimales",
    "République",
    "Ministère",
    "Affectation",
    "nouveaux bacheliers",
    "Moy",
)

# Sessions whose PDF keeps the alphanumeric filière code (field letter).
# 2021 and older use short numeric codes, so they are linked but not compared.
COMPARABLE_YEARS = (2022, 2023, 2024, 2025, 2026)

SOURCES = {
    2026: (
        "Moyennes minimales BAC 2026 — Affectation des nouveaux bacheliers (définitif)",
        "https://www.esi.dz/wp-content/uploads/2026/08/BAC-2026-Moyennes-minimales-2026.pdf",
    ),
    2025: (
        "Moyennes minimales BAC 2025 — Affectation des nouveaux bacheliers",
        "https://www.ummto.dz/vrp/wp-content/uploads/Moyennes-minimales-BAC-2025.pdf",
    ),
    2024: (
        "Moyennes minimales BAC 2024 — Affectation des nouveaux bacheliers",
        "https://www.ummto.dz/vrp/wp-content/uploads/moy_min_bac2024.pdf",
    ),
    2023: (
        "Moyennes minimales BAC 2023 — Affectation des nouveaux bacheliers",
        "https://www.ummto.dz/vrp/wp-content/uploads/Moyennes-minimales-BAC2023.pdf",
    ),
    2022: (
        "Moyennes minimales BAC 2022 — Affectation des nouveaux bacheliers",
        "https://www.ummto.dz/vrp/wp-content/uploads/2022_Moyennes-Minimales.pdf",
    ),
}

READ_ON = "2026-11-15"


def clean(value: str | None) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def canonical(name: str) -> str:
    return clean(QUOTA.sub("", name))


def numeric(value: str) -> float | None:
    if value in ("NC", "--"):
        return None
    try:
        return float(value.replace(",", "."))
    except ValueError:
        return None


def parse_pdf(path: Path) -> list[dict]:
    import pypdf  # imported here so the CLI can explain a missing dependency

    reader = pypdf.PdfReader(str(path))
    lines: list[str] = []
    for page in reader.pages:
        lines.extend(line.strip() for line in page.extract_text().split("\n"))
    lines = [line for line in lines if line]

    rows: list[dict] = []
    code = None
    name = None
    current = None

    for line in lines:
        if ETB.match(line):
            if current:
                rows.append(current)
            code, name, current = line, None, None
            continue

        if code and FIL.match(line):
            if current:
                rows.append(current)
            current = {"e": code, "en": name, "f": line, "n": [], "v": []}
            continue

        if current is not None:
            if len(current["v"]) < 3 and (NUM.match(line) or line in ("NC", "--")):
                current["v"].append(line.replace(",", "."))
                continue
            if not current["v"]:
                current["n"].append(line)
            continue

        if code and line not in SKIP and not any(token in line for token in NOISE) and line != "BAC 2026":
            name = f"{name} {line}" if name else line

    if current:
        rows.append(current)

    return [
        {"e": row["e"], "en": clean(row["en"]), "f": row["f"], "n": clean(" ".join(row["n"])), "v": row["v"]}
        for row in rows
        if row["n"]
    ]


def field_letter(code: str) -> str | None:
    return code[0] if code and code[0].isalpha() else None


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf-dir", required=True)
    parser.add_argument("--out-dir", default="data")
    args = parser.parse_args()

    pdf_dir = Path(args.pdf_dir)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    sessions: dict[int, list[dict]] = {}
    for year in sorted(SOURCES):
        path = pdf_dir / f"bac-{year}.pdf"
        if not path.exists():
            print(f"skip {year}: {path} not found")
            continue
        rows = parse_pdf(path)
        sessions[year] = rows
        institutions = len({row["e"] for row in rows})
        numeric_rows = sum(1 for row in rows if any(numeric(v) is not None for v in row["v"]))
        print(f"{year}: {len(rows)} rows · {institutions} institutions · {numeric_rows} with a number")

    if 2026 not in sessions:
        raise SystemExit("bac-2026.pdf is required")

    title, url = SOURCES[2026]
    payload = {
        "source": {
            "title": title,
            "url": url,
            "publisher": "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESRS)",
            "session": "2026",
            "readOn": READ_ON,
            "rows": len(sessions[2026]),
        },
        "rows": sessions[2026],
    }
    (out_dir / "minimums.json").write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )

    # Only keep keys that still exist in the current session: the site compares
    # today's programs, it does not resurrect retired ones.
    current_keys = {
        f"{field_letter(row['f'])}|{canonical(row['n'])}" for row in sessions[2026] if field_letter(row["f"])
    }

    trends: dict[str, dict[str, dict[str, float | int]]] = {}
    for year, rows in sessions.items():
        if year not in COMPARABLE_YEARS:
            continue
        grouped: dict[str, list[float]] = {}
        for row in rows:
            letter = field_letter(row["f"])
            if not letter:
                continue
            values = [numeric(v) for v in row["v"]]
            values = [v for v in values if v is not None]
            if not values:
                continue
            grouped.setdefault(f"{letter}|{canonical(row['n'])}", []).extend(values)
        for key, values in grouped.items():
            if key not in current_keys:
                continue
            trends.setdefault(key, {})[str(year)] = {
                "low": round(min(values), 2),
                "median": round(statistics.median(values), 2),
                "n": len(values),
            }

    session_stats = {
        str(year): {
            "rows": len(rows),
            "institutions": len({row["e"] for row in rows}),
            "numericRows": sum(1 for row in rows if any(numeric(v) is not None for v in row["v"])),
        }
        for year, rows in sessions.items()
    }

    trend_payload = {
        "years": sorted(COMPARABLE_YEARS),
        "stats": session_stats,
        "sources": {
            str(year): {"title": SOURCES[year][0], "url": SOURCES[year][1]} for year in COMPARABLE_YEARS if year in sessions
        },
        "readOn": READ_ON,
        "programs": trends,
    }
    (out_dir / "trends.json").write_text(
        json.dumps(trend_payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(f"wrote {len(trends)} trend keys for {sorted(sessions)}")


if __name__ == "__main__":
    main()
