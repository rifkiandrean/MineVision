
'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  priority: z.enum(['Low', 'Medium', 'High']),
  userId: z.string().min(1, "User ID is required."),
  userEmail: z.string().email("A valid user email is required."),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
};

export async function createTicket(prevState: any, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    subject: formData.get('subject'),
    priority: formData.get('priority'),
    userId: formData.get('userId'),
    userEmail: formData.get('userEmail'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Error: Please check your input.',
      errors: {
        subject: fieldErrors.subject?.[0],
        priority: fieldErrors.priority?.[0],
      },
    };
  }

  try {
    const { firestore } = initializeFirebase();
    
    const ticketsCollection = collection(firestore, 'helpdeskTickets');
    
    const newTicket = {
      subject: validatedFields.data.subject,
      priority: validatedFields.data.priority,
      userId: validatedFields.data.userId,
      userEmail: validatedFields.data.userEmail,
      status: 'Open' as const,
      createdAt: new Date().toISOString(),
      ticketId: Date.now().toString().slice(-6)
    };

    await addDoc(ticketsCollection, newTicket);

    revalidatePath('/administrasi/it');

    return {
      message: 'Ticket has been successfully created.',
    };

  } catch (e: any) {
    console.error('Failed to create ticket:', e);
    return {
      message: 'Error: Could not create ticket in the database.',
    };
  }
}
