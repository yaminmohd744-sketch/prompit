import { OpenAITextProvider, DallEProvider, OpenAITTSProvider } from "./providers/openai.js";
import { AnthropicProvider } from "./providers/anthropic.js";
import { StubProvider } from "./providers/stub.js";
import type { ModelProvider } from "./types.js";

export const registry = new Map<string, ModelProvider>([
  // ── TEXT ──────────────────────────────────────────────────────
  ["openai/gpt-4o",           new OpenAITextProvider("openai/gpt-4o", "gpt-4o")],
  ["openai/gpt-4o-mini",      new OpenAITextProvider("openai/gpt-4o-mini", "gpt-4o-mini")],
  ["openai/gpt-4-turbo",      new OpenAITextProvider("openai/gpt-4-turbo", "gpt-4-turbo")],
  ["anthropic/claude-opus-4-6",   new AnthropicProvider("anthropic/claude-opus-4-6", "claude-opus-4-6")],
  ["anthropic/claude-sonnet-4-6", new AnthropicProvider("anthropic/claude-sonnet-4-6", "claude-sonnet-4-6")],
  ["anthropic/claude-haiku-4-5",  new AnthropicProvider("anthropic/claude-haiku-4-5", "claude-haiku-4-5-20251001")],

  // Stub providers — swap for real implementations
  ["google/gemini-1.5-pro",   new StubProvider("google/gemini-1.5-pro",  ["text", "code"], 8)],
  ["mistral/large",           new StubProvider("mistral/large",           ["text", "code"], 6)],
  ["deepseek/coder-v2",       new StubProvider("deepseek/coder-v2",       ["code"], 3)],
  ["meta/llama-3-70b",        new StubProvider("meta/llama-3-70b",        ["text", "code"], 3)],
  ["xai/grok-2",              new StubProvider("xai/grok-2",              ["text"], 10)],

  // ── IMAGE ─────────────────────────────────────────────────────
  ["openai/dall-e-3",         new DallEProvider()],
  ["stability/sdxl",          new StubProvider("stability/sdxl",          ["image"], 5)],
  ["stability/sd3",           new StubProvider("stability/sd3",            ["image"], 8)],
  ["ideogram/v2",             new StubProvider("ideogram/v2",              ["image"], 8)],
  ["leonardo/phoenix",        new StubProvider("leonardo/phoenix",         ["image"], 6)],

  // ── VIDEO ─────────────────────────────────────────────────────
  ["runway/gen-3",            new StubProvider("runway/gen-3",             ["video"], 100)],
  ["luma/dream-machine",      new StubProvider("luma/dream-machine",       ["video"], 80)],
  ["pika/1.5",                new StubProvider("pika/1.5",                 ["video"], 60)],

  // ── AUDIO ─────────────────────────────────────────────────────
  ["elevenlabs/multilingual-v2", new StubProvider("elevenlabs/multilingual-v2", ["audio"], 10)],
  ["openai/tts-1",            new OpenAITTSProvider("openai/tts-1", "tts-1")],
  ["openai/tts-1-hd",         new OpenAITTSProvider("openai/tts-1-hd", "tts-1-hd")],

  // ── 3D ───────────────────────────────────────────────────────
  ["meshy/v4",                new StubProvider("meshy/v4",                 ["3d"], 50)],
  ["luma/3d",                 new StubProvider("luma/3d",                  ["3d"], 60)],
]);
