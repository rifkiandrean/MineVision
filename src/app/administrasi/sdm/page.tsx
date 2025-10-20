
'use client';

import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LeaveRequestForm } from './leave-request-form';
import { LeaveApprovalTable } from './leave-approval-table';

export default function SdmPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: SDM" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pengajuan Cuti</CardTitle>
              <CardDescription>
                Isi formulir di bawah ini untuk mengajukan cuti.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestForm />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Persetujuan Cuti</CardTitle>
              <CardDescription>
                Tinjau, setujui, atau tolak permintaan cuti dari karyawan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveApprovalTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
