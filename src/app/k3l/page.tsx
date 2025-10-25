
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnomalyDetectionForm } from './anomaly-form';

export default function K3LPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="K3L & Lingkungan" />
      <div className="grid gap-4 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Peringatan Anomali Otomatis</CardTitle>
            <CardDescription>
              Gunakan AI untuk memprediksi dan memberikan peringatan dini tentang potensi insiden.
              Masukkan data real-time dari berbagai sumber untuk mengidentifikasi anomali.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnomalyDetectionForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
