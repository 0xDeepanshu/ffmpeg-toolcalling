"use client";

import { ModelSelector } from "@/components/ModelSelector";
import { PromptInput } from "@/components/PromptInput";
import { ResponseViewer } from "@/components/ResponseViewer";
import { useChat } from "@/hooks/useChat";
import { useModels } from "@/hooks/useModels";

export default function Home() {
  const chat = useChat();
  const models = useModels();

  const handleSend = () => {
    chat.send(models.selectedModel);
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="border-b border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-emerald-400"
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
            <div>
              <h1 className="text-sm font-semibold text-zinc-100">AI Agent</h1>
              <p className="text-xs text-zinc-600">Offline Worker Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
            <span className="text-xs text-zinc-600">Local</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        <div className="animate-fade-in">
          <ModelSelector
            models={models.models}
            selectedModel={models.selectedModel}
            useManual={models.useManual}
            isLoading={models.isLoading}
            onSelect={models.selectModel}
            onManualChange={models.setManualModel}
            onToggleMode={models.toggleMode}
            onReload={models.reload}
          />
        </div>

        <div className="animate-fade-in">
          <PromptInput
            value={chat.prompt}
            onChange={chat.setPrompt}
            onSend={handleSend}
            isLoading={chat.isLoading}
            hasModel={!!models.selectedModel}
          />
          {models.useManual && !models.selectedModel && (
            <p className="text-xs text-zinc-600 px-1">
              Enter a model name above to enable sending
            </p>
          )}
        </div>

        <div className="animate-fade-in flex-1">
          <ResponseViewer
            response={chat.response}
            usage={chat.usage}
            isLoading={chat.isLoading}
            error={chat.error}
            onRetry={() => chat.send(models.selectedModel)}
          />
        </div>
      </main>

      <footer className="border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-zinc-700">
            Running on LM Studio &middot; OpenAI-compatible API
          </p>
          <p className="text-xs text-zinc-700">
            All processing is local and offline
          </p>
        </div>
      </footer>
    </div>
  );
}
