import { Link } from 'react-router-dom';
import { StatusBadge, TypeBadge } from './StatusBadge';

interface Statement {
  id: string;
  exactQuote: string;
  source: string;
  sourceUrl?: string | null;
  dateMade: string;
  statementType: string;
  status: string;
  impliedDeadline?: string | null;
  confidenceScore?: number | null;
  person?: { name: string; slug: string };
}

export default function StatementCard({ statement, showPerson = true }: { statement: Statement; showPerson?: boolean }) {
  const date = new Date(statement.dateMade).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const deadline = statement.impliedDeadline
    ? new Date(statement.impliedDeadline).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type={statement.statementType} />
          <StatusBadge status={statement.status} />
          {statement.confidenceScore && (
            <span className="text-xs text-gray-400" title="Confidence score">
              {'●'.repeat(statement.confidenceScore)}{'○'.repeat(5 - statement.confidenceScore)}
            </span>
          )}
        </div>
        <time className="text-xs text-gray-400 whitespace-nowrap">{date}</time>
      </div>

      <Link to={`/statement/${statement.id}`} className="block">
        <blockquote className="text-gray-800 text-sm leading-relaxed mb-2 border-l-2 border-gray-300 pl-3 italic">
          &ldquo;{statement.exactQuote}&rdquo;
        </blockquote>
      </Link>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {showPerson && statement.person && (
            <Link to={`/person/${statement.person.slug}`} className="font-medium text-gray-700 hover:text-blue-600">
              {statement.person.name}
            </Link>
          )}
          <span>&middot;</span>
          <span>{statement.source}</span>
        </div>
        {deadline && (
          <span className="text-gray-400">Deadline: {deadline}</span>
        )}
      </div>
    </div>
  );
}
