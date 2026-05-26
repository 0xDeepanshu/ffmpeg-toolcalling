export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ChatRequestBody {
  model: string;
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponseData {
  id: string;
  model: string;
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ModelsResponseData {
  models: Array<{
    id: string;
    owned_by: string;
    created: number;
  }>;
}
