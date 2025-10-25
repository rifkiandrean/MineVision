
'use server';

import { z } from 'zod';

const formSchema = z.object({
  type: z.enum(['Near Miss', 'Hazard Report', 'Property Damage', 'First Aid', 'Lost Time Injury']),
  location: z.string().min(3, 'Lokasi kejadian harus diisi (minimal 3 karakter).'),
  date: z.string().min(1, 'Tanggal kejadian harus diisi.'),
  description: z.string().min(10, 'Deskripsi kejadian harus diisi (minimal 10 karakter).'),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
  data?: {
    type: 'Near Miss' | 'Hazard Report' | 'Property Damage' | 'First Aid' | 'Lost Time Injury';
    location: string;
    date: string;
    description: string;
  };
};

export async function createIncident(prevState: any, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    type: formData.get('type'),
    location: formData.get('location'),
    date: formData.get('date'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Harap periksa kembali isian Anda.',
      errors: {
        type: fieldErrors.type?.[0],
        location: fieldErrors.location?.[0],
        date: fieldErrors.date?.[0],
        description: fieldErrors.description?.[0],
      },
    };
  }

  // Jika validasi berhasil, kembalikan data untuk diproses di client
  return {
    message: 'Validation successful. Submitting incident...',
    data: validatedFields.data,
  };
}
