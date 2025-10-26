
'use client';

import PageHeader from '@/components/page-header';
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
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Bill } from '@/lib/types';

export default function HutangPage() {
  const { firestore } = useFirebase();

  const billsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'bills'),
      orderBy('billDate', 'desc')
    );
  }, [firestore]);

  const { data: bills, isLoading } = useCollection<Bill>(billsQuery);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      date.setDate(date.getDate() + 1); // Adjust for timezone
      return date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
      });
  }

  const getStatusClass = (status: Bill['status']) => {
    const isOverdue = status === 'Overdue';
    const isPaid = status === 'Paid';
    
    if (isOverdue) return 'bg-red-500/80 text-red-foreground';
    if (isPaid) return 'bg-green-500/80 text-green-foreground';
    return 'bg-yellow-500/80 text-yellow-foreground'; // Unpaid
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Hutang Usaha (Accounts Payable)" />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Tagihan (Bill)</CardTitle>
          <CardDescription>
            Kelola semua tagihan yang diterima dari vendor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Tagihan</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Tgl. Tagihan</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                    </TableRow>
                  ))
                : bills?.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium">{bill.billId}</TableCell>
                      <TableCell>{bill.vendorName}</TableCell>
                      <TableCell>{formatDate(bill.billDate)}</TableCell>
                      <TableCell>{formatDate(bill.dueDate)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(bill.amount)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={cn(getStatusClass(bill.status))}>
                          {bill.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {!isLoading && bills?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Tidak ada tagihan yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

    