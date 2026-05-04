import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireRole } from "@/lib/auth/get-user";
import { HttpError, toResponse } from "@/lib/http-error";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  action: z.enum(["approve", "reject"]),
  points: z.number().int().positive().optional(),
  adminNote: z.string().max(2000).optional(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireRole(["admin", "reviewer", "support"]);
    const { id } = await context.params;
    const json = await req.json();
    const body = patchSchema.parse(json);

    if (body.action === "approve" && (body.points === undefined || body.points < 1)) {
      throw new HttpError(400, "points is required for approval");
    }

    const db = getDb();

    const [sub] = await db
      .select()
      .from(schema.submissions)
      .where(eq(schema.submissions.id, id))
      .limit(1);
    if (!sub) throw new HttpError(404, "Submission not found");
    if (sub.status !== "pending") {
      throw new HttpError(400, "Submission already reviewed");
    }

    if (body.action === "reject") {
      await db.transaction(async (tx) => {
        await tx
          .update(schema.submissions)
          .set({
            status: "rejected",
            adminNote: body.adminNote ?? null,
            reviewedBy: admin.id,
            reviewedAt: new Date(),
          })
          .where(eq(schema.submissions.id, id));
        await tx.insert(schema.adminAuditLog).values({
          adminUserId: admin.id,
          action: "submission.reject",
          entityType: "submission",
          entityId: id,
          meta: JSON.stringify({ adminNote: body.adminNote }),
        });
      });
      logger.info("submission.rejected", { id, by: admin.id });
      return Response.json({ ok: true });
    }

    const points = body.points ?? 0;
    await db.transaction(async (tx) => {
      await tx
        .update(schema.submissions)
        .set({
          status: "approved",
          pointsAwarded: points,
          adminNote: body.adminNote ?? null,
          reviewedBy: admin.id,
          reviewedAt: new Date(),
        })
        .where(eq(schema.submissions.id, id));

      await tx.insert(schema.ledgerEntries).values({
        userId: sub.userId,
        delta: points,
        reason: "submission_approved",
        refType: "submission",
        refId: id,
        adminUserId: admin.id,
      });

      await tx.insert(schema.adminAuditLog).values({
        adminUserId: admin.id,
        action: "submission.approve",
        entityType: "submission",
        entityId: id,
        meta: JSON.stringify({ points }),
      });
    });

    logger.info("submission.approved", { id, points, by: admin.id });
    return Response.json({ ok: true, pointsAwarded: points });
  } catch (e) {
    if (e instanceof HttpError) return toResponse(e);
    if (e instanceof z.ZodError) {
      return Response.json({ error: "Invalid input", issues: e.issues }, { status: 400 });
    }
    return toResponse(e);
  }
}
