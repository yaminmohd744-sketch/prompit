import type { FastifyInstance } from "fastify";
import { requireAuth } from "../middleware/auth.js";
import { db } from "@prompit/db";

export async function jobRoutes(app: FastifyInstance) {
  app.get("/:jobId", { preHandler: requireAuth }, async (req, reply) => {
    const { jobId } = req.params as { jobId: string };
    const payload = req.user as { userId: string };

    const generation = await db.generation.findFirst({
      where: { jobId, userId: payload.userId },
      select: {
        jobId: true,
        status: true,
        outputText: true,
        outputUrl: true,
        creditsUsed: true,
        model: true,
        mode: true,
        error: true,
      },
    });

    if (!generation) return reply.status(404).send({ error: "Job not found" });
    return generation;
  });
}
