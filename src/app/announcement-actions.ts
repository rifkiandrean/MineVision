
'use server';

import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter.'),
  department: z.string().min(2, 'Departemen minimal 2 karakter.'),
  priority: z.enum(['High', 'Medium', 'Low']),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
  data?: {
    title: string;
    department: string;
    priority: 'High' | 'Medium' | 'Low';
  };
};

export async function createAnnouncement(
  prevState: any,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    title: formData.get('title'),
    department: formData.get('department'),
    priority: formData.get('priority'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Harap periksa kembali isian Anda.',
      errors: {
        title: fieldErrors.title?.[0],
        department: fieldErrors.department?.[0],
        priority: fieldErrors.priority?.[0],
      },
    };
  }

  // Jika validasi berhasil, kembalikan data untuk diproses di client
  return {
    message: 'Validation successful. Submitting announcement...',
    data: validatedFields.data,
  };
}
