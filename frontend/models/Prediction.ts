import { model, models, Schema, type InferSchemaType } from "mongoose";

const PredictionSchema = new Schema(
  {
    disease: { type: String, required: true, index: true },
    prediction: { type: String, required: true },
    confidence: { type: Number, required: true },
    modelVariant: { type: String, required: true, index: true },
    modelName: { type: String, required: true },
    imageName: { type: String, required: true },
  },
  { timestamps: true },
);

export type PredictionRecord = InferSchemaType<typeof PredictionSchema>;
export const Prediction = models.Prediction || model("Prediction", PredictionSchema);