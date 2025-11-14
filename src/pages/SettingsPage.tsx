"use client";

import React, { useState, useEffect } from 'react';
import MainHeader from '@/components/MainHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Car,
  Bell,
  Shield,
  Camera,
  Key,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Configurações</h2>
          <p className="text-gray-600 dark:text-gray-400">Gerencie suas preferências e informações da conta</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800 dark:border-gray-700">
            <TabsTrigger value="profile" className="cursor-pointer dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="vehicle" className="cursor-pointer dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white">
              <Car className="w-4 h-4 mr-2" />
              Veículo
            </TabsTrigger>
            <TabsTrigger value="notifications" className="cursor-pointer dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="cursor-pointer dark:data-[state=active]:bg-blue-700 dark:data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Informações Pessoais</CardTitle>
                <CardDescription className="dark:text-gray-400">Atualize seus dados pessoais e informações de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xl">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      <Camera className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </Button>
                    <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">JPG, PNG ou GIF (máx. 2MB)</p>
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="dark:text-gray-300">Nome</Label>
                    <Input
                      id="firstName"
                      defaultValue="João"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="dark:text-gray-300">Sobrenome</Label>
                    <Input
                      id="lastName"
                      defaultValue="Silva"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="joao.silva@email.com"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="dark:text-gray-300">Telefone</Label>
                    <Input
                      id="phone"
                      defaultValue="(11) 99999-9999"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="dark:text-gray-300">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      defaultValue="1985-06-15"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="dark:text-gray-300">Cidade</Label>
                    <Input
                      id="city"
                      defaultValue="São Paulo, SP"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">
                    Cancelar
                  </Button>
                  <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="vehicle" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Informações do Veículo</CardTitle>
                <CardDescription className="dark:text-gray-400">Mantenha os dados do seu veículo atualizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="dark:text-gray-300">Marca</Label>
                    <Input
                      id="brand"
                      defaultValue="Honda"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model" className="dark:text-gray-300">Modelo</Label>
                    <Input
                      id="model"
                      defaultValue="Civic"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year" className="dark:text-gray-300">Ano</Label>
                    <Input
                      id="year"
                      defaultValue="2020"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plate" className="dark:text-gray-300">Placa</Label>
                    <Input
                      id="plate"
                      defaultValue="ABC-1234"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color" className="dark:text-gray-300">Cor</Label>
                    <Input
                      id="color"
                      defaultValue="Prata"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel" className="dark:text-gray-300">Combustível</Label>
                    <select
                      id="fuel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      defaultValue="flex"
                    >
                      <option value="gasoline">Gasolina</option>
                      <option value="ethanol">Etanol</option>
                      <option value="flex">Flex</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Elétrico</option>
                      <option value="hybrid">Híbrido</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chassis" className="dark:text-gray-300">Chassi</Label>
                    <Input
                      id="chassis"
                      defaultValue="9BWZZZ377VT004251"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentKm" className="dark:text-gray-300">Quilometragem Atual</Label>
                    <Input
                      id="currentKm"
                      type="number"
                      defaultValue="87542"
                      className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Intervalos de Manutenção</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="oilInterval" className="dark:text-gray-300">Troca de Óleo (km)</Label>
                      <Input
                        id="oilInterval"
                        type="number"
                        defaultValue="5000"
                        className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revisionInterval" className="dark:text-gray-300">Revisão (km)</Label>
                      <Input
                        id="revisionInterval"
                        type="number"
                        defaultValue="10000"
                        className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">
                    Cancelar
                  </Button>
                  <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Preferências de Notificação</CardTitle>
                <CardDescription className="dark:text-gray-400">Configure como e quando você deseja receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium dark:text-white">Notificações por Email</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receba lembretes de manutenção por email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium dark:text-white">Notificações Push</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receba notificações no navegador</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium dark:text-white">SMS</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receba lembretes importantes por SMS</p>
                    </div>
                    <Switch />
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div>
                    <Label className="text-base font-medium mb-4 block dark:text-white">Tipos de Notificação</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium dark:text-gray-300">Manutenções Vencidas</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Alertas para manutenções em atraso</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium dark:text-gray-300">Manutenções Próximas</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Lembretes de manutenções futuras</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium dark:text-gray-300">Relatórios Mensais</Label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Resumo mensal de gastos e manutenções</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                  <Separator className="dark:bg-gray-700" />
                  <div>
                    <Label className="text-base font-medium mb-4 block dark:text-white">Antecedência dos Alertas</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="oilAlert" className="dark:text-gray-300">Troca de Óleo (dias)</Label>
                        <select
                          id="oilAlert"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                          defaultValue="7"
                        >
                          <option value="3">3 dias</option>
                          <option value="7">7 dias</option>
                          <option value="15">15 dias</option>
                          <option value="30">30 dias</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="revisionAlert" className="dark:text-gray-300">Revisão (dias)</Label>
                        <select
                          id="revisionAlert"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                          defaultValue="15"
                        >
                          <option value="7">7 dias</option>
                          <option value="15">15 dias</option>
                          <option value="30">30 dias</option>
                          <option value="60">60 dias</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer dark:text-white dark:border-gray-700 dark:hover:bg-gray-700">
                    Cancelar
                  </Button>
                  <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    Salvar Preferências
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Segurança da Conta</CardTitle>
                <CardDescription className="dark:text-gray-400">Gerencie a segurança e privacidade da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Alterar Senha</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="dark:text-gray-300">Senha Atual</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="dark:text-gray-300">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className="dark:text-gray-300">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmNewPassword"
                        type="password"
                        className="border-gray-300 focus:border-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                      <Key className="w-4 h-4 mr-2" />
                      Alterar Senha
                    </Button>
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Autenticação de Dois Fatores</h4>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium dark:text-white">Ativar 2FA</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Adicione uma camada extra de segurança à sua conta</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Sessões Ativas</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <Monitor className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        <div>
                          <p className="font-medium dark:text-white">Windows - Chrome</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">São Paulo, Brasil • Agora</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Atual</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        <div>
                          <p className="font-medium dark:text-white">iPhone - Safari</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">São Paulo, Brasil • 2 horas atrás</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20"
                      >
                        Encerrar
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator className="dark:bg-gray-700" />
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-500">Zona de Perigo</h4>
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:border-red-900 dark:bg-red-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900 dark:text-red-300">Excluir Conta</p>
                          <p className="text-sm text-red-700 dark:text-red-400">Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.</p>
                        </div>
                        <Button
                          variant="destructive"
                          className="cursor-pointer whitespace-nowrap !rounded-button"
                        >
                          Excluir Conta
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;