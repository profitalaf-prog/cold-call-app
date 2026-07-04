import { useState } from 'react';

export function LoginScreen() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '26.Af.10') {
      localStorage.setItem('authenticated', 'true');
      window.location.reload();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 bg-card border rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-foreground">Cold Call Finder</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">Passwort</label>
            <input
              type="password"
              className="w-full p-2 border rounded-md bg-input text-foreground"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
          </div>
          {error && (
            <div className="p-2 bg-destructive text-destructive-foreground rounded-md text-sm">
              Falsches Passwort
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90"
          >
            Anmelden
          </button>
        </form>
      </div>
    </div>
  );
}
