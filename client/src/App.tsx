import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PersonPage from './pages/PersonPage';
import StatementPage from './pages/StatementPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ReviewQueue from './pages/ReviewQueue';
import AddStatement from './pages/AddStatement';
import AddPerson from './pages/AddPerson';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/person/:slug" element={<PersonPage />} />
        <Route path="/statement/:id" element={<StatementPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/review" element={<ReviewQueue />} />
        <Route path="/admin/add-statement" element={<AddStatement />} />
        <Route path="/admin/add-person" element={<AddPerson />} />
      </Route>
    </Routes>
  );
}
