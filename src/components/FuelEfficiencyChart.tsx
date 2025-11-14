import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFuelingChartData } from '@/hooks/useFuelingChartData';
import { FuelingRecord } from '@/types/fueling';

interface FuelEfficiencyChartProps {
  fuelingRecords: FuelingRecord[];
}

const FuelEfficiencyChart: React.FC<FuelEfficiencyChartProps> = ({ fuelingRecords }) => {
  const data = useFuelingChartData(fuelingRecords);

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold dark:text-white">Eficiência de Combustível (km/l)</CardTitle>
      </CardHeader>
      <CardContent className="h-80 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
            <YAxis 
              stroke="hsl(var(--foreground))" 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value} km/l`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))', 
                borderRadius: '0.5rem' 
              }}
              formatter={(value: number | null) => [value !== null ? `${value} km/l` : 'N/A', 'Eficiência']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FuelEfficiencyChart;