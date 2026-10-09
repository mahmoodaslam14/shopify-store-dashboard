# Shopify Store Dashboard

A customer dashboard for a Shopify store with a **UGC cashback** program. Customers link their store account, see their orders, post content about products (Instagram, TikTok, YouTube), and earn points that they redeem as single-use Shopify discount codes. Admins review submissions from their own panel.

Built with **Next.js (App Router)**, **TypeScript**, **PostgreSQL + Drizzle ORM** and the **Shopify Admin API**.

## Features

**For customers**
- Sign up and log in (argon2 password hashing, encrypted cookie sessions)
- Link a Shopify customer account by email and see synced orders and addresses
- Submit UGC links for cashback, with link previews
- Wallet with a points ledger, and redemption into a single-use Shopify discount code
- Profile and password settings
- Badges, leaderboard and wishlist screens (UI built, currently on mock data)

**For admins**
- Review queue to approve or reject submissions
- Audit log of admin actions

**Under the hood**
- Shopify webhooks (`orders/create`, `orders/updated`) with HMAC verification
- Cron endpoint to reconcile orders against Shopify
- Points ledger that records every earn and redemption
- Rate limiting and basic fraud checks on redemptions
- Environment validation with zod
- Unit tests with Vitest

## Tech stack

| Area | Tech |
| --- | --- |
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL, Drizzle ORM |
| Auth | iron-session, argon2 |
| Integrations | Shopify Admin GraphQL API, webhooks, Resend email |
| Testing | Vitest |

## Getting started

Requirements: Node.js 20+, and Docker (or any PostgreSQL 16 database).

```bash
npm install
cp .env.example .env.local     # fill in your own values

docker compose up -d           # local PostgreSQL
npm run db:push                # create tables from the Drizzle schema
npm run db:seed                # optional: create the first admin user

npm run dev                    # http://localhost:3000
```

### Shopify setup

Create a custom app in your Shopify admin, give it the scopes listed in [`docs/SHOPIFY_SCOPES.md`](docs/SHOPIFY_SCOPES.md), and put the shop domain, Admin API access token and API secret in `.env.local`. Point the `orders/create` and `orders/updated` webhooks at `/api/webhooks/shopify`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run test` | Run tests with Vitest |
| `npm run db:push` | Sync the schema to the database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Create or promote the admin user |

## Project structure

```
app/            pages (dashboard, admin, auth) and API routes
components/     UI components
lib/            auth, database, Shopify client, ledger, fraud checks
drizzle/        SQL migrations
scripts/        database setup and seed scripts
docs/           Shopify scopes and redemption notes
```

## License

MIT
