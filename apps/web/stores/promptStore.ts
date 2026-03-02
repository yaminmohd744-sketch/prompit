import { create } from "zustand";
import type { Modality, GenerationOutput, JobStatus, ModelParameters } from "@prompit/types";

interface PromptState {
  prompt: string;
  mode: Modality;
  selectedModels: string[];
  parameters: ModelParameters;
  outputs: GenerationOutput[];
  jobStatuses: Record<string, JobStatus>;

  setPrompt: (prompt: string) => void;
  setMode: (mode: Modality) => void;
  setModels: (models: string[]) => void;
  updateParams: (params: Partial<ModelParameters>) => void;
  addOutput: (output: GenerationOutput) => void;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  clearOutputs: () => void;
}

const defaultParameters: ModelParameters = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  seed: undefined,
};

export const usePromptStore = create<PromptState>((set) => ({
  prompt: "",
  mode: "text",
  selectedModels: ["openai/gpt-4o"],
  parameters: defaultParameters,
  outputs: [],
  jobStatuses: {},

  setPrompt: (prompt) => set({ prompt }),
  setMode: (mode) => set({ mode }),
  setModels: (selectedModels) => set({ selectedModels }),
  updateParams: (params) =>
    set((state) => ({ parameters: { ...state.parameters, ...params } })),
  addOutput: (output) =>
    set((state) => ({ outputs: [output, ...state.outputs] })),
  updateJobStatus: (jobId, status) =>
    set((state) => ({
      jobStatuses: { ...state.jobStatuses, [jobId]: status },
    })),
  clearOutputs: () => set({ outputs: [], jobStatuses: {} }),
}));
