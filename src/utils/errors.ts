export class ToolError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = "ToolError";
  }
}

export function formatErrorResponse(error: unknown) {
  if (error instanceof ToolError) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
          }),
        },
      ],
    };
  }

  if (error instanceof Error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: {
              code: "INTERNAL_ERROR",
              message: error.message,
              stack:
                process.env.NODE_ENV === "development"
                  ? error.stack
                  : undefined,
            },
          }),
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          error: {
            code: "UNKNOWN_ERROR",
            message: String(error),
          },
        }),
      },
    ],
  };
}
