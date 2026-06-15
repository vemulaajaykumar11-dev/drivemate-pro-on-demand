import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Bell, Car, CheckCircle2, Wallet, XCircle } from "lucide-react";

export const Route = createFileRoute("/driver/notifications")({
  component: () => {
    const { notifications } = useApp();
    const list = notifications.filter((n) => n.role === "driver");
    const iconFor = (t: string) => {
      if (t.includes("Request")) return Car;
      if (t.includes("Cancel")) return XCircle;
      if (t.includes("Completed")) return CheckCircle2;
      if (t.includes("Earnings") || t.includes("Credited")) return Wallet;
      return Bell;
    };
    return (
      <div className="px-4 pt-4">
        <h1 className="font-display text-xl font-bold mb-3">Notifications</h1>
        <div className="space-y-2">
          {list.map((n) => {
            const Icon = iconFor(n.title);
            return (
              <div key={n.id} className="card-soft flex items-start gap-3 p-3.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>
                </div>
                <div className="text-[10px] text-muted-foreground">{n.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
