
'use client';

import { useRef, useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Printer, Pickaxe, Wrench } from 'lucide-react';
import type { MaintenanceTask } from '@/lib/types';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Selesai':
      return 'bg-green-500/80 text-green-foreground';
    case 'Dalam Pengerjaan':
      return 'bg-yellow-500/80 text-yellow-foreground';
    case 'Terjadwal':
      return 'bg-blue-500/80 text-blue-foreground';
    case 'Ditunda':
        return 'bg-secondary text-secondary-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function LaporanPemeliharaanAsetPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const { firestore } = useFirebase();

  const maintenanceQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'maintenanceTasks'), orderBy('scheduledDate', 'desc'));
  }, [firestore]);

  const { data: tasks, isLoading } = useCollection<MaintenanceTask>(maintenanceQuery);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Laporan Pemeliharaan Aset</title>');
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
        printWindow.document.write('<style>body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } @page { size: landscape; } </style>');
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Laporan Pemeliharaan Aset">
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
                Laporan Pemeliharaan Aset
              </h2>
              <p className="text-sm text-gray-600 text-right">
                Tanggal: {reportDate}
              </p>
            </div>
          </header>

          <main>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Tugas</TableHead>
                  <TableHead>ID Aset</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tgl. Selesai</TableHead>
                  <TableHead className="text-right">Downtime (Jam)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : tasks?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                            Tidak ada data pemeliharaan ditemukan.
                        </TableCell>
                    </TableRow>
                ) : (
                  tasks?.map((task: MaintenanceTask) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.taskId}</TableCell>
                      <TableCell>{task.assetId}</TableCell>
                      <TableCell>
                        <Badge variant={task.type === 'Preventive' ? 'outline' : 'default'}>{task.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">{task.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(getStatusClass(task.status))}>
                          {task.status}
                        </Badge>
                      </TableCell>
                       <TableCell>{formatDate(task.completionDate)}</TableCell>
                       <TableCell className="text-right font-mono">{task.downtimeHours || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
