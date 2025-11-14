"use client";

import React from 'react';
import MainHeader from '@/components/MainHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  CalendarCheck,
  OilCan,
  LineChart,
  AlertTriangle,
  Car,
  Disc,
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Dashboard do Veículo</h2>
          <p className="text-gray-600 dark:text-gray-400">Acompanhe o status e as informações do seu carro</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white dark:from-blue-700 dark:to-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Quilometragem Atual</p>
                  <p className="text-3xl font-bold">87.542</p>
                  <p className="text-blue-100 text-xs">km rodados</p>
                </div>
                <Gauge className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium dark:text-gray-400">Próxima Revisão</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2.458 km</p>
                  <p className="text-green-600 text-xs font-medium">Em 15 dias</p>
                </div>
                <CalendarCheck className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium dark:text-gray-400">Troca de Óleo</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">1.200 km</p>
                  <p className="text-orange-600 text-xs font-medium">Em 8 dias</p>
                </div>
                <OilCan className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium dark:text-gray-400">Gasto Mensal</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 450</p>
                  <p className="text-red-600 text-xs font-medium">+12% vs mês anterior</p>
                </div>
                <LineChart className="w-10 h-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Alertas Próximos</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">Manutenções que precisam de atenção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500 dark:bg-orange-900/20 dark:border-orange-700">
                <div className="flex items-center space-x-3">
                  <OilCan className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Troca de Óleo</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vence em 8 dias</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Urgente</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-700">
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Revisão dos 90.000 km</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vence em 15 dias</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Atenção</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 dark:bg-blue-900/20 dark:border-blue-700">
                <div className="flex items-center space-x-3">
                  <Disc className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Verificação dos Pneus</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vence em 30 dias</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Normal</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                <Car className="w-5 h-5 text-blue-600" />
                <span>Informações do Veículo</span>
              </CardTitle>
              <CardDescription className="dark:text-gray-400">Dados principais do seu carro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-center mb-6">
                  <img
                    src="https://readdy.ai/api/search-image?query=modern%20sedan%20car%20side%20view%20on%20clean%20white%20background%2C%20professional%20automotive%20photography%2C%20sleek%20design%20vehicle%20illustration%2C%20minimalist%20car%20image&width=300&height=200&seq=car-profile-1&orientation=landscape"
                    alt="Seu Veículo"
                    className="w-full max-w-sm h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium dark:text-gray-400">Marca/Modelo</p>
                    <p className="text-gray-900 dark:text-white">Honda Civic 2020</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium dark:text-gray-400">Placa</p>
                    <p className="text-gray-900 dark:text-white">ABC-1234</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium dark:text-gray-400">Combustível</p>
                    <p className="text-gray-900 dark:text-white">Flex</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium dark:text-gray-400">Cor</p>
                    <p className="text-gray-900 dark:text-white">Prata</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium dark:text-gray-400">Ano</p>
                    <p className="text-gray-900 dark:text-white">2020/2021</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium dark:text-gray-400">Chassi</p>
                    <p className="text-gray-900 dark:text-white">***7890</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;