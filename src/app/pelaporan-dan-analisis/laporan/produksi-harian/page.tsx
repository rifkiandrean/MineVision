
'use client';

import { useRef } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Printer, Pickaxe } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EquipmentStatus } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

// Mock data, in a real app this would be fetched
const reportData = {
  date: new Date(),
  summary: {
    obMoved: 52800,
    coalMined: 15750,
    stripRatio: 3.35,
    avgGrade: 6280,
  },
  equipment: [
    { id: 'DT-101', type: 'Dump Truck', status: 'Operasional', location: 'Pit-A', fuel: 85, productivity: 95 },
    { id: 'EX-05', type: 'Excavator', status: 'Perawatan', location: 'Workshop', fuel: 0, productivity: 0 },
    { id: 'DZ-22', type: 'Dozer', status: 'Operasional', location: 'Waste Dump-B', fuel: 72, productivity: 88 },
    { id: 'WL-03', type: 'Wheel Loader', status: 'Siaga', location: 'Stockpile-A', fuel: 91, productivity: 0 },
    { id: 'DT-102', type: 'Dump Truck', status: 'Rusak', location: 'Haul Road 1', fuel: 45, productivity: 0 },
    { id: 'DT-103', type: 'Dump Truck', status: 'Operasional', location: 'Pit-A', fuel: 92, productivity: 98 },
    { id: 'EX-06', type: 'Excavator', status: 'Operasional', location: 'Pit-B', fuel: 78, productivity: 91 },
  ],
};

const getStatusClass = (status: string) => {
    switch (status) {
      case 'Operasional':
        return 'bg-green-500/80 text-green-foreground';
      case 'Perawatan':
        return 'bg-yellow-500/80 text-yellow-foreground';
      case 'Siaga':
        return 'bg-blue-500/80 text-blue-foreground';
      case 'Rusak':
         return 'bg-red-500/80 text-red-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

export default function LaporanProduksiHarianPage() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Laporan Produksi Harian</title>');
            // Inject Tailwind styles from CDN for printing
            printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
             printWindow.document.write('<style>body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }</style>');
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Laporan Produksi Harian">
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
                <h2 className="text-xl font-bold uppercase text-gray-700 text-right">Laporan Produksi Harian</h2>
                <p className="text-sm text-gray-600 text-right">{reportData.date.toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
            </div>
          </header>
          
          <main>
            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Ringkasan Produksi</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Overburden (OB) Moved</p>
                        <p className="text-2xl font-bold">{reportData.summary.obMoved.toLocaleString('id-ID')} BCM</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Coal Mined</p>
                        <p className="text-2xl font-bold">{reportData.summary.coalMined.toLocaleString('id-ID')} Ton</p>
                    </div>
                     <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Strip Ratio (Actual)</p>
                        <p className="text-2xl font-bold">{reportData.summary.stripRatio.toFixed(2)}</p>
                    </div>
                     <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Avg. Coal Grade (GAR)</p>
                        <p className="text-2xl font-bold">{reportData.summary.avgGrade.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </section>

             <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Detail Status Alat Berat</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Unit ID</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Lokasi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Bahan Bakar</TableHead>
                            <TableHead className="text-right">Produktivitas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.equipment.map((item: EquipmentStatus) => (
                            <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.type}</TableCell>
                             <TableCell>{item.location}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={cn('text-xs', getStatusClass(item.status))}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span>{item.fuel}%</span>
                                    <Progress value={item.fuel} className="h-2 w-16" />
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{item.productivity > 0 ? `${item.productivity}%` : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </section>
          </main>

           <footer className="mt-12 text-center text-xs text-gray-500">
                Laporan ini dibuat secara otomatis oleh sistem MineVision pada {new Date().toLocaleString('id-ID')}.
           </footer>
        </Card>
      </div>
    </main>
  );
}
