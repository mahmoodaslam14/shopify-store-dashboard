import { eq, sql } from "drizzle-orm";
import type { Database } from "@/lib/db";
import { schema } from "@/lib/db";

export async function getBalance(db: Database, userId: string) {
  const [row] = await db
    .select({
      balance: sql<number>`coalesce(sum(${schema.ledgerEntries.delta}), 0)`,
    })
    .from(schema.ledgerEntries)
    .where(eq(schema.ledgerEntries.userId, userId));
  return Number(row?.balance ?? 0);
}
