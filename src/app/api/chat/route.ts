import { NextResponse } from "next/server";
import { getErrorCode, getErrorMessage } from "@/lib/errors";
import { sendChatMessage } from "@/services/ai";
import type { ChatRequestBody } from "@/types/api";

export async function POST(request: Request) {
  let body: ChatRequestBody;

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

  if (!body.model?.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "MISSING_MODEL", message: "Model is required" },
      },
      { status: 400 },
    );
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "MISSING_PROMPT", message: "Prompt is required" },
      },
      { status: 400 },
    );
  }

  try {
    const response = await sendChatMessage({
      model: body.model,
      prompt: body.prompt,
      temperature: body.temperature,
      max_tokens: body.max_tokens,
    });

    const choice = response.choices[0];

    return NextResponse.json({
      success: true,
      data: {
        id: response.id,
        model: response.model,
        content: choice?.message?.content ?? "",
        usage: {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
        },
      },
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
