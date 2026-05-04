import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export type SessionData = {
  userId?: string;
  email?: string;
  role?: string;
};

function options(): SessionOptions {
  const secret = env().SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be set (min 32 characters)");
  }
  return {
    password: secret,
    cookieName: "cd_session",
    cookieOptions: {
      httpOnly: true,
      secure: env().NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    },
  };
}

export async function getSession() {
  const store = await cookies();
  return getIronSession<SessionData>(store, options());
}

export async function clearSession() {
  const session = await getSession();
  session.destroy();
}
