
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
import { Printer, Pickaxe, Package } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function LaporanStatusInventarisPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const { firestore } = useFirebase();

  const inventoryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'inventory'), orderBy('category'), orderBy('name'));
  }, [firestore]);

  const { data: items, isLoading } = useCollection<InventoryItem>(inventoryQuery);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Laporan Status Inventaris</title>');
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Laporan Status Inventaris">
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
                Laporan Status Inventaris
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
                  <TableHead>Nama Material</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Lokasi Gudang</TableHead>
                  <TableHead className="text-right">Jumlah Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : items?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Tidak ada data inventaris ditemukan.
                        </TableCell>
                    </TableRow>
                ) : (
                  items?.map((item: InventoryItem) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="text-right font-mono">{item.stock.toLocaleString('id-ID')} {item.unit}</TableCell>
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
