import { Link } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-border bg-sidebar/90 px-5 backdrop-blur">
      <Link to="/" className="flex items-center gap-2.5">
        <span className="flex h-6 items-end gap-[3px]" aria-hidden="true">
          <span className="brand-bar h-3.5 w-[3px]" />
          <span className="brand-bar h-6 w-[3px]" />
          <span className="brand-bar h-4.5 w-[3px]" />
        </span>
        <span className="text-base font-extrabold tracking-tight text-foreground">OneB</span>
        <span className="label-caps hidden sm:inline">Terminal</span>
      </Link>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-up md:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-up" />
          Mercado aberto
        </span>

        <label className="hidden items-center gap-2 rounded-lg border border-border bg-card/70 px-2.5 py-1.5 focus-within:border-primary lg:flex">
          <Search className="h-3.5 w-3.5 text-muted-dim" />
          <input
            placeholder="Buscar ativo"
            className="w-36 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-dim"
          />
        </label>

        <button
          type="button"
          aria-label="Notificações"
          className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-down" />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card-alt text-xs font-semibold text-foreground">
          AS
        </div>
      </div>
    </header>
  );
}
