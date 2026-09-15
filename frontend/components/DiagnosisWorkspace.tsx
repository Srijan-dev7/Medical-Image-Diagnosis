"use client";

import { Upload } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function DiagnosisWorkspace({
  disease,
  recommended,
  endpoint,
}: {
  disease: string;
  recommended: string;
  endpoint: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [variant, setVariant] = useState("transfer_learning");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ prediction: string; confidence: number; model_name: string; model_variant: string } | null>(null);

  const scratchLabel =
    disease === "Pneumonia"
      ? "Pneumonia Scratch CNN (Custom CNN)"
      : disease === "Brain Tumor"
        ? "Brain Tumor Scratch CNN (Custom CNN)"
        : "Bone Fracture Scratch CNN (Custom CNN)";

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("model_variant", variant);

    try {
      const response = await fetch(`/api/predict/${endpoint}`, { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Prediction request failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="workspace-shell">
      <div className="workspace-topbar">
        <Link href="/" className="back-link">← Back to Home</Link>
      </div>

      <header className="workspace-header">
        <h1>{disease} Detection Workspace</h1>
        <p>Upload a chest X-ray image for rapid automated deep learning analysis.</p>
      </header>

      <div className="workspace-divider" />

      <div className="workspace-grid">
        <section className="upload-panel">
          <div className="panel-heading">Upload Radiograph</div>

          <label className="upload-dropzone">
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0];
                if (!selectedFile) return;

                if (!selectedFile.type.includes("image") || selectedFile.size > 10 * 1024 * 1024) {
                  setError("Choose a JPG or PNG under 10 MB.");
                  return;
                }

                setFile(selectedFile);
                setPreview(URL.createObjectURL(selectedFile));
                setError("");
              }}
            />

            {preview ? (
              <img src={preview} alt="Selected medical image" className="upload-preview" />
            ) : (
              <>
                <span className="upload-icon">
                  <Upload size={28} />
                </span>
                <span className="upload-text">Drag &amp; drop your image here<br />or click to browse your system</span>
                <small>Supported clinical formats: JPEG, PNG, DICOM (.dcm)</small>
              </>
            )}
          </label>

          <div className="model-selector">
            <label>Select classifier model</label>
            <select value={variant} onChange={(event) => setVariant(event.target.value)}>
              <option value="scratch">{scratchLabel}</option>
              <option value="transfer_learning">Recommended — {recommended}</option>
            </select>
          </div>

          <button type="button" className="analyze-button" onClick={analyze} disabled={!file || loading}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </section>

        <section className="output-panel">
          <div className="panel-heading output-heading">
            Diagnostic Output
            <span className="status-pill">{result ? "Ready" : "Awaiting Input"}</span>
          </div>

          {error ? (
            <div className="error-box">{error}</div>
          ) : result ? (
            <>
              <div className="result-box">
                <div className="result-badge">{result.prediction}</div>
                <div className="result-confidence">
                  <span>Confidence</span>
                  <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                </div>
              </div>
              <div className="metrics-list">
                <div className="metric-row">
                  <span>Classification Label</span>
                  <strong>{result.prediction}</strong>
                </div>
                <div className="metric-row">
                  <span>Confidence Level</span>
                  <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                </div>
                <div className="metric-row">
                  <span>Processing Architecture</span>
                  <strong>{result.model_name}</strong>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="empty-state">
                <div className="pulse-mark">∿</div>
                <p>Diagnostic pipeline stands ready</p>
                <span>Upload an image on the left and click “Analyze Image” to execute CNN prediction maps and confidence calculations.</span>
              </div>

              <div className="metrics-list">
                <div className="metric-row">
                  <span>Expected metrics output</span>
                  <strong>—</strong>
                </div>
                <div className="metric-row">
                  <span>Classification Label</span>
                  <strong>—</strong>
                </div>
                <div className="metric-row">
                  <span>Confidence Level</span>
                  <strong>0.0%</strong>
                </div>
                <div className="metric-row">
                  <span>Processing Architecture</span>
                  <strong>{recommended}</strong>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
