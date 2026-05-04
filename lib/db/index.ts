import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "@/lib/env";

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const url = env().DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!dbInstance) {
    client = postgres(url, { max: 10 });
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

export type Database = ReturnType<typeof getDb>;
export { schema };
