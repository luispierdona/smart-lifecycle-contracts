"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { jsPDF } from "jspdf";

export type ContractRegistration = {
  id: number;
  material_id: number;
  weight: number;
  calculated_co2?: number | string;
  calculated_tax?: number | string;
  status: string;
  material?: { name: string; co2_factor?: number; tax_rate?: number };
  contract?: {
    contract_number: string;
    terms?: string;
    expiry_date: string;
  };
};

type ContractViewerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: ContractRegistration | null;
};

function downloadPdf(registration: ContractRegistration) {
  if (!registration?.contract) return;
  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const contractNumber = registration.contract.contract_number;
  const margin = 20;
  let y = 20;

  const addLine = (text: string, fontSize = 11, bold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(text, margin, y);
    y += fontSize * 0.5 + 2;
  };

  addLine("RECYCLING CONTRACT", 18, true);
  y += 4;
  addLine(`Contract Number: ${contractNumber}`, 12);
  addLine(`Expiry Date: ${registration.contract.expiry_date}`, 11);
  y += 6;

  addLine("Contract Information", 14, true);
  addLine(`Contract Number: ${contractNumber}`);
  addLine(`Expiry Date: ${registration.contract.expiry_date}`);
  y += 4;

  addLine("Waste Registration Details", 14, true);
  addLine(`Material: ${registration.material?.name ?? "—"}`);
  addLine(`Weight: ${registration.weight} kg`);
  addLine(
    `CO2: ${registration.calculated_co2 != null && registration.calculated_co2 !== "" ? Number(registration.calculated_co2).toFixed(2) : "—"} kg`
  );
  addLine(
    `Tax: $${registration.calculated_tax != null && registration.calculated_tax !== "" ? Number(registration.calculated_tax).toFixed(2) : "—"}`
  );
  addLine(`Status: ${registration.status}`);
  addLine(`Registration ID: #${registration.id}`);
  y += 4;

  if (registration.contract.terms) {
    addLine("Terms and Conditions", 14, true);
    const terms = doc.splitTextToSize(registration.contract.terms, 170);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    terms.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 5;
    });
    y += 4;
  }

  addLine(
    `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    9
  );

  doc.save(`${contractNumber}.pdf`);
}

export function ContractViewer({ open, onOpenChange, registration }: ContractViewerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!registration || !open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b px-6 pr-12 py-4">
          <h2 className="text-lg font-bold">Contract {registration.contract?.contract_number ?? "Preview"}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-md p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col overflow-hidden">
          <div
            className="flex-1 overflow-y-auto px-6 pb-6 bg-stone-50 rounded border"
            style={{ minHeight: "400px" }}
          >
            <div className="max-w-[210mm] mx-auto py-8 px-10 bg-white shadow-sm rounded">
              <div className="border-b-2 border-stone-800 pb-3 mb-6">
                <h1 className="text-2xl font-bold text-stone-900">RECYCLING CONTRACT</h1>
                <p className="text-sm text-stone-600 mt-1">
                  Contract Number:{" "}
                  <span className="font-mono font-semibold">
                    {registration.contract?.contract_number}
                  </span>
                </p>
              </div>

              <section className="mb-6">
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  Contract Information
                </h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-stone-500">Contract Number</dt>
                  <dd className="font-medium">{registration.contract?.contract_number}</dd>
                  <dt className="text-stone-500">Expiry Date</dt>
                  <dd className="font-medium">{registration.contract?.expiry_date}</dd>
                </dl>
              </section>

              <section className="mb-6">
                <h2 className="text-base font-semibold text-stone-800 mb-3">
                  Waste Registration Details
                </h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-stone-500">Material</dt>
                  <dd className="font-medium">{registration.material?.name}</dd>
                  <dt className="text-stone-500">Weight</dt>
                  <dd className="font-medium">{registration.weight} kg</dd>
                  <dt className="text-stone-500">CO₂</dt>
                  <dd className="font-medium">
                    {registration.calculated_co2 != null && registration.calculated_co2 !== ""
                      ? `${Number(registration.calculated_co2).toFixed(2)} kg`
                      : "—"}
                  </dd>
                  <dt className="text-stone-500">Tax</dt>
                  <dd className="font-medium">
                    {registration.calculated_tax != null && registration.calculated_tax !== ""
                      ? `$${Number(registration.calculated_tax).toFixed(2)}`
                      : "—"}
                  </dd>
                  <dt className="text-stone-500">Status</dt>
                  <dd className="font-medium">{registration.status}</dd>
                  <dt className="text-stone-500">Registration ID</dt>
                  <dd className="font-medium">#{registration.id}</dd>
                </dl>
              </section>

              {registration.contract?.terms && (
                <section className="mb-6">
                  <h2 className="text-base font-semibold text-stone-800 mb-3">
                    Terms and Conditions
                  </h2>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {registration.contract.terms}
                  </p>
                </section>
              )}

              <div className="pt-4 border-t text-xs text-stone-500">
                Generated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex justify-center pt-4 pb-2">
            <Button
              type="button"
              onClick={() => downloadPdf(registration)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download as {registration.contract?.contract_number}.pdf
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
