import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp, servicePricing } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock, TrendingUp, Wallet, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/driver/")({
  component: DriverHome,
});

const statuses = ["online", "busy", "offline"] as const;
const statusColors = {
  online: "bg-success text-success-foreground",
  busy: "bg-warning text-warning-foreground",
  offline: "bg-muted text-muted-foreground",
};

function DriverHome() {
  const { driverStatus, setDriverStatus, pendingDriverRequests, acceptRequest, rejectRequest, bookings, user, driverVerification } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    if (driverVerification === "none") nav({ to: "/driver/register" });
    else if (driverVerification === "pending") nav({ to: "/driver/pending" });
  }, [driverVerification, nav]);

  if (driverVerification !== "approved") return null;

  const activeTrips = bookings.filter((b) => ["accepted", "enroute", "arrived", "started"].includes(b.status) && b.driverName === (user?.name || "You"));

  return (
    <div className="px-4 pt-4">
      <div className="card-soft p-4">
        <div className="text-xs text-muted-foreground uppercase tracking-wide">Your status</div>
        <div className="mt-2 flex gap-1.5 rounded-2xl bg-muted p-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setDriverStatus(s)}
              className={`flex-1 rounded-xl px-2 py-2 text-xs font-bold capitalize transition ${
                driverStatus === s ? statusColors[s] + " shadow" : "text-muted-foreground"
              }`}
            >
              ● {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Today", amount: "₹1,240", trend: "+12%" },
          { label: "This week", amount: "₹8,540", trend: "+8%" },
          { label: "This month", amount: "₹32,180", trend: "+22%" },
        ].map((e) => (
          <div key={e.label} className="card-soft p-3">
            <div className="text-[10px] text-muted-foreground uppercase">{e.label}</div>
            <div className="font-display text-base font-extrabold mt-1">{e.amount}</div>
            <div className="text-[10px] text-success font-semibold mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> {e.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-base font-bold">New requests</h2>
        <span className="text-xs text-muted-foreground">{pendingDriverRequests.length} waiting</span>
      </div>

      <div className="mt-3 space-y-3">
        {pendingDriverRequests.length === 0 && (
          <div className="card-soft p-6 text-center text-sm text-muted-foreground">No new requests. We'll ping you when one comes in.</div>
        )}
        {pendingDriverRequests.map((r) => (
          <div key={r.id} className="card-soft p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-bold uppercase">
                {servicePricing[r.service].label}
              </span>
              <span className="font-display text-base font-extrabold text-primary">₹{r.price}</span>
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span>{r.pickup}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Clock className="h-3.5 w-3.5" /> {r.date} · {r.startTime} · {r.duration}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => rejectRequest(r.id)}>
                Reject
              </Button>
              <Button className="rounded-xl" onClick={() => acceptRequest(r.id)}>
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>

      {activeTrips.length > 0 && (
        <>
          <h2 className="font-display text-base font-bold mt-7 mb-3">Upcoming trips</h2>
          <div className="space-y-2">
            {activeTrips.map((t) => (
              <Link
                key={t.id}
                to="/driver/active/$id"
                params={{ id: t.id }}
                className="card-soft flex items-center gap-3 p-3.5"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-soft text-primary text-xs font-bold">C</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{servicePricing[t.service].label}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{t.pickup}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">₹{t.price}</div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground inline" />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <Link to="/driver/earnings" className="card-soft mt-6 flex items-center gap-3 p-4 mb-4">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success">
          <Wallet className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Earnings & payouts</div>
          <div className="text-[11px] text-muted-foreground">Transaction history, withdrawals</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>
    </div>
  );
}
