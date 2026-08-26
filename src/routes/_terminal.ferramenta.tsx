import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel } from "@/components/oneb/Panel";
import { MetricCard } from "@/components/oneb/MetricCard";
import { Sparkline } from "@/components/oneb/Sparkline";
import { DenseTable } from "@/components/oneb/DenseTable";
import { CompactList } from "@/components/oneb/CompactList";
import { Change, ComplianceNote, ConfidenceBadge, StatusPill } from "@/components/oneb/Badges";
import { useDashboardSummary } from "@/lib/hooks";
import { fmtBrl, fmtDateTime, fmtNum, fmtTime, fmtUsd } from "@/lib/format";
import type { QuoteRow } from "@/lib/types";

export const Route = createFileRoute("/_terminal/ferramenta")({
  head: () => ({
    meta: [
      { title: "Dashboard do Terminal — OneB Market" },
      {
        name: "description",
        content:
          "Centro de comando OneB: radar de ativos B3 e Nasdaq, câmbio USD/BRL, alertas com confiança e agenda do dia.",
      },
      { property: "og:title", content: "Dashboard do Terminal — OneB Market" },
      {
        property: "og:description",
        content: "Radar de ativos, câmbio, alertas e agenda econômica em um só painel.",
      },
    ],
  }),
  component: DashboardPage,
});

const impactTone = { high: "text-down", medium: "text-warning", low: "text-muted-dim" } as const;

function DashboardPage() {
  const { data, isLoading, dataUpdatedAt } = useDashboardSummary();
  const [brl, setBrl] = useState("1000");

  if (isLoading || !data) {
    return <p className="text-sm text-muted-dim">Carregando dados do terminal…</p>;
  }

  const positives = data.rows.filter((r) => r.change_pct > 0).length;
  const stale = data.rows.filter((r) => r.status !== "live").length;
  const highImpact = data.econ.filter((e) => e.impact === "high").length;
  const usd = (Number(brl) || 0) / data.fx.rate;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-caps">Centro de comando</p>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitoramento contínuo de Ibovespa, IFIX, ações B3 e Nasdaq — atualizado{" "}
            <span className="num">{fmtTime(new Date(dataUpdatedAt).toISOString())}</span>.
          </p>
        </div>
        <Link to="/alertas" className="text-xs font-medium text-primary hover:opacity-80">
          ver alertas →
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Ativos monitorados"
          value={String(data.rows.length)}
          hint={`${positives} em alta · ${stale} com atraso`}
        />
        <MetricCard
          label="Alertas recentes"
          value={String(data.alerts.length)}
          hint="últimos sinais gravados"
        />
        <MetricCard
          label="Mundo agora"
          value={String(data.news.length)}
          hint={`${highImpact} eventos econômicos críticos`}
        />
        <MetricCard
          label="Carteira monitorada"
          value={fmtBrl(data.portfolio.market_value)}
          changePct={(data.portfolio.unrealized_pnl / data.portfolio.market_value) * 100}
          hint={`${data.portfolio.positions} posições lançadas`}
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title="Câmbio e metais"
          subtitle={`USD/BRL atualizado ${fmtTime(data.fx.updated_at)}`}
          className="xl:col-span-1"
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="label-caps">USD/BRL</span>
              <p className="num mt-1 text-3xl font-semibold text-foreground">
                {fmtNum(data.fx.rate, 4)}
              </p>
            </div>
            <Change value={data.fx.change_pct} />
          </div>
          <Sparkline values={data.fx.spark} tone={data.fx.change_pct >= 0 ? "up" : "down"} />

          <label className="flex flex-col gap-1.5">
            <span className="label-caps">Converter de reais</span>
            <input
              value={brl}
              onChange={(e) => setBrl(e.target.value)}
              inputMode="decimal"
              className="num rounded-md border border-border bg-card-alt/60 px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="label-caps">Em dólar</span>
              <p className="num mt-1 text-lg text-foreground">{fmtUsd(usd)}</p>
            </div>
            <div>
              <span className="label-caps">Ouro spot</span>
              <p className="num mt-1 text-lg text-foreground">{fmtUsd(data.gold.usd)}</p>
              <p className="num text-xs text-muted-dim">{fmtBrl(data.gold.brl)}</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Radar de ativos"
          subtitle="Score técnico e confiabilidade do dado por ativo"
          actionLabel="ver watchlist"
          actionTo="/watchlist"
          className="xl:col-span-2"
        >
          <DenseTable<QuoteRow>
            rows={data.rows}
            rowKey={(r) => r.symbol}
            columns={[
              {
                key: "symbol",
                header: "Ativo",
                render: (r) => (
                  <div>
                    <strong className="text-foreground">{r.symbol}</strong>
                    <span className="ml-2 text-xs text-muted-dim">{r.label}</span>
                  </div>
                ),
              },
              {
                key: "price",
                header: "Preço",
                align: "right",
                numeric: true,
                render: (r) => fmtNum(r.price),
              },
              {
                key: "change",
                header: "Var.",
                align: "right",
                render: (r) => <Change value={r.change_pct} />,
              },
              {
                key: "score",
                header: "Score",
                align: "right",
                numeric: true,
                render: (r) => r.score,
              },
              {
                key: "conf",
                header: "Confiança",
                align: "right",
                render: (r) => <ConfidenceBadge level={r.confidence} />,
              },
              {
                key: "status",
                header: "Dado",
                align: "right",
                render: (r) => <StatusPill status={r.status} />,
              },
            ]}
          />
          <ComplianceNote>
            Score técnico calculado a partir de preço, volume e frescor do dado. Indica
            confiabilidade do sinal, não recomendação.
          </ComplianceNote>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Notícias globais" subtitle="Ordenadas por impacto estimado">
          <CompactList
            items={data.news.map((n) => ({
              id: n.id,
              lead: (
                <span className="num rounded-md border border-border px-1.5 py-0.5 text-[0.7rem] text-primary">
                  {n.impact_score}
                </span>
              ),
              title: n.title,
              meta: `${n.source} · ${fmtDateTime(n.published_at)} · ${n.symbols.join(", ")}`,
            }))}
          />
        </Panel>

        <Panel title="Calendário econômico" subtitle="Hoje, horário de Brasília">
          <CompactList
            items={data.econ.map((e) => ({
              id: e.id,
              lead: <span className="num text-xs text-muted-foreground">{e.time}</span>,
              title: `${e.country} · ${e.title}`,
              meta: `impacto ${e.impact}`,
              trailing: (
                <span className={`text-[0.7rem] uppercase ${impactTone[e.impact]}`}>{e.impact}</span>
              ),
            }))}
          />
        </Panel>

        <Panel title="Alertas recentes" subtitle="Regras disparadas na sessão" actionLabel="ver todos" actionTo="/alertas">
          <CompactList
            items={data.alerts.map((a) => ({
              id: a.id,
              lead: (
                <span className="rounded-md border border-border px-1.5 py-0.5 text-[0.7rem] font-semibold text-foreground">
                  {a.symbol}
                </span>
              ),
              title: a.title,
              meta: fmtDateTime(a.created_at),
              trailing: <ConfidenceBadge level={a.confidence} />,
            }))}
          />
        </Panel>
      </div>
    </div>
  );
}
