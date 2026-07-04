import { useState } from 'react';
import { Company, Lead, CallStatus } from '../../types';
import { useLeadsStore } from '../../stores/leadsStore';
import { CallStatusSelect } from './CallStatusSelect';
import { Link } from 'wouter';
import { Star } from 'lucide-react';

interface LeadTableProps {
  data: (Company | Lead)[];
  isSavedMode?: boolean;
}

export function LeadTable({ data, isSavedMode = false }: LeadTableProps) {
  const { leads, addLeads, updateLead } = useLeadsStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [textFilter, setTextFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<CallStatus | 'all'>('all');

  const processedData = data.map((item) => {
    const savedLead = leads.find((l) => l.id === item.id);
    if (savedLead) return savedLead;
    return item as Company;
  });

  const filteredData = processedData.filter((item) => {
    if (textFilter) {
      const q = textFilter.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchPhone = item.phone?.toLowerCase().includes(q);
      if (!matchName && !matchPhone) return false;
    }
    if (statusFilter !== 'all') {
      const st = (item as Lead).callStatus || 'not_called';
      if (st !== statusFilter) return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((d) => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleStatusChange = (item: Company | Lead, newStatus: CallStatus) => {
    const isSaved = leads.some((l) => l.id === item.id);
    if (!isSaved) {
      addLeads([item]);
    }
    updateLead(item.id, { callStatus: newStatus });
  };

  const handleBulkStatusChange = (newStatus: CallStatus) => {
    const itemsToUpdate = filteredData.filter((d) => selectedIds.has(d.id));
    const unsaved = itemsToUpdate.filter((item) => !leads.some((l) => l.id === item.id));
    if (unsaved.length > 0) {
      addLeads(unsaved);
    }
    itemsToUpdate.forEach((item) => {
      updateLead(item.id, { callStatus: newStatus });
    });
    setSelectedIds(new Set());
  };

  const handleNoteChange = (item: Company | Lead, notes: string) => {
    const isSaved = leads.some((l) => l.id === item.id);
    if (!isSaved) {
      addLeads([item]);
    }
    updateLead(item.id, { notes });
  };

  const toggleFavorite = (item: Company | Lead) => {
    const isSaved = leads.some((l) => l.id === item.id);
    const currentState = (item as Lead).isFavorite || false;
    if (!isSaved) {
      addLeads([item]);
    }
    updateLead(item.id, { isFavorite: !currentState });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Filter nach Name/Telefon..."
          className="border p-2 rounded-md bg-input text-foreground text-sm flex-1 max-w-xs"
          value={textFilter}
          onChange={(e) => setTextFilter(e.target.value)}
        />
        <select
          className="border p-2 rounded-md bg-input text-foreground text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CallStatus | 'all')}
        >
          <option value="all">Alle Status</option>
          <option value="not_called">Nicht angerufen</option>
          <option value="callback">Rückruf</option>
          <option value="success">Erfolgreich</option>
          <option value="not_interested">Kein Interesse</option>
          <option value="invalid_number">Ungültige Nummer</option>
        </select>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{selectedIds.size} ausgewählt:</span>
            <CallStatusSelect
              value="not_called"
              onChange={handleBulkStatusChange}
              className="w-40"
            />
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-x-auto bg-card">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-muted text-muted-foreground">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.size > 0 && selectedIds.size === filteredData.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3 w-10">Fav</th>
              <th className="p-3">Firmenname</th>
              <th className="p-3">Telefon</th>
              <th className="p-3">Website</th>
              <th className="p-3">Adresse</th>
              <th className="p-3 w-20">Bew.</th>
              <th className="p-3 w-40">Status</th>
              <th className="p-3">Notizen</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => {
              const lead = item as Lead;
              const isSaved = leads.some((l) => l.id === item.id);
              const colorBorder = lead.color ? { borderLeft: `4px solid ${lead.color}` } : {};

              return (
                <tr
                  key={item.id}
                  className={`border-b hover:bg-muted/50 ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                  style={colorBorder}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => toggleFavorite(item)}>
                      <Star
                        className={`w-4 h-4 ${
                          lead.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="p-3 font-medium">
                    {isSaved ? (
                      <Link href={`/lead/${item.id}`} className="text-primary hover:underline">
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">{item.phone || '-'}</td>
                  <td className="p-3 max-w-[150px] truncate">
                    {item.website ? (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline"
                      >
                        {item.website}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-3 max-w-[200px] truncate" title={item.address}>
                    {item.address}
                  </td>
                  <td className="p-3">{item.rating ? `${item.rating} (${item.reviewCount})` : '-'}</td>
                  <td className="p-3">
                    <CallStatusSelect
                      value={lead.callStatus || 'not_called'}
                      onChange={(st) => handleStatusChange(item, st)}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 bg-input text-foreground text-sm"
                      placeholder="Notiz..."
                      value={lead.notes || ''}
                      onChange={(e) => handleNoteChange(item, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-muted-foreground">
                  Keine Ergebnisse gefunden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
