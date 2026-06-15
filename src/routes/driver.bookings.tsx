import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, servicePricing } from "@/lib/store";
import { StatusPill } from "@/components/app-chrome";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/driver/bookings")({
  component: () => {
    const { bookings, user } = useApp();
    const mine = bookings.filter((b) => b.driverName === (user?.name || "You") || b.driverName.startsWith("Ravi") || b.driverName.startsWith("Amit") || b.driverName.startsWith("Rohit"));
    return (
      <div className="px-4 pt-4">
        <h1 className="font-display text-xl font-bold mb-3">My trips</h1>
        <div className="space-y-2.5">
          {mine.length === 0 && <div className="card-soft p-10 text-center text-sm text-muted-foreground">No trips yet</div>}
          {mine.map((b) => (
            <Link
              key={b.id}
              to="/driver/active/$id"
              params={{ id: b.id }}
              className="card-soft flex items-center gap-3 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold">{servicePricing[b.service].label}</span>
                  <StatusPill status={b.status} />
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{b.id} · {b.date} · {b.duration}</div>
                <div className="text-xs mt-1.5 truncate">📍 {b.pickup}</div>
                <div className="text-sm font-bold text-success mt-1.5">+₹{Math.round(b.price * 0.8)}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    );
  },
});
