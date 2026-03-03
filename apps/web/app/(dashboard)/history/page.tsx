"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Download, Loader2 } from "lucide-react";
import type { Modality } from "@prompit/types";

interface Generation {
  id: string;
  jobId: string;
  prompt: string;
  mode: Modality;
  model: string;
  status: string;
  outputText?: string | null;
  outputUrl?: string | null;
  creditsUsed: number;
  createdAt: string;
}

const MODE_COLORS: Record<string, string> = {
  text: "bg-blue-500/10 text-blue-400",
  image: "bg-purple-500/10 text-purple-400",
  video: "bg-red-500/10 text-red-400",
  audio: "bg-green-500/10 text-green-400",
  code: "bg-yellow-500/10 text-yellow-400",
  "3d": "bg-orange-500/10 text-orange-400",
};

export default function HistoryPage() {
  const { data, isLoading } = useQuery<Generation[]>({
    queryKey: ["generations"],
    queryFn: () => apiClient.get<Generation[]>("/users/me/generations"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Generation History</h1>
        {data && (
          <span className="text-sm text-muted-foreground">
            {data.length} generation{data.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading history…</span>
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-lg">
          <p className="text-sm">No generations yet.</p>
          <p className="text-xs mt-1">Head to the workspace to create your first one.</p>
        </div>
      )}

      <div className="space-y-3">
        {data?.map((gen) => (
          <div
            key={gen.id}
            className="p-4 rounded-lg border border-border bg-card space-y-2"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium line-clamp-2 flex-1">{gen.prompt}</p>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${MODE_COLORS[gen.mode] ?? ""}`}
                >
                  {gen.mode}
                </span>
                {gen.outputUrl && (
                  <a
                    href={gen.outputUrl}
                    download
                    className="p-1.5 rounded hover:bg-accent transition-colors text-muted-foreground"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{gen.model}</span>
              <span>·</span>
              <span>{gen.creditsUsed} credits</span>
              <span>·</span>
              <span
                className={
                  gen.status === "completed"
                    ? "text-green-500"
                    : gen.status === "failed"
                    ? "text-destructive"
                    : "text-yellow-500"
                }
              >
                {gen.status}
              </span>
              <span>·</span>
              <span>{new Date(gen.createdAt).toLocaleString()}</span>
            </div>

            {gen.outputText && (
              <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
                {gen.outputText}
              </p>
            )}

            {gen.outputUrl && gen.mode === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gen.outputUrl}
                alt="Generated"
                className="rounded-md max-h-48 object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
