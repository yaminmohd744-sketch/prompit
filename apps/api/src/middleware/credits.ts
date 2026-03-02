import type { FastifyRequest, FastifyReply } from "fastify";
import { db } from "@prompit/db";

export function requireCredits(minimumCredits: number) {
  return async function (req: FastifyRequest, reply: FastifyReply) {
    const payload = req.user as { userId: string };
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { credits: true },
    });

    if (!user || user.credits < minimumCredits) {
      return reply.status(402).send({
        error: "Insufficient credits",
        credits: user?.credits ?? 0,
        required: minimumCredits,
      });
    }
  };
}
