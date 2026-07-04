import { Switch, Route, Router as WouterRouter } from 'wouter';
import { useEffect, useState } from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import { SavedLeads } from './pages/SavedLeads';
import { LeadDetail } from './pages/LeadDetail';
import { Statistics } from './pages/Statistics';
import { Settings } from './pages/Settings';
import NotFound from './pages/not-found';

function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('authenticated');
    setAuthenticated(auth === 'true');
  }, []);

  if (authenticated === null) return null;
  if (!authenticated) return <LoginScreen />;

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/search" component={Search} />
          <Route path="/leads" component={SavedLeads} />
          <Route path="/lead/:id" component={LeadDetail} />
          <Route path="/stats" component={Statistics} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </WouterRouter>
  );
}

export default App;
