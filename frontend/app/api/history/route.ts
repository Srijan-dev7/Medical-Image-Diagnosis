import { deletePrediction, getPredictions } from "@/lib/predictions";
import mongoose from "mongoose";

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

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return Response.json({ detail: "A valid prediction id is required." }, { status: 400 });
    }

    const deleted = await deletePrediction(id);
    if (!deleted) return Response.json({ detail: "Prediction not found." }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unable to delete prediction.";
    return Response.json({ detail }, { status: 500 });
  }
}