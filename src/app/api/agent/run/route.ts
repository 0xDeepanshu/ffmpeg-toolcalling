import { NextResponse } from "next/server";
import { decide } from "@/agents/video-agent/brain";
import { execute } from "@/agents/video-agent/executor";
import type {
  AgentDecision,
  AgentRequestBody,
} from "@/agents/video-agent/types";
import { getErrorCode, getErrorMessage } from "@/lib/errors";

export async function POST(request: Request) {
  let body: AgentRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON",
        },
      },
      { status: 400 },
    );
  }

  if (!body.job?.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "MISSING_JOB", message: "Job description is required" },
      },
      { status: 400 },
    );
  }

  try {
    const decision = await decide({ job: body.job, model: body.model });

    const decisionWithInput: AgentDecision = injectInputPath(
      decision,
      body.inputPath,
    );

    const response = await execute(decisionWithInput);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const message = getErrorMessage(error);
    const code = getErrorCode(error);
    return NextResponse.json(
      { success: false, error: { code, message } },
      { status: 503 },
    );
  }
}

function injectInputPath(
  decision: AgentDecision,
  inputPath?: string,
): AgentDecision {
  if (decision.action === "reject" || !inputPath) {
    return decision;
  }

  return {
    ...decision,
    args: {
      ...decision.args,
      inputPath,
    },
  };
}
