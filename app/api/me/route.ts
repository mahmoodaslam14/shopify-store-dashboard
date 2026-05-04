import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getBalance } from "@/lib/ledger";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ user: null }, { status: 200 });
  }
  const db = getDb();
  const [link] = await db
    .select()
    .from(schema.shopifyCustomerLinks)
    .where(eq(schema.shopifyCustomerLinks.userId, user.id))
    .limit(1);
  const balance = await getBalance(db, user.id);
  return Response.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    shopifyLinked: Boolean(link),
    shopDomain: link?.shopDomain ?? env().SHOPIFY_SHOP ?? null,
    balancePoints: balance,
  });
}
