import React from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from './MainHeader';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar (Visível em telas maiores) */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        
        {/* Conteúdo Principal */}
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;