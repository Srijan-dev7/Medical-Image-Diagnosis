"use client";

import { Bone, Brain, HeartPulse, X } from "lucide-react";
import { useState } from "react";

type DiseaseKey = "pneumonia" | "brain-tumor" | "bone-fracture";

const diseaseDocs: Record<DiseaseKey, {
	name: string;
	icon: typeof HeartPulse;
	overview: string;
	signs: string;
	modality: string;
}> = {
	pneumonia: {
		name: "Pneumonia",
		icon: HeartPulse,
		overview: "An infection that can cause inflammation and fluid in the air sacs of the lungs.",
		signs: "The model looks for image patterns associated with pneumonia and compares them with normal chest X-rays.",
		modality: "Chest X-ray",
	},
	"brain-tumor": {
		name: "Brain Tumor",
		icon: Brain,
		overview: "An abnormal growth of cells within or around the brain that may require specialist assessment.",
		signs: "The model classifies MRI images into glioma, meningioma, pituitary tumor, or no tumor categories.",
		modality: "Brain MRI",
	},
	"bone-fracture": {
		name: "Bone Fracture",
		icon: Bone,
		overview: "A break or crack in a bone caused by injury, stress, or weakened bone structure.",
		signs: "The model evaluates bone X-ray patterns and classifies the image as fractured or not fractured.",
		modality: "Bone X-ray",
	},
};

export function ClinicalDocsDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedDisease, setSelectedDisease] = useState<DiseaseKey | null>(null);
	const selected = selectedDisease ? diseaseDocs[selectedDisease] : null;

	function openDocs() {
		setSelectedDisease(null);
		setIsOpen(true);
	}

	return (
		<>
			<button type="button" className="secondary-action" onClick={openDocs}>
				Clinical Reference
			</button>

			{isOpen && (
				<div className="clinical-docs-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
					<section
						className="clinical-docs-dialog"
						role="dialog"
						aria-modal="true"
						aria-labelledby="clinical-docs-title"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="clinical-docs-header">
							<div>
								<span className="eyebrow">REFERENCE GUIDE</span>
								<h2 id="clinical-docs-title">Clinical reference</h2>
							</div>
							<button type="button" className="clinical-docs-close" aria-label="Close clinical documentation" onClick={() => setIsOpen(false)}>
								<X size={19} />
							</button>
						</div>

						{!selected ? (
							<>
								<p className="clinical-docs-intro">Select a condition to read a short overview of what this workspace evaluates.</p>
								<div className="clinical-docs-options">
									{(Object.entries(diseaseDocs) as [DiseaseKey, typeof diseaseDocs[DiseaseKey]][]).map(([key, disease]) => {
										const Icon = disease.icon;
										return (
											<button type="button" className="clinical-doc-option" key={key} onClick={() => setSelectedDisease(key)}>
												<span className="clinical-doc-icon"><Icon size={21} /></span>
												<span><strong>{disease.name}</strong><small>{disease.modality}</small></span>
											</button>
										);
									})}
								</div>
							</>
						) : (
							<div className="clinical-doc-detail">
								<div className="clinical-doc-detail-title"><selected.icon size={23} /><div><h3>{selected.name}</h3><span>{selected.modality}</span></div></div>
								<p>{selected.overview}</p>
								<h4>What this model evaluates</h4>
								<p>{selected.signs}</p>
								<button type="button" className="clinical-doc-back" onClick={() => setSelectedDisease(null)}>Back to conditions</button>
							</div>
						)}
						<p className="clinical-docs-disclaimer">Educational reference only. Results are not a medical diagnosis.</p>
					</section>
				</div>
			)}
		</>
	);
}