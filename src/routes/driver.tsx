import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AppHeader, BottomNav } from "@/components/app-chrome";

export const Route = createFileRoute("/driver")({
  component: () => {
    const pathname = useRouterState({ select: (s) => s.location.pathname });
    const hideChrome = pathname.includes("/register") || pathname.includes("/pending");
    return (
      <div className="flex min-h-[100dvh] flex-col">
        {!hideChrome && <AppHeader />}
        <main className="flex-1 pb-4">
          <Outlet />
        </main>
        {!hideChrome && <BottomNav />}
      </div>
    );
  },
});
