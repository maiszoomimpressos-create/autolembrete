import { useMemo } from 'react';
import { useServiceTypesQuery, ServiceType } from '@/integrations/supabase/serviceTypes';
import { MaintenanceRecord } from '@/types/maintenance';

// Tipos de serviço comuns que devem estar sempre disponíveis
const COMMON_SERVICE_TYPES: MaintenanceRecord['type'][] = [
    'Troca de Óleo', 
    'Revisão Geral', 
    'Pneus', 
    'Freios',
];

export const useServiceTypes = () => {
    const { data: customTypes = [], isLoading, error } = useServiceTypesQuery();

    const baseServiceTypes = useMemo(() => {
        const types = [...COMMON_SERVICE_TYPES];
        
        // Adiciona tipos personalizados, evitando duplicatas
        customTypes.forEach(type => {
            if (!types.includes(type.name as MaintenanceRecord['type'])) {
                types.push(type.name as MaintenanceRecord['type']);
            }
        });
        
        return types;
    }, [customTypes]);
    
    const allServiceTypesWithOther = useMemo(() => {
        // Adiciona a opção 'Outro' por último
        return [...baseServiceTypes, 'Outro'];
    }, [baseServiceTypes]);

    return {
        baseServiceTypes, // Tipos comuns + personalizados (sem 'Outro')
        allServiceTypes: allServiceTypesWithOther, // Tipos comuns + personalizados + 'Outro'
        isLoading,
        error,
        customTypes,
    };
};