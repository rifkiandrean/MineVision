
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import {
  Wallet,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { PayrollRun } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock data until Firestore is seeded
const mockPayrollRuns: PayrollRun[] = [
    {
        id: 'run-jul-2024',
        runId: 'RUN-2024-07',
        period: 'Juli 2024',
        payDate: '2024-07-25',
        totalGross: 1250000000,
        totalNet: 1050000000,
        status: 'Paid',
    },
    {
        id: 'run-aug-2024',
        runId: 'RUN-2024-08',
        period: 'Agustus 2024',
        payDate: '2024-08-25',
        totalGross: 1265000000,
        totalNet: 1062000000,
        status: 'Processed',
    },
     {
        id: 'run-sep-2024',
        runId: 'RUN-2024-09',
        period: 'September 2024',
        payDate: '2024-09-25',
        totalGross: 0,
        totalNet: 0,
        status: 'Draft',
    }
];

export default function PayrollPage() {
  const { firestore } = useFirebase();

  // Uncomment this when data is available in Firestore
  /*
  const payrollRunsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'payrollRuns'), orderBy('payDate', 'desc'));
  }, [firestore]);

  const { data: payrollRuns, isLoading } = useCollection<PayrollRun>(payrollRunsQuery);
  */
 
  // Using mock data for now
  const payrollRuns = mockPayrollRuns;
  const isLoading = false;


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusClass = (status: PayrollRun['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-500/80 text-green-foreground';
      case 'Processed':
        return 'bg-blue-500/80 text-blue-foreground';
      case 'Draft':
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Penggajian (Payroll)">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Proses Gaji Baru
        </Button>
      </PageHeader>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Riwayat Proses Penggajian
          </CardTitle>
          <CardDescription>
            Kelola dan lihat riwayat proses penggajian yang telah dilakukan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Proses</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Tanggal Pembayaran</TableHead>
                <TableHead className="text-right">Total Gaji Bersih</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-36 ml-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : payrollRuns?.length > 0 ? (
                payrollRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.runId}</TableCell>
                    <TableCell>{run.period}</TableCell>
                    <TableCell>{new Date(run.payDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}</TableCell>
                    <TableCell className="text-right font-mono">
                        {run.totalNet > 0 ? formatCurrency(run.totalNet) : '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(getStatusClass(run.status))}>
                        {run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/administrasi/sdm/payroll/${run.runId}`}>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Belum ada proses penggajian yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
