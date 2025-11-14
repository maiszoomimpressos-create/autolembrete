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
  HelpCircle,
  LogOut,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/maintenance', label: 'Manutenções', icon: Wrench },
  { path: '/history', label: 'Histórico', icon: History },
  { path: '/settings', label: 'Configurações', icon: Settings },
];

const MainHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

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
    if (path === '/logout') {
      // Simulate logout by navigating to the root/login page
      navigate('/');
    } else if (path === '/help') {
      // Placeholder for help functionality
      console.log('Help clicked');
    } else {
      navigate(path);
    }
    setIsAvatarMenuOpen(false);
  };

  const renderAvatarDropdown = () => (
    <div ref={avatarMenuRef} className="relative">
      <Avatar className="cursor-pointer" onClick={handleAvatarClick}>
        <AvatarImage src="" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      {isAvatarMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="py-2">
            <button
              onClick={() => handleMenuItemClick('/settings?tab=profile')}
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
            <button
              onClick={() => handleMenuItemClick('/help')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <HelpCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Ajuda</span>
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
    <header className="bg-white shadow-sm border-b dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Car className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">CarManager</h1>
          </div>
          <nav className="hidden md:flex space-x-2 lg:space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
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
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer whitespace-nowrap !rounded-button dark:hover:bg-gray-800"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
            {renderAvatarDropdown()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;