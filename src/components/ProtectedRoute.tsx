import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/components/SessionContextProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  // Se for necessário restringir a rota apenas a administradores, podemos usar esta prop
  adminOnly?: boolean; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const { user, isLoading, isAdmin } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="ml-3 text-lg dark:text-white">Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    // Redireciona usuários não autenticados para a página inicial (login)
    return <Navigate to="/" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    // Redireciona usuários autenticados, mas não administradores, para o dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Se autenticado e com permissão (se necessário), renderiza o conteúdo da rota
  return <Outlet />;
};

export default ProtectedRoute;