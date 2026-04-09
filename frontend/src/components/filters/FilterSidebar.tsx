"use client";

import { STATUS_CONFIG, TYPE_CONFIG } from "@/lib/constants";
import type { StatementStatus, StatementType } from "@/lib/types";
import { Filter, X } from "lucide-react";

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <p className="text-xs text-stone-400">
        {totalResults} statement{totalResults !== 1 ? "s" : ""}
      </p>

      {/* Resolved toggle */}
      <div>
        <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
          Resolution
        </h4>
        <div className="flex rounded-md border border-[var(--color-border)] overflow-hidden">
          {(["all", "resolved", "unresolved"] as const).map((val) => (
            <button
              key={val}
              onClick={() => onChange({ ...filters, resolved: val })}
              className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                filters.resolved === val
                  ? "bg-stone-800 text-white"
                  : "bg-white text-stone-500 hover:bg-stone-50"
              }`}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
          Status
        </h4>
        <div className="space-y-1">
          {(Object.entries(STATUS_CONFIG) as [StatementStatus, (typeof STATUS_CONFIG)[StatementStatus]][]).map(
            ([key, config]) => (
              <label
                key={key}
                className="flex items-center gap-2 py-1 px-1 rounded hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.statuses.includes(key)}
                  onChange={() => toggleStatus(key)}
                  className="h-3.5 w-3.5 rounded border-stone-300 text-stone-700 focus:ring-stone-500"
                />
                <span className="text-sm text-stone-600">{config.label}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Type */}
      <div>
        <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
          Statement Type
        </h4>
        <div className="space-y-1">
          {(Object.entries(TYPE_CONFIG) as [StatementType, (typeof TYPE_CONFIG)[StatementType]][]).map(
            ([key, config]) => (
              <label
                key={key}
                className="flex items-center gap-2 py-1 px-1 rounded hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.types.includes(key)}
                  onChange={() => toggleType(key)}
                  className="h-3.5 w-3.5 rounded border-stone-300 text-stone-700 focus:ring-stone-500"
                />
                <span className="text-sm text-stone-600">{config.label}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Date range */}
      <div>
        <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
          Date Range
        </h4>
        <div className="space-y-2">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              onChange({ ...filters, dateFrom: e.target.value })
            }
            className="w-full rounded-md border border-[var(--color-border)] px-2.5 py-1.5 text-xs text-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-300"
          />
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              onChange({ ...filters, dateTo: e.target.value })
            }
            className="w-full rounded-md border border-[var(--color-border)] px-2.5 py-1.5 text-xs text-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-300"
          />
        </div>
      </div>
    </div>
  );
}

export type { FilterState };
