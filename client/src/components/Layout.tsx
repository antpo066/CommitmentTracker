import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { isAdmin, logout, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-gray-800 hover:text-gray-600">
            Commitment Tracker
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Timeline</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link to="/admin/review" className="text-gray-600 hover:text-gray-900">Review Queue</Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Sign out ({user?.name})
                </button>
              </>
            ) : (
              <Link to="/login" className="text-blue-600 hover:text-blue-800">Admin Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        Commitment Tracker &mdash; Tracking public statements for accountability
      </footer>
    </div>
  );
}
