import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SettingsSidebar from '@/components/SettingsSidebar';
import ProfileSettings from './settings/ProfileSettings';
import VehicleSettings from './settings/VehicleSettings';
import GenericSettings from './settings/GenericSettings';

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const basePath = '/settings';

  // Redireciona para 'profile' se estiver apenas em /settings
  if (location.pathname === basePath || location.pathname === `${basePath}/`) {
    return <Navigate to={`${basePath}/profile`} replace />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h2>
      
      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-lg shadow dark:bg-gray-900 dark:border-gray-800 border">
        
        {/* Sidebar */}
        <div className="w-full md:w-56 flex-shrink-0">
          <SettingsSidebar basePath={basePath} />
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-grow min-w-0">
          <Routes>
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="vehicle" element={<VehicleSettings />} />
            <Route 
              path="security" 
              element={<GenericSettings title="Segurança" description="Gerencie suas credenciais de login e autenticação de dois fatores." />} 
            />
            <Route 
              path="notifications" 
              element={<GenericSettings title="Notificações" description="Configure como e quando você recebe alertas sobre manutenções." />} 
            />
            <Route 
              path="general" 
              element={<GenericSettings title="Geral" description="Opções gerais do aplicativo, como tema e idioma." />} 
            />
            {/* Fallback para garantir que sempre haja um conteúdo */}
            <Route path="*" element={<Navigate to={`${basePath}/profile`} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;