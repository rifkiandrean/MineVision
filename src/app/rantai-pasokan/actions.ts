
'use server';

import { z } from 'zod';

const formSchema = z.object({
  item: z.string().min(3, 'Nama item minimal 3 karakter.'),
  quantity: z.coerce.number().min(1, 'Kuantitas minimal 1.'),
  department: z.string().min(1, 'Departemen harus diisi.'),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
  data?: {
    item: string;
    quantity: number;
    department: string;
  };
};

export async function createPurchaseRequest(prevState: any, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    item: formData.get('item'),
    quantity: formData.get('quantity'),
    department: formData.get('department'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Harap periksa kembali isian Anda.',
      errors: {
        item: fieldErrors.item?.[0],
        quantity: fieldErrors.quantity?.[0],
        department: fieldErrors.department?.[0],
      },
    };
  }

  // If validation is successful, return the data to be processed on the client
  return {
    message: 'Validation successful. Submitting request...',
    data: validatedFields.data,
  };
}
