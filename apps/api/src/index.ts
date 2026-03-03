import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { Redis } from "ioredis";
import { authRoutes } from "./routes/auth.js";
import { generateRoutes } from "./routes/generate.js";
import { jobRoutes } from "./routes/jobs.js";
import { userRoutes } from "./routes/users.js";
import { projectRoutes } from "./routes/projects.js";
import { billingRoutes } from "./routes/billing.js";
import { adminRoutes } from "./routes/admin.js";

const app = Fastify({ logger: true });

const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null })
  : undefined;

// Plugins
await app.register(cors, {
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  credentials: true,
});
await app.register(helmet, { contentSecurityPolicy: false });
await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
  redis: redisClient,
});
await app.register(jwt, {
  secret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
});

// Health check
app.get("/health", async () => ({ status: "ok", ts: Date.now() }));

// Routes
await app.register(authRoutes, { prefix: "/api/v1/auth" });
await app.register(generateRoutes, { prefix: "/api/v1/generate" });
await app.register(jobRoutes, { prefix: "/api/v1/jobs" });
await app.register(userRoutes, { prefix: "/api/v1/users" });
await app.register(projectRoutes, { prefix: "/api/v1/projects" });
await app.register(billingRoutes, { prefix: "/api/v1/billing" });
await app.register(adminRoutes, { prefix: "/api/v1/admin" });

const port = parseInt(process.env.PORT ?? "3001");

try {
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`API running on port ${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
