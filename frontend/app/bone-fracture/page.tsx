import { DiagnosisWorkspace } from "@/components/DiagnosisWorkspace";
import { Navbar } from "@/components/Navbar";

export default function BoneFracturePage() {
  return (
    <>
      <Navbar />
      <DiagnosisWorkspace
        disease="Bone Fracture"
        recommended="Bone Fracture MobileNetV2"
        endpoint="bone-fracture"
      />
    </>
  );
}