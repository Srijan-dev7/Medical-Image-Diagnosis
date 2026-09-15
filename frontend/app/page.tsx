import { Activity, ArrowRight, Bone, Brain, CheckCircle2, FileImage, HeartPulse, Stethoscope } from "lucide-react";
import { DiseaseCard } from "@/components/DiseaseCard";
import { Navbar } from "@/components/Navbar";

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
							<a href="/diagnosis" className="secondary-action">
								Read Clinical Docs
							</a>
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
							description="Deploys dual-path DenseNet models trained on NIH ChestX-ray14 to screen for pneumonia and inflammatory fluid."
							type="Chest X-ray"
							href="/pneumonia"
						/>
						<DiseaseCard
							title="Brain Tumor"
							description="Utilizes high-resolution T2-weighted MRI classifiers to segment and detect boundaries of glioblastomas, meningiomas, and pituitary tumors."
							type="MRI Scan"
							href="/brain-tumor"
						/>
						<DiseaseCard
							title="Bone Fracture"
							description="Analyzes structural orthopedic radiographs to flag cortical discontinuities and stress lines along appendicular and axial skeletal segments."
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

