import { useState, useEffect } from 'react';
import { weatherService } from '@/services/weatherService';
import type { WeatherData } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingSpinner } from '@/components/Loading';
import { RefreshCw, Thermometer, Droplets, Cloud, Wind, Eye } from 'lucide-react';

export function Weather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setData(await weatherService.getCurrent());
      setLoading(false);
    })();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setData(await weatherService.refresh());
    setRefreshing(false);
  };

  if (loading) return <LoadingSpinner label="Loading weather data..." />;

  const metrics = [
    { label: 'Temperature', value: `${data!.temperature}°C`, icon: Thermometer, color: 'text-amber-400' },
    { label: 'Humidity', value: `${data!.humidity}%`, icon: Droplets, color: 'text-blue-400' },
    { label: 'Cloud Cover', value: `${data!.cloudCover}%`, icon: Cloud, color: 'text-slate-400' },
    { label: 'Wind Speed', value: `${data!.windSpeed} km/h`, icon: Wind, color: 'text-cyan-400' },
    { label: 'Visibility', value: `${data!.visibility} km`, icon: Eye, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Weather Monitoring</h1>
          <p className="mt-0.5 text-xs text-slate-500">Last updated: {data!.lastUpdated}</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="btn btn-secondary">
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh Weather'}
        </button>
      </div>

      {/* Condition banner */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Observation Condition</p>
            <div className="mt-2">
              <StatusBadge status={data!.condition}>
                {data!.condition === 'GOOD' ? 'GOOD FOR OBSERVATION' : data!.condition === 'FAIR' ? 'FAIR CONDITIONS' : 'POOR CONDITIONS'}
              </StatusBadge>
            </div>
            <p className="mt-3 max-w-md text-sm text-slate-400">{data!.description}</p>
          </div>
          <div className={`hidden h-20 w-20 rounded-full border-2 md:flex items-center justify-center text-3xl font-bold ${
            data!.condition === 'GOOD' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
            data!.condition === 'FAIR' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
            'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {data!.cloudCover}%
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="card card-hover p-5">
            <div className="mb-3 flex items-center gap-2">
              <m.icon size={16} className={m.color} />
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{m.label}</span>
            </div>
            <p className="text-xl font-bold text-slate-100">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <p className="text-xs text-slate-500">
          Data source: Simulated / Mock Data. This weather service is structured for future REST API integration.
        </p>
      </div>
    </div>
  );
}
