import { cn } from "@/lib/utils";
import type { Candle } from "@/lib/types";

interface CandleChartProps {
  candles: Candle[];
  levels?: { label: string; value: number; kind: "suporte" | "resistencia" }[];
  className?: string;
  height?: number;
}

const W = 1000;

/** Gráfico de candles em SVG puro — sem dependência de lib de chart. */
export function CandleChart({ candles, levels = [], className, height = 320 }: CandleChartProps) {
  const priceArea = height * 0.76;
  const volArea = height - priceArea - 8;

  const highs = candles.map((c) => c.h);
  const lows = candles.map((c) => c.l);
  const levelValues = levels.map((l) => l.value);
  const max = Math.max(...highs, ...levelValues);
  const min = Math.min(...lows, ...levelValues);
  const span = max - min || 1;
  const pad = span * 0.06;
  const top = max + pad;
  const bottom = min - pad;

  const y = (v: number) => ((top - v) / (top - bottom)) * priceArea;
  const slot = W / candles.length;
  const bodyW = Math.max(slot * 0.56, 1.5);

  const maxVol = Math.max(...candles.map((c) => c.v)) || 1;

  const ema = (period: number) => {
    const k = 2 / (period + 1);
    let prev = candles[0]?.c ?? 0;
    return candles.map((c, i) => {
      prev = i === 0 ? c.c : c.c * k + prev * (1 - k);
      return `${i * slot + slot / 2},${y(prev)}`;
    });
  };

  return (
    <div className={cn("-mx-1 overflow-hidden rounded-lg border border-border bg-card-alt/40", className)}>
      <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full" role="img" aria-label="Gráfico de candles">
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={priceArea * f}
            y2={priceArea * f}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        ))}

        {levels.map((l) => (
          <g key={l.label}>
            <line
              x1="0"
              x2={W}
              y1={y(l.value)}
              y2={y(l.value)}
              stroke={l.kind === "suporte" ? "var(--color-up)" : "var(--color-down)"}
              strokeWidth="1"
              strokeDasharray="6 6"
              opacity="0.55"
            />
            <text
              x={W - 6}
              y={y(l.value) - 4}
              textAnchor="end"
              fontSize="16"
              fill={l.kind === "suporte" ? "var(--color-up)" : "var(--color-down)"}
              opacity="0.85"
            >
              {l.label}
            </text>
          </g>
        ))}

        {candles.map((c, i) => {
          const x = i * slot + slot / 2;
          const up = c.c >= c.o;
          const color = up ? "var(--color-chart-up)" : "var(--color-chart-down)";
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyH = Math.max(Math.abs(y(c.o) - y(c.c)), 1);
          return (
            <g key={c.t}>
              <line x1={x} x2={x} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1.4" />
              <rect x={x - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} />
              <rect
                x={x - bodyW / 2}
                y={priceArea + 8 + volArea - (c.v / maxVol) * volArea}
                width={bodyW}
                height={(c.v / maxVol) * volArea}
                fill={color}
                opacity="0.35"
              />
            </g>
          );
        })}

        <polyline points={ema(9).join(" ")} fill="none" stroke="var(--color-primary)" strokeWidth="1.6" opacity="0.9" />
        <polyline
          points={ema(21).join(" ")}
          fill="none"
          stroke="var(--color-warning)"
          strokeWidth="1.6"
          opacity="0.75"
        />
      </svg>
      <div className="flex flex-wrap items-center gap-4 border-t border-border px-3 py-2 text-[0.7rem] text-muted-dim">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-primary" /> EMA 9
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-warning" /> EMA 21
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-chart-up" /> alta
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-chart-down" /> baixa
        </span>
        <span>volume na base · candles diários (mock)</span>
      </div>
    </div>
  );
}
