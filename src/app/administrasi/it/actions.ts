
'use server';

import { z } from 'zod';

const formSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  priority: z.enum(['Low', 'Medium', 'High']),
});

export type FormState = {
  message: string;
  errors?: Record<string, string | undefined>;
  data?: {
    subject: string;
    priority: 'Low' | 'Medium' | 'High';
  };
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

  // If validation is successful, return the data to be processed on the client
  return {
    message: 'Validation successful. Submitting ticket...',
    data: validatedFields.data,
  };
}
