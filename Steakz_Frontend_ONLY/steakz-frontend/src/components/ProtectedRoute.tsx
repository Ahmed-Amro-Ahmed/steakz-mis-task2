import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';
export function ProtectedRoute({ children, requiredRoles }: { children: ReactNode; requiredRoles?: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRoles && !requiredRoles.includes(user.role)) return <Navigate to="/access-denied" replace />;
  return <>{children}</>;
}
