## v0.0.1c.2 — June 2026

- `feature` Roadmap entries rendered as rows with horizontal card layout — each category (Planned, In Progress, Ideas, Done) is a labelled row with cards flowing inline
- `improvement` Roadmap category order standardised: Planned → In Progress → Ideas → Done
- `improvement` Roadmap categories styled with per-status background tint and coloured border
- `improvement` Roadmap card lists capped at ~4 visible entries with vertical scroll
- `feature` Time Tracking — monthly timesheet calendar with day-level entry (hours + tasks per day)
- `feature` Time Tracking — freelancer name and company settings persisted to localStorage
- `feature` Time Tracking — PDF export via jsPDF generating a weekly timesheet matching the standard spreadsheet format
- `improvement` PDF timesheet uses Excel-matched salmon fills, violet label column, black grid lines, and grey fill on logged days

## v0.0.1c.1 — June 2026

- `feature` Forecasting mechanism with 12-month rolling budget year, weighted average projection, and three-value summary cards (to date / projected / year-end)
- `feature` Roadmap and Time Tracking view shells added to sidebar navigation
- `feature` Markdown engine for rendering .md files as styled HTML or structured cards
- `feature` Roadmap and Changelog views powered by content/roadmap.md and content/changelog.md
- `fix` Chart.js race condition causing forecasting chart to not render on first Analytics tab load
- `fix` Section title labels rendering black when Dashboard had not been visited first in a session
- `improvement` Documentation split into per-view files: FEATURES.md and ANALYTICS.md
- `improvement` Budget year start picker persisted to localStorage and restored across sessions

## v0.0.1c.0 — June 2026

- `feature` Analytics view with lazy-loaded component architecture
- `feature` Spending and Earnings heatmaps with day-level activity intensity
- `feature` Quartile-based colour scaling on heatmaps
- `feature` Quarter and year navigation on heatmaps
- `feature` Sync toggle keeping both heatmaps on the same period
- `feature` Trends chart with income, expenses, savings, and cash flow lines
- `feature` Week, month, and quarter granularity on Trends

## v0.0.1d — June 2026

- `feature` Dashboard with staged entries workflow — stage, review, then commit
- `feature` Starting Funds as a one-time income entry
- `feature` Expenses by Category bar chart with period picker and legend
- `feature` Period-scoped export and import for the expenses chart
- `feature` Recent Transactions list with type and category filters
- `feature` Full History overlay mode for transaction list
- `feature` Overview cards: Income, Savings, Total Expenses, Flow
- `feature` Global backup export and import via JSON file
- `feature` Data persisted to localStorage across sessions
