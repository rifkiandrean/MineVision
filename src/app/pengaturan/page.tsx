import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Pengaturan" />
      <Card>
        <CardHeader>
          <CardTitle>Halaman Pengaturan</CardTitle>
          <CardDescription>
            Ini adalah placeholder untuk halaman pengaturan aplikasi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Opsi dan preferensi aplikasi akan dapat dikonfigurasi di sini.</p>
        </CardContent>
      </Card>
    </main>
  );
}
