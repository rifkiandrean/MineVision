
'use server';

import { z } from 'zod';

const formSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  priority: z.enum(['Low', 'Medium', 'High']),
  userId: z.string().min(1, "User ID is required."),
  userEmail: z.string().email("A valid user email is required."),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
  data?: {
    subject: string;
    priority: 'Low' | 'Medium' | 'High';
    userId: string;
    userEmail: string;
  };
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

  // If validation is successful, return the data to the client to handle submission
  return {
    message: 'Validation successful. Submitting ticket...',
    data: validatedFields.data,
  };
}
