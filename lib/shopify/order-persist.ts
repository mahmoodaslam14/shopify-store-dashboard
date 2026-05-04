import { eq, and } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { schema } from "@/lib/db";

type RestOrder = {
  id: number;
  order_number?: number;
  name?: string;
  total_price?: string;
  currency?: string;
  financial_status?: string | null;
  fulfillment_status?: string | null;
  line_items?: unknown;
  customer?: { id: number } | null;
  created_at?: string;
  updated_at?: string;
};

export async function upsertOrderFromPayload(
  db: Database,
  shopDomain: string,
  body: RestOrder
) {
  const customerId = body.customer?.id;
  if (!customerId) return { skipped: true as const, reason: "no_customer" };

  const shopifyOrderId = String(body.id);
  const shopifyCustomerId = String(customerId);
  const lineItemsJson = JSON.stringify(body.line_items ?? []);

  const existing = await db
    .select({ id: schema.ordersCache.id })
    .from(schema.ordersCache)
    .where(
      and(
        eq(schema.ordersCache.shopDomain, shopDomain),
        eq(schema.ordersCache.shopifyOrderId, shopifyOrderId)
      )
    )
    .limit(1);

  const row = {
    shopDomain,
    shopifyOrderId,
    shopifyCustomerId,
    orderNumber: body.name ?? String(body.order_number ?? ""),
    totalPrice: body.total_price ?? "0",
    currency: body.currency ?? "",
    financialStatus: body.financial_status ?? "",
    fulfillmentStatus: body.fulfillment_status ?? "",
    lineItemsJson,
    createdAtShopify: body.created_at
      ? new Date(body.created_at)
      : undefined,
    updatedAt: new Date(),
  };

  if (existing[0]) {
    await db
      .update(schema.ordersCache)
      .set(row)
      .where(eq(schema.ordersCache.id, existing[0].id));
  } else {
    await db.insert(schema.ordersCache).values(row);
  }

  return { skipped: false as const };
}
