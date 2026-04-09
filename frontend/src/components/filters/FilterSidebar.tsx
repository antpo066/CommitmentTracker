"use client";

import { useState } from "react";
import { STATUS_CONFIG, TYPE_CONFIG } from "@/lib/constants";
import type { StatementStatus, StatementType } from "@/lib/types";
import { ChevronDown, ChevronRight, X } from "lucide-react";

interface FilterState {
  statuses: StatementStatus[];
  types: StatementType[];
  resolved: "all" | "resolved" | "unresolved";
  confidence: number[];
  dateFrom: string;
  dateTo: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-1 text-[11px] font-semibold text-stone-500 uppercase tracking-wider hover:text-stone-700 transition-colors"
      >
        {title}
        {open ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </button>
      {open && <div className="mt-1.5">{children}</div>}
    </div>
  );
}

export function FilterSidebar({
  filters,
  onChange,
  totalResults,
}: FilterSidebarProps) {
  const toggleStatus = (status: StatementStatus) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onChange({ ...filters, statuses: next });
  };

  const toggleType = (type: StatementType) => {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next });
  };

  const hasActiveFilters =
    filters.statuses.length > 0 ||
    filters.types.length > 0 ||
    filters.resolved !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  const clearAll = () =>
    onChange({
      statuses: [],
      types: [],
      resolved: "all",
      confidence: [],
      dateFrom: "",
      dateTo: "",
    });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-stone-700">
          {totalResults} statement{totalResults !== 1 ? "s" : ""}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-0.5 text-[11px] text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="h-2.5 w-2.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Resolution toggle - chips */}
      <Section title="Resolution">
        <div className="flex gap-1">
          {(["all", "resolved", "unresolved"] as const).map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...filters, resolved: val })}
              className={`flex-1 rounded-full py-1 text-[11px] font-medium transition-all ${
                filters.resolved === val
                  ? "bg-stone-800 text-white shadow-sm"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </button>
          ))}
        </div>
      </Section>

      {/* Status - chips */}
      <Section title="Status">
        <div className="flex flex-wrap gap-1">
          {(
            Object.entries(STATUS_CONFIG) as [
              StatementStatus,
              (typeof STATUS_CONFIG)[StatementStatus]
            ][]
          ).map(([key, config]) => (
            <button
              key={key}
              onClick={() => toggleStatus(key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                filters.statuses.includes(key)
                  ? `${config.bg} ${config.color} ${config.border} shadow-sm`
                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Type - chips */}
      <Section title="Type">
        <div className="flex flex-wrap gap-1">
          {(
            Object.entries(TYPE_CONFIG) as [
              StatementType,
              (typeof TYPE_CONFIG)[StatementType]
            ][]
          ).map(([key, config]) => (
            <button
              key={key}
              onClick={() => toggleType(key)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                filters.types.includes(key)
                  ? `${config.bg} ${config.color} border-current/20 shadow-sm`
                  : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Date range - collapsible, lower priority */}
      <Section title="Date Range" defaultOpen={false}>
        <div className="space-y-1.5">
          <div>
            <label className="text-[10px] text-stone-400 uppercase tracking-wide">From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                onChange({ ...filters, dateFrom: e.target.value })
              }
              className="w-full rounded border border-stone-200 bg-white px-2 py-1 text-[11px] text-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
          <div>
            <label className="text-[10px] text-stone-400 uppercase tracking-wide">To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                onChange({ ...filters, dateTo: e.target.value })
              }
              className="w-full rounded border border-stone-200 bg-white px-2 py-1 text-[11px] text-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

export type { FilterState };
