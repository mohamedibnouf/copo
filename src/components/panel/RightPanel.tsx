"use client";

import {
  GitBranch,
  MessageSquare,
  Paperclip,
} from "lucide-react";
import { CommentBox } from "@/components/shared/CommentBox";
import { FilesTabContent } from "@/components/shared/FileAttachmentCard";
import { WorkflowTimeline } from "@/components/workflow/WorkflowTimeline";
import type { PanelTab, TransactionRequest } from "@/types";
import { cn } from "@/lib/utils";

const tabs: {
  id: PanelTab;
  label: string;
  icon: typeof GitBranch;
  color: string;
  activeBg: string;
}[] = [
  {
    id: "workflow",
    label: "Workflow",
    icon: GitBranch,
    color: "text-emerald-600",
    activeBg: "bg-emerald-50 ring-emerald-200",
  },
  {
    id: "comments",
    label: "Comments",
    icon: MessageSquare,
    color: "text-rose-500",
    activeBg: "bg-rose-50 ring-rose-200",
  },
  {
    id: "files",
    label: "Files",
    icon: Paperclip,
    color: "text-teal-600",
    activeBg: "bg-teal-50 ring-teal-200",
  },
];

function PanelTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2 sm:gap-2 sm:px-4 sm:py-3">
      {tabs.map(({ id, label, icon: Icon, color, activeBg }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTabChange(id)}
          className={cn(
            "flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-medium transition sm:text-[11px]",
            activeTab === id
              ? `${activeBg} ring-1 ${color}`
              : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Icon size={18} className={activeTab === id ? color : "text-slate-400"} />
          {label}
        </button>
      ))}
    </div>
  );
}

export function RightPanelWithActions({
  request,
  activeTab,
  onTabChange,
  onAddComment,
}: {
  request: TransactionRequest;
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onAddComment: (text: string) => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-t border-slate-200 bg-white lg:max-h-[100dvh] lg:w-[min(420px,38vw)] lg:border-l lg:border-t-0">
      <PanelTabs activeTab={activeTab} onTabChange={onTabChange} />

      <div className="max-h-[50vh] flex-1 overflow-y-auto p-3 sm:max-h-none sm:p-4 lg:max-h-[calc(100dvh-80px)]">
        {activeTab === "workflow" && (
          <WorkflowTimeline steps={request.workflow} />
        )}
        {activeTab === "comments" && (
          <CommentBox comments={request.comments} onAdd={onAddComment} />
        )}
        {activeTab === "files" && (
          <FilesTabContent attachments={request.attachments} />
        )}
      </div>
    </aside>
  );
}
