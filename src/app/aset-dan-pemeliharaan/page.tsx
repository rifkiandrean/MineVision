
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Wrench, PackagePlus, HardHat, CalendarClock, Activity, Truck } from 'lucide-react';
import DowntimeChart from '@/components/downtime-chart';

const assets = [
  { id: 'EX-05', name: 'Excavator PC2000', type: 'Alat Gali', location: 'Pit A', status: 'Operasional' },
  { id: 'DT-101', name: 'Komatsu HD785', type: 'Alat Angkut', location: 'Haul Road 1', status: 'Operasional' },
  { id: 'DT-102', name: 'Komatsu HD785', type: 'Alat Angkut', location: 'Workshop', status: 'Perawatan' },
  { id: 'DZ-22', name: 'Dozer D375A', type: 'Alat Dorong', location: 'Waste Dump B', status: 'Siaga' },
];

const preventiveTasks = [
    { id: 'PM-001', asset: 'EX-05', task: 'Pemeriksaan Engine 250 Jam', dueDate: '2024-08-15', status: 'Terjadwal' },
    { id: 'PM-002', asset: 'DT-101', task: 'Penggantian Oli Hidrolik', dueDate: '2024-08-18', status: 'Terjadwal' },
    { id: 'PM-003', asset: 'DZ-22', task: 'Pemeriksaan Undercarriage', dueDate: '2024-08-20', status: 'Terjadwal' },
];

const correctiveTasks = [
    { id: 'CM-056', asset: 'DT-102', issue: 'Kerusakan transmisi', reportedDate: '2024-08-10', status: 'Selesai' },
    { id: 'CM-057', asset: 'WL-03', issue: 'Sistem hidrolik bocor', reportedDate: '2024-08-12', status: 'Dalam Pengerjaan' },
];

const spareParts = [
    { id: 'SP-0112', name: 'Filter Oli Engine PC2000', stock: 15, location: 'Gudang Utama' },
    { id: 'SP-0256', name: 'Brake Shoe HD785', stock: 8, location: 'Gudang Utama' },
    { id: 'SP-0301', name: 'Cutting Edge D375A', stock: 4, location: 'Gudang Workshop' },
];


export default function AssetMaintenancePage() {

   const getStatusClass = (status: string) => {
    switch (status) {
      case 'Operasional':
        return 'bg-green-500/80 text-green-foreground';
      case 'Perawatan':
      case 'Dalam Pengerjaan':
        return 'bg-yellow-500/80 text-yellow-foreground';
      case 'Siaga':
        return 'bg-blue-500/80 text-blue-foreground';
      case 'Selesai':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Aset & Pemeliharaan">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PackagePlus className="mr-2 h-4 w-4" />
          Tambah Aset Baru
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-primary" />
                Manajemen Aset
            </CardTitle>
            <CardDescription>Pencatatan, mutasi, dan informasi detail mengenai aset perusahaan.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID Aset</TableHead>
                        <TableHead>Nama Aset</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map(asset => (
                        <TableRow key={asset.id}>
                            <TableCell className="font-medium">{asset.id}</TableCell>
                            <TableCell>{asset.name}</TableCell>
                            <TableCell>{asset.type}</TableCell>
                            <TableCell>{asset.location}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={getStatusClass(asset.status)}>
                                    {asset.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Pemeliharaan (CMMS)
                </CardTitle>
                <CardDescription>Jadwalkan, lacak, dan kelola semua aktivitas perawatan aset.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="preventive">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preventive">Perawatan Preventif</TabsTrigger>
                        <TabsTrigger value="corrective">Perbaikan Korektif</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preventive" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CalendarClock className="h-5 w-5"/>
                                    Jadwal Akan Datang
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Aset</TableHead>
                                            <TableHead>Tugas</TableHead>
                                            <TableHead>Jatuh Tempo</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {preventiveTasks.map(task => (
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium">{task.asset}</TableCell>
                                                <TableCell>{task.task}</TableCell>
                                                <TableCell>{task.dueDate}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{task.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="corrective" className="mt-4">
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Activity className="h-5 w-5"/>
                                    Log Perbaikan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Work Order</TableHead>
                                            <TableHead>Aset</TableHead>
                                            <TableHead>Masalah</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {correctiveTasks.map(task => (
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium">{task.id}</TableCell>
                                                <TableCell>{task.asset}</TableCell>
                                                <TableCell>{task.issue}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={getStatusClass(task.status)}>{task.status}</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Analisis Downtime Alat</CardTitle>
                    <CardDescription>Visualisasi waktu henti alat berat bulan ini.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DowntimeChart />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary"/>
                        Manajemen Suku Cadang
                    </CardTitle>
                    <CardDescription>Status inventaris suku cadang penting.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Suku Cadang</TableHead>
                                <TableHead className="text-right">Stok</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {spareParts.map(part => (
                                <TableRow key={part.id}>
                                    <TableCell className="font-medium">{part.name}</TableCell>
                                    <TableCell className="text-right">{part.stock}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

      </div>
    </main>
  );
}
