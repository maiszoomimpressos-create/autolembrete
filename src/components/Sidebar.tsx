import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  History,
  Settings,
  Fuel,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/components/SessionContextProvider';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/maintenance', label: 'Manutenções', icon: Wrench },
  { path: '/fueling', label: 'Abastecimentos', icon: Fuel },
  { path: '/history', label: 'Histórico', icon: History },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useSession();

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-sidebar dark:bg-sidebar-background dark:border-sidebar-border h-full p-4 space-y-4">
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => {
          // Verifica se o caminho atual começa com o caminho do item (para rotas aninhadas como /settings/*)
          const isActive = location.pathname.startsWith(item.path) && item.path !== '/';
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "text-sidebar-foreground hover:bg-sidebar-accent dark:hover:bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        {/* Link de Admin Master */}
        {isAdmin && (
          <Link
            to="/master-admin"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mt-2",
              location.pathname.startsWith('/master-admin')
                ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                : "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            )}
          >
            <Shield className="w-5 h-5" />
            <span>Admin Master</span>
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;