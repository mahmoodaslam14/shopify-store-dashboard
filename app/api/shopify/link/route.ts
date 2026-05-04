import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth/get-user";
import { findCustomerByEmail } from "@/lib/shopify/admin";
import { env } from "@/lib/env";
import { HttpError, toResponse } from "@/lib/http-error";
import { rateLimitOrThrow } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.email(),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    rateLimitOrThrow("shopify_link", user.id, { max: 30 });

    const json = await req.json();
    const { email } = bodySchema.parse(json);
    const normalized = email.toLowerCase();
    if (normalized !== user.email) {
      throw new HttpError(400, "Email must match your account email");
    }

    const shop = env().SHOPIFY_SHOP;
    if (!shop) throw new HttpError(503, "Shopify is not configured");

    const customer = await findCustomerByEmail(normalized);
    if (!customer) {
      throw new HttpError(404, "No Shopify customer found with this email");
    }

    const db = getDb();
    const legacyId = customer.legacyResourceId;

    const [existing] = await db
      .select({ id: schema.shopifyCustomerLinks.id })
      .from(schema.shopifyCustomerLinks)
      .where(
        and(
          eq(schema.shopifyCustomerLinks.userId, user.id),
          eq(schema.shopifyCustomerLinks.shopDomain, shop)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .update(schema.shopifyCustomerLinks)
        .set({
          shopifyCustomerId: legacyId,
          emailVerified: true,
        })
        .where(eq(schema.shopifyCustomerLinks.id, existing.id));
    } else {
      await db.insert(schema.shopifyCustomerLinks).values({
        userId: user.id,
        shopDomain: shop,
        shopifyCustomerId: legacyId,
        emailVerified: true,
      });
    }

    return Response.json({ ok: true, shopifyCustomerId: legacyId });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
    }
    return toResponse(e);
  }
}
