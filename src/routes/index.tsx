import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel } from "@/components/oneb/Panel";
import { COMPLIANCE_TEXT } from "./_terminal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OneB Market — Escola de investimentos + Terminal de mercado" },
      {
        name: "description",
        content:
          "OneB une escola de investimentos e terminal de monitoramento: Ibovespa, IFIX, ações B3 e Nasdaq com alertas e leituras de confiança auditável.",
      },
      { property: "og:title", content: "OneB Market — Escola + Terminal" },
      {
        property: "og:description",
        content:
          "Monitore B3 e Nasdaq, crie regras de alerta e aprenda com aulas e lives no mesmo lugar.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    title: "Terminal de monitoramento",
    text: "Radar de ativos B3 e Nasdaq, câmbio USD/BRL, notícias e calendário econômico em um painel só.",
  },
  {
    title: "Regras e alertas",
    text: "Monte regras técnicas, teste no histórico e receba sinais com confiabilidade explícita.",
  },
  {
    title: "Escola integrada",
    text: "Aulas, lives e comunidade conectadas ao que você acompanha no mercado.",
  },
];

function Landing() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-14 px-5 py-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 items-end gap-[3px]" aria-hidden="true">
            <span className="brand-bar h-3.5 w-[3px]" />
            <span className="brand-bar h-6 w-[3px]" />
            <span className="brand-bar h-4.5 w-[3px]" />
          </span>
          <span className="text-base font-extrabold text-foreground">OneB</span>
        </div>
        <Link
          to="/ferramenta"
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary"
        >
          Entrar no terminal
        </Link>
      </header>

      <section className="max-w-2xl">
        <p className="label-caps">Escola + Terminal</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground md:text-5xl">
          Acompanhe B3 e Nasdaq com sinais que você consegue auditar.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Um terminal de monitoramento com regras de alerta, leituras de mercado e badge de
          confiança em cada sinal — junto de uma escola de investimentos.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/ferramenta"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Abrir dashboard
          </Link>
          <Link
            to="/watchlist"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary"
          >
            Ver watchlist
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <Panel key={f.title} title={f.title}>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </Panel>
        ))}
      </section>

      <footer className="mt-auto border-t border-border pt-4 text-[0.7rem] italic text-muted-dim">
        {COMPLIANCE_TEXT}
      </footer>
    </div>
  );
}
