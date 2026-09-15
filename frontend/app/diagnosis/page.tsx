import { DiseaseCard } from "@/components/DiseaseCard";
import { Navbar } from "@/components/Navbar";

export default function DiagnosisPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="font-medium text-teal-700">Diagnosis workflows</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Choose an image type</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Select the disease model that matches the medical image you want to analyze.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <DiseaseCard
            title="Pneumonia"
            description="Analyze chest X-ray images."
            type="Chest X-ray"
            href="/pneumonia"
          />
          <DiseaseCard
            title="Brain Tumor"
            description="Analyze brain MRI images."
            type="Brain MRI"
            href="/brain-tumor"
          />
          <DiseaseCard
            title="Bone Fracture"
            description="Analyze bone X-ray images."
            type="Bone X-ray"
            href="/bone-fracture"
          />
        </div>
      </main>
    </>
  );
}