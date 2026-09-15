import { DiagnosisWorkspace } from "@/components/DiagnosisWorkspace";
import { Navbar } from "@/components/Navbar";

export default function BrainTumorPage() {
  return (
    <>
      <Navbar />
      <DiagnosisWorkspace
        disease="Brain Tumor"
        recommended="Brain Tumor DenseNet121"
        endpoint="brain-tumor"
      />
    </>
  );
}