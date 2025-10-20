import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function KeuanganPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: Keuangan" />
      <Card>
        <CardHeader>
          <CardTitle>Financial Dashboard</CardTitle>
          <CardDescription>
            This is a placeholder for the finance department's dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Financial reports, budget tracking, and sales dashboards will be displayed here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
