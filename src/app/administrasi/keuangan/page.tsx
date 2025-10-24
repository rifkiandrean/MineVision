
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
import Link from 'next/link';
import {
  ArrowRight,
  BarChartHorizontal,
  BookOpen,
  Landmark,
  FileText,
  Wallet,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import BudgetChart from '@/components/budget-chart';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Budget } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function KeuanganPage() {
  const { firestore } = useFirebase();

  const budgetsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'budgets'));
  }, [firestore]);

  const { data: budgets, isLoading } = useCollection<Budget>(budgetsQuery);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: Keuangan" />
      <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Laporan Keuangan */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Laporan Keuangan
            </CardTitle>
            <CardDescription>
              Hasilkan laporan keuangan inti perusahaan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" /> Neraca (Balance Sheet)
            </Button>
            <Button variant="outline" className="w-full justify-start">
                <BarChartHorizontal className="mr-2 h-4 w-4" /> Laba Rugi (P&L)
            </Button>
             <Button variant="outline" className="w-full justify-start">
                <Wallet className="mr-2 h-4 w-4" /> Arus Kas (Cash Flow)
            </Button>
          </CardContent>
        </Card>

        {/* Laporan Anggaran */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartHorizontal className="h-5 w-5 text-primary" />
              Laporan Anggaran
            </CardTitle>
            <CardDescription>
              Perbandingan anggaran vs. realisasi pengeluaran.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] w-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              budgets && <BudgetChart data={budgets} />
            )}
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary"/>
                        Piutang (AR)
                    </CardTitle>
                    <CardDescription>Total tagihan ke pelanggan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">Rp 15.2 Miliar</p>
                    <p className="text-xs text-muted-foreground">30 faktur terbuka</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-destructive"/>
                        Hutang (AP)
                    </CardTitle>
                    <CardDescription>Total tagihan dari vendor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">Rp 8.7 Miliar</p>
                    <p className="text-xs text-muted-foreground">45 tagihan belum dibayar</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-primary"/>
                        Kas & Bank
                    </CardTitle>
                    <CardDescription>Total saldo kas dan bank.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">Rp 25.1 Miliar</p>
                    <p className="text-xs text-muted-foreground">Di 5 rekening bank</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary"/>
                        Persetujuan
                    </CardTitle>
                    <CardDescription>Tinjau permintaan pembayaran.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/administrasi/keuangan/approval">
                    <Button className="w-full">
                        Lihat Permintaan <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </Link>
                </CardContent>
            </Card>
       </div>
    </main>
  );
}
