
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
import {
  Printer,
  Pickaxe,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Incident } from '@/lib/types';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Ditutup':
      return 'bg-green-500/80 text-green-foreground';
    case 'Investigasi':
      return 'bg-yellow-500/80 text-yellow-foreground';
    case 'Open':
      return 'bg-red-500/80 text-red-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

export default function LaporanInsidenK3LPage() {
  const printRef = useRef<HTMLDivElement>(null);
  const { firestore } = useFirebase();

  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const incidentsQuery = useMemoFirebase(() => {
    if (!firestore || !date?.from || !date?.to) return null;
    return query(
      collection(firestore, 'incidents'),
      where('date', '>=', date.from.toISOString()),
      where('date', '<=', date.to.toISOString()),
      orderBy('date', 'desc')
    );
  }, [firestore, date]);

  const { data: incidents, isLoading } = useCollection<Incident>(incidentsQuery);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Ringkasan Insiden K3L</title>');
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

  const periodString = useMemo(() => {
    if (date?.from && date?.to) {
      return `${formatDate(date.from.toISOString())} - ${formatDate(date.to.toISOString())}`;
    }
    return 'Pilih rentang tanggal';
  }, [date]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Ringkasan Insiden K3L">
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={'outline'}
                    className={cn(
                    'w-[300px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                        </>
                    ) : (
                        format(date.from, 'LLL dd, y')
                    )
                    ) : (
                    <span>Pilih tanggal</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Cetak Laporan
          </Button>
        </div>
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
                Ringkasan Laporan Insiden K3L
              </h2>
              <p className="text-sm text-gray-600 text-right">
                Periode: {periodString}
              </p>
            </div>
          </header>

          <main>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Laporan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deskripsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : incidents?.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Tidak ada insiden yang dilaporkan pada periode ini.
                        </TableCell>
                    </TableRow>
                ) : (
                  incidents?.map((incident: Incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">#{incident.incidentId}</TableCell>
                      <TableCell>{formatDate(incident.date)}</TableCell>
                      <TableCell>{incident.type}</TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn('text-xs', getStatusClass(incident.status))}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">{incident.description}</TableCell>
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
