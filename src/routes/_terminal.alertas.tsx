import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/oneb/Panel";
import { DenseTable } from "@/components/oneb/DenseTable";
import { MetricCard } from "@/components/oneb/MetricCard";
import { ComplianceNote, ConfidenceBadge } from "@/components/oneb/Badges";
import { useAlerts } from "@/lib/hooks";
import { fmtDateTime } from "@/lib/format";
import type { AlertItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_terminal/alertas")({
  head: () => ({
    meta: [
      { title: "Alertas do Terminal — OneB Market" },
      {
        name: "description",
        content:
          "Histórico de alertas disparados pelas suas regras, com severidade, confiabilidade do sinal e horário do disparo.",
      },
      { property: "og:title", content: "Alertas do Terminal — OneB Market" },
      {
        property: "og:description",
        content: "Sinais técnicos disparados com severidade e confiança auditável.",
      },
    ],
  }),
  component: AlertasPage,
});

const severityTone = {
  alta: "text-down border-down/40 bg-down/10",
  media: "text-warning border-warning/40 bg-warning/10",
  baixa: "text-muted-foreground border-border bg-card-alt/60",
} as const;

type Filter = "todos" | "alta" | "media" | "baixa";

function AlertasPage() {
  const { data: alerts = [], isLoading } = useAlerts();
  const [filter, setFilter] = useState<Filter>("todos");

  const rows = filter === "todos" ? alerts : alerts.filter((a) => a.severity === filter);
  const unread = alerts.filter((a) => !a.read).length;
  const high = alerts.filter((a) => a.severity === "alta").length;
  const highConfidence = alerts.filter((a) => a.confidence === "alta").length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="label-caps">Monitoramento</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Alertas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading ? "Carregando…" : `${alerts.length} sinais registrados nas últimas 24 horas.`}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Não lidos" value={String(unread)} hint="aguardando sua leitura" />
        <MetricCard label="Severidade alta" value={String(high)} hint="prioridade de análise" />
        <MetricCard
          label="Confiança alta"
          value={String(highConfidence)}
          hint="sinais com dado fresco e histórico consistente"
        />
      </section>

      <Panel
        title="Histórico de disparos"
        subtitle="Filtre por severidade para priorizar a leitura"
      >
        <div className="flex flex-wrap gap-2">
          {(["todos", "alta", "media", "baixa"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                filter === f
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {f === "media" ? "média" : f}
            </button>
          ))}
        </div>

        <DenseTable<AlertItem>
          rows={rows}
          rowKey={(a) => a.id}
          empty="Nenhum alerta com esse filtro."
          columns={[
            {
              key: "symbol",
              header: "Ativo",
              render: (a) => (
                <span className="num font-semibold text-foreground">{a.symbol}</span>
              ),
            },
            {
              key: "title",
              header: "Sinal",
              render: (a) => (
                <div>
                  <p className="text-foreground">{a.title}</p>
                  <p className="num text-[0.7rem] text-muted-dim">{a.rule}</p>
                </div>
              ),
            },
            {
              key: "severity",
              header: "Severidade",
              align: "right",
              render: (a) => (
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[0.7rem] font-medium capitalize",
                    severityTone[a.severity],
                  )}
                >
                  {a.severity === "media" ? "média" : a.severity}
                </span>
              ),
            },
            {
              key: "confidence",
              header: "Confiança",
              align: "right",
              render: (a) => <ConfidenceBadge level={a.confidence} />,
            },
            {
              key: "created",
              header: "Disparo",
              align: "right",
              numeric: true,
              render: (a) => fmtDateTime(a.created_at),
            },
            {
              key: "read",
              header: "Status",
              align: "right",
              render: (a) =>
                a.read ? (
                  <span className="text-xs text-muted-dim">lido</span>
                ) : (
                  // TODO: API -> api.post(`/api/alerts/${a.id}/read`)
                  <button type="button" className="text-xs font-medium text-primary hover:opacity-80">
                    marcar lido
                  </button>
                ),
            },
          ]}
        />
        <ComplianceNote>
          Alertas são gerados por regras técnicas configuradas por você. Dados podem ter atraso;
          valide qualquer sinal antes de decidir.
        </ComplianceNote>
      </Panel>
    </div>
  );
}
