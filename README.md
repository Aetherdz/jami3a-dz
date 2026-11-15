# جامعة الجزائر — Jami3a DZ

A standalone, Arabic-first guide to the Algerian university: the institutions,
the programmes, the life after the gate — and the admission figures the ministry
publishes, read as reference data.

It is deliberately **not** an orientation tool and **not** part of the BAC DZ
site. Orientation belongs there; this site stops where the gate opens. It shows
what the ministry published, as published, and computes the weighted average
with the formulas printed in the ministerial circular.

## What it does

- **The institutions** — 248 universities, university centres, grandes écoles and
  ENS, with Arabic names, wilaya and type, each openable on its own page.
- **The programmes** — 261 programmes in 15 fields, rebuilt from the 4 185 rows
  of the official _Moyennes minimales BAC 2026_ file (final version, phase 2).
- **The life** — a practical guide to registration, housing, canteen and
  transport, the LMD system, the first year, the campus and its clubs, and
  study habits. Generic on purpose: each institution announces its own details.
- **Formulas per programme**, not per field: a language degree is ranked with
  that language, a translation degree with its three languages, a
  technical-stream candidate with the specialty subject — or with the general
  average where the circular says so.
- **Trends 2022 → 2026** for every programme whose filière code can be joined
  across sessions; older PDFs are linked but never turned into numbers.
- **Reading aid, not a promise**: the three published columns are priorities
  (أ1/أ2/أ3), so comparisons use the lowest printed number and say so.

`NC` (filière not saturated) and `--` (nobody oriented in that priority) are
shown exactly as published. No value is estimated, interpolated or invented.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS · static pages for the
browsable shell, on-demand ISR for the 261 programme and 248 institution pages.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used by metadata, `robots.txt`
and `sitemap.xml`.

## Design

Ivory paper (`#f7f4eb`), deep-navy bands (`#0f1524`), royal-indigo accent
(`#1e3a78`) and a copper rule (`#8f4a22`). Print typography in Amiri and
IBM Plex Sans Arabic, hairlines, tabular numerals, numbered sections, a 2px
radius. No shadows, no gradients, no glass.

## Data pipeline

The PDFs are **not** committed (2 MB each). To rebuild `data/`:

```bash
pip install pypdf
# bac-<year>.pdf for 2022…2026 in a directory, 2026 being the final file
python3 scripts/parse-minimums.py --pdf-dir /path/to/pdfs --out-dir data
python3 scripts/generate-names.py      # Arabic labels for all 261 programs
```

- `data/minimums.json` — 2026 rows, exactly as printed, plus the source block.
- `data/trends.json` — low/median/count per programme per session, plus
  per-session file statistics (2022 lists 131 institutions, 2026 lists 248 — the
  figures describe the programme, never the file's coverage).
- `data/institutions.json` — Arabic name, wilaya, wilaya code, type per code.
- `content/names.ts` — generated Arabic label for every programme; the generator
  reports anything it had to leave in French rather than guess.

## Layout

```
app/            routes: home, jamiat, takhasus, mayadin, hayat, hasiba
components/     ui shell, program list (tracks + themes), directory, search, LMD calculator, mark
lib/fields.ts   the 15 fields and 12 streams
lib/rule.ts     per-program weighting, kept because the BAC reader mirrors it
lib/calc.ts     numeric parsing shared by the data layer
lib/majors.ts   canonicalisation, tracks, themes, aggregates
scripts/        PDF → JSON, Arabic names generator
design/         preview board for this site and BAC DZ, plus page screenshots
public/mark.svg gate mark; public/mark-light.svg is the light variant for dark bands
```

`design/preview-both.png` shows both sites side by side with the mark, the
palette and what changed. `design/preview-both.html` is the source board, and
`design/screens/` holds the raw shots it was built from.

Sources: [MESRS](https://www.mesrs.dz), [circulaire.mesrs.dz](https://circulaire.mesrs.dz),
and the published minimums files. This site does not represent the ministry or
any university.
