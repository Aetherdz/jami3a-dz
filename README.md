# جامعة الجزائر — Jami3a DZ

A standalone, Arabic-first reader for Algeria's published university-admission
minimums, plus a weighted-average calculator for the 2026 session.

It is deliberately **not** an orientation tool and **not** part of the BAC DZ
site: it only reads what the ministry published, reorganises it, and computes
the weighted average with the formulas printed in the ministerial circular.

## What it does

- **261 programs** in **15 fields**, rebuilt from the 4 185 rows of the official
  _Moyennes minimales BAC 2026_ file (final version, after phase 2).
- **248 institutions** with Arabic names, wilaya and type.
- **Formulas per program**, not per field: a language degree is ranked with that
  language, a translation degree with its three languages, a technical-stream
  candidate with the specialty subject — or with the general average where the
  circular says so.
- **Trends 2022 → 2026** for every program whose filière code can be joined
  across sessions; older PDFs are linked but never turned into numbers.
- **Reading aid, not a promise**: the three published columns are priorities
  (أ1/أ2/أ3), so comparisons use the lowest printed number and say so.

`NC` (filière not saturated) and `--` (nobody oriented in that priority) are
shown exactly as published. No value is estimated, interpolated or invented.

## Stack

Next.js 15 (App Router) · React 19 · Tailwind CSS · static pages for the
browsable shell, on-demand ISR for the 261 program and 248 institution pages.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

`NEXT_PUBLIC_SITE_URL` sets the canonical origin used by metadata, `robots.txt`
and `sitemap.xml`.

## Data pipeline

The PDFs are **not** committed (2 MB each). To rebuild `data/`:

```bash
pip install pypdf
# bac-<year>.pdf for 2022…2026 in a directory, 2026 being the final file
python3 scripts/parse-minimums.py --pdf-dir /path/to/pdfs --out-dir data
python3 scripts/generate-names.py      # Arabic labels for all 261 programs
```

- `data/minimums.json` — 2026 rows, exactly as printed, plus the source block.
- `data/trends.json` — low/median/count per program per session, plus per-session
  file statistics (2022 lists 131 institutions, 2026 lists 248 — the figures
  describe the program, never the file's coverage).
- `data/institutions.json` — Arabic name, wilaya, wilaya code, type per code.
- `content/names.ts` — generated Arabic label for every program; the generator
  reports anything it had to leave in French rather than guess.

## Layout

```
app/            routes: home, mayadin, takhasus, jamiat, hasiba, kayfa, sanawat
components/     ui shell, program list (tracks + themes), tables, search, calculator
lib/fields.ts   the 15 fields, 12 streams, eligibility, formula table
lib/rule.ts     per-program formula and essential subjects
lib/calc.ts     pure weighted-average arithmetic and buckets
lib/majors.ts   canonicalisation, tracks, themes, aggregates, trends
scripts/        PDF → JSON, Arabic names generator
```

Sources: [MESRS](https://www.mesrs.dz), [circulaire.mesrs.dz](https://circulaire.mesrs.dz),
and the published minimums files. This site does not represent the ministry or
any university.
