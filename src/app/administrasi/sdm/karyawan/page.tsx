
'use client';

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
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

type User = {
    id: string;
    email: string;
    department: string;
    // Add other user fields as needed
}

export default function EmployeeListPage() {
  const { firestore } = useFirebase();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('email'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection<User>(usersQuery);

  const getDepartmentClass = (department: string) => {
    switch (department) {
      case 'Super Admin':
        return 'bg-primary/80 text-primary-foreground';
      case 'Manager':
        return 'bg-accent text-accent-foreground';
      case 'Admin':
        return 'bg-blue-500/80 text-blue-foreground';
      case 'Supervisor':
        return 'bg-yellow-500/80 text-yellow-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };
  
  const getInitial = (email: string) => {
      return email ? email.charAt(0).toUpperCase() : 'U';
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Manajemen Karyawan" />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Database Karyawan
          </CardTitle>
          <CardDescription>
            Daftar semua karyawan yang terdaftar dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    </TableRow>
                  ))
                : users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                           <Avatar>
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} />
                                <AvatarFallback>{getInitial(user.email)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{user.email}</p>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge
                          variant="secondary"
                          className={cn(getDepartmentClass(user.department))}
                        >
                          {user.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/80 text-green-foreground">
                            Aktif
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {!isLoading && users?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Tidak ada data karyawan yang ditemukan.
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

    