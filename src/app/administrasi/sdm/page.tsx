
'use client';

import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowRight,
  Users,
  CalendarCheck,
  Wallet,
  CalendarClock,
  BarChart,
} from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { LeaveRequest } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const sdmModules = [
    { 
        title: "Manajemen Karyawan", 
        description: "Data personel, kontrak, dan workflow karyawan.",
        icon: Users,
        href: "#",
        stats: { value: "1,250", label: "Total Karyawan" },
        disabled: true,
    },
    { 
        title: "Manajemen Cuti", 
        description: "Kelola pengajuan dan persetujuan cuti karyawan.",
        icon: CalendarCheck,
        href: "/administrasi/sdm/cuti",
        stats: { value: "5", label: "Permintaan Tertunda" },
        isDynamic: true,
        disabled: false,
    },
     { 
        title: "Penggajian (Payroll)", 
        description: "Proses perhitungan gaji, tunjangan, dan pajak.",
        icon: Wallet,
        href: "#",
        stats: { value: "Siap Diproses", label: "Periode Ini" },
        disabled: true,
    },
    { 
        title: "Manajemen Kinerja", 
        description: "Evaluasi KPI dan kinerja karyawan.",
        icon: BarChart,
        href: "#",
        stats: { value: "Q3", label: "Siklus Evaluasi" },
        disabled: true,
    },
    { 
        title: "Penjadwalan Kerja", 
        description: "Atur jadwal shift dan lacak kehadiran (absensi).",
        icon: CalendarClock,
        href: "#",
        stats: { value: "98.5%", label: "Tingkat Kehadiran" },
        disabled: true,
    },
]

export default function SdmDashboardPage() {
    const { firestore } = useFirebase();

    const pendingLeaveQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'leaveRequests'), where('status', '==', 'pending'));
    }, [firestore]);

    const { data: pendingLeaveRequests, isLoading: leaveLoading } = useCollection<LeaveRequest>(pendingLeaveQuery);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: SDM" />
      <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sdmModules.map(mod => {
            const Icon = mod.icon;
            const statValue = mod.isDynamic ? (leaveLoading ? <Skeleton className="h-7 w-12"/> : (pendingLeaveRequests?.length ?? 0)) : mod.stats.value;

            return (
                 <Card key={mod.title} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <Icon className="h-6 w-6 text-primary" />
                            {mod.title}
                        </CardTitle>
                        <CardDescription>{mod.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="text-3xl font-bold">
                            {statValue}
                        </div>
                        <p className="text-xs text-muted-foreground">{mod.stats.label}</p>
                    </CardContent>
                    <CardContent>
                         <Link href={mod.disabled ? "#" : mod.href} passHref>
                            <Button className="w-full" disabled={mod.disabled}>
                                {mod.disabled ? 'Segera Hadir' : 'Kelola'}
                                {!mod.disabled && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )
        })}
      </div>
    </main>
  );
}
