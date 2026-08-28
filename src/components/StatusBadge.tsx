import type { ReactNode } from 'react';

type Variant = 'Online' | 'Warning' | 'Offline' | 'Maintenance' | 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue' | 'Planned' | 'Cancelled' | 'GOOD' | 'FAIR' | 'POOR' | 'Low' | 'Medium' | 'High';

const styles: Record<Variant, string> = {
  Online: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Offline: 'bg-red-500/10 text-red-400 border-red-500/30',
  Maintenance: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'In Progress': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Overdue: 'bg-red-500/10 text-red-400 border-red-500/30',
  Planned: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
  GOOD: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  FAIR: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  POOR: 'bg-red-500/10 text-red-400 border-red-500/30',
  Low: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  High: 'bg-red-500/10 text-red-400 border-red-500/30',
};

export function StatusBadge({ status, children }: { status: Variant; children?: ReactNode }) {
  const style = styles[status] ?? 'bg-slate-500/10 text-slate-300 border-slate-500/30';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.includes('emerald') ? 'bg-emerald-400' : style.includes('amber') ? 'bg-amber-400' : style.includes('red') ? 'bg-red-400' : style.includes('blue') ? 'bg-blue-400' : style.includes('cyan') ? 'bg-cyan-400' : 'bg-slate-400'}`} />
      {children ?? status}
    </span>
  );
}
