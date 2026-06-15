import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp, servicePricing, type BookingStatus } from "@/lib/store";
import { MapPlaceholder } from "@/components/app-chrome";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, MapPin, Phone, CheckCircle2, Navigation } from "lucide-react";

export const Route = createFileRoute("/driver/active/$id")({
  component: ActiveTrip,
});

const flow: BookingStatus[] = ["accepted", "enroute", "arrived", "started", "completed"];

function ActiveTrip() {
  const { id } = Route.useParams();
  const { bookings, updateBooking } = useApp();
  const nav = useNavigate();
  const b = bookings.find((x) => x.id === id);

  if (!b) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Trip not found.
      </div>
    );
  }

  const idx = flow.indexOf(b.status);
  const next = flow[Math.min(idx + 1, flow.length - 1)];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-3 py-3 backdrop-blur">
        <button onClick={() => nav({ to: "/driver" })} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="font-display text-base font-bold">Active trip</div>
          <div className="text-[11px] text-muted-foreground">{b.id} · {servicePricing[b.service].label}</div>
        </div>
        <span className="rounded-full bg-success/15 text-success px-2 py-0.5 text-[10px] font-bold uppercase">
          {b.status}
        </span>
      </header>

      <div className="flex-1 px-4 pt-4 pb-32 space-y-4">
        <MapPlaceholder caption={`Pickup: ${b.pickup}`} eta="6 min" />

        <div className="card-soft p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary-soft text-primary font-bold">C</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-display text-base font-bold">Customer</div>
              <div className="text-xs text-muted-foreground">{servicePricing[b.service].label} · {b.duration}</div>
            </div>
            <a href="tel:+919999999999" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Phone className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-3 flex items-start gap-2 text-sm border-t border-border pt-3">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{b.pickup}</span>
          </div>
        </div>

        <div className="card-soft p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">You'll earn</div>
          <div className="font-display text-3xl font-extrabold text-primary">₹{Math.round(b.price * 0.8).toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">After 20% platform fee · paid on completion</div>
        </div>
      </div>

      <div className="sticky bottom-0 space-y-2 border-t border-border bg-card/95 p-4 backdrop-blur">
        {b.status !== "completed" ? (
          <Button
            size="lg"
            className="h-12 w-full rounded-xl text-base"
            onClick={() => updateBooking(b.id, { status: next })}
          >
            {b.status === "accepted" ? <><Navigation className="h-4 w-4" /> Start navigation</> :
              b.status === "enroute" ? "Mark as arrived" :
              b.status === "arrived" ? "Start trip" :
              <><CheckCircle2 className="h-4 w-4" /> Complete trip</>}
          </Button>
        ) : (
          <Button size="lg" className="h-12 w-full rounded-xl text-base" onClick={() => nav({ to: "/driver" })}>
            Back to dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
