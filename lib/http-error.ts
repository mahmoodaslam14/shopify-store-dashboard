export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function toResponse(e: unknown) {
  if (e instanceof HttpError) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: e.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (e instanceof Error) {
    console.error(e);
  } else {
    console.error("Unknown error", e);
  }
  return new Response(JSON.stringify({ error: "Internal error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
