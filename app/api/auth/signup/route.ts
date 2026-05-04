import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { getSession } from "@/lib/auth/session";
import { HttpError, toResponse } from "@/lib/http-error";
import { databaseUnavailableResponse } from "@/lib/db-errors";
import { rateLimitOrThrow } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    rateLimitOrThrow("signup", ip, { max: 20 });

    const json = await req.json();
    const parsed = bodySchema.parse(json);
    const db = getDb();

    const [existing] = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, parsed.email.toLowerCase()))
      .limit(1);
    if (existing) {
      throw new HttpError(409, "Email already registered");
    }

    const passwordHash = await hashPassword(parsed.password);
    const [user] = await db
      .insert(schema.users)
      .values({
        email: parsed.email.toLowerCase(),
        passwordHash,
        name: parsed.name,
        role: "customer",
      })
      .returning({ id: schema.users.id, email: schema.users.email, role: schema.users.role });

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.role = user.role;
    await session.save();

    return Response.json({ ok: true, user: { id: user.id, email: user.email } });
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
