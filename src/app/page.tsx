'use client';

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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/page-header';
import { cn } from '@/lib/utils';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { firestore } = useFirebase();

  const kpiQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'kpi'), limit(4));
  }, [firestore]);

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'announcements'),
      orderBy('date', 'desc'),
      limit(3)
    );
  }, [firestore]);

  const productionStatusQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'productionStatus');
  }, [firestore]);

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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </CardContent>
              </Card>
            ))
          : kpiData?.map((kpi) => (
              <Card key={kpi.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {kpi.title}
                  </CardTitle>
                  {kpiIcons[kpi.title] || (
                    <BarChart4 className="h-6 w-6 text-primary" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p
                    className={`text-xs ${
                      kpi.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {kpi.change} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>
              Stay updated with the latest company news and alerts.
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Production Status</CardTitle>
            <CardDescription>Real-time production overview.</CardDescription>
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
    </main>
  );
}
