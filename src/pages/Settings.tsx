import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Info } from 'lucide-react';

export function Settings() {
  const { theme, setTheme } = useTheme();

  const systemInfo = [
    { label: 'Application', value: 'CELESTIA' },
    { label: 'Version', value: '1.0.0 Prototype' },
    { label: 'Environment', value: 'Development' },
    { label: 'Data Source', value: 'Simulated / Mock Data' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Settings</h1>
        <p className="mt-0.5 text-xs text-slate-500">Configure application preferences</p>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-200">Appearance</h2>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
              theme === 'dark' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <Moon size={18} className={theme === 'dark' ? 'text-cyan-400' : 'text-slate-500'} />
            <div className="text-left">
              <p className="text-sm font-medium text-slate-200">Dark Mode</p>
              <p className="text-xs text-slate-500">Default</p>
            </div>
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
              theme === 'light' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sun size={18} className={theme === 'light' ? 'text-cyan-400' : 'text-slate-500'} />
            <div className="text-left">
              <p className="text-sm font-medium text-slate-200">Light Mode</p>
              <p className="text-xs text-slate-500">Brighter theme</p>
            </div>
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">Theme preference is saved to localStorage and persists across sessions.</p>
      </div>

      {/* System Information */}
      <div className="card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Info size={16} className="text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-200">System Information</h2>
        </div>
        <div className="space-y-3">
          {systemInfo.map((info) => (
            <div key={info.label} className="flex items-center justify-between border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{info.label}</span>
              <span className="text-sm text-slate-200">{info.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
