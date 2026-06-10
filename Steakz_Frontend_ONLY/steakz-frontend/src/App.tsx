import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import { NotFoundPage } from './pages/NotFoundPage';

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login'); }
  return <nav className="navbar"><div className="nav-container"><Link to="/" className="nav-logo">Steakz MIS</Link><ul className="nav-menu">{isAuthenticated ? <><li className="nav-text">{user?.name} ({user?.role})</li><li><Link to="/dashboard" className="nav-link">Dashboard</Link></li><li><button onClick={handleLogout} className="nav-link logout-btn">Logout</button></li></> : <><Link to="/" className="nav-link">Home</Link><li><Link to="/login" className="nav-link">Staff Login</Link></li></>}</ul></div></nav>;
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default function App() { return <BrowserRouter><AuthProvider><Navigation /><main className="main-content"><AppRoutes /></main></AuthProvider></BrowserRouter>; }
