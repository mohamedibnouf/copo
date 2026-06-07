"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Package,
  Send,
  Sparkles,
} from "lucide-react";
import { useWorkflow } from "@/context/WorkflowContext";
import { BRANCHES, type Branch, type UrgencyLevel } from "@/types/workflow";
import { TransactionIdBadge } from "@/components/ui/TransactionIdBadge";
import { COPO_BRAND } from "@/constants/branding";

const ITEM_SUGGESTIONS = [
  "Fresh Meat",
  "Fresh Vegetables",
  "Fresh Seafood",
  "Cooking Oil",
  "Packaging Boxes",
  "Rice & Grains",
  "Disposable Gloves",
  "Spice Mix",
];

const URGENCY_OPTIONS: UrgencyLevel[] = ["Low", "Medium", "High"];

export function PurchaseRequestForm() {
  const { submitRequest, switchRole } = useWorkflow();
  const [branch, setBranch] = useState<Branch>("COPO Riyadh Branch");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [urgency, setUrgency] = useState<UrgencyLevel>("Medium");
  const [requester, setRequester] = useState("COPO Chef / Branch Manager");
  const [submitted, setSubmitted] = useState(false);
  const [lastId, setLastId] = useState("");
  const [lastBranch, setLastBranch] = useState<Branch>("COPO Riyadh Branch");

  const costNum = parseFloat(estimatedCost) || 0;
  const needsDoubleApproval = costNum > 5000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !quantity || !estimatedCost) return;

    const newReq = submitRequest({
      branch,
      itemName: itemName.trim(),
      quantity: parseInt(quantity, 10),
      estimatedCost: costNum,
      urgency,
      requester,
    });

    setLastId(newReq.id);
    setLastBranch(newReq.branch);
    setSubmitted(true);
    setItemName("");
    setQuantity("");
    setEstimatedCost("");
    setUrgency("Medium");

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Package className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">
                New Purchase Request / نموذج طلب شراء
              </h3>
              <p className="text-sm text-slate-500">
                Submit a procurement request for your COPO branch
              </p>
            </div>
          </div>

          {submitted && (
            <div className="mb-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200 animate-in fade-in">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">
                  Request submitted successfully! / تم إرسال الطلب بنجاح
                </p>
                <p className="mt-2 text-sm text-emerald-700">
                  Transaction ID / رقم المعاملة:
                </p>
                <div className="mt-1.5">
                  <TransactionIdBadge id={lastId} branch={lastBranch} size="md" />
                </div>
                <p className="mt-2 text-xs text-emerald-600">
                  Added to COPO workflow tracking with full audit trail.
                </p>
                <button
                  onClick={() => switchRole("area_manager")}
                  className="mt-2 text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                >
                  View in Approvals →
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Branch / الفرع <span className="text-rose-500">*</span>
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as Branch)}
                  className="w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Requester / مقدم الطلب
                </label>
                <input
                  type="text"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Item Name / اسم الصنف <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="item-suggestions"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Meat, Vegetables, Packaging Supplies"
                required
                className="w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <datalist id="item-suggestions">
                {ITEM_SUGGESTIONS.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Quantity / الكمية <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="100"
                  required
                  className="w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Estimated Cost / التكلفة (SAR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Urgency / الأولوية <span className="text-rose-500">*</span>
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full rounded-xl border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200 transition focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  {URGENCY_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {needsDoubleApproval && estimatedCost && (
              <div className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4 ring-1 ring-indigo-200">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-sm font-semibold text-indigo-800">
                    Double Approval Required / موافقة مزدوجة مطلوبة
                  </p>
                  <p className="mt-1 text-sm text-indigo-700">
                    Costs over 5,000 SAR require COPO double approval — Area Manager
                    and Finance Manager.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg active:scale-[0.99] sm:w-auto"
            >
              <Send size={16} />
              Submit Request / إرسال الطلب
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 text-white shadow-lg shadow-indigo-200">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} />
            <h4 className="font-semibold">Quick Tips / نصائح سريعة</h4>
          </div>
          <ul className="space-y-2 text-sm text-indigo-100">
            <li>• COPO branches: {COPO_BRAND.branchesShort.join(", ")}</li>
            <li>• Under 5,000 SAR — Area Manager approval only</li>
            <li>• Over 5,000 SAR — COPO double approval policy applies</li>
            <li>• High urgency requests are prioritized across all COPO branches</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            Common Items / أصناف شائعة
          </h4>
          <div className="flex flex-wrap gap-2">
            {ITEM_SUGGESTIONS.slice(0, 6).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setItemName(item)}
                className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:text-emerald-700 hover:ring-emerald-200"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            Workflow Steps / خطوات سير العمل
          </h4>
          <div className="space-y-3">
            {[
              { step: "1", label: "Created / تم الإنشاء", desc: "Request submitted" },
              { step: "2", label: "Under Review / قيد المراجعة", desc: "Manager review" },
              { step: "3", label: "Final Approval / الموافقة النهائية", desc: "Approved & logged" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
