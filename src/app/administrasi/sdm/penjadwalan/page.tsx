
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  PlusCircle,
  BarChart2,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts';
import { ScheduleForm } from './schedule-form';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { User } from '@/lib/types';


const mockScheduleData = [
  { employee: 'Rifki Andrean', shifts: ['S1', 'S1', 'S1', 'S1', 'S1', 'L', 'L'] },
  { employee: 'Thoriq', shifts: ['S2', 'S2', 'S2', 'S2', 'S2', 'L', 'L'] },
  { employee: 'John Doe', shifts: ['S1', 'S1', 'L', 'L', 'S1', 'S1', 'S2'] },
  { employee: 'Jane Smith', shifts: ['L', 'L', 'S2', 'S2', 'S2', 'S2', 'L'] },
  { employee: 'Michael B.', shifts: ['S3', 'S3', 'S3', 'L', 'L', 'S3', 'S3'] },
];

const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const attendanceStats = [
  { type: 'Hadir', value: 98.5, fill: 'hsl(var(--chart-2))' },
  { type: 'Sakit', value: 0.8, fill: 'hsl(var(--chart-4))' },
  { type: 'Izin', value: 0.5, fill: 'hsl(var(--chart-5))' },
  { type: 'Alpa', value: 0.2, fill: 'hsl(var(--destructive))' },
];

const chartConfig: ChartConfig = {
  value: { label: 'Persentase' },
  Hadir: { label: 'Hadir', color: 'hsl(var(--chart-2))' },
  Sakit: { label: 'Sakit', color: 'hsl(var(--chart-4))' },
  Izin: { label: 'Izin', color: 'hsl(var(--chart-5))' },
  Alpa: { label: 'Alpa', color: 'hsl(var(--destructive))' },
};

export default function SchedulingPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { firestore } = useFirebase();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('email'));
  }, [firestore]);

  const { data: users, isLoading: usersLoading } = useCollection<User>(usersQuery);

  const getShiftClass = (shift: string) => {
    if (shift === 'S1') return 'bg-blue-200 text-blue-800';
    if (shift === 'S2') return 'bg-yellow-200 text-yellow-800';
    if (shift === 'S3') return 'bg-indigo-200 text-indigo-800';
    if (shift === 'L') return 'bg-gray-200 text-gray-600';
    return '';
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Penjadwalan Kerja">
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Atur Jadwal Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Atur Jadwal Baru</DialogTitle>
                <DialogDescription>
                    Pilih karyawan, rentang tanggal, dan shift untuk membuat jadwal kerja.
                </DialogDescription>
            </DialogHeader>
            <ScheduleForm users={users || []} onScheduleCreated={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Jadwal Shift Mingguan
                </CardTitle>
                <CardDescription>
                  Jadwal kerja untuk periode 25 - 31 Agustus 2024.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Karyawan</TableHead>
                  {daysOfWeek.map((day) => (
                    <TableHead key={day} className="text-center">
                      {day}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockScheduleData.map((item) => (
                  <TableRow key={item.employee}>
                    <TableCell className="font-medium">{item.employee}</TableCell>
                    {item.shifts.map((shift, index) => (
                      <TableCell key={index} className="text-center">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'w-8 h-8 flex items-center justify-center font-bold',
                            getShiftClass(shift)
                          )}
                        >
                          {shift}
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="font-semibold">Legenda:</span>
              <span className="flex items-center gap-2">
                <Badge className={cn('font-bold', getShiftClass('S1'))}>S1</Badge>{' '}
                Shift 1 (07:00-15:00)
              </span>
              <span className="flex items-center gap-2">
                <Badge className={cn('font-bold', getShiftClass('S2'))}>S2</Badge>{' '}
                Shift 2 (15:00-23:00)
              </span>
              <span className="flex items-center gap-2">
                <Badge className={cn('font-bold', getShiftClass('S3'))}>S3</Badge>{' '}
                Shift 3 (23:00-07:00)
              </span>
              <span className="flex items-center gap-2">
                <Badge className={cn('font-bold', getShiftClass('L'))}>L</Badge>{' '}
                Libur
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 md:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Statistik Kehadiran
              </CardTitle>
              <CardDescription>Ringkasan kehadiran bulan ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-[180px]">
                <RechartsBarChart
                  accessibilityLayer
                  data={attendanceStats}
                  layout="vertical"
                  margin={{ left: 10 }}
                >
                  <YAxis
                    dataKey="type"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar dataKey="value" layout="vertical" radius={5}>
                    {attendanceStats.map((entry) => (
                      <Clock key={entry.type} fill={entry.fill} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tukar Shift</CardTitle>
              <CardDescription>
                Permintaan tukar shift yang menunggu persetujuan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-sm text-muted-foreground py-6">
                Tidak ada permintaan tukar shift saat ini.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
