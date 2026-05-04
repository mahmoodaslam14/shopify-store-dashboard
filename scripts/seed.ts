import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import { hashPassword } from "../lib/auth/password";

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!url) throw new Error("DATABASE_URL required");
  if (!email || !password) {
    console.log("Set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD to create an admin user.");
    process.exit(0);
  }

  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);

  const passwordHash = await hashPassword(password);

  if (existing) {
    await db
      .update(schema.users)
      .set({ role: "admin", passwordHash })
      .where(eq(schema.users.id, existing.id));
    console.log("Updated existing user to admin:", email);
  } else {
    await db.insert(schema.users).values({
      email: email.toLowerCase(),
      passwordHash,
      name: "Admin",
      role: "admin",
    });
    console.log("Created admin user:", email);
  }

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
