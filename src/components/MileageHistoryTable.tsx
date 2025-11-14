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
import { Gauge, Trash2 } from 'lucide-react';
import { MileageRecord } from '@/types/mileage';
import { Button } from '@/components/ui/button';

interface MileageHistoryTableProps {
  records: MileageRecord[];
  onDeleteManual: (id: string) => void; // Nova prop para exclusão
  isMutating: boolean;
}

const getSourceVariant = (source: MileageRecord['source']) => {
  switch (source) {
    case 'Manual':
      return 'default';
    case 'Fueling':
      return 'secondary';
    default:
      return 'outline';
  }
};

const MileageHistoryTable: React.FC<MileageHistoryTableProps> = ({ records, onDeleteManual, isMutating }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Gauge className="w-12 h-12 mx-auto mb-4" />
        <p className="text-lg font-semibold">Nenhum registro de quilometragem encontrado.</p>
        <p>Adicione um abastecimento ou registre o KM atual no Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border dark:border-gray-700 overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[150px]">Data</TableHead>
            <TableHead>Quilometragem (KM)</TableHead>
            <TableHead>Fonte</TableHead>
            <TableHead>Observação</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <TableCell className="font-medium">{record.date}</TableCell>
              <TableCell className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                {record.mileage.toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>
                <Badge variant={getSourceVariant(record.source)} className="min-w-[80px] justify-center">
                  {record.source === 'Manual' ? 'Manual' : 'Abastecimento'}
                </Badge>
              </TableCell>
              <TableCell>
                {record.source === 'Manual' 
                    ? 'Registro manual do odômetro.' 
                    : 'Registro obtido de um abastecimento.'}
              </TableCell>
              <TableCell className="text-right">
                {record.source === 'Manual' ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onDeleteManual(record.id)}
                    disabled={isMutating}
                    title="Excluir registro manual"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                ) : (
                  <span className="text-gray-400 dark:text-gray-600 text-xs">N/A</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MileageHistoryTable;