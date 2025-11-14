import React from 'react';
import { Outlet } from 'react-router-dom';
import MainHeader from './MainHeader';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;