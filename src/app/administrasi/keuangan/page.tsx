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
import { ArrowRight, BarChartHorizontal } from 'lucide-react';
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