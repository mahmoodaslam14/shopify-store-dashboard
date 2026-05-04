import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, string> = {
    app: "ok",
    db: env().DATABASE_URL ? "configured" : "missing",
    shopify: env().SHOPIFY_SHOP ? "configured" : "missing",
    session: env().SESSION_SECRET ? "configured" : "missing",
  };
  const ok = checks.db === "configured" && checks.session === "configured";
  if (!ok) {
    logger.warn("health.degraded", checks);
  }
  return Response.json(
    { status: ok ? "ok" : "degraded", checks },
    { status: ok ? 200 : 503 }
  );
}
