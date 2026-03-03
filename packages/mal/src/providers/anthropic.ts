import Anthropic from "@anthropic-ai/sdk";
import type { Modality } from "@prompit/types";
import type { ModelProvider, GenerateRequest, GenerateResult } from "../types.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL_COSTS: Record<string, number> = {
  "claude-opus-4-6": 20,
  "claude-sonnet-4-6": 8,
  "claude-haiku-4-5-20251001": 2,
};

export class AnthropicProvider implements ModelProvider {
  id: string;
  modalities: Modality[] = ["text", "code"];
  private modelName: string;

  constructor(modelId: string, modelName: string) {
    this.id = modelId;
    this.modelName = modelName;
  }

  estimateCost(req: GenerateRequest): number {
    const tokensEst = Math.ceil(req.prompt.length / 4) + (req.parameters.maxTokens ?? 1024);
    return Math.ceil((tokensEst / 1000) * (MODEL_COSTS[this.modelName] ?? 8));
  }

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const message = await client.messages.create({
      model: this.modelName,
      max_tokens: (req.parameters.maxTokens as number) ?? 2048,
      messages: [{ role: "user", content: req.prompt }],
    });

    const outputText =
      message.content[0]?.type === "text" ? message.content[0].text : "";
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;
    const costCredits = Math.max(1, Math.ceil((tokensUsed / 1000) * (MODEL_COSTS[this.modelName] ?? 8)));

    return {
      jobId: req.jobId,
      status: "completed",
      costCredits,
      output: { outputText },
    };
  }
}
