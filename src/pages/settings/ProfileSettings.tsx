import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ProfileSettings: React.FC = () => {
  return (
    <Card className="shadow-none border-none dark:bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl dark:text-white">Perfil</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Atualize suas informações pessoais e endereço de e-mail.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" defaultValue="João da Silva" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="joao.silva@exemplo.com" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;