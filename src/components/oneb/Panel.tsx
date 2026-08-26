import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  className?: string;
  children: ReactNode;
}

export function Panel({
  title,
  subtitle,
  actionLabel,
  actionTo,
  onAction,
  className,
  children,
}: PanelProps) {
  return (
    <section className={cn("panel-surface flex flex-col gap-4 p-5", className)}>
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-muted-dim">{subtitle}</p>}
        </div>
        {actionLabel && actionTo && (
          <Link
            to={actionTo}
            className="shrink-0 text-xs font-medium text-primary transition-opacity hover:opacity-80"
          >
            {actionLabel}
          </Link>
        )}
        {actionLabel && !actionTo && (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 text-xs font-medium text-primary transition-opacity hover:opacity-80"
          >
            {actionLabel}
          </button>
        )}
      </header>
      {children}
    </section>
  );
}
