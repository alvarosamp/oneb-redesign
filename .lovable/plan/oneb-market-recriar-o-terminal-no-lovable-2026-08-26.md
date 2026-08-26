# OneB Market — Recriar o Terminal no Lovable

## O que eu li no seu repositório

O repo foi renomeado: hoje é `alvarosamp/OneB` (público, branch `master`). O link antigo redireciona. Achados relevantes em `frontend/`:

- `src/App.tsx` — todas as rotas que você listou, com dois layouts: `Layout` (navbar + escola) e `ToolLayout` (navbar + sidebar + terminal), ambos com o rodapé de compliance fixo.
- `src/styles/global.css` (6.204 linhas) — tem **dois temas empilhados**: um tema antigo claro/escuro dourado (`--accent: #d4af37`) e, a partir da linha ~990, o bloco “OneB professional redesign” que sobrescreve tudo com os tokens do seu guia (`#050607`, `#2684ff`, `#32d583`, `#ff5f6d`, `#f5b84b`, `--surface-glow`, gradiente radial azul no body). Vou usar **somente** os tokens do redesign; o tema dourado fica de fora.
- Componentes já padronizados no CSS: `.panel`, `.panel-title`, `.metric-card`, `.dense-table`, `.status-pill` (good/warn/danger), `.compact-list`, `.confidence`, sidebar de 264px com barra azul no item ativo.
- `src/api/client.ts` — fetch com `VITE_API_URL`, token em `localStorage` (`oneb_market_token`), header `Bearer`, handler global de 401 → `/login`. É exatamente o contrato que vou replicar aqui.
- Páginas ricas em dados: `Dashboard` (polling de 20s em `/api/dashboard-summary`, câmbio, ouro, notícias, calendário, earnings, score/confiança), `Watchlist` (CRUD + regras + backtest), etc.

Diferença importante: seu app usa React Router; este projeto Lovable usa TanStack Router com rotas em arquivos (`src/routes/`). As URLs finais ficam idênticas (`/ferramenta`, `/watchlist`, ...), só a forma de declarar muda.

## Fase 1 — Fundação (o que eu faço primeiro)

1. **Design system** em `src/styles.css`: tokens do redesign convertidos para o formato do projeto (background, foreground, card/card-alt, border, accent, up/down/warning, chart-up/down, shadow, surface-glow, raios 6–8/12px), tema escuro único. Fontes: Inter (interface) e IBM Plex Mono (números) carregadas via `<link>` no root.
2. **Componentes reutilizáveis** em `src/components/oneb/`: `Panel` (título + subtítulo + ação à direita), `MetricCard` (label caps, valor mono, badge ▲/▼, sparkline opcional), `ConfidenceBadge` (Alta/Média/Baixa), `StatusPill` (ao vivo/atrasado/sem dados), `DenseTable`, `CompactList`, `ComplianceNote`.
3. **Shell do Terminal**: `Topbar` 68px (logo de 3 barras em gradiente azul, status “Mercado aberto”, busca/notificações/avatar) + `Sidebar` 264px com seções em maiúsculas e item ativo com barra azul + rodapé de compliance com o texto exato do repo.
4. **Camada de dados mockada**: `src/lib/api.ts` replicando o `client.ts` (base `VITE_API_URL`, Bearer JWT, erro 401) e `src/lib/mock/*.ts` com dados fake tipados. Cada tela consome hooks (`useDashboardSummary`, `useWatchlist`, ...) que hoje devolvem mock e têm um único ponto marcado com `// TODO: API` para trocar pelo FastAPI. Sem Lovable Cloud, sem backend novo.

## Fase 2 — Telas (na sua ordem de prioridade)

- `/ferramenta` Dashboard: métricas, câmbio USD/BRL + conversor, radar com score/confiança, notícias, calendário, alertas recentes.
- `/watchlist` + `/alertas`: tabela densa, formulário de ativo, construtor de regra com resultado de backtest, lista de alertas com confiança.
- `/ativo/:symbol` + `/mesa-tecnica`: cabeçalho de cotação, candles (biblioteca de gráfico leve com as cores `#26a69a`/`#ef5350`), painéis de indicadores.
- `/mesa-ia`, `/copiloto`, `/inteligencia`: um padrão visual único de “score auditável” (barra de confiança + votos + histórico), reaproveitado nas três.
- `/mercado`, `/resumo-diario`, `/analise-matinal`: listas compactas de notícias/eventos + leitura do dia.
- `/posicoes`: tabela + formulário de lançamento manual.

`/` neste projeto passa a ser a Landing pública; login/cadastro entram como telas de UI (sem auth real) até plugarmos o FastAPI.

## Escopo desta primeira entrega

Fase 1 completa + Dashboard, Watchlist e Alertas. Escola, Marketing, SaaS e Operações ficam para depois, como você definiu.

## Notas técnicas

- Rotas: `src/routes/ferramenta.tsx`, `watchlist.tsx`, `alertas.tsx`, `ativo.$symbol.tsx`, com layout do terminal em `src/routes/_terminal` (URLs sem o prefixo).
- Cada rota com `head()` própio (título/descrição).
- Cores só via tokens semânticos; nada de `bg-[#...]` nos componentes.
- Polling: `useQuery` com `refetchInterval` (equivalente ao seu `usePolling`).
