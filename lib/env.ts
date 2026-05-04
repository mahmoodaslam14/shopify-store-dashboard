import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  SHOPIFY_SHOP: z.string().min(1).optional(),
  SHOPIFY_ACCESS_TOKEN: z.string().min(1).optional(),
  SHOPIFY_API_SECRET: z.string().min(1).optional(),
  SHOPIFY_API_VERSION: z.string().default("2025-01"),
  POINTS_PER_CURRENCY_UNIT: z.coerce.number().positive().default(100),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional(),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().min(8).optional(),
  RESEND_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  return envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SHOPIFY_SHOP: process.env.SHOPIFY_SHOP,
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET,
    SHOPIFY_API_VERSION: process.env.SHOPIFY_API_VERSION,
    POINTS_PER_CURRENCY_UNIT: process.env.POINTS_PER_CURRENCY_UNIT,
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_BOOTSTRAP_EMAIL: process.env.ADMIN_BOOTSTRAP_EMAIL,
    ADMIN_BOOTSTRAP_PASSWORD: process.env.ADMIN_BOOTSTRAP_PASSWORD,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  });
}

let cached: Env | null = null;

export function env(): Env {
  if (!cached) cached = loadEnv();
  return cached;
}
