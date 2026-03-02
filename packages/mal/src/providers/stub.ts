/**
 * Stub providers for Phase 2+ models.
 * Replace with real API integrations as you obtain API keys.
 */
import type { ModelProvider, GenerateRequest, GenerateResult } from "../types.js";

export class StubProvider implements ModelProvider {
  id: string;
  modalities;
  private creditCost: number;

  constructor(id: string, modalities: ModelProvider["modalities"], creditCost: number) {
    this.id = id;
    this.modalities = modalities;
    this.creditCost = creditCost;
  }

  estimateCost(_req: GenerateRequest): number {
    return this.creditCost;
  }

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    // In production replace with real API call
    return {
      jobId: req.jobId,
      status: "completed",
      costCredits: this.creditCost,
      output: {
        outputText: `[STUB] ${this.id} response for: "${req.prompt.slice(0, 80)}..."`,
      },
    };
  }
}
