import { connectToDatabase } from "@/lib/mongodb";
import { Prediction } from "@/models/Prediction";

type SavePredictionInput = {
  disease: string;
  prediction: string;
  confidence: number;
  modelVariant: string;
  modelName: string;
  imageName: string;
};

export async function savePrediction(input: SavePredictionInput) {
  await connectToDatabase();
  return Prediction.create(input);
}

export async function getPredictions({
  disease,
  modelVariant,
  limit,
}: {
  disease?: string;
  modelVariant?: string;
  limit: number;
}) {
  await connectToDatabase();
  const filter: Record<string, string> = {};
  if (disease) filter.disease = disease;
  if (modelVariant) filter.modelVariant = modelVariant;

  return Prediction.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
}

export async function deletePrediction(id: string) {
  await connectToDatabase();
  return Prediction.findByIdAndDelete(id);
}