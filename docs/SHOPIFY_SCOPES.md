# Shopify app scopes and cashback (discount) validation

This spike documents the Admin API access needed for the customer dashboard and discount-based cashback redemption.

## Required OAuth / custom app scopes

| Scope | Purpose |
|--------|---------|
| `read_customers` | Look up customers by email for account linking; read addresses if mirrored |
| `write_customers` | Optional: sync profile or address changes from the dashboard to Shopify |
| `read_orders` | Backfill and reconcile orders for linked customers |
| `read_all_orders` | **Often required** if orders are older than 60 days or for broader reconciliation (Shopify may show this as a separate scope in some setups) |
| `write_discounts` | Create price rules / discount codes when users redeem cashback |

Webhook subscriptions are registered on the custom app (Admin: `orders/create`, `orders/updated`; optional `customers/update`).

## Discount redemption (your chosen model)

- **Implementation:** We create a **single-use** basic discount code via the Admin GraphQL API (`discountCodeBasicCreate`) with a fixed **order** discount amount derived from redeemed points.
- **Customer targeting:** Where supported, the discount uses `customerSelection: { customers: { add: [customerGid] } }` so the code only applies to the linked Shopify customer. If your shop/plan or API version limits customer targeting on basic codes, fall back to a short TTL, usage limit of **1**, `appliesOncePerCustomer: true`, and rely on **audit + fraud controls** (rate limits, ledger reversals).
- **Fixed vs percentage:** The MVP uses **fixed amount** in shop currency (configured via `POINTS_PER_CURRENCY_UNIT`). Percentage discounts can be added later using the same mutation with a percentage value input.

## Environment variables

See root `.env.example` for `SHOPIFY_SHOP`, `SHOPIFY_ACCESS_TOKEN`, `SHOPIFY_API_SECRET` (webhook HMAC), and `SHOPIFY_API_VERSION`.

## References

- [Admin GraphQL `discountCodeBasicCreate`](https://shopify.dev/docs/api/admin-graphql/latest/mutations/discountCodeBasicCreate)
- [Webhook verification](https://shopify.dev/docs/apps/build/webhooks/subscribe/https)
