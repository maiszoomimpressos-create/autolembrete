import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface GenericSettingsProps {
  title: string;
  description: string;
}

const GenericSettings: React.FC<GenericSettingsProps> = ({ title, description }) => {
  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">{title}</CardTitle>
        <CardDescription className="dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex items-center justify-center h-48 bg-gray-50 border border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <Settings className="w-6 h-6 mx-auto mb-2" />
            <p>Conteúdo de {title} será implementado aqui.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GenericSettings;