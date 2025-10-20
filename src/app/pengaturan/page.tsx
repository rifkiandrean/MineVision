
'use client';

import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAuth, useFirebase, useDoc, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const initialMenuItems = [
  { id: 1, name: 'Dashboard', path: '/' },
  { id: 2, name: 'Produksi', path: '/produksi' },
  { id: 3, name: 'Geologi', path: '/geologi' },
  { id: 4, name: 'Pengolahan', path: '/pengolahan' },
  { id: 5, name: 'K3L', path: '/k3l' },
];

const allPermissions = [
  { id: 'dashboard', label: 'Akses Dashboard Utama' },
  { id: 'produksi', label: 'Akses Halaman Produksi' },
  { id: 'geologi', label: 'Akses Halaman Geologi' },
  { id: 'pengolahan', label: 'Akses Halaman Pengolahan' },
  { id: 'k3l', label: 'Akses Halaman K3L' },
  { id: 'keuangan', label: 'Akses Halaman Administrasi Keuangan' },
  { id: 'sdm', label: 'Akses Halaman Administrasi SDM' },
  { id: 'it', label: 'Akses Halaman Administrasi IT' },
  { id: 'pengaturan', label: 'Akses Halaman Pengaturan' },
  { id: 'keuangan_approval', label: 'Izin Menyetujui Pembayaran (Keuangan)' },
  { id: 'sdm_approval', label: 'Izin Menyetujui Cuti (SDM)' },
];

const initialUserAccounts = [
  { id: 'usr-001', email: 'rifkiandrean@gmail.com', role: 'Super Admin' },
  { id: 'usr-002', email: 'manager.produksi@example.com', role: 'Manager' },
  { id: 'usr-003', email: 'staff.hr@example.com', role: 'Staff' },
];

const defaultPermissions: { [key: string]: boolean } = {};
allPermissions.forEach((p) => {
    defaultPermissions[p.id] = false;
});


