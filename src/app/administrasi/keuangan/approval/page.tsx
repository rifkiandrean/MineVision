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
import { Button } from '@/components/ui/button';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import type { PaymentRequest } from '@/lib/types';


export default function ApprovalPage() {
  const { firestore } = useFirebase();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'paymentRequests'),
      orderBy('date', 'desc')
    );
  }, [firestore]);

  const { data: requests, isLoading } =
    useCollection<PaymentRequest>(requestsQuery);

  const handleUpdateRequest = (id: string, status: 'approved' | 'rejected') => {
    if (!firestore) return;
    const docRef = doc(firestore, 'paymentRequests', id);
    updateDocumentNonBlocking(docRef, { status });
  };

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-500/80 text-yellow-foreground',
    approved: 'bg-green-500/80 text-green-foreground',
    rejected: 'bg-red-500/80 text-red-foreground',
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Persetujuan Pembayaran" />
      <Card>
        <CardHeader>
          <CardTitle>Permintaan Tertunda</CardTitle>
          <CardDescription>
            Tinjau, setujui, atau tolak permintaan pembayaran dari departemen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-6 w-24 mx-auto" />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : requests?.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        {new Date(req.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {req.requestor}
                      </TableCell>
                      <TableCell>{req.description}</TableCell>
                      <TableCell className="text-right">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(req.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={cn('capitalize', statusColors[req.status])}
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {req.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-300"
                                onClick={() =>
                                  handleUpdateRequest(req.id, 'approved')
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-300"
                                onClick={() =>
                                  handleUpdateRequest(req.id, 'rejected')
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}