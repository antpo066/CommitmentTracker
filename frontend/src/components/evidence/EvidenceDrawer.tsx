"use client";

import type { Statement } from "@/lib/types";
import { EvidencePanel } from "./EvidencePanel";
import { X } from "lucide-react";

interface EvidenceDrawerProps {
  statement: Statement | null;
  onClose: () => void;
}

export function EvidenceDrawer({ statement, onClose }: EvidenceDrawerProps) {
  if (!statement) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-[var(--color-border)] shadow-xl overflow-y-auto lg:hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-4 py-3">
          <h3 className="text-sm font-medium text-stone-700">Evidence</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          <EvidencePanel statement={statement} onClose={onClose} />
        </div>
      </div>
    </>
  );
}
