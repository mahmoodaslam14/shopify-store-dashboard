/**
 * One-time: create `dashboard` role + `customer_dashboard` database on a local Postgres.
 * Usage (PowerShell):
 *   $env:ADMIN_DATABASE_URL = "postgresql://postgres:YOUR_SUPERUSER_PASSWORD@localhost:5432/postgres"
 *   npm run db:setup
 */
import postgres from "postgres";

const adminUrl = process.env.ADMIN_DATABASE_URL;
if (!adminUrl) {
  console.error(
    "Set ADMIN_DATABASE_URL, e.g. postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres"
  );
  process.exit(1);
}

const sql = postgres(adminUrl, { max: 1 });
await sql`SELECT 1`;

try {
  await sql.unsafe(
    `CREATE USER dashboard WITH PASSWORD 'dashboard_dev_password'`
  );
  console.log("Created role dashboard");
} catch (e) {
  const msg = String(e.message ?? e);
  if (!msg.includes("already exists")) throw e;
  console.log("Role dashboard already exists");
}

try {
  await sql.unsafe(
    `CREATE DATABASE customer_dashboard OWNER dashboard`
  );
  console.log("Created database customer_dashboard");
} catch (e) {
  const msg = String(e.message ?? e);
  if (!msg.includes("already exists")) throw e;
  console.log("Database customer_dashboard already exists");
}

await sql.end();
console.log("Done. DATABASE_URL in .env should match dashboard credentials.");
