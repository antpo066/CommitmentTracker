import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import StatementCard from '../components/StatementCard';

interface Person {
  id: string;
  name: string;
  slug: string;
  title?: string;
  _count: { statements: number };
}

interface StatementsResponse {
  statements: any[];
  total: number;
  page: number;
  totalPages: number;
}

export default function HomePage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [statements, setStatements] = useState<any[]>([]);
  const [filters, setFilters] = useState({ status: '', statementType: '', from: '', to: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Person[]>('/persons').then(setPersons).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    if (filters.status) params.set('status', filters.status);
    if (filters.statementType) params.set('statementType', filters.statementType);
    if (filters.from) params.set('from', filters.from);
    if (filters.to) params.set('to', filters.to);

    api.get<StatementsResponse>(`/statements?${params}`)
      .then((res) => {
        setStatements(res.statements);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters, page]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Public Statement Timeline</h1>
        <p className="text-gray-500 text-sm">Tracking documented public statements, commitments, and predictions.</p>
      </div>

      {/* Tracked persons */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {persons.map((p) => (
          <Link
            key={p.id}
            to={`/person/${p.slug}`}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 hover:shadow-sm transition-shadow"
          >
            <span className="font-medium text-sm text-gray-800">{p.name}</span>
            {p.title && <span className="text-xs text-gray-400 ml-2">{p.title}</span>}
            <span className="text-xs text-gray-400 ml-2">{p._count.statements} statements</span>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filters.status}
            onChange={(e) => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="">All statuses</option>
            <option value="UNRESOLVED">Unresolved</option>
            <option value="KEPT">Kept</option>
            <option value="DELAYED">Delayed</option>
            <option value="CONTRADICTED">Contradicted</option>
            <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
          </select>
          <select
            value={filters.statementType}
            onChange={(e) => { setFilters(f => ({ ...f, statementType: e.target.value })); setPage(1); }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          >
            <option value="">All types</option>
            <option value="PROMISE">Promise</option>
            <option value="PREDICTION">Prediction</option>
            <option value="COMMITMENT">Commitment</option>
            <option value="CLAIM">Claim</option>
          </select>
          <input
            type="date"
            value={filters.from}
            onChange={(e) => { setFilters(f => ({ ...f, from: e.target.value })); setPage(1); }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            placeholder="From date"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) => { setFilters(f => ({ ...f, to: e.target.value })); setPage(1); }}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
            placeholder="To date"
          />
        </div>
      </div>

      {/* Statements */}
      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading statements...</p>
      ) : statements.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No statements found matching your filters.</p>
      ) : (
        <div className="space-y-3">
          {statements.map((s) => (
            <StatementCard key={s.id} statement={s} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded text-sm disabled:opacity-30"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded text-sm disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
