import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/oneb/Panel";
import { DenseTable } from "@/components/oneb/DenseTable";
import { Change, ComplianceNote, ConfidenceBadge, StatusPill } from "@/components/oneb/Badges";
import { backtestRule, useWatchlist } from "@/lib/hooks";
import { fmtNum } from "@/lib/format";
import type { BacktestResult, WatchlistItem } from "@/lib/types";

export const Route = createFileRoute("/_terminal/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist e Regras de Alerta — OneB Market" },
      {
        name: "description",
        content:
          "Monte sua watchlist de ativos B3 e Nasdaq, crie regras de alerta com indicadores e teste o histórico antes de ativar.",
      },
      { property: "og:title", content: "Watchlist e Regras de Alerta — OneB Market" },
      {
        property: "og:description",
        content: "Regras de alerta com backtest e badge de confiança por sinal.",
      },
    ],
  }),
  component: WatchlistPage,
});

const assetLabels: Record<WatchlistItem["asset_type"], string> = {
  acao: "Ação B3",
  fii: "FII",
  indice: "Índice",
  us: "EUA / Nasdaq",
};

function WatchlistPage() {
  const { data: items = [], isLoading } = useWatchlist();
  const [symbol, setSymbol] = useState("");
  const [label, setLabel] = useState("");
  const [assetType, setAssetType] = useState<WatchlistItem["asset_type"]>("acao");
  const [ruleFor, setRuleFor] = useState<string | null>(null);
  const [indicator, setIndicator] = useState("RSI(14)");
  const [operator, setOperator] = useState("cruza acima");
  const [value, setValue] = useState("30");
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [testing, setTesting] = useState(false);

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    // TODO: API -> api.post("/api/watchlist", { symbol, label, asset_type: assetType })
    setSymbol("");
    setLabel("");
  }

  async function handleTest(item: WatchlistItem) {
    setTesting(true);
    const res = await backtestRule({
      symbol: item.symbol,
      indicator,
      operator,
      value: Number(value) || 0,
    });
    setResult(res);
    setTesting(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="label-caps">Monitoramento</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Watchlist &amp; Regras</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ativos acompanhados e regras técnicas que geram alertas — sempre com confiabilidade
          explícita.
        </p>
      </header>

      <Panel title="Adicionar ativo" subtitle="Símbolo B3 (PETR4) ou americano (NVDA)">
        <form onSubmit={handleAdd} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <label className="flex flex-col gap-1.5">
            <span className="label-caps">Símbolo</span>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="PETR4"
              className="num rounded-md border border-border bg-card-alt/60 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps">Apelido</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Petrobras PN"
              className="rounded-md border border-border bg-card-alt/60 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="label-caps">Classe</span>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as WatchlistItem["asset_type"])}
              className="rounded-md border border-border bg-card-alt/60 px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {Object.entries(assetLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="self-end rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Adicionar
          </button>
        </form>
      </Panel>

      <Panel
        title="Ativos acompanhados"
        subtitle={isLoading ? "carregando…" : `${items.length} ativos · ${items.reduce((s, i) => s + i.rules.length, 0)} regras ativas`}
      >
        <DenseTable<WatchlistItem>
          rows={items}
          rowKey={(i) => i.id}
          empty="Nenhum ativo na watchlist ainda."
          columns={[
            {
              key: "symbol",
              header: "Ativo",
              render: (i) => (
                <div>
                  <strong className="text-foreground">{i.symbol}</strong>
                  <span className="ml-2 text-xs text-muted-dim">{i.label}</span>
                </div>
              ),
            },
            {
              key: "class",
              header: "Classe",
              render: (i) => <span className="text-xs text-muted-foreground">{assetLabels[i.asset_type]}</span>,
            },
            { key: "price", header: "Preço", align: "right", numeric: true, render: (i) => fmtNum(i.price) },
            { key: "change", header: "Var.", align: "right", render: (i) => <Change value={i.change_pct} /> },
            {
              key: "rules",
              header: "Regras",
              align: "right",
              render: (i) =>
                i.rules.length === 0 ? (
                  <span className="text-xs text-muted-dim">nenhuma</span>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    <span className="num text-xs text-muted-foreground">{i.rules[0]?.description}</span>
                    <ConfidenceBadge level={i.rules[0]!.confidence} />
                  </div>
                ),
            },
            { key: "status", header: "Dado", align: "right", render: (i) => <StatusPill status={i.status} /> },
            {
              key: "actions",
              header: "Ações",
              align: "right",
              render: (i) => (
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRuleFor(ruleFor === i.id ? null : i.id);
                      setResult(null);
                    }}
                    className="text-xs font-medium text-primary hover:opacity-80"
                  >
                    {ruleFor === i.id ? "fechar" : "nova regra"}
                  </button>
                  {/* TODO: API -> api.delete(`/api/watchlist/${i.id}`) */}
                  <button type="button" className="text-xs font-medium text-down hover:opacity-80">
                    remover
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Panel>

      {ruleFor && (
        <Panel
          title={`Nova regra · ${items.find((i) => i.id === ruleFor)?.symbol ?? ""}`}
          subtitle="Teste o histórico antes de ativar o alerta"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
            <label className="flex flex-col gap-1.5">
              <span className="label-caps">Indicador</span>
              <select
                value={indicator}
                onChange={(e) => setIndicator(e.target.value)}
                className="rounded-md border border-border bg-card-alt/60 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {["RSI(14)", "EMA(21)", "Máx(5d)", "ATR(14)", "Volume médio(20d)"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-caps">Condição</span>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="rounded-md border border-border bg-card-alt/60 px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {[">", "<", "cruza acima", "cruza abaixo"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="label-caps">Valor</span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                inputMode="decimal"
                className="num rounded-md border border-border bg-card-alt/60 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <button
              type="button"
              disabled={testing}
              onClick={() => {
                const item = items.find((i) => i.id === ruleFor);
                if (item) void handleTest(item);
              }}
              className="self-end rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary disabled:opacity-60"
            >
              {testing ? "testando…" : "Testar regra"}
            </button>
            {/* TODO: API -> api.post(`/api/watchlist/${ruleFor}/rules`, payload) */}
            <button
              type="button"
              className="self-end rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Salvar
            </button>
          </div>

          {result && (
            <div className="grid gap-3 sm:grid-cols-4">
              <Metric label="Acertos" value={`${result.hits}/${result.tries}`} />
              <Metric label="Taxa de acerto" value={`${(result.hit_rate * 100).toFixed(1)}%`} />
              <Metric label="Movimento médio" value={`${result.avg_move_pct.toFixed(2)}%`} />
              <div className="rounded-lg border border-border bg-card-alt/50 p-3">
                <span className="label-caps">Confiança</span>
                <div className="mt-1.5">
                  <ConfidenceBadge level={result.confidence} />
                </div>
              </div>
            </div>
          )}

          <ComplianceNote>
            Backtest é leitura estatística do passado, com dados que podem ter atraso. Não constitui
            recomendação de investimento.
          </ComplianceNote>
        </Panel>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card-alt/50 p-3">
      <span className="label-caps">{label}</span>
      <p className="num mt-1 text-lg text-foreground">{value}</p>
    </div>
  );
}
