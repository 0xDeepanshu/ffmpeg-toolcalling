export const env = {
  AI_BASE_URL: process.env.AI_BASE_URL ?? "http://localhost:1234",
  AI_API_TOKEN: process.env.AI_API_TOKEN ?? "",
  AI_REQUEST_TIMEOUT_MS: Number(process.env.AI_REQUEST_TIMEOUT_MS ?? "120000"),
  DEFAULT_MODEL: process.env.DEFAULT_MODEL ?? "",
  DEFAULT_TEMPERATURE: Number(process.env.DEFAULT_TEMPERATURE ?? "0.7"),
  DEFAULT_MAX_TOKENS: Number(process.env.DEFAULT_MAX_TOKENS ?? "4096"),
} as const;

export function getAiBaseUrl(): string {
  const url = env.AI_BASE_URL.replace(/\/+$/, "");
  return url;
}
