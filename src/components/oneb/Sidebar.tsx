import { Link } from "@tanstack/react-router";

interface NavItem {
  label: string;
  to?: "/ferramenta" | "/watchlist" | "/alertas";
}

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "Monitoramento",
    items: [
      { label: "Dashboard", to: "/ferramenta" },
      { label: "Watchlist & Regras", to: "/watchlist" },
      { label: "Alertas", to: "/alertas" },
      { label: "Painel de Mercado" },
      { label: "Ativo detalhe" },
    ],
  },
  {
    title: "Leituras do dia",
    items: [
      { label: "Análise Matinal" },
      { label: "Resumo do Mercado" },
      { label: "Regime de mercado" },
    ],
  },
  {
    title: "Inteligência",
    items: [
      { label: "Mesa Técnica" },
      { label: "Mesa IA" },
      { label: "Copiloto" },
      { label: "Inteligência de Mercado" },
      { label: "Assistente IA" },
    ],
  },
  {
    title: "Carteira",
    items: [{ label: "Posições & P&L" }],
  },
  {
    title: "Workspace",
    items: [{ label: "Painel comercial" }, { label: "Auditoria operacional" }, { label: "Como usar" }],
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-[264px] shrink-0 border-r border-border bg-sidebar lg:block">
      <nav className="sticky top-[68px] flex max-h-[calc(100vh-68px)] flex-col gap-6 overflow-y-auto px-3 py-5">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <span className="label-caps px-3 pb-1">{section.title}</span>
            {section.items.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-card-alt/70 hover:text-foreground"
                  activeProps={{
                    className:
                      "active-rail rounded-md bg-card-alt px-3 py-2 text-sm font-medium text-foreground",
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  title="Em breve neste redesign"
                  className="cursor-default rounded-md px-3 py-2 text-sm text-muted-dim/70"
                >
                  {item.label}
                </span>
              ),
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
