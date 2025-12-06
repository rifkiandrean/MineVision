'use server';

import { z } from 'zod';

const profileSchema = z.object({
  displayName: z.string().min(3, 'Nama tampilan minimal 3 karakter.'),
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

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const validatedFields = profileSchema.safeParse({
    displayName: formData.get('displayName'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Error: Validasi gagal.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Validation is successful. The client will handle the actual update.
  return { message: 'Validasi berhasil. Memperbarui profil di sisi klien...' };
}

export async function validatePasswordChange(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Password saat ini diperlukan.'),
    newPassword: z.string().min(8, 'Password baru minimal 8 karakter.'),
  });

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
  
  // Validation successful. The client will now handle re-authentication and update.
  return { message: 'Validasi berhasil. Lanjutkan dengan re-autentikasi.' };
}
