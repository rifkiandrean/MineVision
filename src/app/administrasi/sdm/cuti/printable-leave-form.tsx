
'use client';

import React from 'react';
import type { LeaveRequest } from '@/lib/types';
import { Pickaxe } from 'lucide-react';

interface PrintableLeaveFormProps {
  request: LeaveRequest;
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adjust for timezone issues
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
};

export const PrintableLeaveForm: React.FC<PrintableLeaveFormProps> = ({ request }) => {
  return (
    <div className="bg-white text-black p-8 font-serif">
      <header className="flex items-center justify-between border-b-2 border-black pb-4 mb-8">
        <div className="flex items-center gap-3">
          <Pickaxe className="w-12 h-12 text-gray-800" />
          <div>
            <h1 className="text-3xl font-bold">MineVision Corp.</h1>
            <p className="text-sm text-gray-600">Integrated Mining Operations</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold uppercase text-gray-700">Formulir Pengajuan Cuti</h2>
      </header>

      <main>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-base">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-gray-600">Nama Karyawan:</p>
            <p className="font-bold text-lg">{request.employeeName}</p>
          </div>
           <div className="col-span-2 sm:col-span-1">
             <p className="text-gray-600">Tanggal Pengajuan:</p>
            <p className="font-bold text-lg">{formatDate(request.requestDate)}</p>
          </div>
          <div>
            <p className="text-gray-600">Tanggal Mulai Cuti:</p>
            <p className="font-bold text-lg">{formatDate(request.startDate)}</p>
          </div>
          <div>
            <p className="text-gray-600">Tanggal Selesai Cuti:</p>
            <p className="font-bold text-lg">{formatDate(request.endDate)}</p>
          </div>
          <div className="col-span-2 border-t border-gray-200 pt-4">
            <p className="text-gray-600">Alasan:</p>
            <p className="text-lg min-h-[60px]">{request.reason}</p>
          </div>
        </div>
      </main>

      <footer className="mt-24">
        <div className="grid grid-cols-3 gap-8 text-center">
            <div>
                <p className="mb-16">Pemohon,</p>
                <p className="font-bold border-t border-gray-400 pt-2">{request.employeeName}</p>
            </div>
             <div>
                <p className="mb-16">Menyetujui,</p>
                <p className="font-bold border-t border-gray-400 pt-2">(_______________________)</p>
                <p className="text-sm">Atasan Langsung</p>
            </div>
             <div>
                <p className="mb-16">Mengetahui,</p>
                <p className="font-bold border-t border-gray-400 pt-2">(_______________________)</p>
                <p className="text-sm">Departemen SDM</p>
            </div>
        </div>
         <div className="mt-12 text-center text-xs text-gray-500">
            Dokumen ini dicetak dari sistem MineVision pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.
        </div>
      </footer>
    </div>
  );
};
