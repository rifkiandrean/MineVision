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

export default function Home() {
  const kpiData = [
    {
      title: 'Total Production (Ton)',
      value: '1,250,000',
      change: '+12.5%',
      changeType: 'positive' as 'positive' | 'negative',
      icon: <BarChart4 className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Equipment Availability',
      value: '92.8%',
      change: '-1.2%',
      changeType: 'negative' as 'positive' | 'negative',
      icon: <Truck className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Safety Incidents',
      value: '2',
      change: '+1',
      changeType: 'negative' as 'positive' | 'negative',
      icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
    },
    {
      title: 'Environmental Compliance',
      value: '99.5%',
      change: '+0.1%',
      changeType: 'positive' as 'positive' | 'negative',
      icon: <Activity className="h-6 w-6 text-primary" />,
    },
  ];

  const announcements = [
    {
      title: 'Scheduled Maintenance for Crusher-01',
      date: 'June 25, 2024',
      department: 'Processing',
      priority: 'High' as 'High' | 'Medium' | 'Low',
    },
    {
      title: 'New Safety Protocols for Blasting Area',
      date: 'June 24, 2024',
      department: 'K3L',
      priority: 'Medium' as 'High' | 'Medium' | 'Low',
    },
    {
      title: 'Quarterly Town Hall Meeting',
      date: 'June 22, 2024',
      department: 'HRD',
      priority: 'Low' as 'High' | 'Medium' | 'Low',
    },
  ];

  const priorityColors = {
    High: 'bg-destructive/80 hover:bg-destructive',
    Medium: 'bg-accent/80 hover:bg-accent',
    Low: 'bg-secondary hover:bg-secondary/90',
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
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              {kpi.icon}
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
              {announcements.map((ann) => (
                <div
                  key={ann.title}
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
                        className={cn('text-xs', priorityColors[ann.priority])}
                      >
                        {ann.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ann.department} &middot; {ann.date}
                    </p>´
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Coal Extraction
              </span>
              <Badge variant="outline" className="border-green-500 text-green-500">
                Optimal
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Overburden Removal
              </span>
              <Badge variant="outline" className="border-green-500 text-green-500">
                Optimal
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Crushing Plant
              </span>
              <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                Warning
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Barging & Shipment
              </span>
              <Badge variant="outline" className="border-red-500 text-red-500">
                Halted
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
