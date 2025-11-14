"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Save } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { showSuccess } from '@/utils/toast';
import FileUpload from './FileUpload'; // Import the new component

// Define the schema for maintenance data
const maintenanceSchema = z.object({
  type: z.enum(['oil', 'revision', 'tire', 'brake', 'other'], {
    required_error: "O tipo de manutenção é obrigatório.",
  }),
  date: z.date({
    required_error: "A data da manutenção é obrigatória.",
  }),
  mileage: z.number({
    required_error: "A quilometragem é obrigatória.",
    invalid_type_error: "A quilometragem deve ser um número.",
  }).min(1, "A quilometragem deve ser maior que zero."),
  cost: z.number({
    required_error: "O custo é obrigatório.",
    invalid_type_error: "O custo deve ser um número.",
  }).min(0, "O custo não pode ser negativo."),
  workshop: z.string().min(2, "O nome da oficina é obrigatório."),
  notes: z.string().optional(),
  // Simulated file data storage (e.g., URL or file name)
  invoiceUrl: z.string().optional(), 
});

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormProps {
  initialData?: Partial<MaintenanceFormValues>;
  onSubmit: (data: MaintenanceFormValues) => void;
  isEditing?: boolean;
}

const maintenanceTypes = [
  { value: 'oil', label: 'Troca de Óleo' },
  { value: 'revision', label: 'Revisão' },
  { value: 'tire', label: 'Pneus' },
  { value: 'brake', label: 'Freios' },
  { value: 'other', label: 'Outros' },
];

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      type: initialData.type || 'oil',
      date: initialData.date ? new Date(initialData.date) : new Date(),
      mileage: initialData.mileage || 0,
      cost: initialData.cost || 0,
      workshop: initialData.workshop || '',
      notes: initialData.notes || '',
      invoiceUrl: initialData.invoiceUrl || '', // Initialize invoiceUrl
    },
  });

  const handleSubmit = (data: MaintenanceFormValues) => {
    onSubmit(data);
    showSuccess(isEditing ? "Manutenção atualizada com sucesso!" : "Nova manutenção adicionada com sucesso!");
    if (!isEditing) {
      form.reset({
        type: 'oil',
        date: new Date(),
        mileage: 0,
        cost: 0,
        workshop: '',
        notes: '',
        invoiceUrl: '',
      });
    }
  };
  
  const handleFileUpload = (file: File) => {
    // Simulate storing the file URL/path in the form state
    form.setValue('invoiceUrl', `uploaded/invoice/${file.name}`, { shouldDirty: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Manutenção</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {maintenanceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Manutenção</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal dark:bg-gray-900 dark:border-gray-700 dark:text-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Selecione uma data</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quilometragem (km)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ex: 90000"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custo (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 180.00"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="workshop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oficina/Local</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Auto Center Silva"
                    {...field}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FileUpload
          label="Anexar Nota Fiscal (Opcional)"
          onFileUpload={handleFileUpload}
          acceptedFileTypes=".pdf, .jpg, .png"
        />
        
        {/* Hidden field to store the simulated file URL/path */}
        <FormField
          control={form.control}
          name="invoiceUrl"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes adicionais sobre a manutenção..."
                  {...field}
                  className="resize-none dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="!rounded-button whitespace-nowrap cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Salvar Alterações' : 'Adicionar Manutenção'}
          </Button>
        </div>
      </form>
    </Form>
  );
};