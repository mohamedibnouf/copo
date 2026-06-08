"use client";

import { Paperclip, Trash2 } from "lucide-react";
import { BilingualLabel } from "@/components/shared/BilingualLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LineItem } from "@/types";

export type LineItemDraft = Omit<LineItem, "id"> & { id?: string };

function emptyLine(): LineItemDraft {
  return {
    purpose: "",
    beneficiary: "",
    value: 0,
    documentNumber: "",
    notes: "",
  };
}

interface LineItemsTableProps {
  items: LineItemDraft[];
  onChange: (items: LineItemDraft[]) => void;
  readOnly?: boolean;
}

function MobileLineCard({
  item,
  index,
  readOnly,
  onUpdate,
  onRemove,
  canRemove,
}: {
  item: LineItemDraft;
  index: number;
  readOnly: boolean;
  onUpdate: (field: keyof LineItemDraft, value: string | number) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">Row #{index + 1}</span>
        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            disabled={!canRemove}
            className="h-8 w-8"
          >
            <Trash2 size={14} className="text-rose-500" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <Field label={<BilingualLabel en="Purpose" ar="الغرض" required />} readOnly={readOnly}>
          {readOnly ? (
            <p className="text-sm text-slate-800">{item.purpose}</p>
          ) : (
            <Input
              value={item.purpose}
              onChange={(e) => onUpdate("purpose", e.target.value)}
              placeholder="الغرض"
            />
          )}
        </Field>

        <Field label={<BilingualLabel en="Beneficiary" ar="المستفيد" />} readOnly={readOnly}>
          {readOnly ? (
            <p className="text-sm text-slate-800">{item.beneficiary}</p>
          ) : (
            <Input
              value={item.beneficiary}
              onChange={(e) => onUpdate("beneficiary", e.target.value)}
            />
          )}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={<BilingualLabel en="Value" ar="القيمة" required />} readOnly={readOnly}>
            {readOnly ? (
              <p className="text-sm font-semibold text-slate-800">{item.value}</p>
            ) : (
              <Input
                type="number"
                min={0}
                step={0.01}
                value={item.value || ""}
                onChange={(e) =>
                  onUpdate("value", parseFloat(e.target.value) || 0)
                }
              />
            )}
          </Field>
          <Field
            label={<BilingualLabel en="Document #" ar="رقم المستند" />}
            readOnly={readOnly}
          >
            {readOnly ? (
              <p className="text-sm text-slate-800">{item.documentNumber || "—"}</p>
            ) : (
              <Input
                value={item.documentNumber}
                onChange={(e) => onUpdate("documentNumber", e.target.value)}
              />
            )}
          </Field>
        </div>

        <Field label={<BilingualLabel en="Notes" ar="الملاحظات" />} readOnly={readOnly}>
          {readOnly ? (
            <p className="text-sm text-slate-800">{item.notes || "—"}</p>
          ) : (
            <Input
              value={item.notes}
              onChange={(e) => onUpdate("notes", e.target.value)}
            />
          )}
        </Field>

        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          <Paperclip size={12} />
          {item.attachmentName || "ارفاق المستند"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  readOnly,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  readOnly?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] text-slate-500">{label}</p>
      {children}
    </div>
  );
}

export function LineItemsTable({ items, onChange, readOnly = false }: LineItemsTableProps) {
  const updateItem = (index: number, field: keyof LineItemDraft, value: string | number) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(next);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) return;
    onChange(items.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...items, emptyLine()]);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-3 py-3 sm:px-4">
        <p className="text-xs font-semibold text-slate-800 sm:text-sm">
          Payment voucher request | طلب سداد قسيمة
        </p>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 p-3 md:hidden">
        {items.map((item, index) => (
          <MobileLineCard
            key={item.id ?? index}
            item={item}
            index={index}
            readOnly={readOnly}
            onUpdate={(field, value) => updateItem(index, field, value)}
            onRemove={() => removeItem(index)}
            canRemove={items.length > 1}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm lg:min-w-[960px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-500">
              <th className="w-10 px-3 py-2">#</th>
              <th className="px-3 py-2">
                <BilingualLabel en="Purpose" ar="الغرض" required />
              </th>
              <th className="px-3 py-2">
                <BilingualLabel en="Beneficiary Information" ar="المستفيد" />
              </th>
              <th className="px-3 py-2">
                <BilingualLabel en="Value" ar="القيمة" required />
              </th>
              <th className="px-3 py-2">
                <BilingualLabel en="Document Number" ar="رقم المستند" />
              </th>
              <th className="px-3 py-2">
                <BilingualLabel en="Attachment" ar="إرفاق المستند" />
              </th>
              <th className="px-3 py-2">
                <BilingualLabel en="Notes" ar="الملاحظات" />
              </th>
              {!readOnly && <th className="w-12 px-3 py-2" />}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id ?? index} className="border-b border-slate-50">
                <td className="px-3 py-2 text-slate-400">{index + 1}</td>
                <td className="px-3 py-2">
                  {readOnly ? (
                    item.purpose
                  ) : (
                    <Input
                      value={item.purpose}
                      onChange={(e) => updateItem(index, "purpose", e.target.value)}
                      placeholder="الغرض"
                    />
                  )}
                </td>
                <td className="px-3 py-2">
                  {readOnly ? (
                    item.beneficiary
                  ) : (
                    <Input
                      value={item.beneficiary}
                      onChange={(e) => updateItem(index, "beneficiary", e.target.value)}
                    />
                  )}
                </td>
                <td className="px-3 py-2">
                  {readOnly ? (
                    item.value
                  ) : (
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.value || ""}
                      onChange={(e) =>
                        updateItem(index, "value", parseFloat(e.target.value) || 0)
                      }
                    />
                  )}
                </td>
                <td className="px-3 py-2">
                  {readOnly ? (
                    item.documentNumber || "—"
                  ) : (
                    <Input
                      value={item.documentNumber}
                      onChange={(e) => updateItem(index, "documentNumber", e.target.value)}
                    />
                  )}
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    <Paperclip size={12} />
                    {item.attachmentName || "ارفاق"}
                  </button>
                </td>
                <td className="px-3 py-2">
                  {readOnly ? (
                    item.notes || "—"
                  ) : (
                    <Input
                      value={item.notes}
                      onChange={(e) => updateItem(index, "notes", e.target.value)}
                    />
                  )}
                </td>
                {!readOnly && (
                  <td className="px-3 py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 size={14} className="text-rose-500" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="border-t border-slate-100 px-3 py-3 sm:px-4">
          <Button type="button" onClick={addRow} size="sm" className="w-full sm:w-auto">
            Add row / إضافة صف
          </Button>
        </div>
      )}
    </div>
  );
}

export { emptyLine };
