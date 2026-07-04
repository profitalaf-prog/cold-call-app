import { useLeadsStore } from '../stores/leadsStore';

export function Dashboard() {
  const { leads } = useLeadsStore();

  const totalLeads = leads.length;

  const today = new Date().toISOString().split('T')[0];
  const calledToday = leads.filter(
    (l) => l.statusChangedAt?.startsWith(today) && l.callStatus !== 'not_called'
  ).length;

  const openLeads = leads.filter((l) => l.callStatus === 'not_called' || l.callStatus === 'callback')
    .length;
  const callbacks = leads.filter((l) => l.callStatus === 'callback').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-card border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Gesamt Leads
          </p>
          <p className="text-3xl font-bold mt-2 text-foreground">{totalLeads}</p>
        </div>

        <div className="p-6 bg-card border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Heute angerufen
          </p>
          <p className="text-3xl font-bold mt-2 text-primary">{calledToday}</p>
        </div>

        <div className="p-6 bg-card border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Offene Leads
          </p>
          <p className="text-3xl font-bold mt-2 text-foreground">{openLeads}</p>
        </div>

        <div className="p-6 bg-card border rounded-lg shadow-sm">
          <p className="text-sm font-medium text-yellow-600 uppercase tracking-wide">Rückrufe</p>
          <p className="text-3xl font-bold mt-2 text-yellow-600">{callbacks}</p>
        </div>
      </div>
    </div>
  );
}
