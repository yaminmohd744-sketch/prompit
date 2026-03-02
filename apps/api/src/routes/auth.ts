import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@prompit/db";

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (req, reply) => {
    const body = registerSchema.parse(req.body);

    const existing = await db.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return reply.status(409).send({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        credits: 100,
      },
      select: { id: true, name: true, email: true, plan: true, credits: true },
    });

    const accessToken = app.jwt.sign(
      { userId: user.id, role: "USER" },
      { expiresIn: "15m" }
    );

    return reply.status(201).send({ user, accessToken });
  });

  app.post("/login", async (req, reply) => {
    const body = loginSchema.parse(req.body);

    const user = await db.user.findUnique({ where: { email: body.email } });
    if (!user || !user.passwordHash) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const accessToken = app.jwt.sign(
      { userId: user.id, role: "USER" },
      { expiresIn: "15m" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
      },
      accessToken,
    };
  });

  app.post("/logout", async (_req, reply) => {
    return reply.send({ ok: true });
  });
}
