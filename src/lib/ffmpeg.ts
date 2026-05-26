import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

function findFfmpegBinary(): string {
  const envPath = process.env.FFMPEG_PATH;
  if (envPath && existsSync(envPath)) {
    return resolve(envPath);
  }

  const candidate = join(
    /*turbopackIgnore: true*/ process.cwd(),
    "node_modules",
    "ffmpeg-static",
    "ffmpeg.exe",
  );

  if (existsSync(candidate)) {
    return resolve(candidate);
  }

  return "ffmpeg";
}

const ffmpegPath = findFfmpegBinary();

console.log(`[FFmpeg] Binary: ${ffmpegPath}`);

export const OUTPUT_DIR = resolve("generated/videos");

export interface TrimOptions {
  inputPath: string;
  outputDir?: string;
  duration?: number;
}

export interface TrimResult {
  outputPath: string;
  duration: number;
}

async function ensureOutputDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch {
    // directory exists
  }
}

function generateOutputName(inputPath: string): string {
  const base =
    inputPath
      .replace(/\.\w+$/, "")
      .split(/[/\\]/)
      .pop() ?? "output";
  const timestamp = Date.now();
  return `${base}_trimmed_${timestamp}.mp4`;
}

export async function validateInput(inputPath: string): Promise<void> {
  if (!inputPath) {
    throw new Error("Input path is required");
  }

  const resolved = resolve(inputPath);

  if (!existsSync(resolved)) {
    throw new Error(`Input file not found: ${resolved}`);
  }

  const stats = await stat(resolved);

  if (!stats.isFile()) {
    throw new Error(`Input path is not a file: ${resolved}`);
  }

  if (stats.size === 0) {
    throw new Error(`Input file is empty: ${resolved}`);
  }
}

function runFFmpeg(args: string[]): Promise<void> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = execFile(ffmpegPath, args, (error) => {
      if (error) {
        rejectPromise(new Error(`FFmpeg failed: ${error.message}`));
        return;
      }
      resolvePromise();
    });

    child.stderr?.on("data", (data: string) => {
      console.log(`[FFmpeg] ${data.toString().trim()}`);
    });
  });
}

export async function trimVideo(options: TrimOptions): Promise<TrimResult> {
  const { inputPath, outputDir = OUTPUT_DIR, duration = 30 } = options;

  await ensureOutputDir(outputDir);
  await validateInput(inputPath);

  const resolvedInput = resolve(inputPath);
  const outputName = generateOutputName(resolvedInput);
  const outputPath = join(outputDir, outputName);

  console.log(`[FFmpeg] Trimming: ${resolvedInput}`);
  console.log(`[FFmpeg] Duration: ${duration}s`);
  console.log(`[FFmpeg] Output: ${outputPath}`);

  const args = [
    "-y",
    "-i",
    resolvedInput,
    "-ss",
    "0",
    "-t",
    String(duration),
    "-c",
    "copy",
    outputPath,
  ];

  await runFFmpeg(args);

  console.log(`[FFmpeg] Export completed: ${outputPath}`);

  return { outputPath, duration };
}
