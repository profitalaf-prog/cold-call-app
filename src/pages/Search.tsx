import { useState } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { useSearchStore } from '../stores/searchStore';
import { getProvider } from '../providers/providerFactory';
import { LeadTable } from '../components/leads/LeadTable';
import { ExportButtons } from '../components/leads/ExportButtons';
import { SearchFilters } from '../types';

const COUNTRIES = [
  'USA', 'Schweiz', 'Luxemburg', 'Monaco', 'Liechtenstein', 'Norwegen', 'Irland',
  'Dänemark', 'Singapur', 'Katar', 'Vereinigte Arabische Emirate', 'Hongkong',
  'Island', 'Großbritannien', 'Deutschland', 'Niederlande', 'Schweden', 'Österreich',
  'Finnland', 'Belgien', 'Kanada', 'Australien', 'Neuseeland', 'Israel', 'Frankreich',
  'Japan', 'Saudi-Arabien', 'Kuwait', 'Bahrain', 'Zypern', 'Malta', 'Italien',
  'Spanien', 'Portugal', 'Griechenland', 'Slowenien', 'Kroatien', 'Estland',
  'Tschechien', 'Polen', 'Litauen', 'Lettland', 'Slowakei', 'Ungarn', 'Rumänien',
  'Türkei', 'Brasilien', 'Mexiko', 'Argentinien', 'Chile', 'Kolumbien', 'Peru',
  'China', 'Indien', 'Südkorea', 'Indonesien', 'Malaysia', 'Thailand', 'Vietnam',
  'Philippinen', 'Ukraine', 'Russland',
].sort();

export function Search() {
  const { settings } = useSettingsStore();
  const { results, isSearching, error, setResults, setSearching, setError, saveSearch } =
    useSearchStore();

  const [filters, setFilters] = useState<SearchFilters>({
    industry: '',
    country: 'Deutschland',
    city: '',
    radius: 10,
    onlinePresence: 'all',
    minReviews: 0,
    minRating: 1.0,
    openNow: false,
  });

  const [searchName, setSearchName] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setError(null);
    setResults([]);

    try {
      const provider = getProvider(settings);
      const data = await provider.searchCompanies(filters);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten.');
    } finally {
      setSearching(false);
    }
  };

  const handleSaveSearch = () => {
    if (!searchName) return;
    saveSearch(searchName, filters);
    setSearchName('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Suche</h1>

      <form onSubmit={handleSearch} className="bg-card p-6 border rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Branche</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-input text-foreground"
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              placeholder="z.B. Zahnarzt"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Land *</label>
            <select
              className="w-full p-2 border rounded bg-input text-foreground"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              required
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stadt</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-input text-foreground"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="z.B. Berlin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Radius ({filters.radius} km)</label>
            <input
              type="range"
              min="0"
              max="50"
              className="w-full"
              value={filters.radius}
              onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Online‑Präsenz</label>
            <select
              className="w-full p-2 border rounded bg-input text-foreground"
              value={filters.onlinePresence}
              onChange={(e) => setFilters({ ...filters, onlinePresence: e.target.value as any })}
            >
              <option value="all">Alle</option>
              <option value="none">Kein Internetauftritt</option>
              <option value="social_only">Nur Social Media</option>
              <option value="booking_only">Nur Reservierungsplattform</option>
              <option value="own_website">Eigene Website</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min. Bewertungen ({filters.minReviews})</label>
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              className="w-full"
              value={filters.minReviews}
              onChange={(e) => setFilters({ ...filters, minReviews: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Min. Bewertung ({filters.minRating})</label>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              className="w-full"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.openNow}
                onChange={(e) => setFilters({ ...filters, openNow: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Nur geöffnete</span>
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isSearching ? 'Suche läuft...' : 'Unternehmen suchen'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-destructive text-destructive-foreground font-medium rounded">
            {error}
          </div>
        )}
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-card p-4 border rounded-lg">
            <h2 className="font-bold">{results.length} Ergebnisse gefunden</h2>
            <div className="flex gap-4">
              <ExportButtons data={results} />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Name für Speicherung"
                  className="border px-2 py-1 text-sm rounded bg-input"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <button
                  onClick={handleSaveSearch}
                  disabled={!searchName}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded border"
                >
                  Suche speichern
                </button>
              </div>
            </div>
          </div>
          <LeadTable data={results} />
        </div>
      )}
    </div>
  );
}
