
'use client';

import { useRef, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Printer, Pickaxe } from 'lucide-react';
import type { Budget, Invoice, Bill } from '@/lib/types';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function LaporanKinerjaKeuanganPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const { firestore } = useFirebase();

  const budgetsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'budgets'));
  }, [firestore]);

  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'invoices'), where('status', '!=', 'Paid'));
  }, [firestore]);

  const billsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'bills'), where('status', '==', 'Unpaid'));
  }, [firestore]);

  const { data: budgets, isLoading: budgetsLoading } = useCollection<Budget>(budgetsQuery);
  const { data: openInvoices, isLoading: invoicesLoading } = useCollection<Invoice>(invoicesQuery);
  const { data: unpaidBills, isLoading: billsLoading } = useCollection<Bill>(billsQuery);

  const isLoading = budgetsLoading || invoicesLoading || billsLoading;

  const summary = useMemo(() => {
    const totalBudget = budgets?.reduce((sum, item) => sum + item.budgeted, 0) || 0;
    const totalActual = budgets?.reduce((sum, item) => sum + item.actual, 0) || 0;
    const totalReceivables = openInvoices?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
    const totalPayables = unpaidBills?.reduce((sum, bill) => sum + bill.amount, 0) || 0;

    return {
        totalBudget,
        totalActual,
        budgetVariance: totalBudget - totalActual,
        totalReceivables,
        totalPayables,
    }
  }, [budgets, openInvoices, unpaidBills]);


  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Laporan Kinerja Keuangan</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<style>body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } @page { size: auto; } </style>');
        printWindow.document.write('</head><body class="p-8">');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    }
  };
  
  const reportDate = useMemo(() => new Date().toLocaleDateString('id-ID', { dateStyle: 'full' }), []);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Laporan Kinerja Keuangan">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Cetak Laporan
        </Button>
      </PageHeader>

      <div ref={printRef}>
        <Card className="p-8">
          <header className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
            <div className="flex items-center gap-3">
              <Pickaxe className="w-12 h-12 text-gray-800" />
              <div>
                <h1 className="text-3xl font-bold text-black">MineVision Corp.</h1>
                <p className="text-sm text-gray-600">Integrated Mining Operations</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase text-gray-700 text-right">
                Laporan Kinerja Keuangan
              </h2>
              <p className="text-sm text-gray-600 text-right">
                Tanggal: {reportDate}
              </p>
            </div>
          </header>

          <main className="space-y-8">
            <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Ringkasan Keuangan</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Piutang (AR)</p>
                        {isLoading ? <Skeleton className="h-8 w-40 mt-1" /> : <p className="text-2xl font-bold">{formatCurrency(summary.totalReceivables)}</p>}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Hutang (AP)</p>
                         {isLoading ? <Skeleton className="h-8 w-40 mt-1" /> : <p className="text-2xl font-bold">{formatCurrency(summary.totalPayables)}</p>}
                    </div>
                     <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Variansi Anggaran</p>
                         {isLoading ? <Skeleton className="h-8 w-40 mt-1" /> : <p className="text-2xl font-bold">{formatCurrency(summary.budgetVariance)}</p>}
                    </div>
                 </div>
            </section>
            
            <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Detail Anggaran vs. Realisasi</h3>
                 <div className="space-y-4">
                    {isLoading ? (
                        Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                    ) : (
                        budgets?.map(budget => (
                            <div key={budget.id} className="p-4 border rounded-lg">
                                <p className="font-semibold">{budget.category}</p>
                                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                    <div>
                                        <p className="text-gray-500">Anggaran</p>
                                        <p className="font-mono">{formatCurrency(budget.budgeted)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Realisasi</p>
                                        <p className="font-mono">{formatCurrency(budget.actual)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
                 <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                     <div className="flex justify-between font-bold">
                        <span>Total Keseluruhan</span>
                         {isLoading ? <Skeleton className="h-6 w-48"/> :
                         <span>{formatCurrency(summary.totalActual)} / {formatCurrency(summary.totalBudget)}</span>
                        }
                     </div>
                 </div>
            </section>

          </main>

          <footer className="mt-12 text-center text-xs text-gray-500">
            Laporan ini dibuat secara otomatis oleh sistem MineVision pada{' '}
            {new Date().toLocaleString('id-ID')}.
          </footer>
        </Card>
      </div>
    </main>
  );
}
