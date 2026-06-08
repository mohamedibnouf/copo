"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/types";
import { formatDateTime } from "@/lib/utils";

export function CommentBox({
  comments,
  onAdd,
}: {
  comments: Comment[];
  onAdd: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <div className="flex h-full flex-col">
      {comments.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
            <span className="text-4xl">✈️</span>
          </div>
          <p className="font-semibold text-slate-700">No comments</p>
          <p className="mt-1 text-sm text-slate-400">Be the first to comment</p>
        </div>
      ) : (
        <div className="mb-4 max-h-[360px] flex-1 space-y-3 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"
            >
              <div className="mb-2 flex items-center gap-2">
                <UserAvatar user={comment.author} size="sm" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {comment.author.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatDateTime(comment.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-700">{comment.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-2 border-t border-slate-100 pt-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
        />
        <Button onClick={handleSubmit} className="w-full">
          <Send size={14} />
          Add comment
        </Button>
      </div>
    </div>
  );
}
