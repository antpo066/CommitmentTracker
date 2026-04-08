import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function AddPerson() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', title: '', description: '' });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/persons', {
        name: form.name,
        title: form.title || undefined,
        description: form.description || undefined,
      });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    }
    setSubmitting(false);
  };

  if (!isAdmin) { navigate('/login'); return null; }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Person / Entity</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            required
            placeholder="Full name or organization name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title / Role</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="e.g., CEO, Mayor, Senator"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            rows={3}
            placeholder="Brief neutral description..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Person'}
        </button>
      </form>
    </div>
  );
}
