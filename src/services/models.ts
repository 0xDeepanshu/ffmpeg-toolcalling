import { get } from "@/lib/fetch";
import type {
  AIModel,
  AIModelListResponse,
  LMStudioModelsResponse,
} from "@/types/ai";

async function fetchOpenAiModels(): Promise<AIModel[]> {
  try {
    const response = await get<AIModelListResponse>("/v1/models");
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    return [];
  } catch {
    return [];
  }
}

async function fetchLMStudioModels(): Promise<AIModel[]> {
  try {
    const response = await get<LMStudioModelsResponse>("/api/v1/models");
    const models = response.data ?? response.models ?? [];
    if (models.length > 0) {
      return models.map((m) => ({
        id: m.id,
        object: "model",
        created: 0,
        owned_by: "local",
      }));
    }
    return [];
  } catch {
    return [];
  }
}

function extractModelName(loadedId: string): string {
  const parts = loadedId.replace(/\\/g, "/").split("/");
  const last = parts[parts.length - 1] ?? loadedId;
  return last.replace(/\.(gguf|bin|pt|safetensors)$/i, "");
}

async function fetchLoadedModelFromLMStudio(): Promise<AIModel | null> {
  try {
    const response = await get<LMStudioModelsResponse>("/api/v1/models");
    const models = response.data ?? response.models ?? [];
    const loaded = models.find((m) => m.loaded);
    if (loaded) {
      return {
        id: extractModelName(loaded.id),
        object: "model",
        created: 0,
        owned_by: "local",
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchModels(): Promise<AIModel[]> {
  const openAiModels = await fetchOpenAiModels();
  if (openAiModels.length > 0) return openAiModels;

  const lsModels = await fetchLMStudioModels();
  if (lsModels.length > 0) return lsModels;

  const loadedModel = await fetchLoadedModelFromLMStudio();
  if (loadedModel) return [loadedModel];

  return [];
}
