import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth/get-user";
import { HttpError, toResponse } from "@/lib/http-error";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const db = getDb();
    const [link] = await db
      .select()
      .from(schema.shopifyCustomerLinks)
      .where(eq(schema.shopifyCustomerLinks.userId, user.id))
      .limit(1);
    if (!link) {
      throw new HttpError(400, "Link your Shopify account first");
    }
    const rows = await db
      .select()
      .from(schema.ordersCache)
      .where(
        and(
          eq(schema.ordersCache.shopDomain, link.shopDomain),
          eq(schema.ordersCache.shopifyCustomerId, link.shopifyCustomerId)
        )
      );
    return Response.json({
      orders: rows.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        totalPrice: o.totalPrice,
        currency: o.currency,
        financialStatus: o.financialStatus,
        fulfillmentStatus: o.fulfillmentStatus,
        createdAtShopify: o.createdAtShopify,
        lineItems: o.lineItemsJson ? JSON.parse(o.lineItemsJson) : [],
      })),
    });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    return toResponse(e);
  }
}
