import { Bone, Brain, ChevronRight, HeartPulse } from "lucide-react";
import Link from "next/link";

const details: Record<string, { icon: typeof Brain; color: string }> = {
	Pneumonia: { icon: HeartPulse, color: "teal" },
	"Brain Tumor": { icon: Brain, color: "indigo" },
	"Bone Fracture": { icon: Bone, color: "orange" },
};

export function DiseaseCard({ title, description, href, type }: { title: string; description: string; href: string; type: string }) {
	const detail = details[title];
	const Icon = detail.icon;

	return (
		<Link href={href} className={`workflow-card ${detail.color}`}>
			<div className="workflow-heading">
				<span className="workflow-icon">
					<Icon size={25} />
				</span>
				<div>
					<h3>{title}</h3>
					<p>{type}</p>
				</div>
			</div>
			<p className="workflow-summary">{description}</p>
			<span className="workflow-cta">
				Analyze <ChevronRight size={17} />
			</span>
		</Link>
	);
}
