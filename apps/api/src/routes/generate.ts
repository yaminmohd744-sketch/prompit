import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "../middleware/auth.js";
import { mal } from "@prompit/mal";
import { db } from "@prompit/db";
import type { Modality } from "@prompit/types";

const generateSchema = z.object({
  prompt: z.string().min(1).max(32000),
  model: z.string().min(1),
  parameters: z.record(z.unknown()).optional().default({}),
});

function makeGenerateRoute(mode: Modality) {
  return async function (req: FastifyInstance["_Rec"], reply: FastifyInstance["_Rec"]) {
    const payload = (req as { user: { userId: string } }).user;
    const body = generateSchema.parse((req as { body: unknown }).body);
    const jobId = uuidv4();

    const provider = mal.getProvider(body.model);
    if (!provider) {
      return (reply as { status: (n: number) => { send: (d: unknown) => unknown } })
        .status(400)
        .send({ error: `Unknown model: ${body.model}` });
    }

    const estimatedCost = provider.estimateCost({ ...body, mode, jobId, userId: payload.userId });

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { credits: true },
    });

    if (!user || user.credits < estimatedCost) {
      return (reply as { status: (n: number) => { send: (d: unknown) => unknown } })
        .status(402)
        .send({ error: "Insufficient credits", required: estimatedCost });
    }

    await db.generation.create({
      data: {
        jobId,
        userId: payload.userId,
        prompt: body.prompt,
        mode,
        model: body.model,
        parameters: body.parameters,
        status: "pending",
        creditsUsed: estimatedCost,
      },
    });

    const result = await mal.generate({
      prompt: body.prompt,
      model: body.model,
      mode,
      parameters: body.parameters,
      userId: payload.userId,
      jobId,
    });

    await db.$transaction([
      db.user.update({
        where: { id: payload.userId },
        data: { credits: { decrement: result.costCredits } },
      }),
      db.generation.update({
        where: { jobId },
        data: {
          status: result.status,
          outputText: "outputText" in result.output ? result.output.outputText : null,
          outputUrl: "outputUrl" in result.output ? result.output.outputUrl : null,
          creditsUsed: result.costCredits,
        },
      }),
      db.creditTransaction.create({
        data: {
          userId: payload.userId,
          amount: -result.costCredits,
          type: "usage",
          reference: jobId,
        },
      }),
    ]);

    return { jobId, output: result.output, creditsUsed: result.costCredits };
  };
}

export async function generateRoutes(app: FastifyInstance) {
  const modes: Modality[] = ["text", "image", "video", "audio", "code", "3d"];

  for (const mode of modes) {
    app.post(`/${mode}`, { preHandler: requireAuth }, makeGenerateRoute(mode) as Parameters<typeof app.post>[2]);
  }
}
