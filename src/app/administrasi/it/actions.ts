
'use server';

import { z } from 'zod';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const formSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  priority: z.enum(['Low', 'Medium', 'High']),
  // We'll get user info on the server, so it's not part of the form schema
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
};

export async function createTicket(prevState: any, formData: FormData): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    subject: formData.get('subject'),
    priority: formData.get('priority'),
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
    // This is a server action, we can safely initialize and use Firebase here.
    const { firestore } = initializeFirebase();
    
    const ticketsCollection = collection(firestore, 'helpdeskTickets');
    
    // We can't get user from useFirebase() hook in server action.
    // In a real app, you would get user from session or by passing uid from client.
    // For now, we will use placeholder data.
    const newTicket = {
      ...validatedFields.data,
      userId: 'server-user',
      userEmail: 'server@example.com',
      status: 'Open' as const,
      createdAt: new Date().toISOString(),
      ticketId: Date.now().toString().slice(-6)
    };

    await addDoc(ticketsCollection, newTicket);

    // Revalidate the path to show the new ticket immediately
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
