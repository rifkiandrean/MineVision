
'use server';

import { addDocumentNonBlocking } from '@/firebase';
import { collection, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/index';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  employeeName: z.string().min(1, 'Nama karyawan diperlukan'),
  startDate: z.string().min(1, 'Tanggal mulai diperlukan'),
  endDate: z.string().min(1, 'Tanggal selesai diperlukan'),
  reason: z.string().min(5, 'Alasan harus diisi, minimal 5 karakter'),
});

export async function handleLeaveRequest(prevState: any, formData: FormData) {
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

  try {
    // We need to initialize firebase server-side to get the firestore instance
    const { firestore } = initializeFirebase();
    const leaveRequestsCollection = collection(firestore, 'leaveRequests');
    
    const newRequest = {
      ...validatedFields.data,
      requestDate: new Date().toISOString(),
      status: 'pending',
    };

    await addDocumentNonBlocking(leaveRequestsCollection, newRequest);
    
    revalidatePath('/administrasi/sdm');

    return { message: 'Pengajuan cuti Anda telah berhasil dikirim.' };
  } catch (e: any) {
    return {
      message: 'Error: Gagal menyimpan pengajuan ke database. ' + e.message,
    };
  }
}
