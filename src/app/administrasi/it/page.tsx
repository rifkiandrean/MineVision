import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ItPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: IT" />
      <Card>
        <CardHeader>
          <CardTitle>IT Department Dashboard</CardTitle>
          <CardDescription>
            This is a placeholder for the IT department's dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>IT asset inventory, helpdesk tickets, and network status will be displayed here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
