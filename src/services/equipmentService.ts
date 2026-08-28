import { equipmentData } from '@/data/mockData';
import type { Equipment, EquipmentStatus } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let equipment: Equipment[] = [...equipmentData];

export const equipmentService = {
  async getAll(): Promise<Equipment[]> {
    await delay(400);
    return [...equipment];
  },

  async create(item: Omit<Equipment, 'id'>): Promise<Equipment> {
    await delay(300);
    const newItem: Equipment = { ...item, id: `eq-${Date.now()}` };
    equipment = [...equipment, newItem];
    return newItem;
  },

  async update(id: string, updates: Partial<Equipment>): Promise<Equipment | null> {
    await delay(300);
    equipment = equipment.map((e) => (e.id === id ? { ...e, ...updates } : e));
    return equipment.find((e) => e.id === id) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    await delay(250);
    equipment = equipment.filter((e) => e.id !== id);
    return true;
  },

  async setStatus(id: string, status: EquipmentStatus): Promise<Equipment | null> {
    return this.update(id, { status, lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ') });
  },
};
