export type Modality = "text" | "image" | "video" | "audio" | "code" | "3d";

export type JobStatus = "pending" | "processing" | "completed" | "failed";

export type Plan = "FREE" | "PRO" | "TEAM" | "ENTERPRISE";

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  seed?: number;
  // Image
  resolution?: string;
  style?: string;
  negativePrompt?: string;
  steps?: number;
  cfgScale?: number;
  // Video
  duration?: number;
  fps?: number;
  motionStrength?: number;
  // Audio
  voice?: string;
  speed?: number;
  stability?: number;
  language?: string;
  // 3D
  format?: "GLB" | "OBJ" | "FBX";
  quality?: "low" | "medium" | "high";
}

export interface GenerationOutput {
  jobId: string;
  model: string;
  mode: Modality;
  creditsUsed: number;
  outputText?: string;
  outputUrl?: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  plan: Plan;
  credits: number;
  avatarUrl?: string | null;
}

export interface ModelEntry {
  id: string;
  name: string;
  provider: string;
  costCredits: number;
  modalities: Modality[];
  description?: string;
  contextWindow?: number;
}

export const MODEL_REGISTRY: ModelEntry[] = [
  // ── TEXT ──────────────────────────────────────────────────────
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    costCredits: 10,
    modalities: ["text", "code"],
    contextWindow: 128000,
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    costCredits: 2,
    modalities: ["text", "code"],
    contextWindow: 128000,
  },
  {
    id: "openai/gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    costCredits: 12,
    modalities: ["text", "code"],
    contextWindow: 128000,
  },
  {
    id: "anthropic/claude-opus-4-6",
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    costCredits: 20,
    modalities: ["text", "code"],
    contextWindow: 200000,
  },
  {
    id: "anthropic/claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    costCredits: 8,
    modalities: ["text", "code"],
    contextWindow: 200000,
  },
  {
    id: "anthropic/claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    costCredits: 2,
    modalities: ["text", "code"],
    contextWindow: 200000,
  },
  {
    id: "google/gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    costCredits: 8,
    modalities: ["text", "code"],
    contextWindow: 1000000,
  },
  {
    id: "mistral/large",
    name: "Mistral Large",
    provider: "Mistral",
    costCredits: 6,
    modalities: ["text", "code"],
  },
  {
    id: "deepseek/coder-v2",
    name: "DeepSeek Coder v2",
    provider: "DeepSeek",
    costCredits: 3,
    modalities: ["code"],
  },
  {
    id: "meta/llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta (via Together AI)",
    costCredits: 3,
    modalities: ["text", "code"],
  },
  {
    id: "xai/grok-2",
    name: "Grok-2",
    provider: "xAI",
    costCredits: 10,
    modalities: ["text"],
  },
  // ── IMAGE ─────────────────────────────────────────────────────
  {
    id: "openai/dall-e-3",
    name: "DALL-E 3",
    provider: "OpenAI",
    costCredits: 20,
    modalities: ["image"],
  },
  {
    id: "stability/sdxl",
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    costCredits: 5,
    modalities: ["image"],
  },
  {
    id: "stability/sd3",
    name: "Stable Diffusion 3",
    provider: "Stability AI",
    costCredits: 8,
    modalities: ["image"],
  },
  {
    id: "ideogram/v2",
    name: "Ideogram v2",
    provider: "Ideogram",
    costCredits: 8,
    modalities: ["image"],
  },
  {
    id: "leonardo/phoenix",
    name: "Leonardo Phoenix",
    provider: "Leonardo AI",
    costCredits: 6,
    modalities: ["image"],
  },
  // ── VIDEO ─────────────────────────────────────────────────────
  {
    id: "runway/gen-3",
    name: "Runway Gen-3",
    provider: "Runway",
    costCredits: 100,
    modalities: ["video"],
  },
  {
    id: "luma/dream-machine",
    name: "Dream Machine",
    provider: "Luma AI",
    costCredits: 80,
    modalities: ["video"],
  },
  {
    id: "pika/1.5",
    name: "Pika 1.5",
    provider: "Pika",
    costCredits: 60,
    modalities: ["video"],
  },
  // ── AUDIO ─────────────────────────────────────────────────────
  {
    id: "elevenlabs/multilingual-v2",
    name: "Multilingual v2",
    provider: "ElevenLabs",
    costCredits: 10,
    modalities: ["audio"],
  },
  {
    id: "openai/tts-1",
    name: "TTS-1",
    provider: "OpenAI",
    costCredits: 5,
    modalities: ["audio"],
  },
  {
    id: "openai/tts-1-hd",
    name: "TTS-1 HD",
    provider: "OpenAI",
    costCredits: 10,
    modalities: ["audio"],
  },
  // ── 3D ───────────────────────────────────────────────────────
  {
    id: "meshy/v4",
    name: "Meshy v4",
    provider: "Meshy",
    costCredits: 50,
    modalities: ["3d"],
  },
  {
    id: "luma/3d",
    name: "Luma 3D",
    provider: "Luma AI",
    costCredits: 60,
    modalities: ["3d"],
  },
];
