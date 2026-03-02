"use client";

import { usePromptStore } from "@/stores/promptStore";
import type { GenerationOutput } from "@prompit/types";
import { Download } from "lucide-react";

export function OutputPanel() {
  const { outputs, jobStatuses } = usePromptStore();

  if (outputs.length === 0 && Object.keys(jobStatuses).length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-sm">
        Your generations will appear here
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-auto">
      {Object.entries(jobStatuses)
        .filter(([, status]) => status === "processing")
        .map(([jobId]) => (
          <div
            key={jobId}
            className="p-4 rounded-lg border border-border bg-card animate-pulse"
          >
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}

      {outputs.map((output) => (
        <OutputCard key={output.jobId} output={output} />
      ))}
    </div>
  );
}

function OutputCard({ output }: { output: GenerationOutput }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {output.model} · {output.creditsUsed} credits
        </span>
        {output.outputUrl && (
          <a
            href={output.outputUrl}
            download
            className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>

      {output.outputText && (
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {output.outputText}
        </p>
      )}

      {output.outputUrl && output.mode === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={output.outputUrl}
          alt="Generated image"
          className="rounded-md max-w-full"
        />
      )}

      {output.outputUrl && output.mode === "audio" && (
        <audio controls src={output.outputUrl} className="w-full" />
      )}

      {output.outputUrl && output.mode === "video" && (
        <video controls src={output.outputUrl} className="w-full rounded-md" />
      )}
    </div>
  );
}
