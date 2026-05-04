import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth/get-user";
import { HttpError, toResponse } from "@/lib/http-error";
import { rateLimitOrThrow } from "@/lib/rate-limit";

const patchSchema = z.object({
  name: z.string().min(1).max(120),
});

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    rateLimitOrThrow("profile_update", user.id, { max: 60 });

    const json = await req.json();
    const body = patchSchema.parse(json);
    const db = getDb();

    await db
      .update(schema.users)
      .set({
        name: body.name.trim(),
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, user.id));

    return Response.json({ ok: true, name: body.name.trim() });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
    }
    return toResponse(e);
  }
}
