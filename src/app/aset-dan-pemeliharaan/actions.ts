
'use server';

import { z } from 'zod';

const formSchema = z.object({
  assetId: z.string().min(3, 'ID Aset minimal 3 karakter.'),
  name: z.string().min(5, 'Nama Aset minimal 5 karakter.'),
  type: z.string().min(3, 'Tipe Aset minimal 3 karakter.'),
  location: z.string().min(3, 'Lokasi minimal 3 karakter.'),
  status: z.enum(['Operasional', 'Perawatan', 'Siaga', 'Rusak']),
  purchaseDate: z.string().min(1, 'Tanggal pembelian harus diisi.'),
  initialCost: z.coerce.number().min(1, 'Biaya awal harus diisi.'),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
  data?: {
    assetId: string;
    name: string;
    type: string;
    location: string;
    status: 'Operasional' | 'Perawatan' | 'Siaga' | 'Rusak';
    purchaseDate: string;
    initialCost: number;
  };
};

export async function createAsset(prevState: any, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    assetId: formData.get('assetId'),
    name: formData.get('name'),
    type: formData.get('type'),
    location: formData.get('location'),
    status: formData.get('status'),
    purchaseDate: formData.get('purchaseDate'),
    initialCost: formData.get('initialCost'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Harap periksa kembali isian Anda.',
      errors: {
        assetId: fieldErrors.assetId?.[0],
        name: fieldErrors.name?.[0],
        type: fieldErrors.type?.[0],
        location: fieldErrors.location?.[0],
        status: fieldErrors.status?.[0],
        purchaseDate: fieldErrors.purchaseDate?.[0],
        initialCost: fieldErrors.initialCost?.[0],
      },
    };
  }

  // If validation is successful, return the data to be processed on the client
  return {
    message: 'Validation successful. Submitting asset...',
    data: validatedFields.data,
  };
}
