# Exec Dashboard

A minimal, monitor-optimized executive operations board. Upload an Excel file — every row becomes a KPI card.

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect the folder to a GitHub repo and import it in [vercel.com](https://vercel.com).

## Excel File Format

| Column | Required | Description |
|---|---|---|
| `title` | ✅ | Card label (e.g. "Annual Revenue") |
| `value` | ✅ | The number or text to display |
| `type` | ✅ | `currency` / `number` / `percent` / `text` / `time` / `ratio` |
| `subtitle` | optional | Small description line below the value |
| `color` | optional | `green` / `red` / `blue` / `yellow` / `orange` / `purple` / `gray` |
| `group` | optional | Section heading to group related cards |

A sample file (`sample-dashboard.xlsx`) is included.

## Features

- **Auto-parse** — drop any `.xlsx`, `.xls`, or `.csv` and cards appear instantly
- **Grouping** — use the `group` column to create labeled sections
- **Auto-refresh** — re-parses the uploaded file every 3 minutes
- **Fullscreen mode** — click the expand icon for monitor/TV display
- **Responsive grid** — fills the screen at any resolution
- **Color indicators** — optional per-card color theming
- **Smart formatting** — currency, percent, large number abbreviation (K/M/B)

## Extending

To add charts later, create a new card type (e.g. `type: sparkline`) and handle it in `components/KPICard.js`. The parser in `utils/parseExcel.js` passes all row data through unchanged.
