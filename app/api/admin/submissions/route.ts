import { eq, desc } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireRole } from "@/lib/auth/get-user";
import { HttpError, toResponse } from "@/lib/http-error";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireRole(["admin", "reviewer", "support"]);
    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    const db = getDb();
    const rows = status
      ? await db
          .select()
          .from(schema.submissions)
          .where(eq(schema.submissions.status, status))
          .orderBy(desc(schema.submissions.createdAt))
      : await db
          .select()
          .from(schema.submissions)
          .orderBy(desc(schema.submissions.createdAt));

    return Response.json({ submissions: rows });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    return toResponse(e);
  }
}
