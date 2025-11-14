"use client";

import React from 'react';
import MainHeader from '@/components/MainHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, Check, FileText, Image } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Histórico de Manutenções</h2>
            <p className="text-gray-600 dark:text-gray-400">Consulte todo o histórico de manutenções realizadas</p>
          </div>
          <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="period" className="dark:text-gray-300">Período:</Label>
            <select
              id="period"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="all">Todo período</option>
              <option value="last-month">Último mês</option>
              <option value="last-3-months">Últimos 3 meses</option>
              <option value="last-6-months">Últimos 6 meses</option>
              <option value="last-year">Último ano</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="maintenance-type" className="dark:text-gray-300">Tipo:</Label>
            <select
              id="maintenance-type"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Todos os tipos</option>
              <option value="oil">Troca de Óleo</option>
              <option value="revision">Revisão</option>
              <option value="tire">Pneus</option>
              <option value="brake">Freios</option>
              <option value="other">Outros</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="search-history" className="dark:text-gray-300">Buscar:</Label>
            <Input
              id="search-history"
              type="text"
              placeholder="Pesquisar no histórico..."
              className="w-64 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Linha do Tempo das Manutenções</h3>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Alinhamento e Balanceamento</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">28/11/2024</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm dark:text-gray-300">
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Quilometragem</p>
                        <p className="text-gray-900 dark:text-white">87.200 km</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Custo</p>
                        <p className="text-gray-900 dark:text-white">R$ 120,00</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                        <p className="text-gray-900 dark:text-white">Pneus & Cia</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Garantia</p>
                        <p className="text-gray-900 dark:text-white">3 meses</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">
                      Serviço realizado com sucesso. Pneus em bom estado, não necessitando troca.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Ver Nota
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <Image className="w-4 h-4 mr-1" />
                        Fotos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white}>Troca de Óleo e Filtro</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">15/10/2024</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm dark:text-gray-300">
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Quilometragem</p>
                        <p className="text-gray-900 dark:text-white">82.500 km</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Custo</p>
                        <p className="text-gray-900 dark:text-white">R$ 165,00</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                        <p className="text-gray-900 dark:text-white">Auto Center Silva</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Próxima Troca</p>
                        <p className="text-gray-900 dark:text-white">87.500 km</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">
                      Óleo 5W30 sintético, filtro de óleo e ar trocados. Motor funcionando perfeitamente.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Ver Nota
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <Image className="w-4 h-4 mr-1" />
                        Fotos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Timeline Item 3 */}
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white}>Revisão dos 80.000 km</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">20/08/2024</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm dark:text-gray-300">
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Quilometragem</p>
                        <p className="text-gray-900 dark:text-white">80.000 km</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Custo</p>
                        <p className="text-gray-900 dark:text-white">R$ 780,00</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                        <p className="text-gray-900 dark:text-white">Concessionária Honda</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Garantia</p>
                        <p className="text-gray-900 dark:text-white">12 meses</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">
                      Revisão completa realizada. Trocadas velas de ignição, filtros, óleo e verificação geral dos sistemas.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Ver Nota
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <Image className="w-4 h-4 mr-1" />
                        Fotos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Timeline Item 4 (No line below it) */}
              <div className="relative">
                <div className="relative flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white}>Troca de Pastilhas de Freio</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">10/06/2024</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm dark:text-gray-300">
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Quilometragem</p>
                        <p className="text-gray-900 dark:text-white">75.200 km</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Custo</p>
                        <p className="text-gray-900 dark:text-white">R$ 320,00</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                        <p className="text-gray-900 dark:text-white">Freios Express</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium dark:text-gray-400">Garantia</p>
                        <p className="text-gray-900 dark:text-white">6 meses</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">
                      Pastilhas dianteiras e traseiras trocadas. Discos em bom estado, apenas usinados.
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Ver Nota
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <Image className="w-4 h-4 mr-1" />
                        Fotos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-center dark:text-white">Gasto Total</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-blue-600">R$ 1.385</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Últimos 12 meses</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-center dark:text-white">Manutenções Realizadas</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-green-600">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Últimos 12 meses</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-center dark:text-white">Média por Mês</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-orange-600">R$ 115</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Últimos 12 meses</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;