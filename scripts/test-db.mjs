import "dotenv/config";
import postgres from "postgres";

const u = process.env.DATABASE_URL;
if (!u) {
  console.error("No DATABASE_URL");
  process.exit(1);
}
const sql = postgres(u, { max: 1 });
try {
  await sql`SELECT 1`;
  console.log("Database connection OK");
} catch (e) {
  console.error("Database connection failed:", e.message);
  process.exit(1);
}
await sql.end();
