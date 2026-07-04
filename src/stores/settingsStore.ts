import { create } from 'zustand';
import { AppSettings } from '../types';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleDarkMode: () => void;
}

const defaultSettings: AppSettings = {
  googleApiKey: '',
  overpassUrl: 'https://overpass-api.de/api/interpreter',
  nominatimUrl: 'https://nominatim.openstreetmap.org',
  timeoutMs: 10000,
  maxResults: 100,
  provider: 'osm',
  darkMode: false,
};

const saved = localStorage.getItem('settings');
const initialSettings = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;

if (initialSettings.darkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: initialSettings,
  updateSettings: (partial) =>
    set((state) => {
      const newSettings = { ...state.settings, ...partial };
      localStorage.setItem('settings', JSON.stringify(newSettings));

      if (newSettings.darkMode !== state.settings.darkMode) {
        if (newSettings.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      return { settings: newSettings };
    }),
  toggleDarkMode: () =>
    set((state) => {
      const newSettings = { ...state.settings, darkMode: !state.settings.darkMode };
      localStorage.setItem('settings', JSON.stringify(newSettings));

      if (newSettings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      return { settings: newSettings };
    }),
}));
