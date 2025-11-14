import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wrench, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLink {
  path: string;
  label: string;
  icon: React.ElementType;
}

const adminLinks: AdminLink[] = [
  { path: 'emails', label: 'Gerenciar Administradores', icon: Mail },
  { path: 'service-types', label: 'Cadastrar Tipos de Serviço', icon: Wrench },
];

interface AdminSidebarProps {
  basePath: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ basePath }) => {
  const location = useLocation();
  // Extrai o último segmento da URL para determinar o item ativo
  const currentPathSegment = location.pathname.split('/').pop() || 'emails';

  return (
    <nav className="flex flex-col space-y-1 p-4 border-r dark:border-gray-700">
      {adminLinks.map((link) => {
        const isActive = link.path === currentPathSegment;
        const Icon = link.icon;
        return (
          <Link
            key={link.path}
            to={`${basePath}/${link.path}`}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
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

export default AdminSidebar;