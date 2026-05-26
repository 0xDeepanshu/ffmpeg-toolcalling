import { NextResponse } from "next/server";
import { getErrorCode, getErrorMessage } from "@/lib/errors";
import { fetchModels } from "@/services/models";

export async function GET() {
  try {
    const models = await fetchModels();
    return NextResponse.json({
      success: true,
      data: {
        models: models.map((m) => ({
          id: m.id,
          owned_by: m.owned_by,
          created: m.created,
        })),
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
