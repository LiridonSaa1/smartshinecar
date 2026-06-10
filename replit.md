# Car Wash Pro

A full-stack car wash booking system with a premium public-facing website and an admin panel for managing bookings, services, analytics, and settings.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/car-wash run dev` — run the React frontend (port 22565)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `SESSION_SECRET` — used for any session-based auth

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (`lib/db`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API contract: OpenAPI spec in `lib/api-spec/openapi.yaml`
- API codegen: Orval (from OpenAPI spec) → `lib/api-client-react/src/generated/`
- Frontend: React + Vite, TanStack Query, Wouter routing, shadcn/ui, framer-motion, recharts
- Build: esbuild (CJS bundle for API server)

## Where things live

- `lib/db/src/schema/` — Drizzle ORM table definitions (users, services, bookings, reviews, settings)
- `lib/api-spec/openapi.yaml` — source of truth for all API endpoints
- `lib/api-client-react/src/generated/` — auto-generated React Query hooks + Zod schemas (do not edit manually)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/car-wash/src/pages/` — React pages (public + admin)
- `artifacts/car-wash/src/components/layout/` — Navbar and AdminLayout
- `artifacts/car-wash/src/lib/auth.ts` — Auth context (AuthProvider + useAuth)

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed hooks. Never edit `lib/api-client-react/src/generated/` manually; always regenerate.
- Body schema naming: use entity-shaped names (ServiceInput, BookingInput, etc.) NOT operation-shaped names to avoid TS2308 collision with Orval generated types.
- Auth token stored in `localStorage` under key `carwash_admin_token`; admin API routes protected via Bearer token middleware.
- Express route ordering: `GET /bookings/slots` placed before `GET /bookings/:id` to avoid param conflict.
- `auth.ts` + `auth.tsx` coexist: `auth.ts` has the real implementation (uses `React.createElement` since no JSX in `.ts`), `auth.tsx` re-exports from `auth.ts`. TypeScript prefers `.ts` over `.tsx` when both exist.

## Product

**Public site:**
- Home — hero, services preview, why-choose-us, stats, reviews, CTA, footer
- Services — service cards with images, pricing, duration, direct book buttons
- Booking — 4-step wizard (select service → date & time → customer info → confirm)
- Reviews — all customer reviews with star ratings, submit a new review
- About — company info, contact form, business hours from settings

**Admin panel** (at `/admin/*`, requires login):
- Login — dark-themed with demo credentials shown
- Dashboard — KPI stats, booking status breakdown, 30-day area chart, recent bookings table
- Bookings — filterable/searchable table, add/edit/delete bookings, status updates
- Services — manage service catalog (add/edit/delete, toggle active)
- Analytics — booking & revenue area charts, top services bar chart
- Settings — edit business name, address, phone, email, open/close times, slot duration, working days

**Admin credentials (demo):** `admin@carwash.com` / `admin123`

## User preferences

_Populate as needed._

## Gotchas

- Run codegen after any change to `lib/api-spec/openapi.yaml`: `pnpm --filter @workspace/api-spec run codegen`
- Do not call `pnpm run dev` at workspace root — use individual artifact workflows.
- `useGetAvailableSlots` has required (not optional) params — always pass a valid object, use `enabled: false` to skip fetching.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
