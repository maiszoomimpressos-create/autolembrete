import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import useTheme from '@/hooks/useTheme';

interface GenericSettingsProps {
  title: string;
  description: string;
}

const GenericSettings: React.FC<GenericSettingsProps> = ({ title, description }) => {
  const { theme, toggleTheme } = useTheme();

  const renderContent = () => {
    if (title === 'Geral') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <div>
                <Label htmlFor="theme-switch" className="text-base dark:text-white">Modo Escuro</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ative o modo escuro para uma experiência visual mais confortável.
                </p>
              </div>
            </div>
            <Switch
              id="theme-switch"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
          
          {/* Placeholder para outras configurações gerais */}
          <div className="flex items-center justify-center h-24 bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>Outras opções gerais (ex: Idioma) aqui.</p>
            </div>
          </div>
        </div>
      );
    }

    // Conteúdo padrão para outras páginas (Segurança, Notificações)
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Settings className="w-6 h-6 mx-auto mb-2" />
          <p>Conteúdo de {title} será implementado aqui.</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">{title}</CardTitle>
        <CardDescription className="dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default GenericSettings;