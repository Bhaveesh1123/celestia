import { useState, useEffect } from 'react';
import { equipmentService } from '@/services/equipmentService';
import { weatherService } from '@/services/weatherService';
import { maintenanceService } from '@/services/maintenanceService';
import { observationService } from '@/services/observationService';
import { activityData } from '@/data/mockData';
import type { Equipment, WeatherData, MaintenanceTask, Observation } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSpinner } from '@/components/Loading';
import { RefreshCw, Cpu, CloudRain, Wrench, Telescope, Activity, Clock } from 'lucide-react';

export function Dashboard() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadAll = async () => {
    const [eq, w, mt, obs] = await Promise.all([
      equipmentService.getAll(),
      weatherService.getCurrent(),
      maintenanceService.getAll(),
      observationService.getAll(),
    ]);
    setEquipment(eq);
    setWeather(w);
    setMaintenance(mt);
    setObservations(obs);
    setLastUpdated(new Date().toISOString().slice(0, 16).replace('T', ' '));
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadAll();
      setLoading(false);
    })();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    const w = await weatherService.refresh();
    setWeather(w);
    setEquipment((prev) =>
      prev.map((e) => ({
        ...e,
        temperature: +(e.temperature + (Math.random() - 0.5) * 2).toFixed(1),
        power: Math.min(100, Math.max(0, e.power + Math.round((Math.random() - 0.5) * 6))),
        lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }))
    );
    setLastUpdated(new Date().toISOString().slice(0, 16).replace('T', ' '));
    setRefreshing(false);
  };

  if (loading) return <LoadingSpinner label="Loading observatory data..." />;

  const online = equipment.filter((e) => e.status === 'Online').length;
  const warning = equipment.filter((e) => e.status === 'Warning').length;
  const offline = equipment.filter((e) => e.status === 'Offline').length;
  const openTasks = maintenance.filter((m) => m.status !== 'Completed').length;
  const plannedObs = observations.filter((o) => o.status === 'Planned').length;

  const cards = [
    { label: 'Equipment Health', icon: Cpu, stats: `${equipment.length} Total`, sub: [`${online} Online`, `${warning} Warning`, `${offline} Offline`], color: 'text-cyan-400' },
    { label: 'Observation Conditions', icon: CloudRain, stats: weather?.condition ?? '—', sub: [`Temp: ${weather?.temperature}°C`, `Cloud: ${weather?.cloudCover}%`], color: 'text-emerald-400' },
    { label: 'Maintenance', icon: Wrench, stats: `${openTasks} Open Tasks`, sub: [`${maintenance.filter((m) => m.status === 'In Progress').length} In Progress`, `${maintenance.filter((m) => m.status === 'Overdue').length} Overdue`], color: 'text-amber-400' },
    { label: 'Observations', icon: Telescope, stats: `${plannedObs} Planned`, sub: [`${observations.filter((o) => o.status === 'In Progress').length} Active`, `${observations.filter((o) => o.status === 'Completed').length} Completed`], color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Observatory Dashboard</h1>
          <p className="mt-0.5 text-xs text-slate-500">Last updated: {lastUpdated}</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="btn btn-secondary">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card card-hover p-5">
            <div className="mb-3 flex items-center gap-2">
              <card.icon size={16} className={card.color} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-100">{card.stats}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {card.sub.map((s, i) => (
                <span key={i} className="text-xs text-slate-500">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Equipment overview + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-3">
            <h2 className="text-sm font-semibold text-slate-200">Equipment Overview</h2>
          </div>
          <div className="divide-y divide-slate-800">
            {equipment.map((eq) => (
              <div key={eq.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-200">{eq.name}</span>
                  <span className="text-xs text-slate-500">{eq.type}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-slate-500">{eq.temperature}°C</span>
                  <span className="text-xs text-slate-500">{eq.power}%</span>
                  <StatusBadge status={eq.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-200">Recent Activity</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-800/50">
            {activityData.map((act) => (
              <div key={act.id} className="flex items-start gap-3 px-5 py-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                  <Clock size={11} />
                  {act.time}
                </div>
                <p className="text-xs text-slate-400">{act.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
