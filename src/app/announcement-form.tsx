
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAnnouncement, type FormState } from './announcement-actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

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
          Menyimpan...
        </>
      ) : (
        'Simpan Pengumuman'
      )}
    </Button>
  );
}

interface AnnouncementFormProps {
  onAnnouncementCreated: () => void;
}

export function AnnouncementForm({
  onAnnouncementCreated,
}: AnnouncementFormProps) {
  const { firestore } = useFirebase();
  const [state, formAction] = useActionState(createAnnouncement, initialState);
  const { toast } = useToast();

  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  useEffect(() => {
    if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Pengumuman',
        description: state.message,
      });
    } else if (state.data && firestore) {
      const announcementsCollection = collection(firestore, 'announcements');
      const newAnnouncement = {
        ...state.data,
        date: new Date().toISOString(),
      };

      addDocumentNonBlocking(announcementsCollection, newAnnouncement);

      toast({
        title: 'Pengumuman Dibuat',
        description: 'Pengumuman baru telah berhasil ditambahkan ke dasbor.',
      });

      onAnnouncementCreated();
    }
  }, [state, toast, firestore, onAnnouncementCreated]);

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Judul Pengumuman</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Rapat Keselamatan Bulanan"
          required
        />
        {state.errors?.title && (
          <p className="text-sm text-destructive">{state.errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Departemen</Label>
          <Input
            id="department"
            name="department"
            placeholder="e.g., K3L"
            required
          />
          {state.errors?.department && (
            <p className="text-sm text-destructive">
              {state.errors.department}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Prioritas</Label>
          <input type="hidden" name="priority" value={priority} />
          <Select
            value={priority}
            onValueChange={(value) =>
              setPriority(value as 'High' | 'Medium' | 'Low')
            }
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Pilih prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Rendah</SelectItem>
              <SelectItem value="Medium">Sedang</SelectItem>
              <SelectItem value="High">Tinggi</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.priority && (
            <p className="text-sm text-destructive">
              {state.errors.priority}
            </p>
          )}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
