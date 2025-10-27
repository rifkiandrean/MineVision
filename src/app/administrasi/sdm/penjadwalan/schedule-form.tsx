
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createSchedule, type FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { User } from '@/lib/types';
import { DateRange } from 'react-day-picker';

const initialState: FormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary mt-4">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Menyimpan...
        </>
      ) : (
        'Simpan Jadwal'
      )}
    </Button>
  );
}

interface ScheduleFormProps {
    users: User[];
    onScheduleCreated: () => void;
}

export function ScheduleForm({ users, onScheduleCreated }: ScheduleFormProps) {
  const { firestore } = useFirebase();
  const [state, formAction] = useActionState(createSchedule, initialState);
  const { toast } = useToast();

  const [userId, setUserId] = useState<string>('');
  const [date, setDate] = useState<DateRange | undefined>();
  const [shift, setShift] = useState<string>('');
  const [status, setStatus] = useState<'Hadir' | 'Cuti' | 'Libur'>('Hadir');

  useEffect(() => {
    if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Jadwal',
        description: state.message,
      });
    } else if (state.data && firestore) {
        const attendanceCollection = collection(firestore, 'attendanceRecords');
        const { userId, dates, shift, status } = state.data;

        // Firestore write operations are initiated here
        const promises = dates.map(d => {
            const newRecord = {
                userId,
                date: format(d, 'yyyy-MM-dd'), // Format date to YYYY-MM-DD string
                shift,
                status,
                ...(status === 'Hadir' && { checkIn: null, checkOut: null })
            };
            // Uses a non-blocking function to save to Firestore
            return addDocumentNonBlocking(attendanceCollection, newRecord);
        });

        Promise.all(promises).then(() => {
            toast({
                title: 'Jadwal Dibuat',
                description: `Jadwal baru untuk ${dates.length} hari telah berhasil ditambahkan.`,
            });
            onScheduleCreated(); // Close the dialog on success
        }).catch((err) => {
             console.error("Error saving schedule: ", err);
             toast({
                variant: 'destructive',
                title: 'Gagal Menyimpan Jadwal',
                description: 'Terjadi kesalahan saat menyimpan data ke database.',
            });
        });

    }
  }, [state, toast, firestore, onScheduleCreated]);

  return (
    <form action={formAction} className="space-y-4 pt-4">
        <div className="space-y-2">
            <Label htmlFor="userId">Karyawan</Label>
            <input type="hidden" name="userId" value={userId} />
            <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger id="userId">
                    <SelectValue placeholder="Pilih Karyawan" />
                </SelectTrigger>
                <SelectContent>
                    {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.email}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.errors?.userId && <p className="text-sm text-destructive">{state.errors.userId[0]}</p>}
        </div>
      
        <div className="space-y-2">
            <Label htmlFor="date">Rentang Tanggal</Label>
            <input type="hidden" name="dateRange.from" value={date?.from ? date.from.toISOString() : ''} />
            <input type="hidden" name="dateRange.to" value={date?.to ? date.to.toISOString() : ''} />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pilih rentang tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
             {state.errors?.dateRange && <p className="text-sm text-destructive">{state.errors.dateRange[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="shift">Shift</Label>
                <input type="hidden" name="shift" value={shift} />
                <Select value={shift} onValueChange={setShift}>
                    <SelectTrigger id="shift">
                        <SelectValue placeholder="Pilih Shift" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="S1">S1 (07:00-15:00)</SelectItem>
                        <SelectItem value="S2">S2 (15:00-23:00)</SelectItem>
                        <SelectItem value="S3">S3 (23:00-07:00)</SelectItem>
                    </SelectContent>
                </Select>
                {state.errors?.shift && <p className="text-sm text-destructive">{state.errors.shift[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <input type="hidden" name="status" value={status} />
                <Select value={status} onValueChange={(v) => setStatus(v as 'Hadir' | 'Cuti' | 'Libur')}>
                    <SelectTrigger id="status">
                        <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Hadir">Hadir (Hari Kerja)</SelectItem>
                        <SelectItem value="Libur">Libur (Hari Libur)</SelectItem>
                        <SelectItem value="Cuti">Cuti</SelectItem>
                    </SelectContent>
                </Select>
                {state.errors?.status && <p className="text-sm text-destructive">{state.errors.status[0]}</p>}
            </div>
        </div>
      
      <SubmitButton />
    </form>
  );
}
