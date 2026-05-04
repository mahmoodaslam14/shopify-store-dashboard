import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export async function sendRedemptionEmail(
  to: string,
  payload: { code: string; amountLabel: string; expiresAt: string }
) {
  const key = env().RESEND_API_KEY;
  const from = "Cashback <no-reply@example.com>";
  const subject = "Your cashback discount code";
  const text = `Your discount code: ${payload.code}\nValue: ${payload.amountLabel}\nExpires: ${payload.expiresAt}\nApply it at checkout on our store.`;

  if (!key) {
    logger.info("email.skipped_resend_not_configured", { to, ...payload });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    logger.error("email.resend_failed", { status: res.status, body });
  }
}
