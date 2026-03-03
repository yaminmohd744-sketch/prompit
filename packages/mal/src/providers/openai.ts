import OpenAI from "openai";
import type { Modality } from "@prompit/types";
import type { ModelProvider, GenerateRequest, GenerateResult } from "../types.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "not-configured" });

// Cost in credits per 1K tokens (input+output average)
const MODEL_COSTS: Record<string, number> = {
  "gpt-4o": 10,
  "gpt-4o-mini": 2,
  "gpt-4-turbo": 12,
};

export class OpenAITextProvider implements ModelProvider {
  id: string;
  modalities: Modality[] = ["text", "code"];
  private modelName: string;

  constructor(modelId: string, modelName: string) {
    this.id = modelId;
    this.modelName = modelName;
  }

  estimateCost(req: GenerateRequest): number {
    const tokensEst = Math.ceil(req.prompt.length / 4) + (req.parameters.maxTokens ?? 1024);
    return Math.ceil((tokensEst / 1000) * (MODEL_COSTS[this.modelName] ?? 10));
  }

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const completion = await client.chat.completions.create({
      model: this.modelName,
      messages: [{ role: "user", content: req.prompt }],
      max_tokens: (req.parameters.maxTokens as number) ?? 2048,
      temperature: (req.parameters.temperature as number) ?? 0.7,
      top_p: (req.parameters.topP as number) ?? 1,
    });

    const outputText = completion.choices[0]?.message?.content ?? "";
    const tokensUsed = completion.usage?.total_tokens ?? 0;
    const costCredits = Math.max(1, Math.ceil((tokensUsed / 1000) * (MODEL_COSTS[this.modelName] ?? 10)));

    return {
      jobId: req.jobId,
      status: "completed",
      costCredits,
      output: { outputText },
    };
  }
}

export class DallEProvider implements ModelProvider {
  id = "openai/dall-e-3";
  modalities: Modality[] = ["image"];

  estimateCost(_req: GenerateRequest): number {
    return 20;
  }

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const size = (req.parameters.resolution as "1024x1024" | "1792x1024" | "1024x1792") ?? "1024x1024";

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: req.prompt,
      n: 1,
      size,
      response_format: "url",
    });

    const outputUrl = response.data?.[0]?.url ?? "";

    return {
      jobId: req.jobId,
      status: "completed",
      costCredits: 20,
      output: { outputUrl },
    };
  }
}

export class OpenAITTSProvider implements ModelProvider {
  id: string;
  modalities: Modality[] = ["audio"];
  private modelName: string;

  constructor(modelId: string, modelName: "tts-1" | "tts-1-hd") {
    this.id = modelId;
    this.modelName = modelName;
  }

  estimateCost(req: GenerateRequest): number {
    return Math.max(5, Math.ceil(req.prompt.length / 200));
  }

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const voice = (req.parameters.voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer") ?? "alloy";

    const mp3 = await client.audio.speech.create({
      model: this.modelName as "tts-1" | "tts-1-hd",
      voice,
      input: req.prompt,
      speed: (req.parameters.speed as number) ?? 1.0,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    // In production: upload buffer to R2 and return signed URL
    // For now return a data URL placeholder
    const outputUrl = `data:audio/mpeg;base64,${buffer.toString("base64").slice(0, 100)}...`;

    return {
      jobId: req.jobId,
      status: "completed",
      costCredits: this.estimateCost(req),
      output: { outputUrl },
    };
  }
}
