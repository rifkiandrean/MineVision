'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Budget } from '@/lib/types';

interface BudgetChartProps {
  data: Budget[];
}

export default function BudgetChart({ data }: BudgetChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `Rp ${new Intl.NumberFormat('id-ID').format(value as number)}`
            }
          />
          <Tooltip
            formatter={(value, name) => [
              new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(value as number),
              name === 'budgeted' ? 'Anggaran' : 'Realisasi',
            ]}
          />
          <Legend
            formatter={(value) => (value === 'budgeted' ? 'Anggaran' : 'Realisasi')}
          />
          <Bar
            dataKey="budgeted"
            fill="hsl(var(--secondary))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="actual"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}