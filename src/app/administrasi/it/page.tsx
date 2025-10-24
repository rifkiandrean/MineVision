'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { HardDrive, Ticket, Wifi, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TicketForm } from './ticket-form';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { HelpdeskTicket } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const assets = [
  { id: 'LAP-001', type: 'Laptop', user: 'Rifki Andrean', status: 'In Use' },
  { id: 'LAP-002', type: 'Laptop', user: 'Thoriq', status: 'In Use' },
  { id: 'PRN-001', type: 'Printer', user: 'Office', status: 'Standby' },
  { id: 'SRV-001', type: 'Server', user: 'Data Center', status: 'Maintenance' },
];

const networkServices = [
  { name: 'Internet Gateway', status: 'Operational', uptime: 99.98 },
  { name: 'File Server', status: 'Operational', uptime: 99.95 },
  { name: 'Email Server', status: 'Degraded Performance', uptime: 98.5 },
  { name: 'Intranet Portal', status: 'Outage', uptime: 95.0 },
];

export default function ItPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { firestore } = useFirebase();

  const ticketsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'helpdeskTickets'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const { data: tickets, isLoading: ticketsLoading } =
    useCollection<HelpdeskTicket>(ticketsQuery);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Use':
      case 'Open':
      case 'Operational':
        return 'bg-green-500/80 text-green-foreground';
      case 'Standby':
      case 'In Progress':
      case 'Degraded Performance':
        return 'bg-yellow-500/80 text-yellow-foreground';
      case 'Maintenance':
      case 'Closed':
      case 'Outage':
        return 'bg-red-500/80 text-red-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/80 text-red-foreground';
      case 'Medium':
        return 'bg-yellow-500/80 text-yellow-foreground';
      case 'Low':
        return 'bg-blue-500/80 text-blue-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Administrasi: IT">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a New Helpdesk Ticket</DialogTitle>
              <DialogDescription>
                Fill out the form below to submit a new ticket. The IT team
                will respond shortly.
              </DialogDescription>
            </DialogHeader>
            <TicketForm onTicketCreated={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              IT Asset Inventory
            </CardTitle>
            <CardDescription>
              Daftar semua aset perangkat keras yang terdaftar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.id}</TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.user}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(getStatusClass(asset.status))}
                      >
                        {asset.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-primary" />
              Network Status
            </CardTitle>
            <CardDescription>
              Ketersediaan dan kinerja layanan jaringan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkServices.map((service) => (
              <div key={service.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{service.name}</span>
                  <Badge
                    variant="secondary"
                    className={cn(getStatusClass(service.status))}
                  >
                    {service.status}
                  </Badge>
                </div>
                <Progress value={service.uptime} />
                <p className="text-xs text-muted-foreground mt-1">
                  Uptime: {service.uptime}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Helpdesk Tickets
          </CardTitle>
          <CardDescription>
            Lacak dan kelola tiket dukungan dari seluruh departemen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                : tickets?.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">#{ticket.ticketId}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{ticket.userEmail}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(getPriorityClass(ticket.priority))}
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(getStatusClass(ticket.status))}
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {!ticketsLoading && tickets?.length === 0 && (
             <div className="text-center py-10 text-muted-foreground">
                Tidak ada tiket bantuan saat ini.
            </div>
