"use client";

import { useState } from "react";

interface ModelSelectorProps {
  models: Array<{ id: string; owned_by: string }>;
  selectedModel: string;
  useManual: boolean;
  isLoading: boolean;
  onSelect: (model: string) => void;
  onManualChange: (model: string) => void;
  onToggleMode: (useManual: boolean) => void;
  onReload: () => void;
}

export function ModelSelector({
  models,
  selectedModel,
  useManual,
  isLoading,
  onSelect,
  onManualChange,
  onToggleMode,
  onReload,
}: ModelSelectorProps) {
  const [manualInput, setManualInput] = useState(selectedModel);

  if (useManual || models.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => {
              setManualInput(e.target.value);
              onManualChange(e.target.value);
            }}
            placeholder="Enter model name (e.g. llama-3.2-3b)"
            disabled={isLoading}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 placeholder:text-zinc-600 disabled:opacity-50 transition-all font-mono"
          />
        </div>
        <button
          type="button"
          onClick={onReload}
          disabled={isLoading}
          className="shrink-0 p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Detect models"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
        {models.length > 0 && (
          <button
            type="button"
            onClick={() => onToggleMode(false)}
            className="shrink-0 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Show detected
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <select
          value={selectedModel}
          onChange={(e) => onSelect(e.target.value)}
          disabled={isLoading || models.length === 0}
          className="w-full appearance-none bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {models.length === 0 && <option value="">No models available</option>}
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.id}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <button
        type="button"
        onClick={onReload}
        disabled={isLoading}
        className="shrink-0 p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title="Reload models"
      >
        <svg
          className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onToggleMode(true)}
        className="shrink-0 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        Manual
      </button>
    </div>
  );
}
