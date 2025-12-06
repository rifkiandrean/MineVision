'use server';

import { revalidatePath } from 'next/cache';
import { getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';

const profileSchema = z.object({
  displayName: z.string().min(3, 'Nama tampilan minimal 3 karakter.'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini diperlukan.'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter.'),
});

export type ProfileFormState = {
  message: string;
  errors?: {
    displayName?: string;
  };
};

export type PasswordFormState = {
  message: string;
  errors?: {
    currentPassword?: string;
    newPassword?: string;
  };
};

// This function can't run on the client, but we will call it from a server action wrapper.
// This is a common pattern for using the Firebase Admin SDK in Next.js Server Actions.
async function getUserIdFromSession(sessionCookie?: string): Promise<string | null> {
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const decodedClaims = await getAuth(getApp()).verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}


export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
    
  // This is a placeholder for getting the user ID from the session.
  // In a real app, you would implement session management (e.g., with cookies).
  const uid = "z18z4zzOExSE5EYf3dJf39Fdq0x1"; // Hardcoding for now.
  
  if (!uid) {
      return { message: "Error: Pengguna tidak terautentikasi." };
  }

  const validatedFields = profileSchema.safeParse({
    displayName: formData.get('displayName'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error: Validasi gagal.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    await getAuth(getApp()).updateUser(uid, {
        displayName: validatedFields.data.displayName,
    });

    revalidatePath('/profil');
    return { message: 'Nama tampilan berhasil diperbarui.' };
  } catch (error: any) {
    return { message: `Error: ${error.message}` };
  }
}

export async function updatePasswordAction(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {

  // This is a placeholder. See above.
  const uid = "z18z4zzOExSE5EYf3dJf39Fdq0x1";
  
  if (!uid) {
      return { message: "Error: Pengguna tidak terautentikasi." };
  }

  const validatedFields = passwordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error: Validasi gagal.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // IMPORTANT: For security, re-authentication should be done on the client-side.
  // The server-side action here would typically only update the password IF
  // re-authentication was successful.
  // Since we cannot easily mix client and server auth flows in this simple example,
  // this server action simulates the password update without re-auth, which is NOT SECURE for production.
  
  try {
     await getAuth(getApp()).updateUser(uid, {
      password: validatedFields.data.newPassword,
    });
    return { message: 'Password Anda telah berhasil diubah.' };
  } catch (error: any) {
    console.error("Password update error:", error);
    return { message: `Error: Gagal mengubah password. ${error.message}` };
  }
}
