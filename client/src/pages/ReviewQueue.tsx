import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { TypeBadge } from '../components/StatusBadge';

export default function ReviewQueue() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
    loadQueue();
  }, [isAdmin, navigate]);

  const loadQueue = () => {
    setLoading(true);
    api.get<any[]>('/admin/review')
      .then(setQueue)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const approve = async (id: string) => {
    try {
      await api.post(`/admin/review/${id}/approve`, {});
      setQueue((q) => q.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const reject = async (id: string) => {
    if (!confirm('Remove this statement from the queue? This action cannot be undone.')) return;
    try {
      await api.post(`/admin/review/${id}/reject`, {});
      setQueue((q) => q.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Review Queue</h1>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : queue.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No statements awaiting review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((s) => (
            <div key={s.id} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TypeBadge type={s.statementType} />
                    <span className="text-sm text-gray-600 font-medium">{s.person?.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(s.dateMade).toLocaleDateString()}
                    </span>
                  </div>
                  <blockquote className="text-gray-800 text-sm border-l-2 border-gray-300 pl-3 italic">
                    &ldquo;{s.exactQuote}&rdquo;
                  </blockquote>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-3">
                <div><span className="text-gray-400">Source:</span> {s.source}</div>
                <div><span className="text-gray-400">Type:</span> {s.sourceType.replace('_', ' ')}</div>
                {s.impliedDeadline && (
                  <div><span className="text-gray-400">Deadline:</span> {new Date(s.impliedDeadline).toLocaleDateString()}</div>
                )}
                {s.measurableOutcome && (
                  <div><span className="text-gray-400">Outcome:</span> {s.measurableOutcome}</div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approve(s.id)}
                  className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(s.id)}
                  className="bg-white border border-red-300 text-red-600 px-4 py-1.5 rounded text-sm hover:bg-red-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
