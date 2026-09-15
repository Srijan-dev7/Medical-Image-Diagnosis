import { getPredictions } from "@/lib/predictions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number(searchParams.get("limit") ?? "50");
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 100)
    : 50;

  try {
    const records = await getPredictions({
      disease: searchParams.get("disease") ?? undefined,
      modelVariant: searchParams.get("modelVariant") ?? undefined,
      limit,
    });
    return Response.json({ success: true, records });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unable to load prediction history.";
    return Response.json({ detail }, { status: 500 });
  }
}