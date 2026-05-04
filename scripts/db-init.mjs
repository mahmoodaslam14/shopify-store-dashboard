/**
 * One command: create `dashboard` + `customer_dashboard`, sync password with .env, run drizzle push.
 * Requires in .env: POSTGRES_PASSWORD=<your local postgres superuser password>
 */
import "dotenv/config";
import { execSync } from "node:child_process";
import postgres from "postgres";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const pass = process.env.POSTGRES_PASSWORD?.trim();
if (!pass) {
  console.error(
    "\n  Add this to your .env file, then run again:\n" +
      "  POSTGRES_PASSWORD=your_postgres_superuser_password\n" +
      "  (Windows: the password you chose for the built-in `postgres` user.)\n"
  );
  process.exit(1);
}

const host = process.env.POSTGRES_HOST || "localhost";
const port = process.env.POSTGRES_PORT || "5432";
const superName = process.env.POSTGRES_USER || "postgres";
const adminUrl = `postgresql://${encodeURIComponent(superName)}:${encodeURIComponent(
  pass
)}@${host}:${port}/postgres`;

const appPass = "dashboard_dev_password";
const appDb = "customer_dashboard";
const appUser = "dashboard";

const sql = postgres(adminUrl, { max: 1 });
await sql`SELECT 1`;
console.log("Connected as superuser.");

const du = await sql`
  SELECT 1 AS x FROM pg_roles WHERE rolname = ${appUser}
`;
if (!du.length) {
  await sql.unsafe(
    `CREATE USER ${appUser} WITH LOGIN PASSWORD '${appPass.replace(/'/g, "''")}'`
  );
  console.log(`Created role ${appUser}.`);
} else {
  await sql.unsafe(
    `ALTER USER ${appUser} WITH PASSWORD '${appPass.replace(/'/g, "''")}'`
  );
  console.log(`Updated password for existing role ${appUser}.`);
}

try {
  await sql.unsafe(`CREATE DATABASE ${appDb} OWNER ${appUser}`);
  console.log(`Created database ${appDb}.`);
} catch (e) {
  const msg = String(e.message ?? e);
  if (!msg.includes("already exists")) throw e;
  console.log(`Database ${appDb} already exists; ensuring owner…`);
  await sql.unsafe(`ALTER DATABASE ${appDb} OWNER TO ${appUser}`);
}

await sql.end();

console.log("\nApplying Drizzle schema (drizzle-kit push)…\n");
execSync("npx drizzle-kit push --force", {
  stdio: "inherit",
  cwd: root,
  env: { ...process.env },
});

console.log("\nDone. You can sign up at http://localhost:3000/signup\n");
