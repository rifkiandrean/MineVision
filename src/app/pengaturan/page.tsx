
'use client';

import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const initialMenuItems = [
    { id: 1, name: 'Dashboard', path: '/' },
    { id: 2, name: 'Produksi', path: '/produksi' },
    { id: 3, name: 'Geologi', path: '/geologi' },
    { id: 4, name: 'Pengolahan', path: '/pengolahan' },
    { id: 5, name: 'K3L', path: '/k3l' },
]

export default function SettingsPage() {
  const [websiteName, setWebsiteName] = useState('MineVision');
  const [menuItems, setMenuItems] = useState(initialMenuItems);

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
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Pengaturan Halaman</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="website-name">Nama Website</Label>
                        <Input 
                            id="website-name" 
                            value={websiteName}
                            onChange={(e) => setWebsiteName(e.target.value)}
                            placeholder="e.g. MineVision"
                        />
                         <p className="text-sm text-muted-foreground">
                            Ini akan mengubah judul yang muncul di tab browser.
                        </p>
                    </div>

                    <div className="space-y-2">
                         <Label htmlFor="website-logo">Logo Website</Label>
                         <Input id="website-logo" type="file" className="max-w-xs" />
                         <p className="text-sm text-muted-foreground">
                            Unggah logo baru (disarankan format .png atau .svg).
                        </p>
                    </div>
                    
                    <Separator />

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium">Menu Halaman</h4>
                            <p className="text-sm text-muted-foreground">
                                Atur item navigasi yang muncul di sidebar.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {menuItems.map(item => (
                                <div key={item.id} className="flex items-center gap-2 p-2 rounded-md border">
                                    <Input value={item.name} className="h-9"/>
                                    <Input value={item.path} className="h-9"/>
                                    <Button variant="ghost" size="icon" className="text-destructive h-9 w-9">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                         <Button variant="outline">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Menu Halaman
                        </Button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button className="bg-primary">Simpan Perubahan</Button>
                    </div>

                </div>
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
