import { observationData } from '@/data/mockData';
import type { Observation } from '@/types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let observations: Observation[] = [...observationData];

export const observationService = {
  async getAll(): Promise<Observation[]> {
    await delay(400);
    return [...observations];
  },

  async create(item: Omit<Observation, 'id'>): Promise<Observation> {
    await delay(300);
    const newItem: Observation = { ...item, id: `obs-${Date.now()}` };
    observations = [...observations, newItem];
    return newItem;
  },

  async update(id: string, updates: Partial<Observation>): Promise<Observation | null> {
    await delay(300);
    observations = observations.map((o) => (o.id === id ? { ...o, ...updates } : o));
    return observations.find((o) => o.id === id) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    await delay(250);
    observations = observations.filter((o) => o.id !== id);
    return true;
  },
};
