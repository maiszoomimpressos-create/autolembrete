"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { Car, Wrench, Calendar, Gauge, DollarSign, MapPin, FileText, OilCan } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the type for MaintenanceRecord (matching MaintenancePage)
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

interface MaintenanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: MaintenanceRecord | null;
}

const getStatusBadge = (status: MaintenanceRecord['status']) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-500 text-white dark:bg-green-700 dark:hover:bg-green-700">Concluído</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-500 hover:bg-blue-500 text-white dark:bg-blue-700 dark:hover:bg-blue-700">Agendado</Badge>;
    case 'pending':
    default:
      return <Badge className="bg-orange-500 hover:bg-orange-500 text-white dark:bg-orange-700 dark:hover:bg-orange-700">Pendente</Badge>;
  }
};

const getIcon = (type: MaintenanceRecord['type']) => {
  switch (type) {
    case 'oil':
      return OilCan;
    case 'revision':
      return Car;
    case 'tire':
      return Wrench; 
    case 'brake':
      return Wrench;
    case 'other':
    default:
      return Wrench;
  }
};

const MaintenanceDetailDialog: React.FC<MaintenanceDetailDialogProps> = ({ open, onOpenChange, maintenance }) => {
  if (!maintenance) return null;

  const Icon = getIcon(maintenance.type);
  const formattedDate = format(new Date(maintenance.date), 'dd/MM/yyyy');
  const formattedCost = `R$ ${maintenance.cost.toFixed(2).replace('.', ',')}`;
  const formattedMileage = `${maintenance.mileage.toLocaleString('pt-BR')} km`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] md:max-w-[600px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 dark:text-white">
            <Icon className="w-6 h-6 text-blue-600" />
            <span>{maintenance.title}</span>
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            Detalhes completos da manutenção registrada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
            {getStatusBadge(maintenance.status)}
          </div>
          
          <Separator className="dark:bg-gray-700" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DetailItem icon={Calendar} label="Data" value={formattedDate} />
            <DetailItem icon={Gauge} label="Quilometragem" value={formattedMileage} />
            <DetailItem icon={DollarSign} label={`Custo ${maintenance.status === 'completed' ? 'Real' : 'Estimado'}`} value={formattedCost} />
            <DetailItem icon={MapPin} label="Oficina/Local" value={maintenance.workshop} />
          </div>

          <Separator className="dark:bg-gray-700" />

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <p className="font-semibold text-gray-900 dark:text-white">Observações</p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 p-3 bg-gray-50 rounded-md border dark:bg-gray-900 dark:border-gray-700">
              {maintenance.notes || 'Nenhuma observação registrada.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for consistent detail display
const DetailItem: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <Icon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1 dark:text-blue-400" />
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase dark:text-gray-400">{label}</p>
      <p className="text-base font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

export default MaintenanceDetailDialog;