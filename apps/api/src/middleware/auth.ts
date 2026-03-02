import type { FastifyRequest, FastifyReply } from "fastify";

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    const payload = req.user as { role?: string };
    if (payload.role !== "ADMIN") {
      return reply.status(403).send({ error: "Forbidden" });
    }
  } catch {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}
