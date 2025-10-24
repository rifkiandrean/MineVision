
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

const inventoryItems = [
  { name: 'ANFO', category: 'Bahan Peledak', stock: 5000, unit: 'Kg', location: 'Gudang Peledak 1', usage: 75 },
  { name: 'Filter Oli EX-05', category: 'Suku Cadang', stock: 25, unit: 'Pcs', location: 'Workshop', usage: 40 },
  { name: 'Solar (HSD)', category: 'Bahan Bakar', stock: 250000, unit: 'Liter', location: 'Tangki Utama', usage: 82 },
  { name: 'Ban Dump Truck', category: 'Suku Cadang', stock: 12, unit: 'Pcs', location: 'Gudang Ban', usage: 20 },
];

const purchaseRequests = [
    { id: 'PR-2023-0125', item: 'Bearing Roda DT-101', dept: 'Produksi', date: '2023-11-03', status: 'Approved' },
    { id: 'PR-2023-0126', item: 'Kabel Listrik 500m', dept: 'Pengolahan', date: '2023-11-04', status: 'Ordered' },
    { id: 'PR-2023-0127', item: 'APAR 25 Kg', dept: 'K3L', date: '2023-11-05', status: 'Pending' },
];

const shipments = [
    { id: 'MV-008', vessel: 'MV. Jaya Abadi', cargo: 'Batubara 6300 GAR', quantity: 50000, dest: 'Cigading', status: 'In Transit' },
    { id: 'BG-102', vessel: 'BG. Sumber Rejeki', cargo: 'Batubara 5800 GAR', quantity: 8000, dest: 'PLTU Suralaya', status: 'Loading' },
    { id: 'MV-007', vessel: 'MV. Samudera Biru', cargo: 'Batubara 6300 GAR', quantity: 55000, dest: 'Tanjung Priok', status: 'Discharged' },
];

export default function RantaiPasokanPage() {

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Approved':
            case 'Discharged':
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
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Permintaan
        </Button>
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
                        <TableHead>Tingkat Penggunaan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {inventoryItems.map(item => (
                        <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell className="text-right">{item.stock.toLocaleString('id-ID')} {item.unit}</TableCell>
                            <TableCell>
                                <Progress value={item.usage} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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
                            {purchaseRequests.map(pr => (
                                <TableRow key={pr.id}>
                                    <TableCell className="font-medium">{pr.id}</TableCell>
                                    <TableCell>{pr.item}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn(getStatusClass(pr.status))}>
                                            {pr.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                            {shipments.map(shipment => (
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
