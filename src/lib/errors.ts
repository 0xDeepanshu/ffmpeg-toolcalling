export class AiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AiError) return error.message;
  if (error instanceof NetworkError) return error.message;
  if (error instanceof TimeoutError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unknown error occurred";
}

export function getErrorCode(error: unknown): string {
  if (error instanceof AiError) return error.code;
  if (error instanceof NetworkError) return "NETWORK_ERROR";
  if (error instanceof TimeoutError) return "TIMEOUT";
  return "UNKNOWN_ERROR";
}
