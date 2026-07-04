import { useLeadsStore } from '../stores/leadsStore';
import { useSearchStore } from '../stores/searchStore';
import { LeadTable } from '../components/leads/LeadTable';
import { ExportButtons } from '../components/leads/ExportButtons';
import { useLocation } from 'wouter';

export function SavedLeads() {
  const { leads } = useLeadsStore();
  const { savedSearches, deleteSavedSearch } = useSearchStore();
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Gespeicherte Leads</h1>
        <ExportButtons data={leads} />
      </div>

      <LeadTable data={leads} isSavedMode={true} />

      {savedSearches.length > 0 && (
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-bold text-foreground">Gespeicherte Suchen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedSearches.map((s) => (
              <div key={s.id} className="p-4 bg-card border rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-primary">{s.name}</h3>
                  <button
                    onClick={() => deleteSavedSearch(s.id)}
                    className="text-destructive text-sm font-medium hover:underline"
                  >
                    Löschen
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Gespeichert am: {new Date(s.savedAt).toLocaleDateString()}
                </p>
                <div className="text-xs text-foreground mb-4 space-y-1">
                  <p>Branche: {s.filters.industry || '-'}</p>
                  <p>
                    Ort: {s.filters.city ? `${s.filters.city}, ${s.filters.country}` : s.filters.country}
                  </p>
                  <p>Radius: {s.filters.radius}km</p>
                </div>
                <button
                  onClick={() => setLocation('/search')}
                  className="w-full py-1.5 border rounded bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80"
                >
                  Suchen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
