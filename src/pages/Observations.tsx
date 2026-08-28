import { useState, useEffect } from 'react';
import { observationService } from '@/services/observationService';
import type { Observation, ObservationStatus, Priority } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { LoadingSpinner, EmptyState } from '@/components/Loading';
import { Search, Plus, Pencil, Trash2, Telescope } from 'lucide-react';

const STATUSES: ObservationStatus[] = ['Planned', 'In Progress', 'Completed', 'Cancelled'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const emptyForm = {
  target: '', equipment: '', date: '', startTime: '', endTime: '',
  priority: 'Medium' as Priority, status: 'Planned' as ObservationStatus,
};

export function Observations() {
  const [items, setItems] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Observation | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    setItems(await observationService.getAll());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(
    (o) =>
      (o.target.toLowerCase().includes(search.toLowerCase()) ||
        o.equipment.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'All' || o.status === statusFilter) &&
      (priorityFilter === 'All' || o.priority === priorityFilter)
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (o: Observation) => {
    setEditing(o);
    setForm({ target: o.target, equipment: o.equipment, date: o.date, startTime: o.startTime, endTime: o.endTime, priority: o.priority, status: o.status });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await observationService.update(editing.id, form);
    else await observationService.create(form);
    setModalOpen(false);
    await load();
  };

  const handleDelete = async (id: string) => { await observationService.remove(id); await load(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Observation Planning</h1>
          <p className="mt-0.5 text-xs text-slate-500">Schedule and track astronomical observations</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={14} />
          Add Observation
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input w-full pl-9" placeholder="Search observations..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="input">
          <option value="All">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading observations..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Telescope} title="No observations found" message="Try adjusting your search or schedule a new observation." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="table-header px-5 py-3 text-left">Target</th>
                  <th className="table-header px-5 py-3 text-left">Equipment</th>
                  <th className="table-header px-5 py-3 text-left">Date</th>
                  <th className="table-header px-5 py-3 text-left">Time</th>
                  <th className="table-header px-5 py-3 text-left">Priority</th>
                  <th className="table-header px-5 py-3 text-left">Status</th>
                  <th className="table-header px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-slate-900/50">
                    <td className="px-5 py-3 text-sm font-medium text-slate-200">{o.target}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{o.equipment}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{o.date}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{o.startTime} – {o.endTime}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.priority} /></td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(o)} className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-cyan-400">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(o.id)} className="rounded p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400">
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

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Observation' : 'Add Observation'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Target</label>
            <input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} className="input w-full" placeholder="e.g. Jupiter, Mars, Saturn..." required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Equipment</label>
            <input value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} className="input w-full" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input w-full" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input w-full" required />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input w-full" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="input w-full">
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ObservationStatus })} className="input w-full">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
