import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

interface Person {
  id: string;
  name: string;
}

export default function AddStatement() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [persons, setPersons] = useState<Person[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    personId: '',
    exactQuote: '',
    source: '',
    sourceUrl: '',
    sourceType: 'PASTED_TEXT',
    dateMade: '',
    statementType: 'PROMISE',
    impliedDeadline: '',
    measurableOutcome: '',
    confidenceScore: '3',
    evidenceNote: '',
  });

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
    api.get<Person[]>('/persons').then(setPersons).catch(console.error);
  }, [isAdmin, navigate]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/statements', {
        ...form,
        sourceUrl: form.sourceUrl || undefined,
        impliedDeadline: form.impliedDeadline || undefined,
        measurableOutcome: form.measurableOutcome || undefined,
        evidenceNote: form.evidenceNote || undefined,
      });
      navigate('/admin/review');
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Statement</h1>
      <p className="text-sm text-gray-500 mb-4">
        New statements are added to the review queue and must be approved before appearing publicly.
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Person / Entity *</label>
          <select
            value={form.personId}
            onChange={(e) => update('personId', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
          >
            <option value="">Select a person...</option>
            {persons.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exact Quote *</label>
          <textarea
            value={form.exactQuote}
            onChange={(e) => update('exactQuote', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            rows={3}
            required
            placeholder="Paste the exact statement..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source Name *</label>
            <input
              type="text"
              value={form.source}
              onChange={(e) => update('source', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
              placeholder="e.g., Press Conference, Tweet"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source Type *</label>
            <select
              value={form.sourceType}
              onChange={(e) => update('sourceType', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="PASTED_TEXT">Pasted Text</option>
              <option value="ARTICLE_URL">Article URL</option>
              <option value="YOUTUBE_TRANSCRIPT">YouTube Transcript</option>
              <option value="TWEET">Tweet / Post</option>
              <option value="SPEECH">Speech</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source URL</label>
          <input
            type="url"
            value={form.sourceUrl}
            onChange={(e) => update('sourceUrl', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Made *</label>
            <input
              type="date"
              value={form.dateMade}
              onChange={(e) => update('dateMade', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statement Type *</label>
            <select
              value={form.statementType}
              onChange={(e) => update('statementType', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="PROMISE">Promise</option>
              <option value="PREDICTION">Prediction</option>
              <option value="COMMITMENT">Commitment</option>
              <option value="CLAIM">Claim</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Implied Deadline</label>
            <input
              type="date"
              value={form.impliedDeadline}
              onChange={(e) => update('impliedDeadline', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confidence (1-5)</label>
            <select
              value={form.confidenceScore}
              onChange={(e) => update('confidenceScore', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="1">1 - Very Low</option>
              <option value="2">2 - Low</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - High</option>
              <option value="5">5 - Very High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Measurable Outcome</label>
          <input
            type="text"
            value={form.measurableOutcome}
            onChange={(e) => update('measurableOutcome', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="How can this be verified?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Note</label>
          <textarea
            value={form.evidenceNote}
            onChange={(e) => update('evidenceNote', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            rows={2}
            placeholder="Any initial evidence or context..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit to Review Queue'}
        </button>
      </form>
    </div>
  );
}
