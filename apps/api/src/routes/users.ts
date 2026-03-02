import type { FastifyInstance } from "fastify";
import { requireAuth } from "../middleware/auth.js";
import { db } from "@prompit/db";

export async function userRoutes(app: FastifyInstance) {
  app.get("/me", { preHandler: requireAuth }, async (req, reply) => {
    const payload = req.user as { userId: string };
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, plan: true, credits: true, createdAt: true },
    });
    if (!user) return reply.status(404).send({ error: "User not found" });
    return user;
  });

  app.get("/me/credits", { preHandler: requireAuth }, async (req) => {
    const payload = req.user as { userId: string };
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { credits: true },
    });
    return { credits: user?.credits ?? 0 };
  });
}
