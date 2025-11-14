import { useMemo } from 'react';
import { useServiceTypesQuery, ServiceType } from '@/integrations/supabase/serviceTypes';
import { MaintenanceRecord } from '@/types/maintenance';

// Tipos de serviço padrão que não podem ser removidos
const DEFAULT_SERVICE_TYPES: MaintenanceRecord['type'][] = [
    'Troca de Óleo', 
    'Revisão Geral', 
    'Pneus', 
    'Freios'
];

export const useServiceTypes = () => {
    const { data: customTypes = [], isLoading, error } = useServiceTypesQuery();

    const allServiceTypes = useMemo(() => {
        // 1. Adiciona os tipos padrão
        const types: string[] = [...DEFAULT_SERVICE_TYPES];
        
        // 2. Adiciona os tipos personalizados
        customTypes.forEach(type => {
            if (!types.includes(type.name)) {
                types.push(type.name);
            }
        });
        
        // 3. Adiciona a opção 'Outro' por último
        types.push('Outro');
        
        return types;
    }, [customTypes]);

    return {
        allServiceTypes,
        isLoading,
        error,
        customTypes,
    };
};