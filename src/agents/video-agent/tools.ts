import { trimVideo } from "@/lib/ffmpeg";
import type { EditPodcastArgs, ToolExecutionResult } from "./types";

export async function editPodcast(
  input: Record<string, unknown>,
): Promise<ToolExecutionResult> {
  const args = input as unknown as EditPodcastArgs;

  if (!args.inputPath) {
    return {
      success: false,
      output: "No input path provided",
    };
  }

  console.log(`[VideoAgent] Processing started: ${args.inputPath}`);

  try {
    const result = await trimVideo({
      inputPath: args.inputPath,
      duration: 30,
    });

    console.log("[Executor] Tool finished");

    return {
      success: true,
      output: `Video trimmed successfully: ${result.outputPath}`,
      details: {
        outputPath: result.outputPath,
        duration: result.duration,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[VideoAgent] Processing failed: ${message}`);
    return {
      success: false,
      output: message,
    };
  }
}
