import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right";
  numeric?: boolean;
  render: (row: T) => ReactNode;
}

interface DenseTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: string;
  className?: string;
}

export function DenseTable<T>({
  columns,
  rows,
  rowKey,
  empty = "Sem dados no momento.",
  className,
}: DenseTableProps<T>) {
  return (
    <div className={cn("-mx-1 overflow-x-auto", className)}>
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "label-caps border-b border-border px-2 pb-2 font-semibold",
                  c.align === "right" ? "text-right" : "text-left",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-2 py-6 text-center text-xs text-muted-dim">
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-card-alt/60">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "border-b border-border px-2 py-2.5 align-middle",
                    c.align === "right" ? "text-right" : "text-left",
                    c.numeric && "num",
                  )}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
