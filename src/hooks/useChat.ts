"use client";

import { useCallback, useReducer } from "react";

interface ChatState {
  prompt: string;
  response: string;
  isLoading: boolean;
  error: string | null;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | null;
}

type ChatAction =
  | { type: "SET_PROMPT"; prompt: string }
  | { type: "SEND_START" }
  | { type: "SEND_SUCCESS"; response: string; usage: ChatState["usage"] }
  | { type: "SEND_ERROR"; error: string }
  | { type: "CLEAR" };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_PROMPT":
      return { ...state, prompt: action.prompt };
    case "SEND_START":
      return { ...state, isLoading: true, error: null, response: "" };
    case "SEND_SUCCESS":
      return {
        ...state,
        isLoading: false,
        response: action.response,
        usage: action.usage,
      };
    case "SEND_ERROR":
      return { ...state, isLoading: false, error: action.error };
    case "CLEAR":
      return {
        prompt: "",
        response: "",
        isLoading: false,
        error: null,
        usage: null,
      };
    default:
      return state;
  }
}

export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, {
    prompt: "",
    response: "",
    isLoading: false,
    error: null,
    usage: null,
  });

  const setPrompt = useCallback((prompt: string) => {
    dispatch({ type: "SET_PROMPT", prompt });
  }, []);

  const send = useCallback(
    async (model: string) => {
      if (!state.prompt.trim() || !model) return;

      dispatch({ type: "SEND_START" });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt: state.prompt }),
        });

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error?.message ?? "Request failed");
        }

        dispatch({
          type: "SEND_SUCCESS",
          response: json.data.content,
          usage: {
            promptTokens: json.data.usage.prompt_tokens,
            completionTokens: json.data.usage.completion_tokens,
            totalTokens: json.data.usage.total_tokens,
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to send prompt";
        dispatch({ type: "SEND_ERROR", error: message });
      }
    },
    [state.prompt],
  );

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return {
    ...state,
    setPrompt,
    send,
    clear,
  };
}
