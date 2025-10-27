
'use server';

import { z } from 'zod';
import { eachDayOfInterval } from 'date-fns';

const FormSchema = z.object({
  userId: z.string().min(1, { message: 'Karyawan harus dipilih.' }),
  dateRange: z
    .object({
      from: z.date({ required_error: 'Tanggal mulai harus diisi.' }),
      to: z.date({ required_error: 'Tanggal selesai harus diisi.' }),
    })
    .refine((data) => data.from <= data.to, {
      message: 'Tanggal selesai harus setelah atau sama dengan tanggal mulai.',
      path: ['to'],
    }),
  shift: z.string().min(1, { message: 'Shift harus dipilih.' }),
  status: z.enum(['Hadir', 'Sakit', 'Izin', 'Alpa', 'Cuti']),
});

export type FormState = {
  message: string;
  errors?: {
    userId?: string[];
    dateRange?: string[];
    shift?: string[];
    status?: string[];
  };
  data?: {
    userId: string,
    dates: Date[],
    shift: string,
    status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa' | 'Cuti',
  }
};

export async function createSchedule(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const fromDateStr = formData.get('dateRange.from');
  const toDateStr = formData.get('dateRange.to');

  const validatedFields = FormSchema.safeParse({
    userId: formData.get('userId'),
    dateRange: {
      from: fromDateStr ? new Date(fromDateStr as string) : undefined,
      to: toDateStr ? new Date(toDateStr as string) : undefined,
    },
    shift: formData.get('shift'),
    status: formData.get('status'),
  });
  

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Harap periksa kembali isian Anda.',
      errors: {
          userId: fieldErrors.userId,
          dateRange: fieldErrors.dateRange?.map(e => e.toString()), // Convert object errors to string array
          shift: fieldErrors.shift,
          status: fieldErrors.status,
      },
    };
  }

  const { from, to } = validatedFields.data.dateRange;
  const dates = eachDayOfInterval({ start: from, end: to });

  return {
    message: 'Validation successful. Submitting schedule...',
    data: {
      ...validatedFields.data,
      dates: dates,
    },
  };
}
