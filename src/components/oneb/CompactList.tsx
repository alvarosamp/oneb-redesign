import type { ReactNode } from "react";

export interface CompactItem {
  id: string;
  lead: ReactNode;
  title: string;
  meta?: string;
  trailing?: ReactNode;
}

export function CompactList({ items, empty = "Nada por aqui." }: { items: CompactItem[]; empty?: string }) {
  if (items.length === 0) {
    return <p className="py-4 text-xs text-muted-dim">{empty}</p>;
  }

  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-start gap-3 border-b border-border py-2.5 last:border-b-0"
        >
          <div className="mt-0.5 shrink-0">{item.lead}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-foreground">{item.title}</p>
            {item.meta && <p className="num mt-0.5 text-[0.7rem] text-muted-dim">{item.meta}</p>}
          </div>
          {item.trailing && <div className="shrink-0">{item.trailing}</div>}
        </li>
      ))}
    </ul>
  );
}
