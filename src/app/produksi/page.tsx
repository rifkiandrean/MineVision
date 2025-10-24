
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
import { PlusCircle } from 'lucide-react';

const equipment = [
  { id: 'DT-101', type: 'Dump Truck', status: 'Operational', fuel: '85%' },
  { id: 'EX-05', type: 'Excavator', status: 'Maintenance', fuel: 'N/A' },
  { id: 'DZ-22', type: 'Dozer', status: 'Operational', fuel: '72%' },
  { id: 'WL-03', type: 'Wheel Loader', status: 'Idle', fuel: '91%' },
];

export default function ProduksiPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Operasi Tambang">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Report
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Material Moved</CardTitle>
            <CardDescription>Today</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">15,750 BCM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Cycle Time</CardTitle>
            <CardDescription>Dump Truck Fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">32.5 min</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Laporan Alat Berat</CardTitle>
          <CardDescription>
            Real-time status of heavy equipment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fuel Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'Operational'
                          ? 'default'
                          : item.status === 'Maintenance'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={item.status === 'Operational' ? 'bg-green-500' : ''}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.fuel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
