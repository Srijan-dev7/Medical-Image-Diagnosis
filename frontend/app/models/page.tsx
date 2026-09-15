"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Model = {
  disease: string;
  model_name: string;
  architecture: string;
  variant: string;
  recommended: boolean;
  input_size: number[];
  classes: string[];
  accuracy: number;
};

const diseaseLabels: Record<string, string> = {
  pneumonia: "Pneumonia",
  brain_tumor: "Brain Tumor",
  bone_fracture: "Bone Fracture",
};

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/models")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail);
        setModels(data.models);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Unable to load models.");
      });
  }, []);

  const groupedModels = Object.groupBy(models, (model) => model.disease);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="font-medium text-teal-700">Model comparison</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Available diagnosis models</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Evaluation details come directly from the FastAPI model registry. Confidence from a
          prediction is separate from these test accuracy values.
        </p>
        {error && <p className="mt-6 text-red-700">{error}</p>}
        {!error && models.length === 0 && <p className="mt-6 text-slate-500">Loading model details...</p>}
        <div className="mt-8 space-y-8">
          {Object.entries(groupedModels).map(([disease, diseaseModels]) => (
            <section key={disease}>
              <h2 className="mb-4 text-xl font-semibold">{diseaseLabels[disease] ?? disease}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {diseaseModels?.map((model) => (
                  <Card key={model.model_name}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-3">
                        <span>{model.model_name}</span>
                        {model.recommended && (
                          <span className="text-sm font-medium text-teal-700">Recommended</span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-slate-600">
                      <p>Approach: {model.variant === "scratch" ? "From scratch" : "Transfer learning"}</p>
                      <p>Architecture: {model.architecture}</p>
                      <p>Test accuracy: {(model.accuracy * 100).toFixed(2)}%</p>
                      <p>Input: {model.input_size.join(" x ")} pixels</p>
                      <p>Classes: {model.classes.join(", ")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}