"use client";

interface ResponseViewerProps {
  response: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function ResponseViewer({
  response,
  usage,
  isLoading,
  error,
  onRetry,
}: ResponseViewerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
        <div className="relative w-4 h-4">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 animate-spin" />
        </div>
        <span className="text-sm text-zinc-500 font-mono">
          Generating response...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900/40 bg-red-950/15 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
            <svg
              className="w-3 h-3 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-400">Request Failed</p>
            <p className="text-sm text-red-300/60 mt-1 break-words font-mono">
              {error}
            </p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          </svg>
        </div>
        <p className="text-sm text-zinc-600">
          Send a prompt to see the response
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Response
        </span>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(response)}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Copy
        </button>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
          {response}
        </p>
      </div>
      {usage && (
        <div className="px-5 py-3 border-t border-zinc-800/50 flex items-center gap-4">
          <span className="text-xs text-zinc-600">
            Prompt: <span className="text-zinc-400">{usage.promptTokens}</span>
          </span>
          <span className="text-xs text-zinc-600">
            Completion:{" "}
            <span className="text-zinc-400">{usage.completionTokens}</span>
          </span>
          <span className="text-xs text-zinc-600">
            Total: <span className="text-zinc-400">{usage.totalTokens}</span>
          </span>
        </div>
      )}
    </div>
  );
}
