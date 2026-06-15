import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, servicePricing, type ServiceType, type Booking } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, CheckCircle2, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/customer/book/$service")({
  component: BookFlow,
});

type Step = "form" | "confirm" | "payment" | "success";

const durations: Record<ServiceType, { label: string; multiplier: number }[]> = {
  hourly: [
    { label: "1 Hour", multiplier: 1 },
    { label: "2 Hours", multiplier: 2 },
    { label: "3 Hours", multiplier: 3 },
    { label: "4 Hours", multiplier: 4 },
  ],
  daily: [
    { label: "Half Day (4h)", multiplier: 0.6 },
    { label: "Full Day (8h)", multiplier: 1 },
  ],
  weekly: [{ label: "1 Week (7 days)", multiplier: 1 }],
  monthly: [{ label: "1 Month (30 days)", multiplier: 1 }],
};

function BookFlow() {
  const { service } = Route.useParams();
  const svc = service as ServiceType;
  const meta = servicePricing[svc];
  const nav = useNavigate();
  const { addBooking } = useApp();
  const [step, setStep] = useState<Step>("form");

  const [pickup, setPickup] = useState("");
  const [date, setDate] = useState("2026-06-16");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState(durations[svc][0].label);
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState("upi");

  const mult = durations[svc].find((d) => d.label === duration)?.multiplier ?? 1;
  const price = Math.round(meta.perUnit * mult);
  const tax = Math.round(price * 0.05);
  const total = price + tax;

  const bookingId = "DM-" + Math.floor(2100 + Math.random() * 800);

  if (step === "success") return <Success id={bookingId} total={total} />;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-3 py-3 backdrop-blur">
        <button
          onClick={() => (step === "form" ? nav({ to: "/customer" }) : setStep(step === "confirm" ? "form" : "confirm"))}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="font-display text-base font-bold">
            {step === "form" ? meta.label : step === "confirm" ? "Confirm booking" : "Payment"}
          </div>
          <div className="text-[11px] text-muted-foreground">Step {step === "form" ? 1 : step === "confirm" ? 2 : 3} of 3</div>
        </div>
      </header>

      <div className="flex-1 px-4 pt-4 pb-32">
        {step === "form" && (
          <div className="space-y-4">
            <div>
              <Label className="mb-2">Pickup location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Enter address" value={pickup} onChange={(e) => setPickup(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-2">Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <Label className="mb-2">Start time</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>
            <div>
              <Label className="mb-2">Duration</Label>
              <div className="grid grid-cols-2 gap-2">
                {durations[svc].map((d) => (
                  <button
                    key={d.label}
                    onClick={() => setDuration(d.label)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      duration === d.label
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2">Notes (optional)</Label>
              <Textarea placeholder="Vehicle type, special instructions…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <PriceCard base={price} tax={tax} total={total} />
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-3">
            <SummaryRow label="Service" value={meta.label} />
            <SummaryRow label="Pickup" value={pickup || "—"} />
            <SummaryRow label="Date & time" value={`${date} · ${time}`} />
            <SummaryRow label="Duration" value={duration} />
            {notes && <SummaryRow label="Notes" value={notes} />}
            <PriceCard base={price} tax={tax} total={total} />
            <Button variant="outline" className="w-full rounded-xl" onClick={() => setStep("form")}>
              Edit booking
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="card-soft p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Amount payable</span>
                <span className="font-display text-2xl font-extrabold">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <Label className="mb-1">Choose payment method</Label>
            <RadioGroup value={pay} onValueChange={setPay} className="space-y-2">
              {[
                { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm", Icon: Smartphone },
                { id: "credit", label: "Credit Card", desc: "Visa, Mastercard, Amex", Icon: CreditCard },
                { id: "debit", label: "Debit Card", desc: "All major banks", Icon: Wallet },
                { id: "net", label: "Net Banking", desc: "All major banks", Icon: Building2 },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`card-soft flex cursor-pointer items-center gap-3 p-3 transition ${
                    pay === m.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <m.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="text-[11px] text-muted-foreground">{m.desc}</div>
                  </div>
                  <RadioGroupItem value={m.id} />
                </label>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-card/95 p-4 backdrop-blur">
        {step === "form" && (
          <Button
            disabled={!pickup}
            size="lg"
            className="h-12 w-full rounded-xl text-base"
            onClick={() => setStep("confirm")}
          >
            Continue · ₹{total.toLocaleString()}
          </Button>
        )}
        {step === "confirm" && (
          <Button size="lg" className="h-12 w-full rounded-xl text-base" onClick={() => setStep("payment")}>
            Proceed to payment
          </Button>
        )}
        {step === "payment" && (
          <Button
            size="lg"
            className="h-12 w-full rounded-xl text-base"
            onClick={() => {
              const b: Booking = {
                id: bookingId,
                service: svc,
                pickup,
                date,
                startTime: time,
                duration,
                notes,
                price: total,
                status: "accepted",
                driverName: "Ravi Kumar",
                driverPhone: "+91 99887 11223",
                driverRating: 4.9,
                createdAt: Date.now(),
              };
              addBooking(b);
              setStep("success");
            }}
          >
            Pay ₹{total.toLocaleString()} Now
          </Button>
        )}
      </div>
    </div>
  );
}

function PriceCard({ base, tax, total }: { base: number; tax: number; total: number }) {
  return (
    <div className="card-soft p-4">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Price summary</div>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Base fare</span><span>₹{base.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Taxes & fees</span><span>₹{tax.toLocaleString()}</span></div>
        <div className="my-2 h-px bg-border" />
        <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary text-lg">₹{total.toLocaleString()}</span></div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-soft flex items-start justify-between gap-4 p-3.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}

function Success({ id, total }: { id: string; total: number }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="grid h-24 w-24 place-items-center rounded-full bg-success/15 text-success animate-in zoom-in">
        <CheckCircle2 className="h-14 w-14" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-extrabold">Booking confirmed!</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We've matched you with a verified driver. Track them live until they arrive.
      </p>
      <div className="card-soft mt-6 w-full p-4 text-left">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Booking ID</span><span className="font-bold">{id}</span></div>
        <div className="mt-1 flex justify-between text-sm"><span className="text-muted-foreground">Amount paid</span><span className="font-bold text-primary">₹{total.toLocaleString()}</span></div>
      </div>
      <Link to="/customer/track/$id" params={{ id }} className="mt-8 w-full">
        <Button size="lg" className="h-12 w-full rounded-xl text-base">Track driver</Button>
      </Link>
      <Link to="/customer" className="mt-3 text-xs text-muted-foreground">Back to home</Link>
    </div>
  );
}
