import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { HttpError } from "@/lib/http-error";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session.userId) return null;
  const db = getDb();
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.userId))
    .limit(1);
  return user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new HttpError(401, "Unauthorized");
  }
  return user;
}

export async function requireRole(
  allowed: Array<"admin" | "reviewer" | "support" | "customer">
) {
  const user = await requireUser();
  if (user.suspended) {
    throw new HttpError(403, "Account suspended");
  }
  const role = user.role;
  if (!allowed.includes(role as (typeof allowed)[number])) {
    throw new HttpError(403, "Forbidden");
  }
  return user;
}

export function isStaffRole(role: string) {
  return role === "admin" || role === "reviewer" || role === "support";
}
