
'use client';

import type { FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string | ReactNode;
  children?: ReactNode;
  hideBackButton?: boolean;
  className?: string;
};

const PageHeader: FC<PageHeaderProps> = ({
  title,
  children,
  hideBackButton = false,
  className,
}) => {
  const router = useRouter();

  return (
    <header className={cn("sticky top-0 z-10 flex items-center justify-between bg-background py-4 px-4 md:px-8 border-b", className)}>
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
        {typeof title === 'string' ? (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">
                {title}
            </h1>
        ) : (
            <div>{title}</div>
        )}
      </div>
      {children && (
        <div className="flex items-center space-x-2">{children}</div>
      )}
    </header>
  );
};

export default PageHeader;
