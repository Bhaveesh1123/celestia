import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'celestia-auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));

  const login = async (u: string, p: string): Promise<boolean> => {
    const { authService } = await import('@/services/authService');
    const ok = await authService.login(u, p);
    if (ok) {
      localStorage.setItem(STORAGE_KEY, u);
      setUsername(u);
    }
    return ok;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsername(null);
  };

  return <AuthContext.Provider value={{ isAuthenticated: !!username, username, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
