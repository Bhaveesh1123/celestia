import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Cpu, CloudRain, Wrench, Telescope, Settings, LogOut, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/equipment', label: 'Equipment', icon: Cpu },
  { to: '/weather', label: 'Weather', icon: CloudRain },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/observations', label: 'Observations', icon: Telescope },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const { username, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg light:border-slate-200 light:bg-white/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" className="text-lg font-bold tracking-widest text-slate-100">
            CELESTIA
          </NavLink>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <item.icon size={15} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs">
            <User size={14} className="text-cyan-400" />
            <span className="font-medium text-slate-300">{username}</span>
            <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-cyan-400">Admin</span>
          </div>
          <button onClick={handleLogout} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400" aria-label="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
