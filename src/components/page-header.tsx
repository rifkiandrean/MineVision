import type { FC, ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  children?: ReactNode;
};

const PageHeader: FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight text-primary">
        {title}
      </h1>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </header>
  );
};

export default PageHeader;
