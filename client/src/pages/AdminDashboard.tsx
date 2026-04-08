import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [reviewCount, setReviewCount] = useState(0);
  const [statements, setStatements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }

    Promise.all([
      api.get<any[]>('/admin/review').then((r) => setReviewCount(r.length)),
      api.get<any>('/admin/review/all?limit=10').then((r) => setStatements(r.statements)),
    ])
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/admin/add-person" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50">
            Add Person
          </Link>
          <Link to="/admin/add-statement" className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700">
            Add Statement
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="/admin/review" className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm">
          <p className="text-3xl font-bold text-orange-600">{reviewCount}</p>
          <p className="text-sm text-gray-500">Awaiting Review</p>
        </Link>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-3xl font-bold text-gray-800">{statements.length}</p>
          <p className="text-sm text-gray-500">Recent Statements</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-500 mt-1">Use the review queue to approve or reject extracted statements. Status updates and notes can be added from each statement's detail page.</p>
        </div>
      </div>

      {/* Recent statements */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Statements</h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-2 text-gray-500 font-medium">Quote</th>
                <th className="px-4 py-2 text-gray-500 font-medium">Person</th>
                <th className="px-4 py-2 text-gray-500 font-medium">Type</th>
                <th className="px-4 py-2 text-gray-500 font-medium">Status</th>
                <th className="px-4 py-2 text-gray-500 font-medium">Approved</th>
              </tr>
            </thead>
            <tbody>
              {statements.map((s: any) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <Link to={`/statement/${s.id}`} className="text-blue-600 hover:text-blue-800">
                      {s.exactQuote.slice(0, 80)}{s.exactQuote.length > 80 ? '...' : ''}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{s.person?.name}</td>
                  <td className="px-4 py-2"><TypeBadge type={s.statementType} /></td>
                  <td className="px-4 py-2"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-2">{s.approved ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
