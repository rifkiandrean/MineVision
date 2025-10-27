'use client';

import type { FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
  hideBackButton?: boolean;
};

const PageHeader: FC<PageHeaderProps> = ({
  title,
  children,
  hideBackButton = false,
}) => {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {!hideBackButton && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Kembali</span>
          </Button>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {title}
        </h1>
      </div>
      {children && (
        <div className="flex items-center space-x-2">{children}</div>
      )}
    </header>
  );
};

export default PageHeader;
