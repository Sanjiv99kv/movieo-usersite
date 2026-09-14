import type { ReactNode } from "react";

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
