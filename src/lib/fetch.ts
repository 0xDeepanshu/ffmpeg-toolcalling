import { env, getAiBaseUrl } from "./env";
import { AiError, NetworkError, TimeoutError } from "./errors";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getAiBaseUrl();
  const url = `${baseUrl}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    env.AI_REQUEST_TIMEOUT_MS,
  );

  const authHeaders: Record<string, string> = {};
  if (env.AI_API_TOKEN) {
    authHeaders.Authorization = `Bearer ${env.AI_API_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new AiError(
        body.error?.message ??
          `AI request failed with status ${response.status}`,
        response.status,
        body.error?.type ?? "AI_ERROR",
        body,
      );
    }

    const text = await response.text();
    if (!text) {
      throw new AiError("Empty response from AI server", 200, "EMPTY_RESPONSE");
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new AiError(
        `Non-JSON response from AI server: ${text.slice(0, 200)}`,
        200,
        "INVALID_JSON",
      );
    }
  } catch (error) {
    if (error instanceof AiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new TimeoutError();
    }
    throw new NetworkError(
      `Failed to connect to AI server at ${baseUrl}`,
      error,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
