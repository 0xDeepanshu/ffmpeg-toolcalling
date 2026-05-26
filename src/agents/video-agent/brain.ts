import { env } from "@/lib/env";
import { post } from "@/lib/fetch";
import type { AIChatResponse } from "@/types/ai";
import { buildSystemPrompt } from "./prompts";
import type { AgentAction, AgentDecision } from "./types";

const ALLOWED_ACTIONS: AgentAction[] = ["edit_podcast", "reject"];

function stripCodeFences(raw: string): string {
  return raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseDecision(raw: string): AgentDecision {
  const cleaned = stripCodeFences(raw);

  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.warn(`[Brain] Failed to parse model output: "${raw}"`);
    return { action: "reject" };
  }

  if (typeof parsed !== "object" || parsed === null) {
    return { action: "reject" };
  }

  const action = parsed.action;

  if (typeof action !== "string") {
    return { action: "reject" };
  }

  if (!ALLOWED_ACTIONS.includes(action as AgentAction)) {
    return { action: "reject" };
  }

  if (action === "reject") {
    return { action: "reject" };
  }

  return {
    action: "edit_podcast",
    args:
      typeof parsed.args === "object" && parsed.args !== null
        ? (parsed.args as Record<string, unknown>)
        : {},
  };
}

export interface BrainOptions {
  job: string;
  model?: string;
}

export async function decide(options: BrainOptions): Promise<AgentDecision> {
  const model = options.model || env.DEFAULT_MODEL;

  if (!model) {
    return { action: "reject" };
  }

  const messages = [
    {
      role: "user" as const,
      content: `${buildSystemPrompt()}\n\nJob: ${options.job}`,
    },
  ];

  try {
    const response = await post<AIChatResponse>("/v1/chat/completions", {
      model,
      messages,
      temperature: 0.1,
      max_tokens: 512,
      stream: false,
    });

    const content = response.choices[0]?.message?.content ?? "";

    console.log(`[Brain] Raw model output: "${content}"`);

    if (!content.trim()) {
      return { action: "reject" };
    }

    return parseDecision(content.trim());
  } catch {
    return { action: "reject" };
  }
}
