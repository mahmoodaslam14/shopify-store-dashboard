import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { getSession } from "@/lib/auth/session";
import { HttpError, toResponse } from "@/lib/http-error";
import { databaseUnavailableResponse } from "@/lib/db-errors";
import { rateLimitOrThrow } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    rateLimitOrThrow("login", ip, { max: 40 });

    const json = await req.json();
    const parsed = bodySchema.parse(json);
    const db = getDb();

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, parsed.email.toLowerCase()))
      .limit(1);
    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }
    const ok = await verifyPassword(user.passwordHash, parsed.password);
    if (!ok) {
      throw new HttpError(401, "Invalid email or password");
    }
    if (user.suspended) {
      throw new HttpError(403, "Account suspended");
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.role = user.role;
    await session.save();

    return Response.json({
      ok: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
    }
    const dbResp = databaseUnavailableResponse(e);
    if (dbResp) return dbResp;
    return toResponse(e);
  }
}
