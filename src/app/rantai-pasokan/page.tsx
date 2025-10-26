
'use client';

import { useState } from 'react';
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
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, ShoppingCart, Ship, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PurchaseRequestForm } from './request-form';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { InventoryItem, PurchaseRequestSC, Shipment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const shipmentsData = [
    { id: 'MV-008', vessel: 'MV. Jaya Abadi', cargo: 'Batubara 6300 GAR', quantity: 50000, dest: 'Cigading', status: 'In Transit' },
    { id: 'BG-102', vessel: 'BG. Sumber Rejeki', cargo: 'Batubara 5800 GAR', quantity: 8000, dest: 'PLTU Suralaya', status: 'Loading' },
    { id: 'MV-007', vessel: 'MV. Samudera Biru', cargo: 'Batubara 6300 GAR', quantity: 55000, dest: 'Tanjung Priok', status: 'Discharged' },
];

export default function RantaiPasokanPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { firestore } = useFirebase();

    const inventoryQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'inventory'), orderBy('name'));
    }, [firestore]);

    const prQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'purchaseRequestsSC'), orderBy('requestDate', 'desc'));
    }, [firestore]);

    const { data: inventoryItems, isLoading: inventoryLoading } = useCollection<InventoryItem>(inventoryQuery);
    const { data: purchaseRequests, isLoading: prLoading } = useCollection<PurchaseRequestSC>(prQuery);


    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Approved':
            case 'Discharged':
            case 'Received':
                return 'bg-green-500/80 text-green-foreground';
            case 'Pending':
            case 'Loading':
                return 'bg-yellow-500/80 text-yellow-foreground';
            case 'Ordered':
            case 'In Transit':
                return 'bg-blue-500/80 text-blue-foreground';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Logistik & Rantai Pasokan">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-4 w-4" />
              Buat Permintaan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat Permintaan Pembelian Baru</DialogTitle>
              <DialogDescription>
                Isi formulir di bawah untuk membuat PR baru.
              </DialogDescription>
            </DialogHeader>
            <PurchaseRequestForm 
                inventoryItems={inventoryItems || []} 
                onRequestCreated={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Manajemen Inventaris
            </CardTitle>
            <CardDescription>Kontrol stok material kritis seperti bahan peledak, suku cadang, dan bahan bakar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Material</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead className="text-right">Stok</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventoryLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        inventoryItems?.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell className="text-right">{item.stock.toLocaleString('id-ID')} {item.unit}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
             {!inventoryLoading && inventoryItems?.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    Tidak ada data inventaris.
                </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Pengadaan (Procurement)
                    </CardTitle>
                    <CardDescription>Lacak status permintaan pembelian (PR) dan pesanan pembelian (PO).</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No. PR</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                </TableRow>
                                ))
                            ) : (
                                purchaseRequests?.map(pr => (
                                    <TableRow key={pr.id}>
                                        <TableCell className="font-medium">#{pr.prId}</TableCell>
                                        <TableCell>{pr.item}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={cn(getStatusClass(pr.status))}>
                                                {pr.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {!prLoading && purchaseRequests?.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            Tidak ada permintaan pembelian.
                        </div>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Ship className="h-5 w-5 text-primary" />
                        Logistik & Pengiriman
                    </CardTitle>
                    <CardDescription>Jadwal dan status pengiriman material dari tambang ke pelabuhan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Kapal</TableHead>
                                <TableHead>Kuantitas (MT)</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shipmentsData.map(shipment => (
                                <TableRow key={shipment.id}>
                                    <TableCell className="font-medium">{shipment.vessel}</TableCell>
                                    <TableCell>{shipment.quantity.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn(getStatusClass(shipment.status))}>
                                            {shipment.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>

      </div>
    </main>
  );
}

    