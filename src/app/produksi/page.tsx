
'use client';

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
  Truck,
  Layers,
  MapPin,
  AreaChart,
  Warehouse,
  CheckCircle2,
  Settings2,
  Wind,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const equipment = [
  { id: 'DT-101', type: 'Dump Truck', status: 'Operational', location: 'Pit-A', fuel: 85, productivity: 95 },
  { id: 'EX-05', type: 'Excavator', status: 'Maintenance', location: 'Workshop', fuel: 0, productivity: 0 },
  { id: 'DZ-22', type: 'Dozer', status: 'Operational', location: 'Waste Dump-B', fuel: 72, productivity: 88 },
  { id: 'WL-03', type: 'Wheel Loader', status: 'Idle', location: 'Stockpile-A', fuel: 91, productivity: 0 },
  { id: 'DT-102', type: 'Dump Truck', status: 'Breakdown', location: 'Haul Road 1', fuel: 45, productivity: 0 },
];

const stockpiles = [
    { name: 'ROM Stockpile A', grade: 'High', volume: 125000, capacity: 200000 },
    { name: 'ROM Stockpile B', grade: 'Medium', volume: 80000, capacity: 150000 },
    { name: 'Product Stockpile', grade: 'High (6300 GAR)', volume: 45000, capacity: 50000 },
]

export default function ProduksiPage() {

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'Operational': return 'default';
            case 'Maintenance': return 'destructive';
            case 'Breakdown': return 'destructive';
            case 'Idle': return 'secondary';
            default: return 'outline';
        }
    };
     const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'Operational': return 'bg-green-500/80';
            default: return '';
        }
    };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Operasi Produksi" />
      
      {/* Production Management */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Manajemen Produksi
            </CardTitle>
            <CardDescription>Pelacakan tonase dan kadar material yang ditambang secara real-time.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overburden (OB) Moved</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">52,800 BCM</div>
                    <p className="text-xs text-muted-foreground">Target harian: 60,000 BCM</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Coal Mined</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">15,750 Ton</div>
                    <p className="text-xs text-muted-foreground">Target harian: 18,000 Ton</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Strip Ratio (Actual)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">3.35 : 1</div>
                    <p className="text-xs text-muted-foreground">Plan: 3.50 : 1</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Coal Grade</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">6,280 GAR</div>
                    <p className="text-xs text-muted-foreground">Target: 6,300 GAR</p>
                </CardContent>
            </Card>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Fleet Management */}
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Manajemen Armada (Fleet Management)
                </CardTitle>
                <CardDescription>
                    Status dan produktivitas alat berat secara real-time.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Unit ID</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Bahan Bakar</TableHead>
                        <TableHead className="text-right">Produktivitas</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {equipment.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>
                            <Badge
                            variant={getStatusVariant(item.status)}
                            className={cn(getStatusColorClass(item.status))}
                            >
                            {item.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span>{item.fuel}%</span>
                                <Progress value={item.fuel} className="h-2 w-16" />
                            </div>
                        </TableCell>
                        <TableCell className="text-right">{item.productivity > 0 ? `${item.productivity}%` : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>

        {/* Grade Control & Stockpile */}
        <div className="space-y-4 md:space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Pengawasan Kualitas (Grade Control)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">ROM to Crusher</span>
                        <Badge variant="outline">6,310 GAR</Badge>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium">Crusher to Stockpile</span>
                        <Badge variant="outline">6,295 GAR</Badge>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium">Product (Ready for Sale)</span>
                        <Badge variant="default" className="bg-green-500/80">6,280 GAR</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Warehouse className="h-5 w-5 text-primary" />
                        Manajemen Stockpile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {stockpiles.map(stock => (
                         <div key={stock.name}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{stock.name}</span>
                                <span className="text-sm text-muted-foreground">{stock.grade}</span>
                            </div>
                             <Progress value={(stock.volume / stock.capacity) * 100} />
                             <p className="text-xs text-muted-foreground mt-1 text-right">
                                {new Intl.NumberFormat('id-ID').format(stock.volume)} / {new Intl.NumberFormat('id-ID').format(stock.capacity)} Ton
                            </p>
                         </div>
                     ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
