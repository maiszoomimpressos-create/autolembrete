import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle, Wrench } from 'lucide-react';
import { MaintenanceRecord } from '@/types/maintenance';

interface MaintenanceTableProps {
  records: MaintenanceRecord[];
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
  onComplete?: (record: MaintenanceRecord) => void; // Nova prop
}

const getStatusVariant = (status: MaintenanceRecord['status']) => {
  switch (status) {
    case 'Concluído':
      return 'default';
    case 'Pendente':
      return 'destructive';
    case 'Agendado':
      return 'secondary';
    default:
      return 'outline';
  }
};

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ records, onEdit, onDelete, onComplete }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Wrench className="w-12 h-12 mx-auto mb-4" />
        <p className="text-lg font-semibold">Nenhum registro de manutenção encontrado.</p>
        <p>Adicione sua primeira manutenção para começar a gerenciar seu histórico.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[150px]">Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Custo</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[150px] text-right">Ações</TableHead> {/* Aumentando a largura para acomodar o botão */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <TableCell className="font-medium">{record.date}</TableCell>
              <TableCell>
                {record.type === 'Outro' && record.customType 
                  ? record.customType 
                  : record.type}
              </TableCell>
              <TableCell className="max-w-xs truncate">{record.description}</TableCell>
              <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                {record.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getStatusVariant(record.status)} className="min-w-[80px] justify-center">
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {record.status !== 'Concluído' && onComplete && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onComplete(record)}
                      title="Marcar como Concluído"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(record.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceTable;