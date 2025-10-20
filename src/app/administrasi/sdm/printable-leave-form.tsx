
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
          <div className="col-span-2">
            <p className="text-gray-600">Alasan Cuti:</p>
            <p className="border border-gray-300 rounded p-3 bg-gray-50 min-h-[100px]">
              {request.reason}
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-12 text-center">
            <div>
                 <p className="mb-20">Pemohon,</p>
                 <div className="border-t border-gray-400 pt-2">
                    <p className="font-bold">{request.employeeName}</p>
                 </div>
            </div>
            <div>
                <p className="mb-20">Disetujui oleh,</p>
                 <div className="border-t border-gray-400 pt-2">
                    <p className="font-bold">Manager HRD</p>
                 </div>
            </div>
        </div>
      </main>

       <footer className="text-center text-xs text-gray-500 mt-16 pt-4 border-t">
          Dokumen ini dicetak melalui Sistem MineVision pada {new Date().toLocaleDateString('id-ID', { dateStyle: 'full'})}
      </footer>
    </div>
  );
};
