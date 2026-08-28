import { maintenanceData } from '@/data/mockData';
import type { MaintenanceTask } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let tasks: MaintenanceTask[] = [...maintenanceData];

export const maintenanceService = {
  async getAll(): Promise<MaintenanceTask[]> {
    await delay(400);
    return [...tasks];
  },

  async create(item: Omit<MaintenanceTask, 'id'>): Promise<MaintenanceTask> {
    await delay(300);
    const newItem: MaintenanceTask = { ...item, id: `mt-${Date.now()}` };
    tasks = [...tasks, newItem];
    return newItem;
  },

  async update(id: string, updates: Partial<MaintenanceTask>): Promise<MaintenanceTask | null> {
    await delay(300);
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    return tasks.find((t) => t.id === id) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    await delay(250);
    tasks = tasks.filter((t) => t.id !== id);
    return true;
  },
};
