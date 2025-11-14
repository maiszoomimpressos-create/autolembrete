import React from 'react';
import MainHeader from '@/components/MainHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, OilCan, Car, Check, Pencil, Eye } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Lista de Manutenções</h2>
            <p className="text-gray-600 dark:text-gray-400">Gerencie todas as manutenções do seu veículo</p>
          </div>
          <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            <Plus className="w-4 h-4 mr-2" />
            Nova Manutenção
          </Button>
        </div>
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="filter-type" className="dark:text-gray-300">Tipo:</Label>
            <select
              id="filter-type"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="oil">Troca de Óleo</option>
              <option value="revision">Revisão</option>
              <option value="tire">Pneus</option>
              <option value="brake">Freios</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="filter-status" className="dark:text-gray-300">Status:</Label>
            <select
              id="filter-status"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">Todos</option>
              <option value="pending">Pendente</option>
              <option value="scheduled">Agendado</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="search" className="dark:text-gray-300">Buscar:</Label>
            <Input
              id="search"
              type="text"
              placeholder="Pesquisar manutenções..."
              className="w-64 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="grid gap-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center dark:bg-orange-900/20">
                    <OilCan className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Troca de Óleo e Filtro</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Prevista para 15/12/2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Urgente</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm dark:text-gray-300">
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Quilometragem</p>
                  <p className="text-gray-900 dark:text-white">90.000 km</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Custo Estimado</p>
                  <p className="text-gray-900 dark:text-white">R$ 180,00</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                  <p className="text-gray-900 dark:text-white">Auto Center Silva</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Observações:</strong> Verificar também o filtro de ar e nível do fluido de freio.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900/20">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revisão dos 90.000 km</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Agendada para 20/12/2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Agendado</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm dark:text-gray-300">
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Quilometragem</p>
                  <p className="text-gray-900 dark:text-white">90.000 km</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Custo Estimado</p>
                  <p className="text-gray-900 dark:text-white">R$ 850,00</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                  <p className="text-gray-900 dark:text-white">Concessionária Honda</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Observações:</strong> Revisão completa incluindo troca de velas, filtros e verificação geral.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center dark:bg-green-900/20">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alinhamento e Balanceamento</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Concluído em 28/11/2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Concluído</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detalhes
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm dark:text-gray-300">
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Quilometragem</p>
                  <p className="text-gray-900 dark:text-white">87.200 km</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Custo Real</p>
                  <p className="text-gray-900 dark:text-white">R$ 120,00</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                  <p className="text-gray-900 dark:text-white">Pneus & Cia</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Observações:</strong> Serviço realizado com sucesso. Pneus em bom estado.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MaintenancePage;