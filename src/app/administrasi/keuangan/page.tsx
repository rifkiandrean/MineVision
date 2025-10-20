import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function KeuanganPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: Keuangan" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Alur Kerja Persetujuan</CardTitle>
            <CardDescription>
              Tinjau dan setujui permintaan pembayaran yang tertunda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/administrasi/keuangan/approval">
              <Button className="w-full">
                Lihat Permintaan <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Laporan Anggaran</CardTitle>
            <CardDescription>
              Analisis pengeluaran vs. anggaran.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Dasbor laporan anggaran akan ditampilkan di sini.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dasbor Penjualan</CardTitle>
            <CardDescription>
              Pantau metrik dan kinerja penjualan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Dasbor penjualan akan ditampilkan di sini.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}