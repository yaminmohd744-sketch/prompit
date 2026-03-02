import type { FastifyInstance } from "fastify";
import { requireAdmin } from "../middleware/auth.js";
import { db } from "@prompit/db";

export async function adminRoutes(app: FastifyInstance) {
  app.get("/users", { preHandler: requireAdmin }, async (req) => {
    const { page = "1", limit = "50" } = req.query as Record<string, string>;
    return db.user.findMany({
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, plan: true, credits: true, createdAt: true },
    });
  });

  app.put("/users/:id/credits", { preHandler: requireAdmin }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const { amount } = req.body as { amount: number };
    const user = await db.user.update({
      where: { id },
      data: { credits: { increment: amount } },
      select: { id: true, credits: true },
    });
    return user;
  });

  app.get("/model-usage", { preHandler: requireAdmin }, async () => {
    const usage = await db.generation.groupBy({
      by: ["model"],
      _count: { id: true },
      _sum: { creditsUsed: true },
      orderBy: { _count: { id: "desc" } },
    });
    return usage;
  });
}
