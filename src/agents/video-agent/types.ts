export type AgentAction = "edit_podcast" | "reject";

export type AgentDecision =
  | {
      action: "edit_podcast";
      args?: Record<string, unknown>;
    }
  | {
      action: "reject";
    };

export interface ToolExecutionResult {
  success: boolean;
  output: string;
  details?: Record<string, unknown>;
}

export interface AgentRunResponse {
  decision: AgentDecision;
  result: ToolExecutionResult;
}

export interface AgentRequestBody {
  job: string;
  model?: string;
  inputPath?: string;
}

export interface EditPodcastArgs {
  inputPath: string;
}
