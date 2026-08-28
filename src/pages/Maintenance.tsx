import { useState, useEffect } from 'react';
import { maintenanceService } from '@/services/maintenanceService';
import type { MaintenanceTask, MaintenanceStatus } from '@/types';
import { StatusBadge } from '@/components/StatusBadge';
import { Modal } from '@/components/Modal';
import { LoadingSpinner, EmptyState } from '@/components/Loading';
import { Search, Plus, Pencil, Trash2, Wrench } from 'lucide-react';

const STATUSES: MaintenanceStatus[] = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];
const emptyForm = { equipment: '', task: '', scheduledDate: '', assignedTo: '', status: 'Scheduled' as MaintenanceStatus };

export function Maintenance() {
  const [items, setItems] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MaintenanceTask | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    setItems(await maintenanceService.getAll());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter(
    (t) =>
      (t.equipment.toLowerCase().includes(search.toLowerCase()) ||
        t.task.toLowerCase().includes(search.toLowerCase()) ||
        t.assignedTo.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === 'All' || t.status === statusFilter)
  );

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (t: MaintenanceTask) => {
    setEditing(t);
    setForm({ equipment: t.equipment, task: t.task, scheduledDate: t.scheduledDate, assignedTo: t.assignedTo, status: t.status });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await maintenanceService.update(editing.id, form);
    else await maintenanceService.create(form);
    setModalOpen(false);
    await load();
  };

  const handleDelete = async (id: string) => { await maintenanceService.remove(id); await load(); };

  const summary = [
    { label: 'Total Tasks', value: items.length, color: 'text-slate-100' },
    { label: 'Scheduled', value: items.filter((t) => t.status === 'Scheduled').length, color: 'text-blue-400' },
    { label: 'In Progress', value: items.filter((t) => t.status === 'In Progress').length, color: 'text-cyan-400' },
    { label: 'Overdue', value: items.filter((t) => t.status === 'Overdue').length, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Maintenance Scheduling</h1>
          <p className="mt-0.5 text-xs text-slate-500">Track and manage equipment maintenance tasks</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <Plus size={14} />
          Add Task
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input w-full pl-9" placeholder="Search tasks..." />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input">
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading maintenance tasks..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Wrench} title="No maintenance tasks found" message="Try adjusting your search or add a new task." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="table-header px-5 py-3 text-left">Equipment</th>
                  <th className="table-header px-5 py-3 text-left">Task</th>
                  <th className="table-header px-5 py-3 text-left">Scheduled Date</th>
                  <th className="table-header px-5 py-3 text-left">Assigned To</th>
                  <th className="table-header px-5 py-3 text-left">Status</th>
                  <th className="table-header px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-slate-900/50">
                    <td className="px-5 py-3 text-sm font-medium text-slate-200">{t.equipment}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{t.task}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{t.scheduledDate}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">{t.assignedTo}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(t)} className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-cyan-400">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="rounded p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400">
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
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Task' : 'Add Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Equipment</label>
            <input value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })} className="input w-full" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Task</label>
            <input value={form.task} onChange={(e) => setForm({ ...form, task: e.target.value })} className="input w-full" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Scheduled Date</label>
            <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="input w-full" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Assigned To</label>
            <input value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="input w-full" required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MaintenanceStatus })} className="input w-full">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
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
