import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

const plants = [
  { name: 'Crusher Plant 1', status: 'Online', throughput: 85, energy: 1.2, alert: false },
  { name: 'Crusher Plant 2', status: 'Online', throughput: 92, energy: 1.1, alert: false },
  { name: 'Washing Plant A', status: 'Offline', throughput: 0, energy: 0, alert: true },
  { name: 'Barging Conveyor 1', status: 'Online', throughput: 98, energy: 0.8, alert: false },
]

export default function PengolahanPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Pengolahan" />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Data Kualitas Produk</CardTitle>
                <CardDescription>Rata-rata kualitas produk hari ini.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Total Ash</p>
                    <p className="text-2xl font-bold">8.5%</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total Moisture</p>
                    <p className="text-2xl font-bold">12.1%</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total Sulphur</p>
                    <p className="text-2xl font-bold">0.7%</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Calorific Value (GAR)</p>
                    <p className="text-2xl font-bold">6,320</p>
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Stockpile Volume</CardTitle>
                <CardDescription>Kapasitas stockpile saat ini.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm">Stockpile A (High CV)</span>
                            <span className="text-sm font-medium">125,000 / 200,000 MT</span>
                        </div>
                        <Progress value={62.5} />
                    </div>
                     <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm">Stockpile B (Low CV)</span>
                            <span className="text-sm font-medium">80,000 / 150,000 MT</span>
                        </div>
                        <Progress value={53.3} />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kinerja Peralatan</CardTitle>
          <CardDescription>Status real-time dari unit pengolahan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
            {plants.map(plant => (
                <Card key={plant.name}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">{plant.name}</CardTitle>
                        <Badge variant={plant.status === 'Online' ? 'default' : 'destructive'} className={plant.status === 'Online' ? 'bg-green-500' : ''}>
                            {plant.status}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Throughput: {plant.throughput}%</p>
                        <Progress value={plant.throughput} className="my-2 h-2" />
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Zap className="h-4 w-4 mr-2" />
                            <span>Energy Consumption: {plant.energy} MWh</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </CardContent>
      </Card>
    </main>
  );
}
