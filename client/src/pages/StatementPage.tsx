import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, TypeBadge } from '../components/StatusBadge';

interface Note {
  id: string;
  content: string;
  noteType: string;
  createdAt: string;
  author: { name: string };
}

interface StatementDetail {
  id: string;
  exactQuote: string;
  source: string;
  sourceUrl?: string | null;
  sourceType: string;
  dateMade: string;
  statementType: string;
  impliedDeadline?: string | null;
  measurableOutcome?: string | null;
  confidenceScore?: number | null;
  status: string;
  evidenceNote?: string | null;
  person: { name: string; slug: string };
  notes: Note[];
}

export default function StatementPage() {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const [statement, setStatement] = useState<StatementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState('CONTEXT');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!id) return;
    api.get<StatementDetail>(`/statements/${id}`)
      .then(setStatement)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const addNote = async () => {
    if (!noteContent.trim() || !id) return;
    setSubmitting(true);
    try {
      await api.post('/admin/notes', { statementId: id, content: noteContent, noteType });
      setNoteContent('');
      load();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (loading) return <p className="text-gray-400 text-center py-8">Loading...</p>;
  if (!statement) return <p className="text-gray-500 text-center py-8">Statement not found.</p>;

  const date = new Date(statement.dateMade).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const deadline = statement.impliedDeadline
    ? new Date(statement.impliedDeadline).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  return (
    <div>
      <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to timeline</Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TypeBadge type={statement.statementType} />
          <StatusBadge status={statement.status} />
        </div>

        <blockquote className="text-lg text-gray-800 leading-relaxed border-l-3 border-gray-300 pl-4 italic mb-4">
          &ldquo;{statement.exactQuote}&rdquo;
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-400 text-xs uppercase mb-0.5">Speaker</dt>
            <dd>
              <Link to={`/person/${statement.person.slug}`} className="text-blue-600 hover:text-blue-800">
                {statement.person.name}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase mb-0.5">Date</dt>
            <dd className="text-gray-700">{date}</dd>
          </div>
          <div>
            <dt className="text-gray-400 text-xs uppercase mb-0.5">Source</dt>
            <dd className="text-gray-700">
              {statement.sourceUrl ? (
                <a href={statement.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  {statement.source}
                </a>
              ) : statement.source}
              <span className="text-gray-400 ml-2">({statement.sourceType.replace('_', ' ').toLowerCase()})</span>
            </dd>
          </div>
          {deadline && (
            <div>
              <dt className="text-gray-400 text-xs uppercase mb-0.5">Implied Deadline</dt>
              <dd className="text-gray-700">{deadline}</dd>
            </div>
          )}
          {statement.measurableOutcome && (
            <div className="md:col-span-2">
              <dt className="text-gray-400 text-xs uppercase mb-0.5">Measurable Outcome</dt>
              <dd className="text-gray-700">{statement.measurableOutcome}</dd>
            </div>
          )}
          {statement.confidenceScore && (
            <div>
              <dt className="text-gray-400 text-xs uppercase mb-0.5">Confidence</dt>
              <dd className="text-gray-700">
                {'●'.repeat(statement.confidenceScore)}{'○'.repeat(5 - statement.confidenceScore)}
                <span className="ml-1 text-gray-400">({statement.confidenceScore}/5)</span>
              </dd>
            </div>
          )}
          {statement.evidenceNote && (
            <div className="md:col-span-2">
              <dt className="text-gray-400 text-xs uppercase mb-0.5">Evidence Note</dt>
              <dd className="text-gray-700">{statement.evidenceNote}</dd>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Context &amp; Notes</h2>

        {statement.notes.length === 0 ? (
          <p className="text-gray-400 text-sm mb-4">No notes yet.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {statement.notes.map((note) => (
              <div key={note.id} className="border-l-2 border-gray-200 pl-3">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <span className="font-medium text-gray-600">{note.author.name}</span>
                  <span>&middot;</span>
                  <span className="uppercase">{note.noteType.toLowerCase()}</span>
                  <span>&middot;</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700">{note.content}</p>
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Add Note</h3>
            <div className="flex gap-2 mb-2">
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1.5 text-sm"
              >
                <option value="CONTEXT">Context</option>
                <option value="DISPUTE">Dispute</option>
                <option value="EVIDENCE">Evidence</option>
                <option value="CORRECTION">Correction</option>
              </select>
            </div>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Add context, dispute, or evidence..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
              rows={3}
            />
            <button
              onClick={addNote}
              disabled={submitting || !noteContent.trim()}
              className="bg-gray-800 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
            >
              {submitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
