import { mockAlerts, mockNews, mockRows } from "@/lib/mock/data";
import type { AssetDetail, Candle, DeskRow, Indicator, QuoteRow } from "@/lib/types";

/** Pseudo-random determinístico por símbolo — mesmo desenho a cada render/SSR. */
function seeded(symbol: string) {
  let s = [...symbol].reduce((acc, ch) => acc + ch.charCodeAt(0), 7);
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

export function buildCandles(symbol: string, price: number, changePct: number, count = 70): Candle[] {
  const rnd = seeded(symbol);
  const drift = (changePct / 100) * 0.35;
  let close = price * (1 - drift * count * 0.08);
  const out: Candle[] = [];
  const start = Date.UTC(2026, 4, 18);

  for (let i = 0; i < count; i += 1) {
    const vol = price * (0.006 + rnd() * 0.012);
    const open = close;
    close = Math.max(open + (rnd() - 0.48 + drift) * vol * 2.4, price * 0.55);
    const high = Math.max(open, close) + rnd() * vol;
    const low = Math.min(open, close) - rnd() * vol;
    out.push({
      t: new Date(start + i * 86_400_000).toISOString(),
      o: open,
      h: high,
      l: low,
      c: close,
      v: Math.round((0.6 + rnd()) * 1000),
    });
  }

  // Ancora o último fechamento no preço corrente do radar.
  const last = out[out.length - 1]!;
  const adj = price / last.c;
  return out.map((c) => ({
    ...c,
    o: c.o * adj,
    h: c.h * adj,
    l: c.l * adj,
    c: c.c * adj,
  }));
}

function indicatorsFor(row: QuoteRow): Indicator[] {
  const rnd = seeded(`${row.symbol}-ind`);
  const rsi = Math.round(38 + rnd() * 34 + row.change_pct * 3);
  const atr = Number((0.9 + rnd() * 2.4).toFixed(2));
  const up = row.change_pct >= 0;

  return [
    {
      name: "RSI (14)",
      value: String(Math.min(Math.max(rsi, 8), 92)),
      reading: rsi > 70 ? "sobrecompra" : rsi < 30 ? "sobrevenda" : "faixa neutra",
      bias: rsi > 55 ? "alta" : rsi < 45 ? "baixa" : "neutro",
      confidence: row.confidence,
    },
    {
      name: "EMA 9 / 21",
      value: up ? "9 > 21" : "9 < 21",
      reading: up ? "empilhamento de alta" : "empilhamento de baixa",
      bias: up ? "alta" : "baixa",
      confidence: row.status === "live" ? row.confidence : "baixa",
    },
    {
      name: "MACD",
      value: Number(((row.change_pct / 2) * (0.6 + rnd())).toFixed(2)).toString(),
      reading: up ? "histograma expandindo" : "histograma contraindo",
      bias: up ? "alta" : "baixa",
      confidence: "media",
    },
    {
      name: "ATR (14) %",
      value: `${atr.toFixed(2)}%`,
      reading: atr > 2.4 ? "volatilidade acima do normal" : "volatilidade contida",
      bias: "neutro",
      confidence: "media",
    },
    {
      name: "Volume / média 20d",
      value: `${(0.7 + rnd() * 1.1).toFixed(2)}x`,
      reading: "participação do fluxo no movimento",
      bias: up ? "alta" : "neutro",
      confidence: row.status === "live" ? "alta" : "baixa",
    },
  ];
}

export function buildAssetDetail(symbol: string): AssetDetail | null {
  const row = mockRows.find((r) => r.symbol.toUpperCase() === symbol.toUpperCase());
  if (!row) return null;

  const candles = buildCandles(row.symbol, row.price, row.change_pct);
  const highs = candles.slice(-30).map((c) => c.h);
  const lows = candles.slice(-30).map((c) => c.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const prev = row.price / (1 + row.change_pct / 100);

  return {
    ...row,
    day: {
      open: prev * (1 + (row.change_pct / 100) * 0.3),
      high: Math.max(row.price, prev) * 1.004,
      low: Math.min(row.price, prev) * 0.995,
      prev_close: prev,
      volume: row.volume,
    },
    candles,
    indicators: indicatorsFor(row),
    levels: [
      { label: `resistência ${max.toFixed(2)}`, value: max, kind: "resistencia" },
      { label: `suporte ${min.toFixed(2)}`, value: min, kind: "suporte" },
    ],
    notes: [
      row.change_pct >= 0
        ? "Preço acima das médias curtas com fluxo comprador dominante na sessão."
        : "Preço perdendo as médias curtas; fluxo vendedor comanda a sessão.",
      row.status === "live"
        ? "Dado ao vivo — leitura confiável para o horário atual."
        : "Dado com atraso — confirme antes de qualquer decisão.",
      `Faixa observada nos últimos 30 candles entre ${min.toFixed(2)} e ${max.toFixed(2)}.`,
    ],
    news: mockNews.filter((n) => n.symbols.includes(row.symbol)),
    alerts: mockAlerts.filter((a) => a.symbol === row.symbol),
  };
}

const setups = [
  "Rompimento de máxima de 5 dias",
  "Pullback na EMA 21",
  "Reversão em suporte semanal",
  "Perda de média de 21 períodos",
  "Consolidação com volume baixo",
  "Continuação de tendência",
  "Divergência de RSI",
];

export const mockDesk: DeskRow[] = mockRows.map((row, i) => {
  const rnd = seeded(`${row.symbol}-desk`);
  const up = row.change_pct >= 0;
  return {
    symbol: row.symbol,
    label: row.label,
    price: row.price,
    change_pct: row.change_pct,
    trend: up ? (row.score > 70 ? "alta forte" : "alta") : row.score < 45 ? "baixa forte" : "baixa",
    rsi: Math.round(Math.min(Math.max(40 + row.change_pct * 6 + rnd() * 12, 12), 88)),
    ema_stack: up ? "9 > 21 > 50" : "9 < 21 < 50",
    atr_pct: Number((0.9 + rnd() * 2.2).toFixed(2)),
    volume_ratio: Number((0.7 + rnd() * 1.2).toFixed(2)),
    setup: setups[i % setups.length]!,
    score: row.score,
    confidence: row.confidence,
    status: row.status,
    spark: row.spark,
  };
});
