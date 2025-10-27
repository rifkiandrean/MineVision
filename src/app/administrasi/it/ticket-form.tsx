
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createTicket, type FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Ticket'
      )}
    </Button>
  );
}

interface TicketFormProps {
    onTicketCreated: () => void;
}

export function TicketForm({ onTicketCreated }: TicketFormProps) {
  const { user } = useFirebase();
  const [state, formAction] = useActionState(createTicket, initialState);
  const [priority, setPriority] = useState('Medium');
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;

    if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Failed to Create Ticket',
        description: state.message,
      });
    } else {
      toast({
        title: 'Ticket Submitted',
        description: 'Your helpdesk ticket has been successfully created.',
      });
      // Close the dialog and reset the form
      onTicketCreated();
      formRef.current?.reset();
      setPriority('Medium');
    }
  }, [state, toast, onTicketCreated]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 pt-4">
       <input type="hidden" name="userId" value={user?.uid || ''} />
       <input type="hidden" name="userEmail" value={user?.email || ''} />
       <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Textarea
          id="subject"
          name="subject"
          placeholder="e.g., Unable to connect to network printer"
          rows={3}
          required
        />
        {state.errors?.subject && <p className="text-sm text-destructive">{state.errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <input type="hidden" name="priority" value={priority} />
        <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority">
                <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
            </SelectContent>
        </Select>
        {state.errors?.priority && <p className="text-sm text-destructive">{state.errors.priority}</p>}
      </div>
      
      <SubmitButton />
    </form>
  );
}
