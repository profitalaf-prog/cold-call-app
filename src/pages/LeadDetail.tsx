import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'wouter';
import { useLeadsStore } from '../stores/leadsStore';
import { CallStatusSelect } from '../components/leads/CallStatusSelect';
import { Star, MapPin, Globe, Phone, Mail, Building } from 'lucide-react';

const COLORS = [
  { value: '', label: 'Keine' },
  { value: 'red', label: 'Rot' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Gelb' },
  { value: 'green', label: 'Grün' },
  { value: 'blue', label: 'Blau' },
];

export function LeadDetail() {
  const { id } = useParams();
  const { leads, updateLead } = useLeadsStore();
  const lead = leads.find((l) => l.id === id);

  const [notes, setNotes] = useState(lead?.notes || '');
  const [tagsInput, setTagsInput] = useState(lead?.tags?.join(', ') || '');

  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || '');
      setTagsInput(lead.tags?.join(', ') || '');
    }
  }, [lead?.id]);

  const saveNotes = useCallback(
    (newNotes: string) => {
      if (id) updateLead(id, { notes: newNotes });
    },
    [id, updateLead]
  );

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveNotes(val);
    }, 500);
  };

  const handleTagsBlur = () => {
    if (id) {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      updateLead(id, { tags });
    }
  };

  if (!lead) return <div className="p-6">Lead nicht gefunden.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            {lead.name}
            <button onClick={() => updateLead(lead.id, { isFavorite: !lead.isFavorite })}>
              <Star
                className={`w-6 h-6 ${
                  lead.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
                }`}
              />
            </button>
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Building className="w-4 h-4" /> {lead.category || 'Keine Kategorie'}
            {lead.rating && (
              <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs font-medium">
                ★ {lead.rating} ({lead.reviewCount})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CallStatusSelect
            value={lead.callStatus}
            onChange={(st) => updateLead(lead.id, { callStatus: st })}
            className="text-lg py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-6 bg-card border rounded-lg shadow-sm">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">Kontakt</h2>
            <div className="space-y-4">
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold text-foreground tracking-tight">
                    {lead.phone}
                  </span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-medium break-all"
                  >
                    {lead.website}
                  </a>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-primary hover:underline font-medium break-all"
                  >
                    {lead.email}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-foreground font-medium">{lead.address}</p>
                  {lead.mapsLink && (
                    <a
                      href={lead.mapsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:underline inline-block mt-1"
                    >
                      Bei {lead.provider === 'google' ? 'Google Maps' : 'OpenStreetMap'} öffnen
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-card border rounded-lg shadow-sm">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">Metadaten</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tags (kommagetrennt)</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded bg-input"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onBlur={handleTagsBlur}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {lead.tags?.map((t) => (
                    <span key={t} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Farbe</label>
                <select
                  className="w-full p-2 border rounded bg-input"
                  value={lead.color || ''}
                  onChange={(e) => updateLead(lead.id, { color: e.target.value })}
                >
                  {COLORS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-muted-foreground pt-2">
                Gespeichert am: {new Date(lead.savedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col h-[600px]">
          <div className="p-6 bg-card border rounded-lg shadow-sm flex-1 flex flex-col">
            <h2 className="text-sm font-bold text-muted-foreground uppercase mb-4">Notizen</h2>
            <textarea
              className="w-full flex-1 p-4 border rounded bg-input resize-none"
              placeholder="Notizen zum Anruf..."
              value={notes}
              onChange={handleNotesChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
