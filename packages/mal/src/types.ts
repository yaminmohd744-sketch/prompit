import type { Modality, ModelParameters } from "@prompit/types";

export interface GenerateRequest {
  prompt: string;
  model: string;
  mode: Modality;
  parameters: Partial<ModelParameters> & Record<string, unknown>;
  userId: string;
  jobId: string;
}

export interface TextOutput {
  outputText: string;
}

export interface AssetOutput {
  outputUrl: string;
}

export type GenerateOutput = TextOutput | AssetOutput;

export interface GenerateResult {
  jobId: string;
  status: "completed" | "processing" | "failed";
  costCredits: number;
  output: GenerateOutput;
}

export interface ModelProvider {
  id: string;
  modalities: Modality[];
  estimateCost(req: GenerateRequest): number;
  generate(req: GenerateRequest): Promise<GenerateResult>;
}
