
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
import { Download } from 'lucide-react';
import Link from 'next/link';

const availableReports = [
  {
    title: 'Laporan Produksi Harian',
    description: 'Ringkasan tonase OB dan batu bara, rasio pengupasan, dan produktivitas alat.',
    category: 'Produksi',
    href: '/pelaporan-dan-analisis/laporan/produksi-harian',
  },
  {
    title: 'Ringkasan Insiden K3L',
    description: 'Daftar semua insiden, laporan bahaya, dan status investigasi dalam periode tertentu.',
    category: 'K3L',
    disabled: true,
  },
  {
    title: 'Laporan Status Inventaris',
    description: 'Stok terkini untuk material kritis seperti bahan bakar dan suku cadang.',
    category: 'Rantai Pasokan',
    disabled: true,
  },
  {
    title: 'Laporan Kinerja Keuangan',
    description: 'Ringkasan pendapatan, pengeluaran, dan anggaran. (Segera Hadir)',
    category: 'Keuangan',
    disabled: true,
  },
    {
    title: 'Laporan Pemeliharaan Aset',
    description: 'Jadwal pemeliharaan preventif, riwayat perbaikan, dan analisis downtime.',
    category: 'Aset',
    disabled: true,
  },
];

export default function LaporanKinerjaPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Pusat Laporan" />
      <Card>
        <CardHeader>
            <CardTitle>Buat Laporan Kinerja</CardTitle>
            <CardDescription>
                Pilih salah satu laporan di bawah ini untuk dibuat dan diunduh. Anda dapat menentukan rentang tanggal dan filter lainnya saat membuat laporan.
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            {availableReports.map((report) => (
                <Card key={report.title} className="flex flex-col sm:flex-row items-start justify-between p-4">
                    <div className="mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                             <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{report.category}</span>
                             <h3 className="font-semibold">{report.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 max-w-lg">{report.description}</p>
                    </div>
                    <Link href={report.href || '#'} passHref>
                      <Button disabled={report.disabled}>
                          {report.disabled ? 'Segera Hadir' : <><Download className="mr-2 h-4 w-4" /> Buat Laporan</>}
                      </Button>
                    </Link>
                </Card>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
