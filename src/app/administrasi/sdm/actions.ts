'use server';

import { z } from 'zod';

const formSchema = z.object({
  employeeName: z.string().min(1, 'Nama karyawan diperlukan'),
  startDate: z.string().min(1, 'Tanggal mulai diperlukan'),
  endDate: z.string().min(1, 'Tanggal selesai diperlukan'),
  reason: z.string().min(5, 'Alasan harus diisi, minimal 5 karakter'),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
  data?: {
    employeeName: string;
    startDate: string;
    endDate: string;
    reason: string;
  };
};


export async function validateLeaveRequest(prevState: any, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    employeeName: formData.get('employeeName'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Harap periksa kembali isian Anda.',
      errors: {
        employeeName: fieldErrors.employeeName?.[0],
        startDate: fieldErrors.startDate?.[0],
        endDate: fieldErrors.endDate?.[0],
        reason: fieldErrors.reason?.[0],
      },
    };
  }

  // If validation is successful, return the data to the client
  return {
    message: 'Validation successful. Submitting...',
    data: validatedFields.data,
  };
}