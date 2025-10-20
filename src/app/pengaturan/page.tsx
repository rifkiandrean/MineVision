import PageHeader from '@/components/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
          <CardTitle>Konfigurasi Aplikasi</CardTitle>
          <CardDescription>
            Kelola pengaturan halaman dan hak akses pengguna.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Pengaturan Halaman</AccordionTrigger>
              <AccordionContent>
                Placeholder untuk opsi konfigurasi halaman, seperti tema,
                bahasa, atau notifikasi.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Hak Akses & Peran Pengguna</AccordionTrigger>
              <AccordionContent>
                Placeholder untuk mengelola aturan akses akun pengguna dan
                peran di dalam aplikasi.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
