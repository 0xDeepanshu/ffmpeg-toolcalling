export interface AIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIChatRequest {
  model: string;
  messages: AIChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface AIChatChoice {
  index: number;
  message: AIChatMessage;
  finish_reason: "stop" | "length" | null;
}

export interface AIChatUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface AIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: AIChatChoice[];
  usage: AIChatUsage;
}

export interface AIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export interface AIModelListResponse {
  object: string;
  data: AIModel[];
}

export interface AIErrorResponse {
  error: {
    message: string;
    type: string;
    code: number | null;
  };
}

export interface LMStudioModel {
  id: string;
  path: string;
  type?: string;
  loaded: boolean;
  size?: string;
}

export interface LMStudioModelsResponse {
  data?: LMStudioModel[];
  models?: LMStudioModel[];
}
