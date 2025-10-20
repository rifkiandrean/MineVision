import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SdmPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: SDM" />
      <Card>
        <CardHeader>
          <CardTitle>HRD Dashboard</CardTitle>
          <CardDescription>
            This is a placeholder for the Human Resources department's dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Employee database, leave management, and training schedules will be displayed here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
