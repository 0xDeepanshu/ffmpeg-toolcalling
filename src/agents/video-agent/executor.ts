import { editPodcast } from "./tools";
import type { AgentDecision, AgentRunResponse } from "./types";

const REJECTED_RESPONSE: AgentRunResponse = {
  decision: { action: "reject" },
  result: { success: false, output: "Job rejected" },
};

export async function execute(
  decision: AgentDecision,
): Promise<AgentRunResponse> {
  switch (decision.action) {
    case "edit_podcast":
      return {
        decision,
        result: await editPodcast(decision.args ?? {}),
      };

    case "reject":
      return REJECTED_RESPONSE;

    default:
      return REJECTED_RESPONSE;
  }
}
