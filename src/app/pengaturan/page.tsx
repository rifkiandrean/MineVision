
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { useFirebase, useDoc, useMemoFirebase, setDocumentNonBlocking, useCollection } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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

const defaultPermissions: { [key: string]: boolean } = {};
allPermissions.forEach((p) => {
    defaultPermissions[p.id] = false;
});


export default function SettingsPage() {
  const { auth, user, firestore, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();

  const [websiteName, setWebsiteName] = useState('MineVision');
  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);
  
  const { data: userAccounts, isLoading: usersLoading } = useCollection<{id: string; email: string; department: string}>(usersQuery);

  const [selectedAccount, setSelectedAccount] = useState<string>('z18z4zzOExSE5EYf3dJf39Fdq0x1');

  const permissionsDocRef = useMemoFirebase(() => {
    if (!firestore || !selectedAccount) return null;
    return doc(firestore, 'userPermissions', selectedAccount);
  }, [firestore, selectedAccount]);

  const { data: savedPermissions, isLoading: permissionsLoading } = useDoc<{ permissions: { [key: string]: boolean } }>(permissionsDocRef);

  const [permissions, setPermissions] = useState(defaultPermissions);
  
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('Staff');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const isSuperAdmin = user?.email === 'rifkiandrean@gmail.com';
  const selectedUser = userAccounts?.find(acc => acc.id === selectedAccount);
  const selectedUserIsSuperAdmin = selectedUser?.department === 'Super Admin';

  useEffect(() => {
    async function createDefaultUsers() {
        if (!auth || !firestore) return;
        
        const usersToCreate = [
            { email: 'rifkiandrean@gmail.com', pass: 'password123', uid: 'z18z4zzOExSE5EYf3dJf39Fdq0x1', department: 'Super Admin' },
            { email: 'thoriq@gmail.com', pass: 'password123', uid: '8zoyGpdLOiaFyhL17sQWYqvFWz12', department: 'Manager' },
        ];

        for (const u of usersToCreate) {
             try {
                // Check if user exists in Auth
                try {
                    await createUserWithEmailAndPassword(auth, u.email, u.pass);
                     toast({ title: 'Akun Demo Dibuat', description: `Akun untuk ${u.email} telah dibuat.` });
                } catch (error: any) {
                    if (error.code !== 'auth/email-already-in-use') {
                        throw error;
                    }
                }
                
                // Set user data in Firestore
                const userDocRef = doc(firestore, 'users', u.uid);
                setDocumentNonBlocking(userDocRef, { uid: u.uid, email: u.email, department: u.department }, { merge: true });

            } catch (error: any) {
                 if (error.code !== 'auth/email-already-in-use') {
                    console.error(`Gagal membuat pengguna demo ${u.email}:`, error);
                }
            }
        }
    }

    if (isSuperAdmin) {
      createDefaultUsers();
    }
  }, [auth, isSuperAdmin, toast, firestore]);


  useEffect(() => {
      if (!isUserLoading && !user) {
          router.push('/login');
      } else if (!isUserLoading && user && !isSuperAdmin) {
          toast({
            variant: 'destructive',
            title: 'Akses Ditolak',
            description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
          });
          router.push('/');
      }
  }, [user, isUserLoading, isSuperAdmin, router, toast]);


  useEffect(() => {
    if (selectedUserIsSuperAdmin) {
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
  }, [selectedAccount, selectedUserIsSuperAdmin, savedPermissions, permissionsLoading]);


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
    if (selectedUserIsSuperAdmin) return; // Prevent changes for Super Admin
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const handleSavePermissions = async () => {
    if (!firestore || !selectedAccount || selectedUserIsSuperAdmin) return;
    
    const docRef = doc(firestore, 'userPermissions', selectedAccount);
    const dataToSave = {
        userId: selectedAccount,
        permissions: permissions
    };
    
    setDocumentNonBlocking(docRef, dataToSave, { merge: true });

    toast({
        title: 'Hak Akses Disimpan',
        description: `Hak akses untuk ${selectedUser?.email} telah diperbarui.`,
    });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Layanan otentikasi tidak tersedia.',
        });
        return;
    }
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
      
      const newUser = {
        uid: userCredential.user.uid,
        email: newUserEmail,
        department: newUserDepartment
      };

      // Save user info to 'users' collection
      const userDocRef = doc(firestore, 'users', newUser.uid);
      setDocumentNonBlocking(userDocRef, newUser, {});

      // Initialize permissions for the new user
      const newUserPermsRef = doc(firestore, 'userPermissions', newUser.uid);
      setDocumentNonBlocking(newUserPermsRef, { userId: newUser.uid, permissions: defaultPermissions }, { merge: true });

      toast({
        title: 'Akun Dibuat',
        description: `Akun untuk ${newUserEmail} berhasil dibuat.`,
      });

      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserDepartment('Staff');

    } catch (error: any) {
      // This catch block handles Auth errors (like email-already-in-use)
      // Firestore permission errors from setDocumentNonBlocking are handled globally.
      if (error.code?.startsWith('auth/')) {
        toast({
          variant: 'destructive',
          title: 'Gagal Membuat Akun',
          description: error.message || 'Terjadi kesalahan otentikasi.',
        });
      }
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (isUserLoading || !isSuperAdmin) {
      return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-64" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </main>
      )
  }

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
                        <SelectTrigger id="account-select" disabled={usersLoading}>
                          <SelectValue placeholder="Pilih akun untuk dikonfigurasi" />
                        </SelectTrigger>
                        <SelectContent>
                           {usersLoading ? (
                             <SelectItem value="loading" disabled>Memuat akun...</SelectItem>
                           ) : (
                            userAccounts?.map(account => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.email} ({account.department})
                              </SelectItem>
                            ))
                           )}
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
                        Atur izin akses untuk <span className="font-semibold">{selectedUser?.email}</span>.
                      </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-md border p-4">
                    {permissionsLoading ? (
                      Array.from({ length: allPermissions.length }).map((_, i) => (
                         <div key={i} className="flex items-center space-x-2">
                           <Skeleton className="h-4 w-4" />
                           <Skeleton className="h-4 w-48" />
                         </div>
                      ))
                    ) : (
                      allPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={permissions[permission.id] || false}
                            onCheckedChange={() => handlePermissionChange(permission.id)}
                            disabled={selectedUserIsSuperAdmin}
                          />
                          <Label
                            htmlFor={`perm-${permission.id}`}
                            className={cn("font-normal", selectedUserIsSuperAdmin ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer")}
                          >
                            {permission.label}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                   {selectedUserIsSuperAdmin && (
                        <p className="text-sm text-accent-foreground rounded-md bg-accent p-2">
                            Akun Super Admin memiliki semua izin akses dan tidak dapat diubah.
                        </p>
                    )}
                  <div className="flex justify-end pt-4">
                    <Button className="bg-primary" onClick={handleSavePermissions} disabled={selectedUserIsSuperAdmin}>Simpan Perubahan Hak Akses</Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      {isSuperAdmin && (
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
                        <Label htmlFor="new-department">Departemen</Label>
                        <Select value={newUserDepartment} onValueChange={setNewUserDepartment}>
                            <SelectTrigger id="new-department">
                                <SelectValue placeholder="Pilih departemen" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Supervisor">Supervisor</SelectItem>
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
    
    

    

    
