
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
import { Upload, GitBranch, CalendarDays, BarChart4, Database } from 'lucide-react';
import Image from "next/image";

const drillHoles = [
    { id: 'BH-01', easting: '523450', northing: '9712345', elevation: '120m', depth: '250m' },
    { id: 'BH-02', easting: '523550', northing: '9712400', elevation: '122m', depth: '265m' },
    { id: 'BH-03', easting: '523650', northing: '9712455', elevation: '118m', depth: '240m' },
];

const designVersions = [
    { id: 'v2.1', name: 'Desain Pit Blok Barat', author: 'Rifki A.', date: '2023-10-26', status: 'Approved' },
    { id: 'v1.0', name: 'Rancangan Jalan Hauling Utama', author: 'Thoriq', date: '2023-09-15', status: 'Approved' },
    { id: 'v3.0-draft', name: 'Optimasi Pit Blok Timur', author: 'Rifki A.', date: '2023-11-02', status: 'In Review' },
];

const scheduleTasks = [
    { period: 'Q4 2023', target: '2.5M BCM', focus: 'Overburden Removal Blok Barat' },
    { period: 'Q1 2024', target: '1.2M Ton', focus: 'Coal Getting Seam-A' },
    { period: 'Q2 2024', target: '3.0M BCM', focus: 'Overburden Removal Blok Timur' },
];


export default function MinePlanningPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Perencanaan Tambang">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Upload className="mr-2 h-4 w-4" />
          Impor Data
        </Button>
      </PageHeader>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Pemodelan Geologi dan Sumber Daya
            </CardTitle>
            <CardDescription>Mengelola data drillhole, estimasi cadangan, dan pemodelan 3D.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
             <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden border">
                <Image src="https://picsum.photos/seed/geology/800/800" alt="Model Geologi 3D" fill style={{objectFit: "cover"}} data-ai-hint="geology 3d model" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <p className="text-white z-10 font-semibold text-lg p-4 text-center">Model Blok Sumber Daya 3D - Area Konsesi</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Data Drillhole Terbaru</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Easting</TableHead>
                    <TableHead>Northing</TableHead>
                    <TableHead>Elevasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drillHoles.map((hole) => (
                    <TableRow key={hole.id}>
                      <TableCell className="font-medium">{hole.id}</TableCell>
                      <TableCell>{hole.easting}</TableCell>
                      <TableCell>{hole.northing}</TableCell>
                      <TableCell>{hole.elevation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-primary" />
                        Perancangan Tambang
                    </CardTitle>
                    <CardDescription>Desain pit, stope, ramp, dan optimasi.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Versi</TableHead>
                                <TableHead>Nama Desain</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {designVersions.map(v => (
                                <TableRow key={v.id}>
                                    <TableCell className="font-medium">{v.id}</TableCell>
                                    <TableCell>{v.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={v.status === 'Approved' ? 'default' : 'secondary'} className={v.status === 'Approved' ? 'bg-green-500' : ''}>
                                            {v.status}
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
                        <CalendarDays className="h-5 w-5 text-primary" />
                        Penjadwalan Tambang
                    </CardTitle>
                    <CardDescription>Perencanaan produksi dan penentuan target.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Periode</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Fokus Aktivitas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scheduleTasks.map(task => (
                                <TableRow key={task.period}>
                                    <TableCell className="font-medium">{task.period}</TableCell>
                                    <TableCell>{task.target}</TableCell>
                                    <TableCell>{task.focus}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart4 className="h-5 w-5 text-primary" />
                Analisis Kelayakan
            </CardTitle>
            <CardDescription>Simulasi dan analisis kelayakan proyek tambang.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Modul Analisis Kelayakan sedang dalam pengembangan.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}
