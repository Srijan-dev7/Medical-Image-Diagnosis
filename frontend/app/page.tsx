import { Activity, ArrowRight, Bone, Brain, CheckCircle2, FileImage, HeartPulse, Stethoscope } from "lucide-react";
import { DiseaseCard } from "@/components/DiseaseCard";
import { Navbar } from "@/components/Navbar";
import { ClinicalDocsDialog } from "@/components/ClinicalDocsDialog";

export default function Home() {
	return (
		<>
			<Navbar />
			<main className="home-page">
				<section className="hero-section">
					<div className="hero-copy">
						<span className="eyebrow"><Activity size={14} /> EDUCATIONAL &amp; RESEARCH USE</span>
						<h1>Medical Image Diagnosis</h1>
						<p>Analyze medical images using deep learning models.</p>
						<p>
							This workspace acts as an institutional reference node. Deploy convolutional neural networks to
							evaluate chest X-rays for pneumonia, high-resolution MRI scans for brain tumor boundaries,
							and orthopedic X-rays for structural bone fractures.
						</p>
						<div className="hero-actions">
							<a href="/diagnosis" className="primary-action">
								Start Diagnosis <ArrowRight size={16} />
							</a>
							<ClinicalDocsDialog />
						</div>
					</div>
					<div className="hero-visual" aria-label="Medical scan preview">
						<div className="xray-frame">
							<div className="minimal-scan-mark">
								<div className="modality-icons" aria-hidden="true">
									<Brain size={27} />
									<HeartPulse size={27} />
									<Bone size={27} />
								</div>
							</div>
							<div className="scan-label">BRAIN · LUNGS · BONE</div>
						</div>
					</div>
				</section>

				<section className="workflow-section">
					<div className="section-heading">
						<h2>Choose an analysis</h2>
					</div>
					<div className="workflow-grid">
						<DiseaseCard
							title="Pneumonia"
							description="Analyze chest X-ray images and classify them as normal or showing signs of pneumonia."
							type="Chest X-ray"
							href="/pneumonia"
						/>
						<DiseaseCard
							title="Brain Tumor"
							description="Analyze brain MRI scans to identify glioma, meningioma, pituitary tumor, or no tumor."
							type="MRI Scan"
							href="/brain-tumor"
						/>
						<DiseaseCard
							title="Bone Fracture"
							description="Analyze bone X-ray images and classify them as fractured or not fractured."
							type="X-ray"
							href="/bone-fracture"
						/>
					</div>
				</section>

				<section className="stats-strip">
					<div className="stat"><span><Brain size={16} /></span><div><strong>3</strong><small>Conditions screened</small></div></div>
					<div className="stat"><span><Stethoscope size={16} /></span><div><strong>6</strong><small>Deep learning models</small></div></div>
					<div className="stat"><span><FileImage size={16} /></span><div><strong>2</strong><small>Diagnostic modalities</small></div></div>
				</section>
			</main>
		</>
	);
}

