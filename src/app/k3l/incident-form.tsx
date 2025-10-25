
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createIncident, type FormState } from './incident-actions';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

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
          Mengirim...
        </>
      ) : (
        'Kirim Laporan'
      )}
    </Button>
  );
}

interface IncidentFormProps {
    onIncidentReported: () => void;
}

export function IncidentForm({ onIncidentReported }: IncidentFormProps) {
  const { firestore } = useFirebase();
  const [state, formAction] = useActionState(createIncident, initialState);
  const { toast } = useToast();

  const [incidentType, setIncidentType] = useState('Near Miss');
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Gagal Mengirim Laporan',
        description: state.message,
      });
    } else if (state.data && firestore) {
      const incidentsCollection = collection(firestore, 'incidents');
      const newIncident = {
        ...state.data,
        incidentId: `INC-${Date.now().toString().slice(-6)}`,
        status: 'Open' as const,
      };
      
      addDocumentNonBlocking(incidentsCollection, newIncident);
      
      toast({
        title: 'Laporan Terkirim',
        description: 'Laporan insiden Anda telah berhasil dikirim dan akan segera ditinjau.',
      });

      onIncidentReported();
    }
  }, [state, toast, firestore, onIncidentReported]);

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="type">Jenis Insiden</Label>
            <input type="hidden" name="type" value={incidentType} />
            <Select value={incidentType} onValueChange={(value) => setIncidentType(value as any)}>
                <SelectTrigger id="type">
                    <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Near Miss">Near Miss (Nyaris Celaka)</SelectItem>
                    <SelectItem value="Hazard Report">Laporan Bahaya</SelectItem>
                    <SelectItem value="Property Damage">Kerusakan Properti</SelectItem>
                    <SelectItem value="First Aid">Pertolongan Pertama</SelectItem>
                    <SelectItem value="Lost Time Injury">Cedera Berdampak Waktu Kerja</SelectItem>
                </SelectContent>
            </Select>
            {state.errors?.type && <p className="text-sm text-destructive">{state.errors.type}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="date">Tanggal Kejadian</Label>
            <input type="hidden" name="date" value={incidentDate ? incidentDate.toISOString() : ''} />
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                    'w-full justify-start text-left font-normal',
                    !incidentDate && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {incidentDate ? format(incidentDate, 'PPP') : <span>Pilih tanggal</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={incidentDate}
                    onSelect={setIncidentDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            {state.errors?.date && <p className="text-sm text-destructive">{state.errors.date}</p>}
        </div>
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="location">Lokasi Kejadian</Label>
        <Input id="location" name="location" placeholder="e.g., Pit B, Haul Road 3" required />
        {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi Lengkap Kejadian</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Jelaskan secara kronologis apa yang terjadi, siapa yang terlibat, dan kondisi saat itu."
          rows={5}
          required
        />
        {state.errors?.description && <p className="text-sm text-destructive">{state.errors.description}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}
