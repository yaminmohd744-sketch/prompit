"use client";

import { useState } from "react";
import { MODEL_REGISTRY } from "@prompit/types";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import { Send, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Modality, GenerationOutput } from "@prompit/types";

const TEXT_MODELS = MODEL_REGISTRY.filter((m) => m.modalities.includes("text"));

interface CompareResult {
  model: string;
  modelName: string;
  output?: GenerationOutput;
  loading: boolean;
  error?: string;
}

export default function ComparePage() {
  const { refreshCredits } = useAuthStore();
  const [prompt, setPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "openai/gpt-4o",
    "anthropic/claude-sonnet-4-6",
  ]);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [running, setRunning] = useState(false);

  function toggleModel(id: string) {
    if (selectedModels.includes(id)) {
      if (selectedModels.length <= 2) {
        toast.error("Select at least 2 models to compare");
        return;
      }
      setSelectedModels(selectedModels.filter((m) => m !== id));
    } else {
      if (selectedModels.length >= 4) {
        toast.error("Maximum 4 models for comparison");
        return;
      }
      setSelectedModels([...selectedModels, id]);
    }
  }

  async function handleCompare() {
    if (!prompt.trim()) {
      toast.error("Enter a prompt first");
      return;
    }

    const initial: CompareResult[] = selectedModels.map((id) => ({
      model: id,
      modelName: MODEL_REGISTRY.find((m) => m.id === id)?.name ?? id,
      loading: true,
    }));
    setResults(initial);
    setRunning(true);

    await Promise.all(
      selectedModels.map(async (model, idx) => {
        try {
          const result = await apiClient.post<{ jobId: string; output?: GenerationOutput }>(
            "/generate/text",
            { prompt, model, parameters: { temperature: 0.7, maxTokens: 1024 } }
          );
          setResults((prev) => {
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              loading: false,
              output: result.output,
            };
            return next;
          });
        } catch {
          setResults((prev) => {
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              loading: false,
              error: "Generation failed",
            };
            return next;
          });
        }
      })
    );

    setRunning(false);
    await refreshCredits();
  }

  const colClass =
    results.length <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : results.length === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Compare Models</h1>

      <div className="space-y-4 p-4 rounded-lg border border-border bg-card">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Select models to compare (2–4)
          </label>
          <div className="flex flex-wrap gap-2">
            {TEXT_MODELS.map((m) => {
              const selected = selectedModels.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleModel(m.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {m.name}
                  {selected && (
                    <X className="inline w-3 h-3 ml-1.5 -mr-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleCompare();
            }}
            placeholder="Enter your prompt… (⌘+Enter to compare)"
            rows={3}
            className="w-full px-4 py-3 pr-14 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <button
            onClick={handleCompare}
            disabled={running || !prompt.trim() || selectedModels.length < 2}
            className="absolute bottom-3 right-3 p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            {running ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className={`grid gap-4 ${colClass}`}>
          {results.map((result) => (
            <div
              key={result.model}
              className="p-4 rounded-lg border border-border bg-card flex flex-col gap-3 min-h-48"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{result.modelName}</span>
                {result.output && (
                  <span className="text-xs text-muted-foreground">
                    {result.output.creditsUsed} credits
                  </span>
                )}
              </div>

              {result.loading && (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}

              {result.error && (
                <p className="text-sm text-destructive">{result.error}</p>
              )}

              {result.output?.outputText && (
                <p className="text-sm whitespace-pre-wrap leading-relaxed flex-1">
                  {result.output.outputText}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground border border-dashed border-border rounded-lg">
          <p className="text-sm">Select models and enter a prompt to compare outputs side by side.</p>
        </div>
      )}
    </div>
  );
}
