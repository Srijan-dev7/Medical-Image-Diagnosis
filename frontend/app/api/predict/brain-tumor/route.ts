import { forwardPrediction } from "@/lib/fastapi"; export async function POST(request: Request){return forwardPrediction(request,"brain-tumor")}
