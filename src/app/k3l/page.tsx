
'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnomalyDetectionForm } from './anomaly-form';
import { ClipboardCheck, Megaphone, Wind, PlusCircle, CalendarIcon, MapPin, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IncidentForm } from './incident-form';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Incident } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const complianceItems = [
    { id: 'ENV-001', name: 'Audit Kualitas Air', status: 'Sesuai', dueDate: '2024-09-01' },
    { id: 'HSE-005', name: 'Pelatihan P3K', status: 'Terlambat', dueDate: '2024-07-30' },
    { id: 'ENV-002', name: 'Laporan Emisi Debu', status: 'Sesuai', dueDate: '2024-08-15' },
];

export default function K3LPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

    const { firestore } = useFirebase();

    const incidentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'incidents'), orderBy('date', 'desc'), limit(5));
    }, [firestore]);

    const { data: incidents, isLoading: incidentsLoading } = useCollection<Incident>(incidentsQuery);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Sesuai':
            case 'Ditutup':
                return 'bg-green-500/80 text-green-foreground';
            case 'Investigasi':
                return 'bg-yellow-500/80 text-yellow-foreground';
            case 'Terlambat':
            case 'Open':
                return 'bg-red-500/80 text-red-foreground';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };
    
    const handleRowClick = (incident: Incident) => {
        setSelectedIncident(incident);
        setIsDetailOpen(true);
    }
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
    }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="K3L & Lingkungan" />
      <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    Pelaporan Insiden
                </CardTitle>
                <CardDescription>Pencatatan dan pelacakan kecelakaan atau potensi bahaya (near miss).</CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full mb-4">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Laporkan Insiden Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Laporkan Insiden atau Bahaya Baru</DialogTitle>
                            <DialogDescription>
                                Isi detail di bawah ini. Laporan Anda akan segera ditinjau oleh tim K3L.
                            </DialogDescription>
                        </DialogHeader>
                        <IncidentForm onIncidentReported={() => setIsFormOpen(false)} />
                    </DialogContent>
                </Dialog>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID Laporan</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {incidentsLoading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24"/></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32"/></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            incidents?.map(inc => (
                                <TableRow key={inc.id} onClick={() => handleRowClick(inc)} className="cursor-pointer">
                                    <TableCell className="font-medium">#{inc.incidentId}</TableCell>
                                    <TableCell>{inc.type}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={cn(getStatusClass(inc.status))}>
                                            {inc.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                { !incidentsLoading && incidents?.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        Belum ada insiden yang dilaporkan.
                    </div>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    Manajemen Kepatuhan
                </CardTitle>
                <CardDescription>Pemantauan pemenuhan regulasi lingkungan dan K3.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item Kepatuhan</TableHead>
                            <TableHead>Jatuh Tempo</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {complianceItems.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.dueDate}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={cn(getStatusClass(item.status))}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            Pemantauan & Peringatan Dini AI
          </CardTitle>
          <CardDescription>
            Gunakan AI untuk memprediksi dan memberikan peringatan dini tentang
            potensi insiden. Masukkan data real-time dari berbagai sumber untuk
            mengidentifikasi anomali.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnomalyDetectionForm />
        </CardContent>
      </Card>
      
      {/* Incident Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedIncident && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Laporan Insiden #{selectedIncident.incidentId}</DialogTitle>
                <DialogDescription>
                  Rincian lengkap dari laporan insiden yang dipilih.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Jenis Laporan</span>
                    <span className="font-semibold">{selectedIncident.type}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <Badge variant="secondary" className={cn(getStatusClass(selectedIncident.status))}>
                        {selectedIncident.status}
                    </Badge>
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><CalendarIcon className="h-4 w-4"/>Tanggal & Waktu</h4>
                    <p>{formatDate(selectedIncident.date)}</p>
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4"/>Lokasi</h4>
                    <p>{selectedIncident.location}</p>
                </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2"><FileText className="h-4 w-4"/>Deskripsi</h4>
                    <p className="p-3 bg-muted rounded-md text-sm">{selectedIncident.description}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
