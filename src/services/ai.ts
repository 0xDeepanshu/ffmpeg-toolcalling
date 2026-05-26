import { post } from "@/lib/fetch";
import type { AIChatMessage, AIChatRequest, AIChatResponse } from "@/types/ai";

export interface ChatOptions {
  model: string;
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

export async function sendChatMessage(
  options: ChatOptions,
): Promise<AIChatResponse> {
  const messages: AIChatMessage[] = [{ role: "user", content: options.prompt }];

  const body: AIChatRequest = {
    model: options.model,
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens ?? 4096,
    stream: false,
  };

  return post<AIChatResponse>("/v1/chat/completions", body);
}
