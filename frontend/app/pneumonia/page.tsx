import { DiagnosisWorkspace } from "@/components/DiagnosisWorkspace";
import { Navbar } from "@/components/Navbar";

export default function PneumoniaPage() {
  return (
    <>
      <Navbar />
      <DiagnosisWorkspace
        disease="Pneumonia"
        recommended="Pneumonia EfficientNetB0"
        endpoint="pneumonia"
      />
    </>
  );
}