/**
 * Map Postgres / config failures to a helpful API response for login & signup.
 */
export function databaseUnavailableResponse(err: unknown): Response | null {
  const msg = err instanceof Error ? err.message : String(err);
  const lower = msg.toLowerCase();
  if (
    msg.includes("DATABASE_URL is not configured") ||
    lower.includes("password authentication failed") ||
    lower.includes("connect econnrefused") ||
    (lower.includes("database") && lower.includes("does not exist")) ||
    (lower.includes("role") && lower.includes("does not exist"))
  ) {
    return Response.json(
      {
        error:
          "Database is not set up. Add POSTGRES_PASSWORD to .env (your local Postgres superuser password), then run: npm run db:init",
      },
      { status: 503 }
    );
  }
  return null;
}
