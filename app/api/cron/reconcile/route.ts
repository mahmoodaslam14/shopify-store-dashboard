import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { cleanupRateBuckets } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * Scheduled reconciliation hook: extend with Admin API order polling per linked customer.
 * Protect with a shared secret header in production.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("Authorization");
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    if (!secret) {
      return new Response("CRON_SECRET not configured", { status: 501 });
    }
    if (auth !== `Bearer ${secret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  } else if (secret && auth !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  cleanupRateBuckets();
  logger.info("cron.reconcile_tick", {
    shopConfigured: Boolean(env().SHOPIFY_SHOP),
  });

  return Response.json({
    ok: true,
    message:
      "Webhook pipeline is primary; expand this job to backfill orders via Admin API if needed.",
  });
}
