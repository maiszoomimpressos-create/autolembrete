import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Lock, Bell, Car, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingLink {
  path: string;
  label: string;
  icon: React.ElementType;
}

const settingLinks: SettingLink[] = [
  { path: 'profile', label: 'Perfil', icon: User },
  { path: 'vehicle', label: 'Veículo', icon: Car },
  { path: 'security', label: 'Segurança', icon: Lock },
  { path: 'notifications', label: 'Notificações', icon: Bell },
  { path: 'general', label: 'Geral', icon: Settings },
];

interface SettingsSidebarProps {
  basePath: string;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ basePath }) => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'profile';

  return (
    <nav className="flex flex-col space-y-1 p-4 border-r dark:border-gray-700">
      {settingLinks.map((link) => {
        const isActive = link.path === currentPath;
        const Icon = link.icon;
        return (
          <Link
            key={link.path}
            to={`${basePath}/${link.path}`}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SettingsSidebar;