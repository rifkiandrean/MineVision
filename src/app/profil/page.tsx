'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { updateProfile, validatePasswordChange, type ProfileFormState, type PasswordFormState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile as updateClientProfile } from 'firebase/auth';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        children
      )}
    </Button>
  );
}

const initialProfileState: ProfileFormState = { message: '' };
const initialPasswordState: PasswordFormState = { message: '' };

export default function ProfilePage() {
  const { user, auth } = useFirebase();
  const { toast } = useToast();
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const profileFormRef = useRef<HTMLFormElement>(null);

  const [profileState, profileAction] = useActionState(updateProfile, initialProfileState);
  const [passwordState, passwordAction] = useActionState(validatePasswordChange, initialPasswordState);

  // Effect for handling Profile Update
  useEffect(() => {
    async function handleProfileUpdate() {
        if (!user || !auth || !profileFormRef.current) return;
        
        const formData = new FormData(profileFormRef.current);
        const displayName = formData.get('displayName') as string;

        try {
            await updateClientProfile(user, { displayName });
            toast({
                title: 'Profil Diperbarui',
                description: 'Nama tampilan Anda telah berhasil diperbarui.',
            });
             // You might want to trigger a refresh of user data if needed
        } catch (error: any) {
            console.error("Client profile update error:", error);
            toast({
                variant: 'destructive',
                title: 'Gagal Memperbarui Profil',
                description: error.message || 'Terjadi kesalahan di sisi klien.',
            });
        }
    }
      
    if (profileState.message.startsWith('Validasi berhasil')) {
        handleProfileUpdate();
    } else if (profileState.message.startsWith('Error')) {
      toast({
          variant: 'destructive',
          title: 'Gagal Memperbarui Profil',
          description: Object.values(profileState.errors || {}).join(' ') || profileState.message,
      });
    }
  }, [profileState, toast, user, auth]);

  // Effect for handling Password Update
  useEffect(() => {
    async function handlePasswordUpdate() {
        if (!user || !auth || !passwordFormRef.current) return;

        const formData = new FormData(passwordFormRef.current);
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;

        if (!currentPassword || !newPassword) return;

        try {
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);
            
            await updatePassword(user, newPassword);

            toast({
                title: 'Password Berhasil Diubah',
                description: 'Password Anda telah berhasil diperbarui.',
            });
            passwordFormRef.current?.reset();

        } catch (error: any) {
            console.error("Password update error:", error);
            let description = 'Terjadi kesalahan. Silakan coba lagi.';
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = 'Password saat ini yang Anda masukkan salah.';
            }
            toast({
                variant: 'destructive',
                title: 'Gagal Mengubah Password',
                description,
            });
        }
    }

    if (passwordState.message.startsWith('Validasi berhasil')) {
        handlePasswordUpdate();
    } else if (passwordState.message.startsWith('Error')) {
        toast({
            variant: 'destructive',
            title: 'Gagal Mengubah Password',
            description: Object.values(passwordState.errors || {}).join(' ') || passwordState.message,
        });
    }
  }, [passwordState, toast, user, auth]);

  return (
    <main className="flex flex-1 flex-col">
      <PageHeader title="Profil Pengguna" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>
              Ubah informasi pribadi dan detail akun Anda di sini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={profileFormRef} action={profileAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Nama Tampilan</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={user?.displayName || ''}
                  className="max-w-sm"
                />
                {profileState.errors?.displayName && (
                  <p className="text-sm text-destructive">{profileState.errors.displayName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="max-w-sm"
                />
              </div>
              <SubmitButton>Simpan Perubahan</SubmitButton>
            </form>

            <Separator className="my-8" />

            <form ref={passwordFormRef} action={passwordAction} className="space-y-4">
               <h3 className="text-lg font-medium">Ubah Password</h3>
               <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  className="max-w-sm"
                />
                 {passwordState.errors?.currentPassword && (
                  <p className="text-sm text-destructive">{passwordState.errors.currentPassword}</p>
                )}
              </div>
               <div className="space-y-2">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="max-w-sm"
                />
                 {passwordState.errors?.newPassword && (
                  <p className="text-sm text-destructive">{passwordState.errors.newPassword}</p>
                )}
              </div>
               <SubmitButton>Ubah Password</SubmitButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
