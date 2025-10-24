
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
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { GeneralLedgerEntry } from '@/lib/types';

export default function GeneralLedgerPage() {
  const { firestore } = useFirebase();

  const ledgerQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'generalLedger'),
      orderBy('date', 'desc')
    );
  }, [firestore]);

  const { data: entries, isLoading } = useCollection<GeneralLedgerEntry>(ledgerQuery);

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Buku Besar Umum (General Ledger)" />
      <Card>
        <CardHeader>
          <CardTitle>Jurnal Transaksi</CardTitle>
          <CardDescription>
            Catatan semua transaksi keuangan yang telah terjadi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Akun</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Kredit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                : entries?.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell className="font-medium">{entry.account}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(entry.debit)}</TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(entry.credit)}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
           {!isLoading && entries?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Tidak ada entri jurnal yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
