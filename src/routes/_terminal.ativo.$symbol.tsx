import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel } from "@/components/oneb/Panel";
import { MetricCard } from "@/components/oneb/MetricCard";
import { DenseTable } from "@/components/oneb/DenseTable";
import { CompactList } from "@/components/oneb/CompactList";
import { CandleChart } from "@/components/oneb/CandleChart";
import { Change, ComplianceNote, ConfidenceBadge, StatusPill } from "@/components/oneb/Badges";
import { useAssetDetail } from "@/lib/hooks";
import { fmtDateTime, fmtNum } from "@/lib/format";
import { COMPLIANCE_TEXT } from "@/lib/constants";
import type { Indicator } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_terminal/ativo/$symbol")({
  head: ({ params }) => {
    const symbol = params.symbol.toUpperCase();
    return {
      meta: [
        { title: `${symbol} — Leitura técnica | OneB Market` },
        {
          name: "description",
          content: `Candles, médias, indicadores, suportes e resistências de ${symbol} com confiabilidade explícita de cada leitura.`,
        },
        { property: "og:title", content: `${symbol} — Leitura técnica | OneB Market` },
        {
          property: "og:description",
          content: `Painel técnico de ${symbol}: candles, EMA 9/21, RSI, ATR e níveis observados.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: AtivoPage,
});

const biasTone = {
  alta: "text-up",
  baixa: "text-down",
  neutro: "text-muted-foreground",
} as const;

function AtivoPage() {
  const { symbol } = Route.useParams();
  const { data, isLoading } = useAssetDetail(symbol);

  if (isLoading) {
    return <p className="text-sm text-muted-dim">Carregando leitura técnica de {symbol.toUpperCase()}…</p>;
  }

  if (!data) {
    return (
      <div className="panel-surface flex flex-col gap-3 p-6">
        <h1 className="text-lg font-semibold text-foreground">
          Ativo {symbol.toUpperCase()} não está no radar
        </h1>
        <p className="text-sm text-muted-foreground">
          Este símbolo ainda não tem cobertura de dados nesta versão do terminal.
        </p>
        <Link to="/ferramenta" className="text-xs font-medium text-primary">
          Voltar para o dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps">Leitura técnica</p>
          <h1 className="mt-1 flex flex-wrap items-center gap-3 text-2xl font-semibold text-foreground">
            {data.symbol}
            <span className="text-sm font-normal text-muted-dim">{data.label}</span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusPill status={data.status} />
            <ConfidenceBadge level={data.confidence} />
            <span className="text-xs text-muted-dim">
              atualizado {fmtDateTime(data.taken_at)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <strong className="num block text-3xl font-semibold text-foreground">
            {fmtNum(data.price)}
          </strong>
          <Change value={data.change_pct} />
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Abertura" value={fmtNum(data.day.open)} hint="preço do leilão de abertura" />
        <MetricCard label="Máxima / Mínima" value={`${fmtNum(data.day.high)} / ${fmtNum(data.day.low)}`} hint="faixa da sessão" />
        <MetricCard label="Fech. anterior" value={fmtNum(data.day.prev_close)} hint="referência do dia anterior" />
        <MetricCard label="Volume" value={data.day.volume} changePct={data.change_pct} spark={data.spark} />
      </section>

      <Panel
        title="Candles diários com EMA 9/21"
        subtitle="Níveis tracejados marcam suporte e resistência observados nos últimos 30 candles"
      >
        <CandleChart candles={data.candles} levels={data.levels} />
      </Panel>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Indicadores" subtitle="Cada leitura vem com sua confiabilidade" className="xl:col-span-2">
          <DenseTable<Indicator>
            rows={data.indicators}
            rowKey={(r) => r.name}
            columns={[
              { key: "name", header: "Indicador", render: (r) => <strong className="text-foreground">{r.name}</strong> },
              { key: "value", header: "Valor", align: "right", numeric: true, render: (r) => r.value },
              {
                key: "bias",
                header: "Viés",
                render: (r) => <span className={cn("font-medium", biasTone[r.bias])}>{r.bias}</span>,
              },
              { key: "reading", header: "Leitura", render: (r) => <span className="text-muted-foreground">{r.reading}</span> },
              {
                key: "conf",
                header: "Confiança",
                align: "right",
                render: (r) => <ConfidenceBadge level={r.confidence} />,
              },
            ]}
          />
        </Panel>

        <Panel title="Níveis e observações" subtitle="Base do que o terminal está lendo agora">
          <ul className="flex flex-col gap-2">
            {data.levels.map((l) => (
              <li
                key={l.label}
                className="flex items-center justify-between rounded-md border border-border bg-card-alt/50 px-3 py-2 text-xs"
              >
                <span className={cn("capitalize", l.kind === "resistencia" ? "text-down" : "text-up")}>
                  {l.kind}
                </span>
                <span className="num text-foreground">{fmtNum(l.value)}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
            {data.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-primary">·</span>
                {n}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Notícias ligadas ao ativo" subtitle="Contexto que pode explicar o movimento">
          <CompactList
            items={data.news.map((n) => ({
              id: n.id,
              title: n.title,
              meta: `${n.source} · ${fmtDateTime(n.published_at)}`,
            }))}
            empty="Sem notícias relacionadas nas últimas horas."
          />
        </Panel>

        <Panel title="Alertas disparados" subtitle="Regras suas que tocaram neste ativo" actionLabel="Ver todos" actionTo="/alertas">
          <CompactList
            items={data.alerts.map((a) => ({
              id: a.id,
              title: a.title,
              meta: `${a.rule} · ${fmtDateTime(a.created_at)}`,
            }))}
            empty="Nenhum alerta disparado para este ativo."
          />
        </Panel>
      </div>

      <ComplianceNote>{COMPLIANCE_TEXT}</ComplianceNote>
    </div>
  );
}
