import { useState, useEffect } from 'react';
import { equipmentService } from '@/services/equipmentService';
import type { Equipment, EquipmentStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { LoadingSpinner, EmptyState } from '@/components/Loading';
import { Search, Plus, Pencil, Trash2, X, Cpu, Thermometer, Zap } from 'lucide-react';

const STATUSES: EquipmentStatus[] = ['Online', 'Warning', 'Offline', 'Maintenance'];
const emptyForm = { name: '', type: '', status: 'Online' as EquipmentStatus, temperature: 20, power: 90 };

export function Equipment() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [detail, setDetail] = useState<Equipment | null>(null);

  const load = async () => {
    setLoading(true);
    setItems(await equipmentService.getAll());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(
    (e) =>
      (e.name.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'All' || e.status === statusFilter)
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (eq: Equipment) => {
    setEditing(eq);
    setForm({ name: eq.name, type: eq.type, status: eq.status, temperature: eq.temperature, power: eq.power });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const lastUpdated = new Date().toISOString().slice(0, 16).replace('T', ' ');
    if (editing) {
      await equipmentService.update(editing.id, { ...form, lastUpdated });
    } else {
      await equipmentService.create({ ...form, lastUpdated });
    }
    setModalOpen(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    await equipmentService.remove(id);
    await load();
  };

  const handleStatusChange = async (id: string, status: EquipmentStatus) => {
    await equipmentService.setStatus(id, status);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Equipment Monitoring</h1>
          <p className="mt-0.5 text-xs text-slate-500">Centralized equipment status and health tracking</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={14} />
          Add Equipment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full pl-9"
            placeholder="Search equipment..."
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading equipment..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Cpu} title="No equipment found" message="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="table-header px-5 py-3 text-left">Name</th>
                  <th className="table-header px-5 py-3 text-left">Type</th>
                  <th className="table-header px-5 py-3 text-left">Status</th>
                  <th className="table-header px-5 py-3 text-left">Temp</th>
                  <th className="table-header px-5 py-3 text-left">Power</th>
                  <th className="table-header px-5 py-3 text-left">Last Updated</th>
                  <th className="table-header px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map((eq) => (
                  <tr key={eq.id} className="transition-colors hover:bg-slate-900/50">
                    <td className="cursor-pointer px-5 py-3 text-sm font-medium text-slate-200" onClick={() => setDetail(eq)}>
                      {eq.name}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{eq.type}</td>
                    <td className="px-5 py-3">
                      <select
                        value={eq.status}
                        onChange={(e) => handleStatusChange(eq.id, e.target.value as EquipmentStatus)}
                        className="rounded border border-transparent bg-transparent text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400">{eq.temperature}°C</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{eq.power}%</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{eq.lastUpdated}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(eq)} className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-cyan-400">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(eq.id)} className="rounded p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Equipment' : 'Add Equipment'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input w-full" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Type</label>
            <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input w-full" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EquipmentStatus })} className="input w-full">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Temperature (°C)</label>
              <input type="number" step="0.1" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: +e.target.value })} className="input w-full" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Power (%)</label>
              <input type="number" value={form.power} onChange={(e) => setForm({ ...form, power: +e.target.value })} className="input w-full" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Equipment Details">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-100">{detail.name}</h3>
              <StatusBadge status={detail.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-xs text-slate-500">Type</p>
                <p className="mt-1 font-medium text-slate-200">{detail.type}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <p className="text-xs text-slate-500">Last Updated</p>
                <p className="mt-1 font-medium text-slate-200">{detail.lastUpdated}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                  <Thermometer size={12} /> Temperature
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-500" style={{ width: `${Math.min(100, (detail.temperature / 50) * 100)}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{detail.temperature}°C</p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
                  <Zap size={12} /> Power
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${detail.power}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{detail.power}%</p>
              </div>
            </div>
            <button onClick={() => setDetail(null)} className="btn btn-secondary w-full">
              <X size={14} /> Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
