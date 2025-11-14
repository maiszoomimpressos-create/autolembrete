import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { Shield, Loader2 } from 'lucide-react';
import { showError } from '@/utils/toast';
import AdminSidebar from '@/components/AdminSidebar';
import AdminEmailsPage from './admin/AdminEmailsPage';
import ServiceTypesPage from './admin/ServiceTypesPage';

const MasterAdminPage: React.FC = () => {
  const { isLoading, isAdmin } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = '/master-admin';

  // Redireciona se não for administrador
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      showError('Acesso negado. Você não tem permissão de administrador master.');
      navigate('/dashboard', { replace: true });
    }
  }, [isLoading, isAdmin, navigate]);

  // Redireciona para 'emails' se estiver apenas em /master-admin
  if (!isLoading && isAdmin && (location.pathname === basePath || location.pathname === `${basePath}/`)) {
    return <Navigate to={`${basePath}/emails`} replace />;
  }

  if (isLoading || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 dark:text-red-400" />
        <p className="mt-4 dark:text-white">Verificando permissões de administrador...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
        <Shield className="w-7 h-7 text-red-600 dark:text-red-400" />
        <span>Painel de Administração Master</span>
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-lg shadow dark:bg-gray-900 dark:border-gray-800 border">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <AdminSidebar basePath={basePath} />
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-grow min-w-0">
          <Routes>
            <Route path="emails" element={<AdminEmailsPage />} />
            <Route path="service-types" element={<ServiceTypesPage />} />
            {/* Fallback para garantir que sempre haja um conteúdo */}
            <Route path="*" element={<Navigate to={`${basePath}/emails`} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MasterAdminPage;