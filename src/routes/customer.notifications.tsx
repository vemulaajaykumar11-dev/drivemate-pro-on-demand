import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Bell, CheckCircle2, Car, CreditCard, MapPin, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/customer/notifications")({
  component: NotificationsPage,
});

const iconFor = (title: string) => {
  if (title.includes("Arrived")) return MapPin;
  if (title.includes("Accepted")) return Car;
  if (title.includes("Started")) return PlayCircle;
  if (title.includes("Completed")) return CheckCircle2;
  if (title.includes("Payment")) return CreditCard;
  return Bell;
};

function NotificationsPage() {
  const { notifications } = useApp();
  const list = notifications.filter((n) => n.role === "customer");
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
              <div className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
