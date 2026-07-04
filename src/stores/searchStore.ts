import { create } from 'zustand';
import { Company, SavedSearch, SearchFilters } from '../types';

interface SearchState {
  results: Company[];
  isSearching: boolean;
  error: string | null;
  savedSearches: SavedSearch[];
  setResults: (results: Company[]) => void;
  setSearching: (isSearching: boolean) => void;
  setError: (error: string | null) => void;
  saveSearch: (name: string, filters: SearchFilters) => void;
  deleteSavedSearch: (id: string) => void;
}

const saved = localStorage.getItem('savedSearches');
const initialSavedSearches: SavedSearch[] = saved ? JSON.parse(saved) : [];

export const useSearchStore = create<SearchState>((set) => ({
  results: [],
  isSearching: false,
  error: null,
  savedSearches: initialSavedSearches,
  setResults: (results) => set({ results }),
  setSearching: (isSearching) => set({ isSearching }),
  setError: (error) => set({ error }),
  saveSearch: (name, filters) =>
    set((state) => {
      const newSearch: SavedSearch = {
        id: Math.random().toString(36).substring(7),
        name,
        filters,
        savedAt: new Date().toISOString(),
      };
      const updated = [...state.savedSearches, newSearch];
      localStorage.setItem('savedSearches', JSON.stringify(updated));
      return { savedSearches: updated };
    }),
  deleteSavedSearch: (id) =>
    set((state) => {
      const updated = state.savedSearches.filter((s) => s.id !== id);
      localStorage.setItem('savedSearches', JSON.stringify(updated));
      return { savedSearches: updated };
    }),
}));
