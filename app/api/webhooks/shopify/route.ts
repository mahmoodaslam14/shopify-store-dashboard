import crypto from "crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { verifyShopifyWebhook } from "@/lib/shopify/webhook-verify";
import { upsertOrderFromPayload } from "@/lib/shopify/order-persist";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { HttpError, toResponse } from "@/lib/http-error";

export const dynamic = "force-dynamic";

const orderSchema = z
  .object({
    id: z.number(),
    order_number: z.number().optional(),
    name: z.string().optional(),
    total_price: z.string().optional(),
    currency: z.string().optional(),
    financial_status: z.string().nullable().optional(),
    fulfillment_status: z.string().nullable().optional(),
    line_items: z.array(z.unknown()).optional(),
    customer: z.object({ id: z.number() }).nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .passthrough();

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const hmac = req.headers.get("X-Shopify-Hmac-Sha256");
    const shopDomain =
      req.headers.get("X-Shopify-Shop-Domain") ?? env().SHOPIFY_SHOP ?? "";
    const webhookId = req.headers.get("X-Shopify-Webhook-Id");
    const topic = req.headers.get("X-Shopify-Topic") ?? "unknown";

    if (!verifyShopifyWebhook(rawBody, hmac)) {
      logger.warn("webhook.invalid_hmac", { topic, shopDomain });
      throw new HttpError(401, "Invalid webhook signature");
    }

    const db = getDb();

    const idempotencyKey =
      webhookId ||
      `${shopDomain}:${topic}:${hashBody(rawBody)}`;
    const inserted = await db
      .insert(schema.webhookEvents)
      .values({
        idempotencyKey,
        topic,
        shopDomain: shopDomain || "unknown",
        processed: false,
      })
      .onConflictDoNothing({ target: schema.webhookEvents.idempotencyKey })
      .returning({ id: schema.webhookEvents.id });

    if (!inserted.length) {
      return Response.json({ ok: true, duplicate: true });
    }

    const payload = JSON.parse(rawBody) as unknown;
    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) {
      logger.warn("webhook.order_parse_skipped", { topic });
      await db
        .update(schema.webhookEvents)
        .set({ processed: true })
        .where(eq(schema.webhookEvents.idempotencyKey, idempotencyKey));
      return Response.json({ ok: true, skipped: "parse" });
    }

    if (topic === "orders/create" || topic === "orders/updated") {
      const r = await upsertOrderFromPayload(
        db,
        shopDomain,
        parsed.data as Parameters<typeof upsertOrderFromPayload>[2]
      );
      logger.info("webhook.order_upserted", { topic, shopDomain, ...r });
    }

    await db
      .update(schema.webhookEvents)
      .set({ processed: true })
      .where(eq(schema.webhookEvents.idempotencyKey, idempotencyKey));

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    logger.error("webhook.error", { err: String(e) });
    return toResponse(e);
  }
}

function hashBody(rawBody: string) {
  return crypto.createHash("sha256").update(rawBody).digest("hex");
}
