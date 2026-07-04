import { useSettingsStore } from '../stores/settingsStore';

export function Settings() {
  const { settings, updateSettings, toggleDarkMode } = useSettingsStore();

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Einstellungen</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-destructive text-destructive-foreground font-medium rounded text-sm hover:bg-destructive/90"
        >
          Abmelden
        </button>
      </div>

      <div className="bg-card border rounded-lg shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Suchanbieter</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Standard-Provider</label>
            <select
              className="w-full p-2 border rounded bg-input"
              value={settings.provider}
              onChange={(e) => updateSettings({ provider: e.target.value as any })}
            >
              <option value="auto">Automatisch (OSM + Google Fallback)</option>
              <option value="osm">OpenStreetMap</option>
              <option value="google">Google Places API</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Google API Key</label>
            <input
              type="password"
              className="w-full p-2 border rounded bg-input"
              value={settings.googleApiKey}
              onChange={(e) => updateSettings({ googleApiKey: e.target.value })}
              placeholder="AIzaSy..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Wird für Google Places Suche benötigt.
            </p>
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-bold">OpenStreetMap Details</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Overpass API URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-input"
              value={settings.overpassUrl}
              onChange={(e) => updateSettings({ overpassUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nominatim API URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded bg-input"
              value={settings.nominatimUrl}
              onChange={(e) => updateSettings({ nominatimUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4 border-t pt-6">
          <h2 className="text-lg font-bold">Allgemein</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Timeout (ms)</label>
            <input
              type="number"
              className="w-full p-2 border rounded bg-input"
              value={settings.timeoutMs}
              onChange={(e) => updateSettings({ timeoutMs: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Max. Ergebnisse pro Suche</label>
            <input
              type="number"
              className="w-full p-2 border rounded bg-input"
              value={settings.maxResults}
              onChange={(e) => updateSettings({ maxResults: parseInt(e.target.value) })}
            />
          </div>

          <div className="pt-2">
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 border rounded bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80"
            >
              {settings.darkMode ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
