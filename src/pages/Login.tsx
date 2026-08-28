import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const ok = await login(username, password);
    setLoading(false);
    if (ok) navigate('/dashboard');
    else setError('Invalid credentials. Use admin / admin123.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-[0.3em] text-slate-100">CELESTIA</h1>
          <p className="mt-2 text-sm text-slate-500">Observatory Operations System</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input w-full"
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="Enter password"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-center text-xs text-slate-500">
            Demo credentials — <span className="font-mono text-cyan-400">admin</span> / <span className="font-mono text-cyan-400">admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
