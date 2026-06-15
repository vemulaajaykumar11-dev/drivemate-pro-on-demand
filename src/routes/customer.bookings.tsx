import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, servicePricing, type BookingStatus } from "@/lib/store";
import { StatusPill } from "@/components/app-chrome";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/customer/bookings")({
  component: BookingsPage,
});

const tabs: { key: "upcoming" | "active" | "completed" | "cancelled"; label: string; statuses: BookingStatus[] }[] = [
  { key: "active", label: "Active", statuses: ["accepted", "enroute", "arrived", "started"] },
  { key: "upcoming", label: "Upcoming", statuses: ["requested"] },
  { key: "completed", label: "Completed", statuses: ["completed"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled"] },
];

function BookingsPage() {
  const { bookings } = useApp();
  const [tab, setTab] = useState<typeof tabs[number]["key"]>("active");
  const list = bookings.filter((b) => tabs.find((t) => t.key === tab)!.statuses.includes(b.status));

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-xl font-bold mb-3">My bookings</h1>
      <div className="flex gap-1 rounded-2xl bg-muted p-1 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-xl px-2 py-2 text-xs font-semibold transition ${
              tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-2.5">
        {list.length === 0 && (
          <div className="card-soft p-10 text-center text-sm text-muted-foreground">No bookings here</div>
        )}
        {list.map((b) => (
          <Link
            key={b.id}
            to="/customer/track/$id"
            params={{ id: b.id }}
            className="card-soft flex items-center gap-3 p-4 transition active:scale-[0.99]"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold">{servicePricing[b.service].label}</span>
                <StatusPill status={b.status} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">{b.id} · {b.date} · {b.duration}</div>
              <div className="text-xs mt-1.5 truncate">📍 {b.pickup}</div>
              <div className="text-sm font-bold text-primary mt-1.5">₹{b.price.toLocaleString()}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
