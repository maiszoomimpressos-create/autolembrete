import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  LayoutDashboard,
  Wrench,
  History,
  Settings,
  Bell,
  User,
  LogOut,
  Fuel,
  Shield,
} from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { useProfile } from '@/hooks/useProfile';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords'; // Novo Import
import { useFuelingRecords } from '@/hooks/useFuelingRecords'; // Novo Import
import { useMileageRecords } from '@/hooks/useMileageRecords'; // Novo Import
import { useMileageAlerts } from '@/hooks/useMileageAlerts'; // Novo Import
import { useDateAlerts } from '@/hooks/useDateAlerts'; // Novo Import
import { Badge } from '@/components/ui/badge'; // Novo Import

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

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAdmin } = useSession();
  const { profile } = useProfile();
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  
  // Hooks de Alerta
  const { records: maintenanceRecords } = useMaintenanceRecords();
  const { records: fuelingRecords } = useFuelingRecords();
  const { currentMileage } = useMileageRecords(fuelingRecords);
  const { alerts: mileageAlerts } = useMileageAlerts(maintenanceRecords, currentMileage);
  const { alerts: dateAlerts } = useDateAlerts(maintenanceRecords);
  const totalAlerts = mileageAlerts.length + dateAlerts.length;


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAvatarClick = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };
  
  const handleMenuItemClick = (path: string) => {
    setIsAvatarMenuOpen(false);
    if (path === '/logout') {
        signOut();
        navigate('/');
    } else {
        navigate(path);
    }
  };
  
  const getDisplayName = () => {
      if (profile.firstName) {
          const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
          return fullName.length > 20 ? profile.firstName : fullName;
      }
      return user?.email || 'Usuário';
  };

  const userInitials = profile.firstName 
    ? profile.firstName.substring(0, 1).toUpperCase() + (profile.lastName ? profile.lastName.substring(0, 1).toUpperCase() : '')
    : user?.email ? user.email.substring(0, 2).toUpperCase() : 'JD';

  const renderAvatarDropdown = () => (
    <div ref={avatarMenuRef} className="relative">
      <Avatar className="cursor-pointer" onClick={handleAvatarClick}>
        <AvatarImage src={profile.avatarUrl || ""} />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
      {isAvatarMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="py-2">
            <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white truncate border-b dark:border-gray-700">
                {getDisplayName()}
            </div>
            
            {/* Botão de Administrador Master (Visível apenas para admins) */}
            {isAdmin && (
                <>
                    <button
                      onClick={() => handleMenuItemClick('/master-admin')}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 dark:hover:bg-red-900/20"
                    >
                      <Shield className="w-4 h-4 text-red-500" />
                      <span>Admin Master</span>
                    </button>
                    <Separator className="my-1 dark:bg-gray-700" />
                </>
            )}
            
            <button
              onClick={() => handleMenuItemClick('/settings/profile')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Ver Perfil</span>
            </button>
            <button
              onClick={() => handleMenuItemClick('/settings')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Configurações</span>
            </button>
            <Separator className="my-1 dark:bg-gray-700" />
            <button
              onClick={() => handleMenuItemClick('/logout')}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white shadow-sm border-b dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Autolembrete</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path) && item.path !== '/';
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`cursor-pointer whitespace-nowrap !rounded-button ${isActive ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
          <div className="flex items-center space-x-4">
            {/* Botão de Administrador Master na barra de navegação principal (opcional, mas útil) */}
            {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer whitespace-nowrap !rounded-button text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 hidden lg:flex"
                  onClick={() => navigate('/master-admin')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Master
                </Button>
            )}
            {/* Botão de Alertas */}
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer whitespace-nowrap !rounded-button dark:hover:bg-gray-800 relative"
              onClick={() => navigate('/alerts')}
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {totalAlerts > 0 && (
                <Badge 
                    variant="destructive" 
                    className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                    {totalAlerts}
                </Badge>
              )}
            </Button>
            {renderAvatarDropdown()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;