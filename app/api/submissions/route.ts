import { z } from "zod";
import { and, eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireUser } from "@/lib/auth/get-user";
import { HttpError, toResponse } from "@/lib/http-error";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { normalizePostUrl } from "@/lib/fraud";

const createSchema = z.object({
  platform: z.string().min(1).max(64),
  postUrl: z.string().refine((s) => {
    try {
      new URL(s);
      return true;
    } catch {
      return false;
    }
  }, "Invalid URL"),
  notes: z.string().max(2000).optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.submissions)
      .where(eq(schema.submissions.userId, user.id));
    return Response.json({ submissions: rows });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    return toResponse(e);
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    if (user.suspended) throw new HttpError(403, "Account suspended");
    rateLimitOrThrow("submission_create", user.id, { max: 30 });

    const json = await req.json();
    const parsed = createSchema.parse(json);
    const normalized = normalizePostUrl(parsed.postUrl);

    const db = getDb();

    const [duplicate] = await db
      .select({ id: schema.submissions.id })
      .from(schema.submissions)
      .where(
        and(
          eq(schema.submissions.postUrlNormalized, normalized),
          inArray(schema.submissions.status, ["pending", "approved"])
        )
      )
      .limit(1);
    if (duplicate) {
      throw new HttpError(409, "This post was already submitted");
    }

    const [row] = await db
      .insert(schema.submissions)
      .values({
        userId: user.id,
        platform: parsed.platform,
        postUrl: parsed.postUrl.trim(),
        postUrlNormalized: normalized,
        notes: parsed.notes,
        status: "pending",
      })
      .returning();

    return Response.json({ submission: row });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
    }
    return toResponse(e);
  }
}
