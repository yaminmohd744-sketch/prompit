#!/usr/bin/env node
/**
 * Run this AFTER adding billing to https://dashboard.render.com/billing
 * Usage: node scripts/create-render-service.js
 *
 * After success, add the printed Service ID as RENDER_SERVICE_ID in GitHub secrets:
 * https://github.com/yaminmohd744-sketch/prompit/settings/secrets/actions
 */
const https = require("https");

const RENDER_API_KEY =
  process.env.RENDER_API_KEY || "rnd_FGg5RvdCXdv54KoQyzC6H38yGweD";
const buildCmd =
  "npm install -g pnpm@10 && pnpm install --frozen-lockfile && " +
  "pnpm --filter @prompit/db exec prisma generate && " +
  "pnpm --filter @prompit/api build";

const body = JSON.stringify({
  type: "web_service",
  name: "prompit-api",
  ownerId: "tea-d6jbvuv5r7bs73eupukg",
  repo: "https://github.com/yaminmohd744-sketch/prompit",
  branch: "main",
  plan: "free",
  region: "oregon",
  serviceDetails: {
    env: "node",
    healthCheckPath: "/health",
    envSpecificDetails: {
      buildCommand: buildCmd,
      startCommand: "node apps/api/dist/index.js",
    },
  },
  envVars: [
    { key: "NODE_ENV", value: "production" },
    {
      key: "DATABASE_URL",
      value:
        "postgresql://postgres:Prompit2024Secure1@db.zxhskwnhmwzkoaklhsxv.supabase.co:5432/postgres",
    },
    { key: "FRONTEND_URL", value: "https://prompit-web.vercel.app" },
    {
      key: "JWT_SECRET",
      value: "e2fd33205043c0abf82e13b06f88be7df5351b7cd2096869f015ba26003baca4",
    },
  ],
});

const options = {
  hostname: "api.render.com",
  path: "/v1/services",
  method: "POST",
  headers: {
    Authorization: `Bearer ${RENDER_API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  },
};

console.log("Creating Render service prompit-api...");
const req = https.request(options, (res) => {
  let data = "";
  res.on("data", (c) => (data += c));
  res.on("end", () => {
    const r = JSON.parse(data);
    if (r.service) {
      console.log("\n✅ Service created successfully!");
      console.log("Service ID:", r.service.id);
      console.log("URL: https://prompit-api.onrender.com");
      console.log("\nNext steps:");
      console.log(
        "1. Add RENDER_SERVICE_ID to GitHub secrets at:"
      );
      console.log(
        "   https://github.com/yaminmohd744-sketch/prompit/settings/secrets/actions"
      );
      console.log("   Value:", r.service.id);
      console.log("2. Wait for the first deploy to complete (~5 min)");
      console.log("3. Test the API: https://prompit-api.onrender.com/health");
    } else {
      console.error("\n❌ Failed:", r.message);
      if (res.statusCode === 402) {
        console.log(
          "→ Add a payment method at: https://dashboard.render.com/billing"
        );
        console.log("  (Free tier is still free — card is just for identity)");
        console.log("  Then run this script again.");
      }
    }
  });
});
req.on("error", (e) => console.error("Error:", e.message));
req.write(body);
req.end();
