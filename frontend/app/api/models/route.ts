export async function GET() {
  const apiUrl = process.env.FASTAPI_URL;

  if (!apiUrl) {
    return Response.json({ detail: "FASTAPI_URL is not configured." }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiUrl}/models`, { cache: "no-store" });
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      { detail: "The FastAPI server is unavailable. Start it on port 8000 and try again." },
      { status: 503 },
    );
  }
}