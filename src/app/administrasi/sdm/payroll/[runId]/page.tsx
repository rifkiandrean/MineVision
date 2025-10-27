
'use client';

import { useParams } from 'next/navigation';
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
  TableFooter,
} from '@/components/ui/table';
import { Printer, Check, Shield, FileDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// This is mock data. In a real app, you'd fetch this based on the runId.
const payrollDetail = {
  runId: 'RUN-2024-08',
  period: 'Agustus 2024',
  status: 'Processed',
  payslips: [
    { id: 'PS-001', employeeName: 'Rifki Andrean', baseSalary: 80000000, allowances: 15000000, deductions: 7500000, netPay: 87500000 },
    { id: 'PS-002', employeeName: 'Thoriq', baseSalary: 75000000, allowances: 12000000, deductions: 6500000, netPay: 80500000 },
    { id: 'PS-003', employeeName: 'John Doe', baseSalary: 45000000, allowances: 8000000, deductions: 4500000, netPay: 48500000 },
    { id: 'PS-004', employeeName: 'Jane Smith', baseSalary: 50000000, allowances: 9500000, deductions: 5000000, netPay: 54500000 },
  ],
  summary: {
    totalGross: 294500000,
    totalDeductions: 23500000,
    totalNet: 271000000,
  }
};

export default function PayrollRunDetailPage() {
  const params = useParams();
  const { runId } = params;
  
  // In a real app, you would use 'runId' to fetch data from Firestore.
  // For now, we use mock data.
  const data = payrollDetail;
  const isLoading = false; // Set to true when fetching data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title={`Detail Penggajian: ${runId}`}>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Ekspor Laporan
          </Button>
          <Button>
            <Check className="mr-2 h-4 w-4" />
            Setujui & Proses
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-4">
        <Card>
            <CardHeader>
                <CardTitle>Periode</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{data.period}</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Total Gaji Kotor</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(data.summary.totalGross)}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Potongan</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(data.summary.totalDeductions)}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Gaji Bersih</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold text-primary">{formatCurrency(data.summary.totalNet)}</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rincian Gaji Karyawan</CardTitle>
          <CardDescription>
            Daftar rincian gaji untuk setiap karyawan dalam periode ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Karyawan</TableHead>
                <TableHead className="text-right">Gaji Pokok</TableHead>
                <TableHead className="text-right">Tunjangan</TableHead>
                <TableHead className="text-right">Potongan</TableHead>
                <TableHead className="text-right">Gaji Bersih (Net Pay)</TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                data.payslips.map((slip) => (
                  <TableRow key={slip.id}>
                    <TableCell className="font-medium">{slip.employeeName}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(slip.baseSalary)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(slip.allowances)}</TableCell>
                    <TableCell className="text-right font-mono text-destructive">{formatCurrency(slip.deductions)}</TableCell>
                    <TableCell className="text-right font-bold font-mono">{formatCurrency(slip.netPay)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4} className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold font-mono">{formatCurrency(data.summary.totalNet)}</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
