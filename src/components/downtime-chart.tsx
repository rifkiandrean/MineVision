
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'EX-01', downtime: 4.5 },
  { name: 'EX-02', downtime: 2.1 },
  { name: 'DT-101', downtime: 1.5 },
  { name: 'DT-102', downtime: 8.2 },
  { name: 'DZ-22', downtime: 0.5 },
  { name: 'GR-01', downtime: 3.0 },
];

export default function DowntimeChart() {
  return (
    <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
            <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
            />
            <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} jam`}
            />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))' 
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="downtime" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
