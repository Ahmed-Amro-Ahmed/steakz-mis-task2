import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthUser { id: number; name: string; email: string; role: string; branchId: number | null; branch?: string | null }
interface AuthContextType { user: AuthUser | null; isAuthenticated: boolean; login: (token: string, user: AuthUser) => void; logout: () => void }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => { const stored = localStorage.getItem('user'); if (stored) setUser(JSON.parse(stored)); }, []);
  function login(token: string, userData: AuthUser) { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(userData)); setUser(userData); }
  function logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); }
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used inside AuthProvider'); return ctx; }
