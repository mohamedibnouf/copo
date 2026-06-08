# COPO KSA — Internal Transactions Demo

Demo web application for **COPO KSA / شركة كوبو لتقديم الوجبات** — internal payment vouchers, approvals, attachments, comments, and workflow timeline.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style components (Radix UI)
- lucide-react
- Mock data only (no backend)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard — stats, recent transactions, overview table |
| `/requests` | All requests list |
| `/requests/new` | Create new payment voucher request |
| `/requests/[id]` | Request detail + workflow/comments/files panel |

## Structure

```
src/
  app/           # Next.js pages
  components/    # UI, layout, requests, workflow, panel
  context/       # App state (mock CRUD)
  data/          # mock-data.ts
  lib/           # utils
  types/         # TypeScript types
```

## Demo Data

Includes sample request **FR266010** (filter maintenance — BLT Cafe) matching the reference workflow screenshots.

## Future

Code is structured for later integration with Supabase or PostgreSQL.
