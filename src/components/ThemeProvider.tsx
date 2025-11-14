import React from 'react';
import useTheme from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Este componente apenas inicializa o hook para aplicar o tema ao DOM
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Chama o hook para garantir que o tema seja lido do localStorage e aplicado ao <html>
  useTheme(); 
  
  return <>{children}</>;
};

export default ThemeProvider;