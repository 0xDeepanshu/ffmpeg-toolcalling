"use client";

import { useCallback, useEffect, useReducer } from "react";

interface Model {
  id: string;
  owned_by: string;
}

interface State {
  models: Model[];
  selectedModel: string;
  manualModel: string;
  useManual: boolean;
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; models: Model[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "SELECT_MODEL"; model: string }
  | { type: "SET_MANUAL_MODEL"; model: string }
  | { type: "TOGGLE_MODE"; useManual: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        models: action.models,
        isLoading: false,
        selectedModel: action.models[0]?.id ?? state.selectedModel,
        useManual: action.models.length === 0 ? true : state.useManual,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.error };
    case "SELECT_MODEL":
      return { ...state, selectedModel: action.model };
    case "SET_MANUAL_MODEL":
      return {
        ...state,
        manualModel: action.model,
        selectedModel: action.model,
      };
    case "TOGGLE_MODE":
      return { ...state, useManual: action.useManual };
    default:
      return state;
  }
}

export function useModels() {
  const [state, dispatch] = useReducer(reducer, {
    models: [],
    selectedModel: "",
    manualModel: "",
    useManual: false,
    isLoading: true,
    error: null,
  });

  const loadModels = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const res = await fetch("/api/models");
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error?.message ?? "Failed to fetch models");
      }
      dispatch({ type: "FETCH_SUCCESS", models: json.data.models });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load models";
      dispatch({ type: "FETCH_ERROR", error: message });
    }
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const selectModel = useCallback((model: string) => {
    dispatch({ type: "SELECT_MODEL", model });
  }, []);

  const setManualModel = useCallback((model: string) => {
    dispatch({ type: "SET_MANUAL_MODEL", model });
  }, []);

  const toggleMode = useCallback((useManual: boolean) => {
    dispatch({ type: "TOGGLE_MODE", useManual });
  }, []);

  return {
    models: state.models,
    selectedModel: state.selectedModel,
    manualModel: state.manualModel,
    useManual: state.useManual,
    isLoading: state.isLoading,
    error: state.error,
    selectModel,
    setManualModel,
    toggleMode,
    reload: loadModels,
  };
}
