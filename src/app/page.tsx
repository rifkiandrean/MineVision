
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  BarChart4,
  FileText,
  Megaphone,
  Truck,
  Mountain,
  Cog,
  ShieldCheck,
  Briefcase,
  Layers,
  Package,
  Settings2,
  PlusCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/page-header';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AnnouncementForm } from './announcement-form';
import { useIsMobile } from '@/hooks/use-mobile';

const moduleLinks = [
  { href: '/perencanaan-tambang', icon: Layers, label: 'Perencanaan', description: 'Model geologi dan desain tambang.' },
  { href: '/produksi', icon: Truck, label: 'Produksi', description: 'Status alat berat dan produksi harian.' },
  { href: '/geologi', icon: Mountain, label: 'Geologi', description: 'Peta cadangan dan hasil bor.' },
  { href: '/pengolahan', icon: Cog, label: 'Pengolahan', description: 'Kinerja pabrik dan kualitas produk.' },
  { href: '/k3l', icon: ShieldCheck, label: 'K3L', description: 'Insiden, hazard, dan compliance.' },
  { href: '/rantai-pasokan', icon: Package, label: 'Rantai Pasokan', description: 'Inventaris, pengadaan, dan logistik.' },
  { href: '/aset-dan-pemeliharaan', icon: Settings2, label: 'Aset', description: 'Manajemen aset dan jadwal perawatan.' },
  { href: '/administrasi/keuangan', icon: Briefcase, label: 'Administrasi', description: 'Keuangan, SDM, dan operasional IT.' },
  { href: '/pelaporan-dan-analisis', icon: BarChart4, label: 'Laporan & BI', description: 'Dashboard, laporan, dan analisis data.'}
]

export default function Home() {
  const { firestore, isUserLoading } = useFirebase();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const kpiQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return query(collection(firestore, 'kpi'), limit(4));
  }, [firestore, isUserLoading]);

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return query(
      collection(firestore, 'announcements'),
      orderBy('date', 'desc'),
      limit(3)
    );
  }, [firestore, isUserLoading]);

  const productionStatusQuery = useMemoFirebase(() => {
    if (!firestore || isUserLoading) return null;
    return collection(firestore, 'productionStatus');
  }, [firestore, isUserLoading]);

  const { data: kpiData, isLoading: kpiLoading } = useCollection<any>(kpiQuery);
  const { data: announcements, isLoading: announcementsLoading } =
    useCollection<any>(announcementsQuery);
  const { data: productionStatus, isLoading: productionStatusLoading } =
    useCollection<any>(productionStatusQuery);

  const kpiIcons: { [key: string]: React.ReactNode } = {
    'Total Production (Ton)': <BarChart4 className="h-6 w-6 text-primary" />,
    'Equipment Availability': <Truck className="h-6 w-6 text-primary" />,
    'Safety Incidents': <AlertTriangle className="h-6 w-6 text-destructive" />,
    'Environmental Compliance': <Activity className="h-6 w-6 text-primary" />,
  };

  const priorityColors: { [key: string]: string } = {
    High: 'bg-destructive/80 hover:bg-destructive',
    Medium: 'bg-accent/80 hover:bg-accent text-accent-foreground',
    Low: 'bg-secondary hover:bg-secondary/90',
  };

  const statusColors: { [key: string]: string } = {
    Optimal: 'border-green-500 text-green-500',
    Warning: 'border-yellow-500 text-yellow-500',
    Halted: 'border-red-500 text-red-500',
  };

  const MobileLayout = () => (
    <>
        <div className="grid grid-cols-3 gap-4">
            {moduleLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className="block">
                    <Card className="h-full hover:bg-muted/50 transition-colors hover:border-primary/50 aspect-square flex flex-col items-center justify-center p-2">
                        <Icon className="h-8 w-8 text-primary" />
                        <p className="text-xs text-center mt-2 font-medium text-primary">{link.label}</p>
                    </Card>
                  </Link>
                )
            })}
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
            <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Pengumuman Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {announcementsLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-start space-x-4 p-2">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        </div>
                    ))
                    : announcements?.map((ann) => (
                        <div
                        key={ann.id}
                        className="flex items-start space-x-4 rounded-md p-2 transition-colors hover:bg-muted/50"
                        >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <Megaphone className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">
                                {ann.title}
                            </p>
                            <Badge
                                variant="secondary"
                                className={cn(
                                'text-xs',
                                priorityColors[ann.priority]
                                )}
                            >
                                {ann.priority}
                            </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                            {ann.department} &middot;{' '}
                            {new Date(ann.date).toLocaleDateString()}
                            </p>
                        </div>
                        </div>
                    ))}
                </div>
                {!announcementsLoading && announcements?.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        Tidak ada pengumuman saat ini.
                    </div>
                )}
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Status Produksi</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                {productionStatusLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                    ))
                : productionStatus?.map((status) => (
                    <div key={status.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                        {status.name}
                        </span>
                        <Badge
                        variant="outline"
                        className={statusColors[status.status]}
                        >
                        {status.status}
                        </Badge>
                    </div>
                    ))}
            </CardContent>
            </Card>
      </div>
    </>
  );

  const DesktopLayout = () => (
      <>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {moduleLinks.map(link => {
                const Icon = link.icon;
                return (
                <Link key={link.href} href={link.href} className="block">
                    <Card className="h-full hover:bg-muted/50 transition-colors hover:border-primary/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base font-medium">{link.label}</CardTitle>
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">{link.description}</p>
                        </CardContent>
                    </Card>
                </Link>
                )
            })}
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2">
            <CardHeader>
                <CardTitle>Pengumuman Terbaru</CardTitle>
                <CardDescription>
                Ikuti terus berita dan peringatan terbaru perusahaan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                {announcementsLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-start space-x-4 p-2">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        </div>
                    ))
                    : announcements?.map((ann) => (
                        <div
                        key={ann.id}
                        className="flex items-start space-x-4 rounded-md p-2 transition-colors hover:bg-muted/50"
                        >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <Megaphone className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">
                                {ann.title}
                            </p>
                            <Badge
                                variant="secondary"
                                className={cn(
                                'text-xs',
                                priorityColors[ann.priority]
                                )}
                            >
                                {ann.priority}
                            </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                            {ann.department} &middot;{' '}
                            {new Date(ann.date).toLocaleDateString()}
                            </p>
                        </div>
                        </div>
                    ))}
                </div>
                {!announcementsLoading && announcements?.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        Tidak ada pengumuman saat ini.
                    </div>
                )}
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Status Produksi</CardTitle>
                <CardDescription>Tinjauan produksi real-time.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {productionStatusLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                    ))
                : productionStatus?.map((status) => (
                    <div key={status.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                        {status.name}
                        </span>
                        <Badge
                        variant="outline"
                        className={statusColors[status.status]}
                        >
                        {status.status}
                        </Badge>
                    </div>
                    ))}
            </CardContent>
            </Card>
        </div>
      </>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard Utama" hideBackButton>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Pengumuman
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Buat Pengumuman Baru</DialogTitle>
              <DialogDescription>
                Isi detail pengumuman di bawah ini. Pengumuman akan muncul di
                dasbor utama.
              </DialogDescription>
            </DialogHeader>
            <AnnouncementForm
              onAnnouncementCreated={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      {isMobile ? <MobileLayout /> : <DesktopLayout />}

    </main>
  );
}
