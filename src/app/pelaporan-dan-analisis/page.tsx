
'use client';

import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const biModules = [
  {
    title: 'Dashboard Real-time',
    description: 'Tampilan ringkasan kinerja produksi, keuangan, dan aset secara real-time.',
    icon: LayoutDashboard,
    href: '/',
    disabled: false,
    actionText: 'Lihat Dashboard',
  },
  {
    title: 'Laporan Kinerja',
    description: 'Hasilkan laporan terstruktur untuk produksi, keuangan, dan efisiensi operasional.',
    icon: FileText,
    href: '/pelaporan-dan-analisis/laporan',
    disabled: false,
    actionText: 'Buat Laporan',
  },
  {
    title: 'Analisis Data (AI)',
    description: 'Gunakan alat AI untuk mengidentifikasi tren, anomali, dan wawasan bisnis dari data historis.',
    icon: BrainCircuit,
    href: '/k3l',
    disabled: false,
    actionText: 'Mulai Analisis',
  },
];

export default function BiPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHeader title="Pelaporan & Analisis (BI)" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-3">
          {biModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Card key={mod.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    {mod.title}
                  </CardTitle>
                  <CardDescription>{mod.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  <Link href={mod.href} passHref className="w-full">
                    <Button className="w-full" disabled={mod.disabled}>
                      {mod.disabled ? 'Segera Hadir' : mod.actionText}
                      {!mod.disabled && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gambaran Umum</CardTitle>
            <CardDescription>
              Pusat Business Intelligence ini dirancang untuk mengubah data mentah dari seluruh operasi Anda menjadi wawasan yang dapat ditindaklanjuti. Gunakan modul di atas untuk memantau, melaporkan, dan menganalisis kinerja bisnis Anda secara mendalam.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">Area untuk visualisasi data utama atau KPI ringkasan akan ditampilkan di sini.</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
