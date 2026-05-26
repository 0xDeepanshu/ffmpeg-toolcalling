# AI Agent Offline

Lightweight offline autonomous AI worker platform powered by [Next.js](https://nextjs.org) and a local OpenAI-compatible AI server (LM Studio).

No cloud AI providers. No LangChain. No heavy frameworks. Runs entirely offline.

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts    POST /api/chat       → proxy to LM Studio
│   │   └── models/route.ts  GET  /api/models     → proxy to LM Studio
│   ├── layout.tsx
│   ├── page.tsx             main UI
│   └── globals.css
├── components/
│   ├── ModelSelector.tsx     dropdown + manual model name input
│   ├── PromptInput.tsx       auto-resizing textarea + send button
│   ├── ResponseViewer.tsx    response display with token usage + copy
│   ├── LoadingIndicator.tsx
│   └── ErrorDisplay.tsx
├── hooks/
│   ├── useChat.ts            prompt/response/loading/error state
│   └── useModels.ts          model list + manual model entry state
├── lib/
│   ├── env.ts                environment configuration
│   ├── errors.ts             typed error classes (AiError, NetworkError, TimeoutError)
│   └── fetch.ts              reusable fetch wrapper with auth, timeout, error handling
├── services/
│   ├── ai.ts                 sendChatMessage() → POST /v1/chat/completions
│   └── models.ts             model fetch with 3 fallback strategies
└── types/
    ├── ai.ts                 OpenAI-compatible API types
    └── api.ts                API route response envelope types
```

## Prerequisites

- Node.js 20+
- [LM Studio](https://lmstudio.ai/) running locally with an LLM loaded

## Setup

```bash
npm install
```

Copy the environment configuration:

```env
AI_BASE_URL=http://127.0.0.1:1234
AI_API_TOKEN=                         # Get this from LM Studio → Developer → API Server
AI_REQUEST_TIMEOUT_MS=120000
DEFAULT_TEMPERATURE=0.7
DEFAULT_MAX_TOKENS=4096
```

### Getting your LM Studio API token

1. Open LM Studio
2. Go to the **Developer** tab
3. Under **API Server**, copy the token
4. Set `AI_API_TOKEN` in `.env.local`

## Running

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Select or type a model name
2. Enter a prompt
3. Send with Enter (Shift+Enter for newline)

## Model Detection

The app tries three strategies to detect available models:

1. **OpenAI `GET /v1/models`** — standard endpoint
2. **LM Studio `GET /api/v1/models`** — parses LM Studio's own API format
3. **Extracts loaded model** — finds the model with `loaded: true` in the LM Studio response

If none succeed, a manual text input appears so you can type the model name directly.

## Internal API

| Route | Method | Description |
|-------|--------|-------------|
| `/api/chat` | POST | Send a prompt to the loaded model |
| `/api/models` | GET | List available models from LM Studio |

Both return `{ success: true, data: ... }` on success or `{ success: false, error: { code, message } }` on failure.

## Design Principles

- **No database** — stateless, all state lives in the browser
- **Server-side API routes** — LM Studio is only called from the server
- **Typed everywhere** — full TypeScript coverage
- **Modular services** — swap LM Studio for any OpenAI-compatible endpoint
- **Graceful degradation** — manual model entry when auto-detection fails

## Future

This foundation is designed to support local task execution, file generation, ERC-8004 decentralized AI job assignment, browser automation, and autonomous workflows — none of which are implemented yet.
