import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth/get-user";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { HttpError, toResponse } from "@/lib/http-error";
import { rateLimitOrThrow } from "@/lib/rate-limit";

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    rateLimitOrThrow("password_change", user.id, { max: 15 });

    const json = await req.json();
    const body = bodySchema.parse(json);

    const db = getDb();
    const [row] = await db
      .select({ passwordHash: schema.users.passwordHash })
      .from(schema.users)
      .where(eq(schema.users.id, user.id))
      .limit(1);

    if (!row) throw new HttpError(404, "User not found");

    const ok = await verifyPassword(row.passwordHash, body.currentPassword);
    if (!ok) throw new HttpError(401, "Current password is incorrect");

    const passwordHash = await hashPassword(body.newPassword);
    await db
      .update(schema.users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(schema.users.id, user.id));

    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
    }
    return toResponse(e);
  }
}
