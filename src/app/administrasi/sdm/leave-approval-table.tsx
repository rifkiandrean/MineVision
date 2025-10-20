
'use client';

import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import type { LeaveRequest } from '@/lib/types';
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
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export function LeaveApprovalTable() {
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'leaveRequests'),
      orderBy('requestDate', 'desc')
    );
  }, [firestore]);

  const { data: requests, isLoading } = useCollection<LeaveRequest>(requestsQuery);

  const handleUpdateRequest = (id: string, status: 'approved' | 'rejected') => {
    if (!firestore) return;
    const docRef = doc(firestore, 'leaveRequests', id);
    updateDocumentNonBlocking(docRef, { status })
    toast({
        title: 'Status Updated',
        description: `Request has been ${status}.`
    })
  };

  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-500/80 text-yellow-foreground',
    approved: 'bg-green-500/80 text-green-foreground',
    rejected: 'bg-red-500/80 text-red-foreground',
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Karyawan</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Alasan</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Tindakan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-20 mx-auto" />
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
                  <TableCell className="font-medium">{req.employeeName}</TableCell>
                  <TableCell>
                    {new Date(req.startDate).toLocaleDateString()} -{' '}
                    {new Date(req.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{req.reason}</TableCell>
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
                            onClick={() => handleUpdateRequest(req.id, 'approved')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-300"
                            onClick={() => handleUpdateRequest(req.id, 'rejected')}
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
       {requests?.length === 0 && !isLoading && (
            <div className="text-center py-10 text-muted-foreground">
                Tidak ada permintaan cuti saat ini.
            </div>
        )}
    </div>
  );
}
