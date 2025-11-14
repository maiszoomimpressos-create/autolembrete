import { useMemo } from 'react';
import { useServiceTypesQuery, ServiceType } from '@/integrations/supabase/serviceTypes';
import { MaintenanceRecord } from '@/types/maintenance';

// Tipos de serviço padrão removidos. Agora, a lista é baseada apenas nos tipos personalizados.
const DEFAULT_SERVICE_TYPES: MaintenanceRecord['type'][] = [];

export const useServiceTypes = () => {
    const { data: customTypes = [], isLoading, error } = useServiceTypesQuery();

    const baseServiceTypes = useMemo(() => {
        // A lista base agora é composta apenas pelos tipos personalizados
        const types: string[] = [];
        
        customTypes.forEach(type => {
            if (!types.includes(type.name)) {
                types.push(type.name);
            }
        });
        
        return types;
    }, [customTypes]);
    
    const allServiceTypesWithOther = useMemo(() => {
        // Adiciona a opção 'Outro' por último
        return [...baseServiceTypes, 'Outro'];
    }, [baseServiceTypes]);

    return {
        baseServiceTypes, // Tipos personalizados (sem 'Outro')
        allServiceTypes: allServiceTypesWithOther, // Tipos personalizados + 'Outro'
        isLoading,
        error,
        customTypes,
    };
};