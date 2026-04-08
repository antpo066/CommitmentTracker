import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import StatementCard from '../components/StatementCard';

interface PersonDetail {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  statements: any[];
}

export default function PersonPage() {
  const { slug } = useParams<{ slug: string }>();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get<PersonDetail>(`/persons/${slug}`)
      .then(setPerson)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-gray-400 text-center py-8">Loading...</p>;
  if (!person) return <p className="text-gray-500 text-center py-8">Person not found.</p>;

  const filtered = person.statements.filter((s) => {
    if (filterStatus && s.status !== filterStatus) return false;
    if (filterType && s.statementType !== filterType) return false;
    return true;
  });

  const statusCounts = person.statements.reduce((acc: Record<string, number>, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to timeline</Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{person.name}</h1>
        {person.title && <p className="text-gray-500 text-sm mt-1">{person.title}</p>}
        {person.description && <p className="text-gray-600 text-sm mt-2">{person.description}</p>}

        <div className="mt-4 flex gap-4 text-sm">
          <span className="text-gray-500">{person.statements.length} documented statements</span>
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status} className="text-gray-400">
              {status.replace('_', ' ').toLowerCase()}: {count}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm"
        >
          <option value="">All types</option>
          <option value="PROMISE">Promise</option>
          <option value="PREDICTION">Prediction</option>
          <option value="COMMITMENT">Commitment</option>
          <option value="CLAIM">Claim</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No statements match your filters.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((s: any) => (
            <StatementCard key={s.id} statement={{ ...s, person: { name: person.name, slug: person.slug } }} showPerson={false} />
          ))}
        </div>
      )}
    </div>
  );
}
