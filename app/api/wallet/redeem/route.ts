import { z } from "zod";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { getDb, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth/get-user";
import {
  createBasicDiscountCode,
  getShopCurrency,
} from "@/lib/shopify/admin";
import { getBalance } from "@/lib/ledger";
import { env } from "@/lib/env";
import { HttpError, toResponse } from "@/lib/http-error";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { sendRedemptionEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  points: z.number().int().positive(),
});

const mkCode = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 12);

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (user.suspended) throw new HttpError(403, "Account suspended");
    rateLimitOrThrow("wallet_redeem", user.id, { max: 20 });

    const json = await req.json();
    const { points } = bodySchema.parse(json);

    const db = getDb();
    const balance = await getBalance(db, user.id);
    if (balance < points) {
      throw new HttpError(400, "Insufficient points");
    }

    const [link] = await db
      .select()
      .from(schema.shopifyCustomerLinks)
      .where(eq(schema.shopifyCustomerLinks.userId, user.id))
      .limit(1);
    if (!link) {
      throw new HttpError(400, "Link your Shopify account before redeeming");
    }

    const ratio = env().POINTS_PER_CURRENCY_UNIT;
    const amountNumber = points / ratio;
    if (amountNumber <= 0) {
      throw new HttpError(400, "Redemption amount too small");
    }
    const amountStr = amountNumber.toFixed(2);

    let currency: string;
    try {
      currency = await getShopCurrency();
    } catch {
      throw new HttpError(503, "Unable to read shop currency from Shopify");
    }

    const code = `CB${mkCode()}`;
    const endsAtIso = new Date(Date.now() + 7 * 86400 * 1000).toISOString();
    const customerGid = `gid://shopify/Customer/${link.shopifyCustomerId}`;

    const [redemption] = await db
      .insert(schema.redemptions)
      .values({
        userId: user.id,
        points,
        status: "pending",
      })
      .returning({ id: schema.redemptions.id });

    try {
      const { shopifyDiscountId } = await createBasicDiscountCode({
        title: `Cashback ${code}`,
        code,
        amount: amountStr,
        customerGid,
        endsAtIso,
      });

      await db.transaction(async (tx) => {
        await tx.insert(schema.ledgerEntries).values({
          userId: user.id,
          delta: -points,
          reason: "redemption",
          refType: "redemption",
          refId: redemption.id,
        });
        await tx
          .update(schema.redemptions)
          .set({
            status: "completed",
            discountCode: code,
            shopifyDiscountId,
            completedAt: new Date(),
          })
          .where(eq(schema.redemptions.id, redemption.id));
      });

      await sendRedemptionEmail(user.email, {
        code,
        amountLabel: `${currency} ${amountStr}`,
        expiresAt: endsAtIso,
      });

      logger.info("wallet.redeem_ok", { userId: user.id, points, code });

      return Response.json({
        ok: true,
        discountCode: code,
        amount: amountStr,
        currency,
        expiresAt: endsAtIso,
      });
    } catch (err) {
      await db
        .update(schema.redemptions)
        .set({
          status: "failed",
          errorMessage: err instanceof Error ? err.message : String(err),
        })
        .where(eq(schema.redemptions.id, redemption.id));
      logger.error("wallet.redeem_failed", { err: String(err) });
      throw new HttpError(502, "Could not create Shopify discount. Try again later.");
    }
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
    }
    return toResponse(e);
  }
}
