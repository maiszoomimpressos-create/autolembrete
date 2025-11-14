import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Car } from 'lucide-react';

const IndexPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = () => {
    // Simulate successful authentication
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(https://readdy.ai/api/search-image?query=modern%20automotive%20service%20garage%20with%20clean%20luxury%20cars%2C%20professional%20car%20maintenance%20workshop%20interior%2C%20bright%20lighting%20and%20organized%20tools%2C%20automotive%20service%20center%20background%20image%20for%20login%20page&width=1440&height=1024&seq=login-bg-1&orientation=landscape)'
      }}
    >
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60"></div>
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Car className="w-10 h-10 text-blue-400 drop-shadow-lg" />
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">CarManager</h1>
          </div>
          <p className="text-lg text-white drop-shadow-lg">
            Gerencie a manutenção do seu veículo de forma inteligente e eficiente
          </p>
        </div>
        <Card className="w-full bg-white/95 backdrop-blur-sm shadow-2xl dark:bg-gray-900/95 dark:text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              {isLogin ? 'Entrar na sua conta' : 'Criar nova conta'}
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {isLogin
                ? 'Acesse seu painel de controle automotivo'
                : 'Comece a gerenciar seu veículo hoje'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-300">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                className="border-gray-300 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <Button
              className="w-full !rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={handleAuth}
            >
              {isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
            <Separator className="dark:bg-gray-700" />
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              </p>
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap dark:text-blue-400 dark:hover:text-blue-500"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexPage;