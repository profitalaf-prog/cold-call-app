import { create } from 'zustand';
import { Lead } from '../types';

interface LeadsState {
  leads: Lead[];
  addLeads: (companies: Omit<Lead, 'callStatus' | 'notes' | 'tags' | 'isFavorite' | 'savedAt'>[]) => void;
  updateLead: (id: string, partial: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  clearLeads: () => void;
}

const saved = localStorage.getItem('leads');
const initialLeads: Lead[] = saved ? JSON.parse(saved) : [];

export const useLeadsStore = create<LeadsState>((set) => ({
  leads: initialLeads,
  addLeads: (companies) =>
    set((state) => {
      const newLeads = companies.map((c) => ({
        ...c,
        callStatus: 'not_called' as const,
        notes: '',
        tags: [],
        isFavorite: false,
        savedAt: new Date().toISOString(),
      }));
      const merged = [...state.leads];
      for (const nl of newLeads) {
        if (!merged.find((l) => l.id === nl.id)) {
          merged.push(nl);
        }
      }
      localStorage.setItem('leads', JSON.stringify(merged));
      return { leads: merged };
    }),
  updateLead: (id, partial) =>
    set((state) => {
      const updated = state.leads.map((l) => {
        if (l.id === id) {
          const next = { ...l, ...partial };
          if (partial.callStatus && partial.callStatus !== l.callStatus) {
            next.statusChangedAt = new Date().toISOString();
          }
          return next;
        }
        return l;
      });
      localStorage.setItem('leads', JSON.stringify(updated));
      return { leads: updated };
    }),
  removeLead: (id) =>
    set((state) => {
      const updated = state.leads.filter((l) => l.id !== id);
      localStorage.setItem('leads', JSON.stringify(updated));
      return { leads: updated };
    }),
  clearLeads: () =>
    set(() => {
      localStorage.removeItem('leads');
      return { leads: [] };
    }),
}));
