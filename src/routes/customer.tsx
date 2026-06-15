import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader, BottomNav } from "@/components/app-chrome";

export const Route = createFileRoute("/customer")({
  component: () => (
    <div className="flex min-h-[100dvh] flex-col">
      <AppHeader />
      <main className="flex-1 pb-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  ),
});
