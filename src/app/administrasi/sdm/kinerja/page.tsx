
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { PerformanceReview } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, Pie, PieChart, Cell } from 'recharts';

// Mock data until Firestore is seeded
const mockPerformanceReviews: PerformanceReview[] = [
    {
        id: 'rev-q3-2024',
        reviewId: 'Q3-2024',
        period: 'Q3 2024',
        userId: 'some-user-id',
        employeeName: 'Rifki Andrean',
        status: 'Manager Review',
        overallRating: 0,
    },
    {
        id: 'rev-q3-2024-2',
        reviewId: 'Q3-2024',
        period: 'Q3 2024',
        userId: 'another-user-id',
        employeeName: 'Thoriq',
        status: 'Self-Assessment',
        overallRating: 0,
    },
    {
        id: 'rev-q2-2024',
        reviewId: 'Q2-2024',
        period: 'Q2 2024',
        userId: 'some-user-id',
        employeeName: 'Rifki Andrean',
        status: 'Completed',
        overallRating: 4,
    },
     {
        id: 'rev-q2-2024-2',
        reviewId: 'Q2-2024',
        period: 'Q2 2024',
        userId: 'another-user-id',
        employeeName: 'Thoriq',
        status: 'Completed',
        overallRating: 5,
    }
];

const performanceDistribution = [
  { rating: 1, count: 2 },
  { rating: 2, count: 8 },
  { rating: 3, count: 25 },
  { rating: 4, count: 38 },
  { rating: 5, count: 15 },
]

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

export default function PerformanceManagementPage() {
  const { firestore } = useFirebase();

  // Using mock data for now
  const performanceReviews = mockPerformanceReviews;
  const isLoading = false;


  const getStatusClass = (status: PerformanceReview['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/80 text-green-foreground';
      case 'Manager Review':
        return 'bg-blue-500/80 text-blue-foreground';
      case 'Self-Assessment':
        return 'bg-yellow-500/80 text-yellow-foreground';
      case 'Not Started':
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Kinerja">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Siklus Penilaian Baru
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:gap-8 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    Siklus Penilaian Kinerja
                </CardTitle>
                <CardDescription>
                    Kelola dan lacak siklus penilaian kinerja karyawan.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>Karyawan</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Rating Akhir</TableHead>
                    <TableHead className="text-center">Tindakan</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-6 w-28 mx-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                    </TableRow>
                    ))
                ) : performanceReviews?.length > 0 ? (
                    performanceReviews.map((review) => (
                    <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.period}</TableCell>
                        <TableCell>{review.employeeName}</TableCell>
                        <TableCell className="text-center">
                        <Badge className={cn(getStatusClass(review.status))}>
                            {review.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                            {review.status === 'Completed' ? `${review.overallRating}/5` : 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">
                        <Link href={`#`}>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </Link>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        Belum ada siklus penilaian yang dibuat.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Distribusi Kinerja</CardTitle>
                <CardDescription>Distribusi rating kinerja karyawan pada siklus terakhir (Q2 2024).</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                        <Pie data={performanceDistribution} dataKey="count" nameKey="rating" cx="50%" cy="50%" outerRadius={100}>
                             {performanceDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                         <ChartLegend
                            content={<ChartLegendContent nameKey="rating" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                 </ChartContainer>
            </CardContent>
        </Card>
      </div>

    </main>
  );
}
