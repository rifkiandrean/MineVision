
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createAsset, type FormState } from './actions';
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
        'Simpan Aset'
      )}
    </Button>
  );
}

interface AssetFormProps {
    onAssetCreated: () => void;
}

export function AssetForm({ onAssetCreated }: AssetFormProps) {
  const { firestore } = useFirebase();
  const [state, formAction] = useActionState(createAsset, initialState);
  const { toast } = useToast();

  const [status, setStatus] = useState<'Operasional' | 'Perawatan' | 'Siaga' | 'Rusak'>('Operasional');
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>();

  useEffect(() => {
    if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Gagal Menambah Aset',
        description: state.message,
      });
    } else if (state.data && firestore) {
      const assetsCollection = collection(firestore, 'assets');
      addDocumentNonBlocking(assetsCollection, state.data);
      
      toast({
        title: 'Aset Ditambahkan',
        description: `Aset ${state.data.name} telah berhasil ditambahkan.`,
      });

      onAssetCreated();
    }
  }, [state, toast, firestore, onAssetCreated]);

  return (
    <form action={formAction} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="assetId">ID Aset</Label>
            <Input id="assetId" name="assetId" placeholder="e.g., EX-06" required />
            {state.errors?.assetId && <p className="text-sm text-destructive">{state.errors.assetId}</p>}
        </div>
         <div className="space-y-2">
            <Label htmlFor="name">Nama Aset</Label>
            <Input id="name" name="name" placeholder="e.g., Excavator PC3000" required />
            {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name}</p>}
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="type">Tipe Aset</Label>
            <Input id="type" name="type" placeholder="e.g., Alat Gali" required />
            {state.errors?.type && <p className="text-sm text-destructive">{state.errors.type}</p>}
        </div>
         <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input id="location" name="location" placeholder="e.g., Pit C" required />
            {state.errors?.location && <p className="text-sm text-destructive">{state.errors.location}</p>}
        </div>
      </div>
      
       <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <input type="hidden" name="status" value={status} />
        <Select value={status} onValueChange={(value) => setStatus(value as any)}>
            <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Operasional">Operasional</SelectItem>
                <SelectItem value="Perawatan">Perawatan</SelectItem>
                <SelectItem value="Siaga">Siaga</SelectItem>
                <SelectItem value="Rusak">Rusak</SelectItem>
            </SelectContent>
        </Select>
        {state.errors?.status && <p className="text-sm text-destructive">{state.errors.status}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Tanggal Pembelian</Label>
            <input type="hidden" name="purchaseDate" value={purchaseDate ? format(purchaseDate, 'yyyy-MM-dd') : ''} />
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                    'w-full justify-start text-left font-normal',
                    !purchaseDate && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {purchaseDate ? format(purchaseDate, 'PPP') : <span>Pilih tanggal</span>}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={purchaseDate}
                    onSelect={setPurchaseDate}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            {state.errors?.purchaseDate && <p className="text-sm text-destructive">{state.errors.purchaseDate}</p>}
        </div>
         <div className="space-y-2">
            <Label htmlFor="initialCost">Biaya Awal (IDR)</Label>
            <Input id="initialCost" name="initialCost" type="number" placeholder="e.g., 5000000000" required />
            {state.errors?.initialCost && <p className="text-sm text-destructive">{state.errors.initialCost}</p>}
        </div>
      </div>
      
      <SubmitButton />
    </form>
  );
}
