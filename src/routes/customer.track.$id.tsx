import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, type BookingStatus } from "@/lib/store";
import { MapPlaceholder } from "@/components/app-chrome";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MessageCircle, X, Star, ShieldAlert, LifeBuoy, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/customer/track/$id")({
  component: TrackFlow,
});

const timeline: { key: BookingStatus; label: string }[] = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "enroute", label: "En route" },
  { key: "arrived", label: "Arrived" },
  { key: "started", label: "Trip started" },
  { key: "completed", label: "Completed" },
];

function TrackFlow() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { bookings, updateBooking } = useApp();
  const booking = bookings.find((b) => b.id === id);
  const [showRate, setShowRate] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground text-sm">Booking not found.</p>
        <Link to="/customer" className="mt-4 inline-block text-primary text-sm">Go home</Link>
      </div>
    );
  }

  const currentIdx = timeline.findIndex((t) => t.key === booking.status);
  const isTripActive = booking.status === "started";
  const isComplete = booking.status === "completed";

  const advance = () => {
    const next = timeline[Math.min(currentIdx + 1, timeline.length - 1)];
    updateBooking(booking.id, { status: next.key });
  };

  if (isComplete && !booking.rated && showRate) {
    return (
      <div className="flex min-h-[100dvh] flex-col px-6 pt-6 pb-8">
        <button onClick={() => setShowRate(false)} className="mb-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-2xl font-bold">Rate your driver</h1>
        <p className="mt-1 text-sm text-muted-foreground">How was your trip with {booking.driverName}?</p>
        <div className="mt-8 flex justify-center">
          <Avatar className="h-20 w-20 ring-4 ring-primary-soft">
            <AvatarFallback className="bg-primary-soft text-primary text-2xl font-bold">{booking.driverName[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)}>
              <Star className={`h-10 w-10 ${n <= rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        <Textarea className="mt-6" placeholder="Leave a comment (optional)" value={review} onChange={(e) => setReview(e.target.value)} />
        <div className="flex-1" />
        <Button
          size="lg"
          className="h-12 rounded-xl text-base"
          onClick={() => {
            updateBooking(booking.id, { rated: true });
            nav({ to: "/customer" });
          }}
        >
          Submit review
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-3 py-3 backdrop-blur">
        <button onClick={() => nav({ to: "/customer" })} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="font-display text-base font-bold">{isComplete ? "Trip summary" : isTripActive ? "Trip in progress" : "Track driver"}</div>
          <div className="text-[11px] text-muted-foreground">{booking.id}</div>
        </div>
        {isTripActive && (
          <Link to="/customer/sos" className="grid h-9 w-9 place-items-center rounded-full bg-destructive text-destructive-foreground">
            <ShieldAlert className="h-4 w-4" />
          </Link>
        )}
      </header>

      <div className="flex-1 px-4 pt-4 pb-32 space-y-4">
        {!isComplete && <MapPlaceholder caption={`Pickup: ${booking.pickup}`} eta={isTripActive ? "Trip live" : "8 min"} />}

        {isComplete && (
          <div className="card-soft p-5 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-3 font-display text-xl font-bold">Trip completed</h2>
            <p className="mt-1 text-sm text-muted-foreground">Hope you had a great ride!</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-muted p-3">
                <div className="text-[10px] text-muted-foreground uppercase">Duration</div>
                <div className="text-sm font-bold mt-1">{booking.duration}</div>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <div className="text-[10px] text-muted-foreground uppercase">Paid</div>
                <div className="text-sm font-bold mt-1">₹{booking.price}</div>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <div className="text-[10px] text-muted-foreground uppercase">Driver</div>
                <div className="text-sm font-bold mt-1 truncate">{booking.driverName.split(" ")[0]}</div>
              </div>
            </div>
          </div>
        )}

        <div className="card-soft p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarFallback className="bg-primary-soft text-primary font-bold">{booking.driverName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-display text-base font-bold">{booking.driverName}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-warning text-warning" /> {booking.driverRating} · 8 yrs exp
              </div>
            </div>
            {!isComplete && (
              <div className="flex gap-2">
                <a href={`tel:${booking.driverPhone}`} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Phone className="h-4 w-4" />
                </a>
                <button className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {!isComplete && (
          <div className="card-soft p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Trip timeline</div>
            <div className="space-y-3">
              {timeline.map((t, i) => {
                const done = i <= currentIdx;
                return (
                  <div key={t.key} className="flex items-center gap-3">
                    <div className={`grid h-7 w-7 place-items-center rounded-full ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px]">{i + 1}</span>}
                    </div>
                    <span className={`text-sm ${done ? "font-semibold" : "text-muted-foreground"}`}>{t.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isTripActive && (
          <Link to="/customer/support" className="card-soft flex items-center justify-between p-4">
            <span className="flex items-center gap-3 text-sm font-medium">
              <LifeBuoy className="h-4 w-4 text-primary" /> Contact support
            </span>
            <span className="text-xs text-muted-foreground">24×7</span>
          </Link>
        )}
      </div>

      <div className="sticky bottom-0 space-y-2 border-t border-border bg-card/95 p-4 backdrop-blur">
        {!isComplete && (
          <Button size="lg" className="h-12 w-full rounded-xl text-base" onClick={advance}>
            {booking.status === "accepted"
              ? "Simulate: driver en route"
              : booking.status === "enroute"
              ? "Simulate: arrived"
              : booking.status === "arrived"
              ? "Start trip"
              : booking.status === "started"
              ? "Complete trip"
              : "Continue"}
          </Button>
        )}
        {isComplete && !booking.rated && (
          <Button size="lg" className="h-12 w-full rounded-xl text-base" onClick={() => setShowRate(true)}>
            Rate driver
          </Button>
        )}
        {!isComplete && booking.status !== "started" && (
          <Button
            variant="outline"
            className="h-11 w-full rounded-xl"
            onClick={() => {
              updateBooking(booking.id, { status: "cancelled" });
              nav({ to: "/customer" });
            }}
          >
            <X className="h-4 w-4" /> Cancel booking
          </Button>
        )}
      </div>
    </div>
  );
}
