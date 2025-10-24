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
            <CardTitle>Automated Anomaly Alerts</CardTitle>
            <CardDescription>
              Use AI to predict and provide early warnings on potential incidents.
              Input real-time data from various sources to identify anomalies.
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