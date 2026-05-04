import crypto from "crypto";
import { env } from "@/lib/env";

export function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null) {
  const secret = env().SHOPIFY_API_SECRET;
  if (!secret || !hmacHeader) return false;
  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}
