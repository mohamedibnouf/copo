"use client";

import { FileText, Upload } from "lucide-react";
import type { Attachment } from "@/types";
import { Button } from "@/components/ui/button";

export function FileAttachmentCard({ file }: { file: Attachment }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <FileText className="h-10 w-10 shrink-0 text-rose-500" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
        <p className="text-xs text-slate-400">{file.size}</p>
      </div>
    </div>
  );
}

export function FilesTabContent({
  attachments,
}: {
  attachments: Attachment[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">Files</h4>
      </div>

      <div className="rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800 ring-1 ring-sky-100">
        Payment voucher request | طلب سداد قسيمة
      </div>

      {attachments.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">No files attached</p>
      ) : (
        <div className="space-y-2">
          {attachments.map((file) => (
            <FileAttachmentCard key={file.id} file={file} />
          ))}
        </div>
      )}

      <Button variant="secondary" className="w-full">
        <Upload size={14} />
        Upload file / رفع ملف
      </Button>
    </div>
  );
}
