
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
import type { BankAccount } from '@/lib/types';
import { Bank, Landmark } from 'lucide-react';

export default function KasDanBankPage() {
  const { firestore } = useFirebase();

  const bankAccountsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'bankAccounts'),
      orderBy('bankName')
    );
  }, [firestore]);

  const { data: accounts, isLoading } = useCollection<BankAccount>(bankAccountsQuery);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Kas & Bank" />

        <Card>
            <CardHeader>
                <CardTitle>Total Saldo</CardTitle>
                <CardDescription>Total saldo gabungan dari semua rekening bank.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-10 w-64" />
                ) : (
                    <p className="text-4xl font-bold tracking-tight">{formatCurrency(totalBalance)}</p>
                )}
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            Daftar Rekening Bank
          </CardTitle>
          <CardDescription>
            Rincian semua rekening bank yang dimiliki perusahaan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Bank</TableHead>
                <TableHead>Nama Akun</TableHead>
                <TableHead>Nomor Rekening</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-36 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                : accounts?.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Bank className="h-4 w-4 text-muted-foreground" />
                        {account.bankName}
                      </TableCell>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell className="font-mono">{account.accountNumber}</TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(account.balance)}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {!isLoading && accounts?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Tidak ada rekening bank yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

    