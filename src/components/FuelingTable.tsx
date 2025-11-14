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
import { Edit, Trash2, Fuel } from 'lucide-react';
import { FuelingRecord } from '@/types/fueling';

interface FuelingTableProps {
  records: FuelingRecord[];
  onEdit: (record: FuelingRecord) => void;
  onDelete: (id: string) => void;
}

const FuelingTable: React.FC<FuelingTableProps> = ({ records, onEdit, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Fuel className="w-12 h-12 mx-auto mb-4" />
        <p className="text-lg font-semibold">Nenhum registro de abastecimento encontrado.</p>
        <p>Adicione seu primeiro abastecimento para começar a monitorar o consumo.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[120px]">Data</TableHead>
            <TableHead>KM</TableHead>
            <TableHead>Tipo de Combustível</TableHead>
            <TableHead>Litros</TableHead>
            <TableHead className="text-right">Custo/L</TableHead>
            <TableHead className="text-right">Custo Total</TableHead>
            <TableHead>Posto</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <TableCell className="font-medium">{record.date}</TableCell>
              <TableCell>{record.mileage.toLocaleString('pt-BR')} km</TableCell>
              <TableCell>
                <Badge variant="secondary">{record.fuelType}</Badge>
              </TableCell>
              <TableCell>{record.volumeLiters.toFixed(2)} L</TableCell>
              <TableCell className="text-right">
                {record.costPerLiter.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                {record.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </TableCell>
              <TableCell>{record.station}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
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

export default FuelingTable;