import { useQuery } from "@tanstack/react-query";
import { mockAlerts, mockDashboard, mockWatchlist } from "@/lib/mock/data";
import type { AlertItem, BacktestResult, DashboardSummary, WatchlistItem } from "@/lib/types";

/**
 * Ponto único de integração com o FastAPI.
 * Cada hook devolve mock hoje; troque o `queryFn` pelo `api.get(...)` indicado.
 */
const delay = <T>(data: T, ms = 220) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard-summary"],
    // TODO: API -> api.get<DashboardSummary>("/api/dashboard-summary")
    queryFn: () => delay(mockDashboard),
    refetchInterval: 20_000,
  });
}

export function useWatchlist() {
  return useQuery<WatchlistItem[]>({
    queryKey: ["watchlist"],
    // TODO: API -> api.get<WatchlistItem[]>("/api/watchlist")
    queryFn: () => delay(mockWatchlist),
    refetchInterval: 30_000,
  });
}

export function useAlerts() {
  return useQuery<AlertItem[]>({
    queryKey: ["alerts"],
    // TODO: API -> api.get<AlertItem[]>("/api/alerts")
    queryFn: () => delay(mockAlerts),
    refetchInterval: 30_000,
  });
}

// TODO: API -> api.post<BacktestResult>("/api/watchlist/rules/backtest", payload)
export async function backtestRule(payload: {
  symbol: string;
  indicator: string;
  operator: string;
  value: number;
}): Promise<BacktestResult> {
  const seed = payload.symbol.length + payload.value;
  const tries = 40 + (Math.round(seed) % 25);
  const hits = Math.round(tries * (0.42 + ((Math.round(seed) % 30) / 100)));
  const hitRate = hits / tries;
  return delay({
    hits,
    tries,
    hit_rate: hitRate,
    avg_move_pct: Number((hitRate * 3.4 - 0.6).toFixed(2)),
    confidence: hitRate > 0.6 ? "alta" : hitRate > 0.45 ? "media" : "baixa",
  } satisfies BacktestResult);
}
