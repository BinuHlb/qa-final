import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground/90 leading-relaxed">{description}</p>
      )}
      {children}
    </div>
  );
}
