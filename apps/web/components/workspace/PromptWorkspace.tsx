"use client";

import { PromptInput } from "./PromptInput";
import { ModelSelector } from "./ModelSelector";
import { ModeSelector } from "./ModeSelector";
import { ParameterPanel } from "./ParameterPanel";
import { OutputPanel } from "./OutputPanel";
import { usePromptStore } from "@/stores/promptStore";
import { useAuthStore } from "@/stores/authStore";
import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";
import type { GenerationOutput } from "@prompit/types";

export function PromptWorkspace() {
  const { prompt, mode, selectedModels, parameters, addOutput, updateJobStatus } =
    usePromptStore();
  const { refreshCredits } = useAuthStore();

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    for (const model of selectedModels) {
      try {
        const result = await apiClient.post<{ jobId: string; output?: GenerationOutput }>(
          `/generate/${mode}`,
          { prompt, model, parameters }
        );

        if (result.output) {
          addOutput(result.output);
        } else {
          updateJobStatus(result.jobId, "processing");
        }
      } catch {
        toast.error(`Failed to generate with ${model}`);
      }
    }

    await refreshCredits();
  }

  return (
    <div className="h-full flex gap-6">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <ModeSelector />
        <ModelSelector />
        <PromptInput onGenerate={handleGenerate} />
        <OutputPanel />
      </div>
      <aside className="w-72 shrink-0">
        <ParameterPanel />
      </aside>
    </div>
  );
}
