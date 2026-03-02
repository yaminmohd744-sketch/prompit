export type { GenerateRequest, GenerateResult, GenerateOutput, ModelProvider } from "./types.js";
export { registry } from "./registry.js";

import { registry } from "./registry.js";
import type { GenerateRequest, GenerateResult } from "./types.js";

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 500
): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
      }
    }
  }
  throw lastErr;
}

export const mal = {
  getProvider(model: string) {
    return registry.get(model) ?? null;
  },

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const provider = registry.get(req.model);
    if (!provider) {
      throw new Error(`No provider registered for model: ${req.model}`);
    }
    return withRetry(() => provider.generate(req));
  },
};
