
'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPurchaseRequest, type FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { InventoryItem } from '@/lib/types';
import { Combobox } from '@/components/ui/combobox';

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
          Mengajukan...
        </>
      ) : (
        'Ajukan Permintaan'
      )}
    </Button>
  );
}

interface PurchaseRequestFormProps {
    inventoryItems: InventoryItem[];
    onRequestCreated: () => void;
}

export function PurchaseRequestForm({ inventoryItems, onRequestCreated }: PurchaseRequestFormProps) {
  const { firestore } = useFirebase();
  const [state, formAction] = useActionState(createPurchaseRequest, initialState);
  const { toast } = useToast();
  const [itemValue, setItemValue] = useState('');

  const itemOptions = inventoryItems.map(item => ({
      value: item.name,
      label: item.name,
  }));

  useEffect(() => {
    if (state.message.startsWith('Error')) {
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Permintaan',
        description: state.message,
      });
    } else if (state.data && firestore) {
      // Data is valid, now save it from the client
      const prCollection = collection(firestore, 'purchaseRequestsSC');
      const newRequest = {
        ...state.data,
        prId: `PR-${Date.now().toString().slice(-5)}`,
        requestDate: new Date().toISOString(),
        status: 'Pending' as const,
      };
      
      addDocumentNonBlocking(prCollection, newRequest);
      
      toast({
        title: 'Permintaan Terkirim',
        description: 'Permintaan pembelian Anda telah berhasil dibuat.',
      });

      onRequestCreated();
    }
  }, [state, toast, firestore, onRequestCreated]);

  return (
    <form action={formAction} className="space-y-4 pt-4">
       <div className="space-y-2">
        <Label htmlFor="item">Nama Barang</Label>
        <input type="hidden" name="item" value={itemValue} />
        <Combobox
            options={itemOptions}
            value={itemValue}
            onChange={setItemValue}
            placeholder="Pilih barang atau ketik baru..."
            searchPlaceholder="Cari barang..."
            noResultsText="Barang tidak ditemukan."
        />
        {state.errors?.item && <p className="text-sm text-destructive">{state.errors.item}</p>}
      </div>

       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="quantity">Jumlah</Label>
            <Input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="e.g., 10"
            required
            />
            {state.errors?.quantity && <p className="text-sm text-destructive">{state.errors.quantity}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="department">Departemen</Label>
            <Input
            id="department"
            name="department"
            placeholder="e.g., Produksi"
            required
            />
            {state.errors?.department && <p className="text-sm text-destructive">{state.errors.department}</p>}
        </div>
       </div>
      
      <SubmitButton />
    </form>
  );
}
