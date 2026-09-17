"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Filter, History, RotateCcw, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type HistoryRecord = {
  _id: string;
  disease: string;
  prediction: string;
  confidence: number;
  modelVariant: string;
  modelName: string;
  imageName: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [disease, setDisease] = useState("");
  const [modelVariant, setModelVariant] = useState("");
  const [error, setError] = useState("");

  async function deleteRecord(id: string) {
    if (!window.confirm("Delete this prediction from history?")) return;

    try {
      const response = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to delete prediction.");
      setRecords((currentRecords) => currentRecords.filter((record) => record._id !== id));
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Unable to delete prediction.");
    }
  }

  useEffect(() => {
    const query = new URLSearchParams({ limit: "100" });
    if (disease) query.set("disease", disease);
    if (modelVariant) query.set("modelVariant", modelVariant);

    fetch(`/api/history?${query}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail);
        setRecords(data.records);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Unable to load history.");
      });
  }, [disease, modelVariant]);

  return (
    <>
      <Navbar />
      <main className="history-page">
        <p className="history-eyebrow">Prediction history</p>
        <h1 className="history-title">Previous model predictions</h1>
        <div className="history-toolbar">
          <div className="history-toolbar-title"><Filter size={16} /><span>Filter predictions</span></div>
          <div className="history-filters">
            <label className="history-filter">
              <span>Disease</span>
              <span className="history-select-wrap"><select value={disease} onChange={(event) => setDisease(event.target.value)}>
                <option value="">All diseases</option>
                <option value="pneumonia">Pneumonia</option>
                <option value="brain_tumor">Brain Tumor</option>
                <option value="bone_fracture">Bone Fracture</option>
              </select><ChevronDown size={15} /></span>
            </label>
            <label className="history-filter">
              <span>Model approach</span>
              <span className="history-select-wrap"><select value={modelVariant} onChange={(event) => setModelVariant(event.target.value)}>
                <option value="">All models</option>
                <option value="scratch">From Scratch</option>
                <option value="transfer_learning">Recommended models</option>
              </select><ChevronDown size={15} /></span>
            </label>
            {(disease || modelVariant) && <button type="button" className="history-clear" onClick={() => { setDisease(""); setModelVariant(""); }}><RotateCcw size={14} /> Clear filters</button>}
          </div>
        </div>
        {error && <p className="history-error">{error}</p>}
        {!error && records.length === 0 && (
          <div className="history-empty">
            <History size={22} />
            <strong>No saved predictions yet</strong>
            <span>Completed image analyses will appear here.</span>
          </div>
        )}
        {records.length > 0 && (
          <Card className="history-results">
            <CardHeader><CardTitle className="history-card-title"><span><History size={18} /> Recent predictions</span><small>{records.length} result{records.length === 1 ? "" : "s"}</small></CardTitle></CardHeader>
            <CardContent>
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b text-slate-500">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Disease</th>
                    <th className="p-3">Prediction</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">Image</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id} className="border-b last:border-0">
                      <td className="p-3">{new Date(record.createdAt).toLocaleString()}</td>
                      <td className="p-3">{record.disease}</td>
                      <td className="p-3 font-medium">{record.prediction}</td>
                      <td className="p-3">{(record.confidence * 100).toFixed(1)}%</td>
                      <td className="p-3">{record.modelName}</td>
                      <td className="p-3">{record.imageName}</td>
                      <td className="p-3">
                        <button type="button" className="history-delete-button" aria-label={`Delete ${record.imageName} prediction`} title="Delete prediction" onClick={() => deleteRecord(record._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}