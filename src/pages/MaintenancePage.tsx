"use client";

import React, { useState } from 'react';
import MainHeader from '@/components/MainHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, OilCan, Car, Check, Pencil, Eye, Disc } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { MaintenanceForm } from '@/components/MaintenanceForm';
import MaintenanceEditDialog from '@/components/MaintenanceEditDialog';
import { format } from 'date-fns';

// Mock type for a maintenance record
interface MaintenanceRecord {
  id: string;
  type: 'oil' | 'revision' | 'tire' | 'brake' | 'other';
  title: string;
  date: string; // ISO date string
  mileage: number;
  cost: number;
  workshop: string;
  notes: string;
  status: 'pending' | 'scheduled' | 'completed';
  urgency: 'Urgente' | 'Atenção' | 'Normal';
}

const initialMaintenanceData: MaintenanceRecord[] = [
  {
    id: 'm1',
    type: 'oil',
    title: 'Troca de Óleo e Filtro',
    date: '2024-12-15',
    mileage: 90000,
    cost: 180.00,
    workshop: 'Auto Center Silva',
    notes: 'Verificar também o filtro de ar e nível do fluido de freio.',
    status: 'pending',
    urgency: 'Urgente',
  },
  {
    id: 'm2',
    type: 'revision',
    title: 'Revisão dos 90.000 km',
    date: '2024-12-20',
    mileage: 90000,
    cost: 850.00,
    workshop: 'Concessionária Honda',
    notes: 'Revisão completa incluindo troca de velas, filtros e verificação geral.',
    status: 'scheduled',
    urgency: 'Atenção',
  },
  {
    id: 'm3',
    type: 'tire',
    title: 'Alinhamento e Balanceamento',
    date: '2024-11-28',
    mileage: 87200,
    cost: 120.00,
    workshop: 'Pneus & Cia',
    notes: 'Serviço realizado com sucesso. Pneus em bom estado.',
    status: 'completed',
    urgency: 'Normal',
  },
];

const getIcon = (type: MaintenanceRecord['type']) => {
  switch (type) {
    case 'oil':
      return OilCan;
    case 'revision':
      return Car;
    case 'tire':
      return Disc;
    default:
      return Check;
  }
};

const getUrgencyClasses = (urgency: MaintenanceRecord['urgency']) => {
  switch (urgency) {
    case 'Urgente':
      return {
        badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
        iconBg: 'bg-orange-100 dark:bg-orange-900/20',
        iconColor: 'text-orange-600',
      };
    case 'Atenção':
      return {
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        iconColor: 'text-blue-600',
      };
    case 'Normal':
    case 'completed':
    default:
      return {
        badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        iconBg: 'bg-green-100 dark:bg-green-900/20',
        iconColor: 'text-green-600',
      };
  }
};

const MaintenancePage: React.FC = () => {
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRecord[]>(initialMaintenanceData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<MaintenanceRecord | null>(null);

  const handleAddMaintenance = (data: any) => {
    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(), // Simple unique ID
      title: data.workshop + ' - ' + data.type, // Simplified title generation
      date: format(data.date, 'yyyy-MM-dd'),
      mileage: data.mileage,
      cost: data.cost,
      workshop: data.workshop,
      notes: data.notes,
      type: data.type,
      status: 'scheduled', // Default status for new items
      urgency: 'Normal', // Default urgency
    };
    setMaintenanceList([newRecord, ...maintenanceList]);
    setIsAddDialogOpen(false);
  };

  const handleEditClick = (maintenance: MaintenanceRecord) => {
    setEditingMaintenance(maintenance);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (updatedData: MaintenanceRecord) => {
    setMaintenanceList(maintenanceList.map(m => m.id === updatedData.id ? updatedData : m));
    setEditingMaintenance(null);
  };

  const handleMarkAsCompleted = (id: string) => {
    setMaintenanceList(maintenanceList.map(m => 
      m.id === id ? { ...m, status: 'completed', urgency: 'Normal' } : m
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Lista de Manutenções</h2>
            <p className="text-gray-600 dark:text-gray-400">Gerencie todas as manutenções do seu veículo</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Nova Manutenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="dark:text-white">Adicionar Nova Manutenção</DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Preencha os detalhes da manutenção que você precisa agendar ou registrar.
                </DialogDescription>
              </DialogHeader>
              <MaintenanceForm onSubmit={handleAddMaintenance} />
            </DialogContent>
          </Dialog>
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
          {maintenanceList.map((maintenance) => {
            const Icon = getIcon(maintenance.type);
            const { badge, iconBg, iconColor } = getUrgencyClasses(maintenance.status === 'completed' ? 'completed' : maintenance.urgency);
            const dateDisplay = format(new Date(maintenance.date), 'dd/MM/yyyy');

            return (
              <Card key={maintenance.id} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{maintenance.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {maintenance.status === 'completed' ? `Concluído em ${dateDisplay}` : `Previsto para ${dateDisplay}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 flex-wrap gap-2 sm:gap-3">
                      <Badge className={badge}>
                        {maintenance.status === 'completed' ? 'Concluído' : maintenance.urgency}
                      </Badge>
                      {maintenance.status !== 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer whitespace-nowrap !rounded-button text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-900/20"
                          onClick={() => handleMarkAsCompleted(maintenance.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Concluir
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="cursor-pointer whitespace-nowrap !rounded-button dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
                        onClick={() => handleEditClick(maintenance)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
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
                      <p className="text-gray-900 dark:text-white">{maintenance.mileage.toLocaleString('pt-BR')} km</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium dark:text-gray-400">Custo {maintenance.status === 'completed' ? 'Real' : 'Estimado'}</p>
                      <p className="text-gray-900 dark:text-white">R$ {maintenance.cost.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium dark:text-gray-400">Oficina</p>
                      <p className="text-gray-900 dark:text-white">{maintenance.workshop}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Observações:</strong> {maintenance.notes}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      
      {/* Edit Dialog */}
      <MaintenanceEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        maintenance={editingMaintenance}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MaintenancePage;