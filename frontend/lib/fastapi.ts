export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
import { savePrediction } from "@/lib/predictions";

const supportedTypes = new Set(["image/jpeg", "image/png"]);

export function validateUpload(file: File | null) {
  if (!file) return "Select a medical image first.";
  if (!supportedTypes.has(file.type)) return "Only JPG, JPEG, and PNG images are supported.";
  if (file.size > MAX_IMAGE_BYTES) return "The image must be 10 MB or smaller.";
  return null;
}

export async function forwardPrediction(request: Request, diseasePath: string) {
  const incoming = await request.formData();
  const image = incoming.get("image");
  const modelVariant = incoming.get("model_variant") ?? "best";
  if (!(image instanceof File)) return Response.json({ detail: "An image file is required." }, { status: 400 });
  const error = validateUpload(image);
  if (error) return Response.json({ detail: error }, { status: 400 });

  const apiUrl = process.env.FASTAPI_URL;
  if (!apiUrl) return Response.json({ detail: "FASTAPI_URL is not configured." }, { status: 500 });
  const form = new FormData(); form.append("image", image); form.append("model_variant", String(modelVariant));
  try {
    const response = await fetch(`${apiUrl}/predict/${diseasePath}`, { method: "POST", body: form, cache: "no-store" });
    const data = await response.json();
    if (response.ok && data.success) {
      try {
        await savePrediction({
          disease: data.disease,
          prediction: data.prediction,
          confidence: data.confidence,
          modelVariant: data.model_variant,
          modelName: data.model_name,
          imageName: image.name || "uploaded-image",
        });
        data.history_saved = true;
      } catch (error) {
        console.error("Unable to save prediction history:", error);
        data.history_saved = false;
      }
    }
    return Response.json(data, { status: response.status });
  } catch { return Response.json({ detail: "The FastAPI server is unavailable. Start it on port 8000 and try again." }, { status: 503 }); }
}
