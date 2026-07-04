import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Search, Bookmark, BarChart, Settings, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';

export function Sidebar() {
  const [location] = useLocation();
  const { settings, toggleDarkMode } = useSettingsStore();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Suche', icon: Search },
    { href: '/leads', label: 'Gespeicherte Leads', icon: Bookmark },
    { href: '/stats', label: 'Statistiken', icon: BarChart },
    { href: '/settings', label: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-sidebar-foreground">Cold Call Finder</h2>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            location === item.href || (item.href !== '/' && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {settings.darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </div>
  );
}
