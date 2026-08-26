import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";

interface MetricCardProps {
  label: string;
  value: string;
  changePct?: number | null;
  hint?: string;
  spark?: number[];
  className?: string;
}

export function MetricCard({ label, value, changePct, hint, spark, className }: MetricCardProps) {
  const positive = (changePct ?? 0) >= 0;

  return (
    <article className={cn("panel-surface flex flex-col gap-2 p-4", className)}>
      <span className="label-caps">{label}</span>
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
        <strong className="num min-w-0 truncate text-2xl font-semibold leading-none text-foreground">{value}</strong>
        {changePct !== undefined && changePct !== null && (
          <span
            className={cn(
              "num rounded-md px-1.5 py-0.5 text-xs font-semibold",
              positive ? "bg-up/10 text-up" : "bg-down/10 text-down",
            )}
          >
            {positive ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}%
          </span>
        )}
      </div>
      {spark && spark.length > 1 && (
        <Sparkline values={spark} tone={positive ? "up" : "down"} className="mt-1" />
      )}
      {hint && <span className="text-xs text-muted-dim">{hint}</span>}
    </article>
  );
}
