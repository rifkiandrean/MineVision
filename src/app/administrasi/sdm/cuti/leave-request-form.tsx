
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { validateLeaveRequest, type FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengajukan...
        </>
      ) : (
        'Ajukan Cuti'
      )}
    </Button>
  );
}

export function LeaveRequestForm() {
  const { user, firestore } = useFirebase();
  const [state, formAction] = useActionState(validateLeaveRequest, initialState);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Gagal Mengajukan Cuti',
        description: state.message,
      });
    } else if (state.data && firestore) {
      // Data is valid, now save it from the client
      const leaveRequestsCollection = collection(firestore, 'leaveRequests');
      const newRequest = {
        ...state.data,
        requestDate: new Date().toISOString(),
        status: 'pending',
      };
      
      addDocumentNonBlocking(leaveRequestsCollection, newRequest);
      
      toast({
        title: 'Pengajuan Berhasil',
        description: 'Pengajuan cuti Anda telah berhasil dikirim.',
      });

      // Reset form
      setStartDate(undefined);
      setEndDate(undefined);
      const form = document.getElementById('leave-request-form') as HTMLFormElement;
      if (form) form.reset();

    }
  }, [state, toast, firestore]);

  return (
    <form id="leave-request-form" action={formAction} className="space-y-4">
      <input type="hidden" name="employeeName" value={user?.displayName || user?.email || 'Unknown User'} />
      <div className="space-y-2">
        <Label htmlFor="employeeName-display">Nama Karyawan</Label>
        <Input id="employeeName-display" value={user?.displayName || user?.email || 'Unknown User'} disabled />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Tanggal Mulai</Label>
          <input type="hidden" name="startDate" value={startDate ? format(startDate, 'yyyy-MM-dd') : ''} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {state.errors?.startDate && <p className="text-sm text-destructive">{state.errors.startDate}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Tanggal Selesai</Label>
           <input type="hidden" name="endDate" value={endDate ? format(endDate, 'yyyy-MM-dd') : ''} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={{ before: startDate }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
           {state.errors?.endDate && <p className="text-sm text-destructive">{state.errors.endDate}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Alasan Cuti</Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="e.g., Keperluan keluarga, sakit, dll."
          rows={3}
        />
        {state.errors?.reason && <p className="text-sm text-destructive">{state.errors.reason}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
