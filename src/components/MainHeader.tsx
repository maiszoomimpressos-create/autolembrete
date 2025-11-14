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
  Gauge,
  Check,
  ChevronDown,
  Menu, // Adicionado para o menu mobile
} from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { useProfile } from '@/hooks/useProfile';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useFuelingRecords } from '@/hooks/useFuelingRecords';
import { useMileageRecords } from '@/hooks/useMileageRecords';
import { useMileageAlerts } from '@/hooks/useMileageAlerts';
import { useDateAlerts } from '@/hooks/useDateAlerts';
import { Badge } from '@/components/ui/badge';
import MileageInputDialog from './MileageInputDialog';
import { useVehicle } from '@/hooks/useVehicle';
import { useActiveVehicle } from '@/hooks/useActiveVehicle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Componentes para menu mobile

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
  const [isMileageDialogOpen, setIsMileageDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para o menu mobile
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  
  // Hooks de Veículo
  const { vehicle: activeVehicle, vehicles, isLoading: isLoadingVehicle } = useVehicle();
  const { setActiveVehicle } = useActiveVehicle();

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

  const renderNavLinks = (onLinkClick: () => void, isMobile: boolean) => (
    <div className={isMobile ? "flex flex-col space-y-1 p-4" : "space-x-8"}>
        {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && item.path !== '/';
            const Icon = item.icon;
            return (
                <Button
                    key={item.path}
                    variant={isActive ? 'default' : 'ghost'}
                    className={`cursor-pointer whitespace-nowrap !rounded-button ${isMobile ? 'w-full justify-start' : ''} ${isActive ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                    onClick={() => {
                        navigate(item.path);
                        onLinkClick();
                    }}
                >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                </Button>
            );
        })}
    </div>
  );

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
  
  const renderVehicleSelector = () => {
    if (isLoadingVehicle || vehicles.length === 0) {
        return (
            <Button variant="outline" size="sm" disabled className="dark:hover:bg-gray-700">
                <Car className="w-4 h-4 mr-2" />
                Carregando...
            </Button>
        );
    }
    
    if (vehicles.length === 1) {
        return (
            <Button variant="outline" size="sm" disabled className="dark:hover:bg-gray-700">
                <Car className="w-4 h-4 mr-2" />
                {activeVehicle.model}
            </Button>
        );
    }
    
    // Se houver múltiplos veículos, exibe o Dropdown
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="dark:hover:bg-gray-700">
                    <Car className="w-4 h-4 mr-2" />
                    {activeVehicle.model}
                    <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuLabel className="text-sm font-semibold dark:text-white">Veículo Ativo</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                {vehicles.map((v) => (
                    <DropdownMenuItem 
                        key={v.id}
                        onClick={() => setActiveVehicle(v.id)}
                        className="flex items-center justify-between cursor-pointer dark:hover:bg-gray-700"
                    >
                        <span className="truncate">{v.model} ({v.plate})</span>
                        {v.id === activeVehicle.id && <Check className="w-4 h-4 text-blue-500 ml-2" />}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem 
                    onClick={() => navigate('/settings/vehicle')}
                    className="text-blue-600 dark:text-blue-400 cursor-pointer dark:hover:bg-gray-700"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Gerenciar Veículos
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Autolembrete</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            {renderNavLinks(() => {}, false)}
          </nav>
          
          <div className="flex items-center space-x-4">
            
            {/* Seletor de Veículo (Desktop/Tablet) */}
            <div className="hidden sm:block">
                {renderVehicleSelector()}
            </div>
            
            {/* Botão de Administrador Master (Desktop) */}
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
            
            {/* Botão de Registro de KM Rápido (Visível em todas as telas) */}
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer whitespace-nowrap !rounded-button dark:hover:bg-gray-700"
              onClick={() => setIsMileageDialogOpen(true)}
            >
              <Gauge className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Registrar KM</span>
              <span className="sm:hidden">KM</span>
            </Button>
            
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
            
            {/* Avatar Dropdown (Desktop) */}
            <div className="hidden md:block">
                {renderAvatarDropdown()}
            </div>
            
            {/* Menu Hamburger (Mobile) */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                        <Menu className="w-6 h-6 dark:text-white" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px] dark:bg-gray-900 dark:border-gray-800 p-0">
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b dark:border-gray-800">
                            <div className="flex items-center space-x-2">
                                <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Navegação</h1>
                            </div>
                        </div>
                        
                        {/* Links de Navegação */}
                        <div className="flex-grow overflow-y-auto">
                            {renderNavLinks(() => setIsMobileMenuOpen(false), true)}
                            
                            {/* Seletor de Veículo (Mobile) */}
                            <div className="p-4 border-t dark:border-gray-800">
                                <h3 className="text-sm font-semibold mb-2 dark:text-white">Veículo Ativo</h3>
                                {renderVehicleSelector()}
                            </div>
                            
                            {/* Admin Link (Mobile) */}
                            {isAdmin && (
                                <div className="p-4 border-t dark:border-gray-800">
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                      onClick={() => {
                                          navigate('/master-admin');
                                          setIsMobileMenuOpen(false);
                                      }}
                                    >
                                      <Shield className="w-4 h-4 mr-2" />
                                      Admin Master
                                    </Button>
                                </div>
                            )}
                        </div>
                        
                        {/* Rodapé do Menu (Perfil e Sair) */}
                        <div className="p-4 border-t dark:border-gray-800">
                            <div className="flex items-center space-x-3 mb-3">
                                <Avatar>
                                    <AvatarImage src={profile.avatarUrl || ""} />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium dark:text-white truncate">{getDisplayName()}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:border-red-900"
                                onClick={() => handleMenuItemClick('/logout')}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            
          </div>
        </div>
      </div>
      
      {/* Diálogo de Registro de KM */}
      <MileageInputDialog 
        isOpen={isMileageDialogOpen} 
        onOpenChange={setIsMileageDialogOpen} 
      />
    </header>
  );
};

export default MainHeader;