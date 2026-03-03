"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { FolderOpen, Plus, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
}

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => apiClient.get<Project[]>("/projects"),
  });

  const createMutation = useMutation({
    mutationFn: (body: { name: string; description?: string }) =>
      apiClient.post<Project>("/projects", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setName("");
      setDescription("");
      setCreating(false);
      toast.success("Project created");
    },
    onError: () => toast.error("Failed to create project"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete<{ ok: boolean }>(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete project"),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, description: description || undefined });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={() => setCreating(!creating)}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New project
        </button>
      </div>

      {creating && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-lg border border-border bg-card space-y-3"
        >
          <h2 className="text-sm font-semibold">Create project</h2>
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              required
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {createMutation.isPending ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="px-4 py-2 rounded-md border border-border text-sm hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading projects…</span>
        </div>
      )}

      {!isLoading && projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-lg">
          <FolderOpen className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No projects yet.</p>
          <p className="text-xs mt-1">Create one to organise your generations.</p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium text-sm truncate">{project.name}</span>
              </div>
              <button
                onClick={() => deleteMutation.mutate(project.id)}
                disabled={deleteMutation.isPending}
                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {project.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-auto">
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
