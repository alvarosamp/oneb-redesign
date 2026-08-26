import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/oneb/Sidebar";
import { Topbar } from "@/components/oneb/Topbar";
import { COMPLIANCE_TEXT } from "@/lib/constants";

export const Route = createFileRoute("/_terminal")({
  component: TerminalLayout,
});


function TerminalLayout() {
  return (
    <div className="min-h-screen">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-7">
          <Outlet />
          <footer className="mt-10 border-t border-border pt-4 text-[0.7rem] italic text-muted-dim">
            {COMPLIANCE_TEXT}
          </footer>
        </main>
      </div>
    </div>
  );
}
