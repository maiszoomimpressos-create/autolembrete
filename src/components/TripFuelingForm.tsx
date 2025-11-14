import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelingRecord } from '@/types/fueling';
import { Plus, Trash2, Gauge, TrendingUp } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useVehicle } from '@/hooks/useVehicle';

// Tipo auxiliar para o estado do formulário de viagem
interface TripRecord extends Omit<FuelingRecord, 'id' | 'vehicleId'> {}

interface TripFuelingFormProps {
  onSubmit: (data: Omit<FuelingRecord, 'id'>) => void;
  onCancel: () => void;
}

// Helper function to calculate efficiency for a single segment
const calculateEfficiency = (distance: number, volume: number): number | null => {
    if (distance > 0 && volume > 0) {
        return parseFloat((distance / volume).toFixed(2));
    }
    return null;
};

const TripFuelingForm: React.FC<TripFuelingFormProps> = ({ onSubmit, onCancel }) => {
  const { vehicle: activeVehicle } = useVehicle(); // Obter veículo ativo
  const [initialMileage, setInitialMileage] = useState<number>(0); // KM Inicial da Viagem
  const [tripRecords, setTripRecords] = useState<TripRecord[]>([
    // Começa com um registro vazio
    {
      date: new Date().toISOString().split('T')[0],
      mileage: 0,
      fuelType: 'Gasolina Comum',
      volumeLiters: 0,
      costPerLiter: 0,
      totalCost: 0,
      station: '',
    },
  ]);

  // Cálculo de Métricas da Viagem
  const tripMetrics = useMemo(() => {
    let totalDistance = 0;
    let totalVolume = 0;
    let totalCost = 0;
    let previousMileage = initialMileage;
    
    if (initialMileage > 0) {
        tripRecords.forEach(record => {
            if (record.mileage > previousMileage) {
                totalDistance += (record.mileage - previousMileage);
                totalVolume += record.volumeLiters;
                totalCost += record.totalCost;
                previousMileage = record.mileage;
            }
        });
    }

    const averageEfficiency = totalDistance > 0 && totalVolume > 0 
        ? parseFloat((totalDistance / totalVolume).toFixed(2)) 
        : null;

    return {
        totalDistance,
        totalVolume,
        totalCost,
        averageEfficiency,
    };
  }, [initialMileage, tripRecords]);


  const handleAddRecord = () => {
    // Sugere o KM final do último abastecimento como KM inicial para o novo registro
    const lastMileage = tripRecords[tripRecords.length - 1]?.mileage || initialMileage;
    
    setTripRecords(prev => [
      ...prev,
      {
        date: new Date().toISOString().split('T')[0],
        mileage: lastMileage, // Sugere o último KM conhecido
        fuelType: 'Gasolina Comum',
        volumeLiters: 0,
        costPerLiter: 0,
        totalCost: 0,
        station: '',
      },
    ]);
  };

  const handleRemoveRecord = (index: number) => {
    if (tripRecords.length > 1) {
      setTripRecords(prev => prev.filter((_, i) => i !== index));
    } else {
      showError("Pelo menos um registro de abastecimento é necessário.");
    }
  };

  const calculateTotalCost = (liters: number, costPerL: number) => {
    return parseFloat((liters * costPerL).toFixed(2));
  };
  
  const calculateCostPerLiter = (totalCost: number, liters: number) => {
    if (liters > 0) {
      return parseFloat((totalCost / liters).toFixed(2));
    }
    return 0;
  };

  const handleChange = (index: number, id: keyof TripRecord, value: string | number) => {
    setTripRecords(prev => {
      const newRecords = [...prev];
      let record = newRecords[index];

      if (id === 'mileage') {
        record.mileage = parseInt(value as string) || 0;
      } else if (id === 'volumeLiters' || id === 'costPerLiter') {
        const liters = id === 'volumeLiters' ? parseFloat(value as string) || 0 : record.volumeLiters;
        const costPerL = id === 'costPerLiter' ? parseFloat(value as string) || 0 : record.costPerLiter;
        
        record.volumeLiters = liters;
        record.costPerLiter = costPerL;
        record.totalCost = calculateTotalCost(liters, costPerL);
      } else if (id === 'totalCost') {
        const total = parseFloat(value as string) || 0;
        const liters = record.volumeLiters;
        
        record.totalCost = total;
        record.costPerLiter = calculateCostPerLiter(total, liters);
      } else if (id === 'fuelType' || id === 'station' || id === 'date') {
        (record as any)[id] = value;
      }

      return newRecords;
    });
  };

  const handleInitialMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialMileage(parseInt(e.target.value) || 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeVehicle.id === '') {
        showError("Por favor, cadastre um veículo antes de registrar o abastecimento.");
        return;
    }

    // Validação de KM Inicial
    if (initialMileage <= 0) {
        showError("Por favor, insira a Quilometragem Inicial da Viagem.");
        return;
    }
    
    let previousMileage = initialMileage;
    let isValid = true;

    tripRecords.forEach((r, index) => {
        // Validação de KM crescente e campos obrigatórios
        if (r.mileage <= previousMileage || r.volumeLiters <= 0 || r.totalCost <= 0) {
            isValid = false;
        }
        previousMileage = r.mileage;
    });

    if (!isValid) {
      showError("Verifique se todos os abastecimentos têm KM final maior que o anterior, Litros e Custo Total preenchidos.");
      return;
    }

    // Submete cada registro individualmente
    tripRecords.forEach(record => {
      onSubmit({
          ...record,
          vehicleId: activeVehicle.id, // Adiciona o ID do veículo
      });
    });

    showSuccess(`Viagem registrada! ${tripRecords.length} abastecimentos adicionados. Eficiência média: ${tripMetrics.averageEfficiency} km/l.`);
    onCancel();
  };
  
  if (activeVehicle.id === '') {
      return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/10 dark:border-red-900">
              <p className="text-sm text-red-600 dark:text-red-400">
                  ⚠️ Nenhum veículo ativo encontrado. Por favor, cadastre um veículo em Configurações.
              </p>
          </div>
      );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Adicione todos os abastecimentos realizados durante a sua viagem. Eles serão registrados individualmente.
      </p>

      {/* KM Inicial da Viagem */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 p-4">
        <CardTitle className="text-base mb-2 dark:text-white flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span>KM Inicial da Viagem</span>
        </CardTitle>
        <div className="space-y-2">
            <Label htmlFor="initialMileage">Quilometragem no início da viagem</Label>
            <Input
                id="initialMileage"
                type="number"
                value={initialMileage}
                onChange={handleInitialMileageChange}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                min={0}
            />
        </div>
      </Card>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {tripRecords.map((record, index) => {
          const previousMileage = index === 0 ? initialMileage : tripRecords[index - 1].mileage;
          const distance = record.mileage - previousMileage;
          const efficiency = calculateEfficiency(distance, record.volumeLiters);
          
          return (
            <Card key={index} className="dark:bg-gray-800 dark:border-gray-700 relative p-4">
              <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base dark:text-white">
                  Abastecimento #{index + 1}
                </CardTitle>
                {tripRecords.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button"
                    onClick={() => handleRemoveRecord(index)}
                    className="text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0 grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor={`date-${index}`}>Data</Label>
                  <Input
                    id={`date-${index}`}
                    type="date"
                    value={record.date}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`mileage-${index}`}>KM Final (Odomêtro)</Label>
                  <Input
                    id={`mileage-${index}`}
                    type="number"
                    value={record.mileage}
                    onChange={(e) => handleChange(index, 'mileage', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                    min={previousMileage + 1}
                  />
                  {initialMileage > 0 && record.mileage > 0 && record.mileage <= previousMileage && (
                    <p className="text-xs text-red-500">O KM deve ser maior que o KM anterior ({previousMileage.toLocaleString('pt-BR')}).</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`station-${index}`}>Posto</Label>
                  <Input
                    id={`station-${index}`}
                    type="text"
                    value={record.station}
                    onChange={(e) => handleChange(index, 'station', e.target.value)}
                    placeholder="Nome do posto"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor={`fuelType-${index}`}>Combustível</Label>
                  <Select
                    value={record.fuelType}
                    onValueChange={(value) => handleChange(index, 'fuelType', value as FuelingRecord['fuelType'])}
                  >
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {['Gasolina Comum', 'Gasolina Aditivada', 'Etanol', 'Diesel'].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`volumeLiters-${index}`}>Litros</Label>
                  <Input
                    id={`volumeLiters-${index}`}
                    type="number"
                    step="0.01"
                    value={record.volumeLiters}
                    onChange={(e) => handleChange(index, 'volumeLiters', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`costPerLiter-${index}`}>Custo/L (R$)</Label>
                  <Input
                    id={`costPerLiter-${index}`}
                    type="number"
                    step="0.01"
                    value={record.costPerLiter}
                    onChange={(e) => handleChange(index, 'costPerLiter', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor={`totalCost-${index}`}>Custo Total (R$)</Label>
                  <Input
                    id={`totalCost-${index}`}
                    type="number"
                    step="0.01"
                    value={record.totalCost}
                    onChange={(e) => handleChange(index, 'totalCost', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                
                {/* Exibição da Eficiência */}
                <div className="col-span-2 pt-2 border-t border-dashed dark:border-gray-700 mt-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {index === 0 ? 'Distância Percorrida (desde o início):' : 'Distância Percorrida (desde o último abastecimento):'}
                    </p>
                    <p className="text-lg font-bold dark:text-white">
                        {distance > 0 ? `${distance.toLocaleString('pt-BR')} km` : 'Aguardando KM final...'}
                    </p>
                    {efficiency !== null && (
                        <p className="text-md font-semibold text-blue-600 dark:text-blue-400 mt-1">
                            Consumo Estimado: {efficiency} km/l
                        </p>
                    )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button 
        type="button" 
        variant="outline" 
        onClick={handleAddRecord} 
        className="w-full dark:hover:bg-gray-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Outro Abastecimento
      </Button>
      
      {/* Resumo da Viagem */}
      {tripMetrics.totalDistance > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700 p-4 border-l-4 border-blue-500">
            <CardTitle className="text-base mb-2 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Resumo da Viagem</span>
            </CardTitle>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-500 dark:text-gray-400">Distância Total:</p>
                <p className="font-semibold text-right dark:text-white">{tripMetrics.totalDistance.toLocaleString('pt-BR')} km</p>
                
                <p className="text-gray-500 dark:text-gray-400">Custo Total:</p>
                <p className="font-semibold text-right dark:text-white">
                    {tripMetrics.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                
                <p className="text-gray-500 dark:text-gray-400 font-bold">Eficiência Média:</p>
                <p className="font-bold text-right text-blue-600 dark:text-blue-400">
                    {tripMetrics.averageEfficiency !== null ? `${tripMetrics.averageEfficiency} km/l` : 'N/A'}
                </p>
            </div>
        </Card>
      )}

      <Button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
        Registrar Viagem ({tripRecords.length} Abastecimentos)
      </Button>
    </form>
  );
};

export default TripFuelingForm;