export default function SettingsPage() {
  const { auth, user, firestore } = useFirebase();
  const { toast } = useToast();

  const [websiteName, setWebsiteName] = useState('MineVision');
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [userAccounts, setUserAccounts] = useState(initialUserAccounts);
  const [selectedAccount, setSelectedAccount] = useState<string>('usr-001');

  const permissionsDocRef = useMemoFirebase(() => {
    if (!firestore || !selectedAccount) return null;
    return doc(firestore, 'userPermissions', selectedAccount);
  }, [firestore, selectedAccount]);

  const { data: savedPermissions, isLoading: permissionsLoading } = useDoc<{ permissions: { [key: string]: boolean } }>(permissionsDocRef);

  const [permissions, setPermissions] = useState(defaultPermissions);
  
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Staff');
  const [isCreatingUser, setIsCreatingUser] = useState(false);


  const isSuperAdmin = userAccounts.find(acc => acc.id === selectedAccount)?.role === 'Super Admin';

  useEffect(() => {
    if (isSuperAdmin) {
        const allTruePermissions: { [key: string]: boolean } = {};
        allPermissions.forEach(p => {
            allTruePermissions[p.id] = true;
        });
        setPermissions(allTruePermissions);
    } else if (savedPermissions) {
        setPermissions(savedPermissions.permissions);
    } else if (!permissionsLoading) {
        setPermissions(defaultPermissions);
    }
  }, [selectedAccount, isSuperAdmin, savedPermissions, permissionsLoading]);


  const handleMenuItemChange = (id: number, field: 'name' | 'path', value: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addMenuItem = () => {
    const newId =
      menuItems.length > 0 ? Math.max(...menuItems.map((item) => item.id)) + 1 : 1;
    setMenuItems([...menuItems, { id: newId, name: 'New Menu', path: '/new-path' }]);
  };

  const removeMenuItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const handlePermissionChange = (permissionId: string) => {
    if (isSuperAdmin) return; // Prevent changes for Super Admin
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const handleSavePermissions = async () => {
    if (!firestore || !selectedAccount || isSuperAdmin) return;
    
    const docRef = doc(firestore, 'userPermissions', selectedAccount);
    const dataToSave = {
        userId: selectedAccount,
        permissions: permissions
    };
    
    setDocumentNonBlocking(docRef, dataToSave, { merge: true });

    toast({
        title: 'Hak Akses Disimpan',
        description: `Hak akses untuk ${userAccounts.find(acc => acc.id === selectedAccount)?.email} telah diperbarui.`,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Email dan password tidak boleh kosong.',
      });
      return;
    }
    setIsCreatingUser(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
      toast({
        title: 'Akun Dibuat',
        description: `Akun untuk ${newUserEmail} berhasil dibuat.`,
      });
      
      const newUser = {
        id: userCredential.user.uid,
        email: newUserEmail,
        role: newUserRole
      };
      setUserAccounts(prev => [...prev, newUser]);
      
      // Initialize permissions for the new user
      if (firestore) {
        const newUserPermsRef = doc(firestore, 'userPermissions', newUser.id);
        await setDoc(newUserPermsRef, { userId: newUser.id, permissions: defaultPermissions });
      }

      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('Staff');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Akun',
        description: error.message || 'Terjadi kesalahan.',
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

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
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
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
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 p-2 rounded-md border"
                        >
                          <Input
                            value={item.name}
                            onChange={(e) =>
                              handleMenuItemChange(item.id, 'name', e.target.value)
                            }
                            className="h-9"
                          />
                          <Input
                            value={item.path}
                            onChange={(e) =>
                              handleMenuItemChange(item.id, 'path', e.target.value)
                            }
                            className="h-9"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-9 w-9"
                            onClick={() => removeMenuItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" onClick={addMenuItem}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Tambah Menu Halaman
                    </Button>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button className="bg-primary">
                      Simpan Perubahan Halaman
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Hak Akses & Peran Pengguna</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6">
                  <div className="space-y-2 max-w-sm">
                     <Label htmlFor="account-select">Pilih Akun</Label>
                      <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger id="account-select">
                          <SelectValue placeholder="Pilih akun untuk dikonfigurasi" />
                        </SelectTrigger>
                        <SelectContent>
                          {userAccounts.map(account => (
                             <SelectItem key={account.id} value={account.id}>
                               {account.email} ({account.role})
                             </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Pilih akun untuk mengatur izin aksesnya di bawah ini.
                      </p>
                  </div>

                   <Separator />

                  <div>
                    <h4 className="font-medium">Izin Akses untuk Akun Terpilih</h4>
                     <p className="text-sm text-muted-foreground">
                        Atur izin akses untuk <span className="font-semibold">{userAccounts.find(acc => acc.id === selectedAccount)?.email}</span>.
                      </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md border p-4">
                    {allPermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`perm-${permission.id}`}
                          checked={permissions[permission.id] || false}
                          onCheckedChange={() => handlePermissionChange(permission.id)}
                          disabled={isSuperAdmin || permissionsLoading}
                        />
                        <Label
                          htmlFor={`perm-${permission.id}`}
                          className={cn("font-normal", (isSuperAdmin || permissionsLoading) ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                   {isSuperAdmin && (
                        <p className="text-sm text-accent-foreground rounded-md bg-accent p-2">
                            Akun Super Admin memiliki semua izin akses dan tidak dapat diubah.
                        </p>
                    )}
                  <div className="flex justify-end pt-4">
                    <Button className="bg-primary" onClick={handleSavePermissions} disabled={isSuperAdmin}>Simpan Perubahan Hak Akses</Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      {user?.email === 'rifkiandrean@gmail.com' && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Tambah Akun Baru</CardTitle>
                <CardDescription>Hanya Super Admin yang dapat menambahkan akun baru.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleCreateUser}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-email">Email Pengguna</Label>
                            <Input id="new-email" type="email" placeholder="email@example.com" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="new-password">Password Sementara</Label>
                            <Input id="new-password" type="password" placeholder="********" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
                        </div>
                    </div>
                     <div className="space-y-2 max-w-sm">
                        <Label htmlFor="new-role">Peran</Label>
                        <Select value={newUserRole} onValueChange={setNewUserRole}>
                            <SelectTrigger id="new-role">
                                <SelectValue placeholder="Pilih peran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex justify-end pt-4">
                        <Button type="submit" className="bg-primary" disabled={isCreatingUser}>
                            {isCreatingUser ? 'Menambahkan...' : 'Tambah Akun'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
      )}
    </main>
  );
}
