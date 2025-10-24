
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
import type { Invoice } from '@/lib/types';

export default function PiutangPage() {
  const { firestore } = useFirebase();

  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'invoices'),
      orderBy('issueDate', 'desc')
    );
  }, [firestore]);

  const { data: invoices, isLoading } = useCollection<Invoice>(invoicesQuery);

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

  const getStatusClass = (status: Invoice['status']) => {
    const isOverdue = status === 'Overdue';
    const isPaid = status === 'Paid';
    const isSent = status === 'Sent';
    
    if (isOverdue) return 'bg-red-500/80 text-red-foreground';
    if (isPaid) return 'bg-green-500/80 text-green-foreground';
    if (isSent) return 'bg-blue-500/80 text-blue-foreground';
    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Piutang Usaha (Accounts Receivable)" />
      <Card>
        <CardHeader>
          <CardTitle>Daftar Faktur (Invoice)</CardTitle>
          <CardDescription>
            Kelola semua faktur yang dikirim ke pelanggan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Faktur</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tgl. Terbit</TableHead>
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
                : invoices?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
                      <TableCell>{invoice.customerName}</TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={cn(getStatusClass(invoice.status))}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
           {!isLoading && invoices?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Tidak ada faktur yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
