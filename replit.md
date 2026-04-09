# ALKABRAIN - Marketing Automation Platform

## Overview

ALKABRAIN is a full-stack marketing automation platform built for Indian SMBs. It enables users to find leads via DuckDuckGo scraping, send email and WhatsApp campaigns, manage templates, and track credits.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Clerk (Google + Email/Password)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Artifacts

- **leadflow** — React + Vite frontend (previewPath: `/`)
- **api-server** — Express API server (previewPath: `/api`)

## Features

1. **Authentication**: Clerk with Google OAuth + Email/Password
2. **Dashboard**: Credits balance, plan info, campaign stats
3. **Campaign Launcher**: Target niche, email subject/body, WhatsApp message, template loader
4. **Lead Scraper**: DuckDuckGo-based public email/phone/website scraping
5. **Email Sender**: Gmail SMTP via app password
6. **WhatsApp Integration**: Web WhatsApp session management
7. **Templates**: Save/reuse email and WA templates
8. **Billing**: Plans (₹5/3days, ₹99/month, ₹249/3months, ₹799/year) with webhook
9. **Credits System**: Credit tracking with history
10. **Terms & Privacy**: Comprehensive legal pages

## DB Schema

Tables: users, templates, campaigns, gmail_integrations, whatsapp_sessions, subscriptions, credit_transactions

## Routes

### API Routes (all under /api)
- GET /healthz
- GET /users/me
- GET /users/dashboard
- GET/POST /templates, PUT/DELETE /templates/:id
- GET/POST /campaigns, GET /campaigns/:id
- POST /leads/scrape (DuckDuckGo scraper)
- GET/POST /integrations/gmail
- GET /integrations/whatsapp/status
- POST /integrations/whatsapp/connect, /disconnect
- GET /billing/plans, GET /billing/subscription, POST /billing/webhook
- GET /credits/history

### Frontend Pages
- / — Landing page
- /sign-in, /sign-up — Clerk auth
- /pricing — Full pricing page
- /terms, /privacy — Legal pages
- /dashboard — Main dashboard (auth required)
- /campaigns, /campaigns/new, /campaigns/:id — Campaign management
- /templates — Template manager
- /leads — Lead scraper
- /integrations — Gmail + WhatsApp setup
- /billing — Plans and credits history
- /settings — Profile info
