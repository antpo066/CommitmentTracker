"use client";

import { useEffect, useState } from "react";
import { api, type StatementRecord } from "@/lib/api";
import { TopNav } from "@/components/layout/TopNav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { CONFIDENCE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Check, X, ChevronDown, ChevronUp, ExternalLink, LogIn } from "lucide-react";

export default function AdminReviewPage() {
  const [queue, setQueue] = useState<StatementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      loadQueue();
    } else {
      setLoading(false);
    }
  }, []);

  const loadQueue = () => {
    setLoading(true);
    api.get<StatementRecord[]>("/api/admin/review")
      .then(setQueue)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await api.post<{ token: string }>("/api/auth/login", loginForm);
      localStorage.setItem("token", res.token);
      setLoggedIn(true);
      loadQueue();
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleApprove = async (id: string, status: string) => {
    try {
      await api.post(`/api/admin/review/${id}/approve`, { status });
      setQueue((q) => q.filter((s) => s.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/api/admin/review/${id}/reject`, {});
      setQueue((q) => q.filter((s) => s.id !== id));
    } catch (err) { console.error(err); }
  };

  if (!loggedIn) {
    return (
      <>
        <TopNav />
        <div className="max-w-sm mx-auto mt-16">
          <h1 className="text-xl font-semibold text-stone-800 mb-6 text-center">Admin Sign In</h1>
          <form onSubmit={handleLogin} className="bg-white border border-[var(--color-border)] rounded-lg p-6 space-y-4">
            {loginError && <div className="bg-red-50 text-red-700 text-xs px-3 py-2 rounded">{loginError}</div>}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Email</label>
              <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Password</label>
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300" required />
            </div>
            <button type="submit" className="w-full bg-stone-800 text-white py-2 rounded text-sm hover:bg-stone-700 transition-colors flex items-center justify-center gap-2">
              <LogIn className="h-3.5 w-3.5" /> Sign In
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-stone-800 tracking-tight">Review Queue</h1>
            <p className="text-sm text-stone-500 mt-1">{queue.length} statement{queue.length !== 1 ? "s" : ""} awaiting review</p>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-sm text-stone-400 py-8">Loading...</p>
        ) : queue.length === 0 ? (
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-12 text-center">
            <Check className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-stone-500">All caught up. No statements pending review.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((s) => (
              <ReviewCard
                key={s.id}
                statement={s}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                onApprove={(status) => handleApprove(s.id, status)}
                onReject={() => handleReject(s.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ReviewCard({ statement, expanded, onToggle, onApprove, onReject }: {
  statement: StatementRecord;
  expanded: boolean;
  onToggle: () => void;
  onApprove: (status: string) => void;
  onReject: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState("UNRESOLVED");

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <TypeBadge type={statement.statementType} />
              {statement.aiExtracted && (
                <span className="text-[10px] bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">
                  AI extracted
                  {statement.aiConfidence && ` · ${Math.round(statement.aiConfidence * 100)}%`}
                </span>
              )}
              <span className="text-xs text-stone-400">{statement.sourceTitle}</span>
              <span className="text-xs text-stone-400">{formatDate(statement.sourceDate)}</span>
            </div>
            <p className="text-sm text-stone-800 font-medium leading-relaxed">
              &ldquo;{statement.exactQuote}&rdquo;
            </p>
            <p className="text-xs text-stone-400 mt-1">{statement.person?.name}</p>
          </div>
          <button onClick={onToggle} className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-50 shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-3 text-sm">
            {statement.context && (
              <div>
                <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">Context</h4>
                <p className="text-stone-600 text-xs leading-relaxed">{statement.context}</p>
              </div>
            )}
            {statement.interpretation && (
              <div>
                <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">Interpretation</h4>
                <p className="text-stone-600 text-xs leading-relaxed">{statement.interpretation}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-xs text-stone-500">
              {statement.impliedDeadline && <span><strong>Deadline:</strong> {formatDate(statement.impliedDeadline)}</span>}
              {statement.measurableOutcome && <span><strong>Outcome:</strong> {statement.measurableOutcome}</span>}
              <span><strong>Confidence:</strong> {CONFIDENCE_LABELS[statement.confidenceScore]}</span>
            </div>
            {statement.sourceUrl && (
              <a href={statement.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700">
                <ExternalLink className="h-3 w-3" /> View source
              </a>
            )}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded border border-stone-200 px-2.5 py-1.5 text-xs text-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-300">
            <option value="UNRESOLVED">Unresolved</option>
            <option value="KEPT">Kept</option>
            <option value="DELAYED">Delayed</option>
            <option value="CONTRADICTED">Contradicted</option>
            <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
            <option value="TOO_VAGUE">Too Vague</option>
          </select>
          <button onClick={() => onApprove(selectedStatus)}
            className="flex items-center gap-1.5 rounded bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-emerald-700 transition-colors">
            <Check className="h-3 w-3" /> Approve
          </button>
          <button onClick={onReject}
            className="flex items-center gap-1.5 rounded border border-red-200 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-50 transition-colors">
            <X className="h-3 w-3" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
