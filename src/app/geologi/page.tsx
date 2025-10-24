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
import { Map, Upload } from 'lucide-react';
import Image from "next/image";

const drillData = [
    { holeId: 'DH-001', depth: '150m', seam: 'S-A1', calorific: '6300 GAR' },
    { holeId: 'DH-002', depth: '175m', seam: 'S-A1', calorific: '6350 GAR' },
    { holeId: 'DH-003', depth: '160m', seam: 'S-A2', calorific: '6100 GAR' },
    { holeId: 'DH-004', depth: '180m', seam: 'S-B1', calorific: '5800 GAR' },
]

export default function GeologiPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Geologi & Eksplorasi">
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Upload className="mr-2 h-4 w-4" />
          Upload Data
        </Button>
      </PageHeader>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Peta Cadangan</CardTitle>
                <CardDescription>Visualisasi cadangan sumber daya.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    <Image src="https://picsum.photos/seed/map/1200/600" alt="Peta Cadangan" fill style={{objectFit: "cover"}} data-ai-hint="geology map" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <p className="text-white z-10 font-semibold">Map Data Unavailable</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Laporan Sumber Daya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-muted-foreground">Total Cadangan Terbukti</p>
                    <p className="text-2xl font-bold">120M Ton</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Total Cadangan Terduga</p>
                    <p className="text-2xl font-bold">250M Ton</p>
                </div>
                <Button variant="outline" className="w-full">
                    <Map className="mr-2 h-4 w-4" />
                    View Full Report
                </Button>
            </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Hasil Pengeboran</CardTitle>
          <CardDescription>Log dan assay dari aktivitas pengeboran terbaru.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hole ID</TableHead>
                <TableHead>Depth</TableHead>
                <TableHead>Seam</TableHead>
                <TableHead>Calorific Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {drillData.map(data => (
                    <TableRow key={data.holeId}>
                        <TableCell className="font-medium">{data.holeId}</TableCell>
                        <TableCell>{data.depth}</TableCell>
                        <TableCell>{data.seam}</TableCell>
                        <TableCell>{data.calorific}</TableCell>
                    </TableRow>
                ))}
            </TableBody