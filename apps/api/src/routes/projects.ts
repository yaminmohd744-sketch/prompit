import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { db } from "@prompit/db";

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function projectRoutes(app: FastifyInstance) {
  app.get("/", { preHandler: requireAuth }, async (req) => {
    const payload = req.user as { userId: string };
    return db.project.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" },
    });
  });

  app.post("/", { preHandler: requireAuth }, async (req, reply) => {
    const payload = req.user as { userId: string };
    const body = createProjectSchema.parse(req.body);
    const project = await db.project.create({
      data: { ...body, userId: payload.userId },
    });
    return reply.status(201).send(project);
  });

  app.delete("/:id", { preHandler: requireAuth }, async (req, reply) => {
    const payload = req.user as { userId: string };
    const { id } = req.params as { id: string };
    await db.project.deleteMany({ where: { id, userId: payload.userId } });
    return reply.send({ ok: true });
  });
}
