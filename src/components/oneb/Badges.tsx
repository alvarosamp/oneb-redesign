import { cn } from "@/lib/utils";

export type Confidence = "alta" | "media" | "baixa";
export type DataStatus = "live" | "delayed" | "none";

const confidenceMap: Record<Confidence, { label: string; dot: string; text: string }> = {
  alta: { label: "Alta", dot: "bg-up", text: "text-up" },
  media: { label: "Média", dot: "bg-warning", text: "text-warning" },
  baixa: { label: "Baixa", dot: "bg-muted-dim", text: "text-muted-foreground" },
};

export function ConfidenceBadge({
  level,
  className,
}: {
  level: Confidence;
  className?: string;
}) {
  const cfg = confidenceMap[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-card-alt/70 px-2 py-0.5 text-[0.7rem] font-medium",
        cfg.text,
        className,
      )}
      title="Confiabilidade do sinal — não é recomendação de investimento"
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

const statusMap: Record<DataStatus, { label: string; dot: string; text: string }> = {
  live: { label: "ao vivo", dot: "bg-up", text: "text-up" },
  delayed: { label: "atrasado", dot: "bg-warning", text: "text-warning" },
  none: { label: "sem dados", dot: "bg-down", text: "text-down" },
};

export function StatusPill({ status, className }: { status: DataStatus; className?: string }) {
  const cfg = statusMap[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide",
        cfg.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

export function ComplianceNote({ children }: { children: string }) {
  return <p className="text-[0.7rem] italic text-muted-dim">{children}</p>;
}

export function Change({ value, suffix = "%" }: { value: number | null | undefined; suffix?: string }) {
  if (value === null || value === undefined) return <span className="num text-muted-dim">—</span>;
  const positive = value >= 0;
  return (
    <span className={cn("num font-medium", positive ? "text-up" : "text-down")}>
      {positive ? "▲" : "▼"} {Math.abs(value).toFixed(2)}
      {suffix}
    </span>
  );
}
