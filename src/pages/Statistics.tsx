import { useLeadsStore } from '../stores/leadsStore';

export function Statistics() {
  const { leads } = useLeadsStore();

  const total = leads.length;
  const called = leads.filter((l) => l.callStatus !== 'not_called').length;
  const notCalled = leads.filter((l) => l.callStatus === 'not_called').length;

  const success = leads.filter((l) => l.callStatus === 'success').length;
  const notInterested = leads.filter((l) => l.callStatus === 'not_interested').length;
  const callbacks = leads.filter((l) => l.callStatus === 'callback').length;
  const invalid = leads.filter((l) => l.callStatus === 'invalid_number').length;

  const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Gesamt Leads', value: total, color: 'text-foreground' },
    { label: 'Angerufen', value: called, color: 'text-primary' },
    { label: 'Nicht angerufen', value: notCalled, color: 'text-muted-foreground' },
    { label: 'Erfolgreich', value: success, color: 'text-green-600' },
    { label: 'Kein Interesse', value: notInterested, color: 'text-red-600' },
    { label: 'Rückruf', value: callbacks, color: 'text-yellow-600' },
    { label: 'Ungültige Nummer', value: invalid, color: 'text-gray-900' },
    { label: 'Erfolgsquote', value: `${successRate}%`, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Statistiken</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="p-6 bg-card border rounded-lg shadow-sm">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {s.label}
            </p>
            <p className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
