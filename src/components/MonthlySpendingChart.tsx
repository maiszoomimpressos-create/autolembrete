import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dados simulados de gastos mensais
const data = [
  { name: 'Jan', gastos: 400 },
  { name: 'Fev', gastos: 300 },
  { name: 'Mar', gastos: 2000 }, // Ex: Revisão grande
  { name: 'Abr', gastos: 278 },
  { name: 'Mai', gastos: 1890 }, // Ex: Troca de pneus
  { name: 'Jun', gastos: 239 },
  { name: 'Jul', gastos: 349 },
  { name: 'Ago', gastos: 0 },
  { name: 'Set', gastos: 0 },
  { name: 'Out', gastos: 0 },
  { name: 'Nov', gastos: 0 },
  { name: 'Dez', gastos: 0 },
];

const MonthlySpendingChart: React.FC = () => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold dark:text-white">Gastos Mensais de Manutenção (R$)</CardTitle>
      </CardHeader>
      <CardContent className="h-80 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
            <YAxis 
              stroke="hsl(var(--foreground))" 
              tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))', 
                borderRadius: '0.5rem' 
              }}
              formatter={(value: number) => [value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 'Gastos']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="gastos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlySpendingChart;