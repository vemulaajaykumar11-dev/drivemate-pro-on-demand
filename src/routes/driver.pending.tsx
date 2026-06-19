import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/driver/pending")({
  component: Pending,
});

function Pending() {
  const { driverVerification, setDriverVerification } = useApp();
  const nav = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div className="grid h-24 w-24 place-items-center rounded-full bg-warning/15 text-warning ring-8 ring-warning/10">
        {driverVerification === "approved" ? <CheckCircle2 className="h-12 w-12 text-success" /> :
          driverVerification === "rejected" ? <XCircle className="h-12 w-12 text-destructive" /> :
          <Clock className="h-12 w-12 animate-pulse" />}
      </div>
      <h1 className="mt-6 font-display text-2xl font-extrabold">
        {driverVerification === "approved" ? "You're verified!" :
          driverVerification === "rejected" ? "Verification failed" : "Under review"}
      </h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {driverVerification === "approved"
          ? "You can now start accepting bookings and earn with DriveMate."
          : driverVerification === "rejected"
          ? "Some of your documents couldn't be verified. Please re-upload to try again."
          : "Your documents are being reviewed. This usually takes 12–24 hours. We'll notify you once done."}
      </p>

      <div className="card-soft mt-8 w-full p-4 text-left">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">Status</div>
        <div className="space-y-2">
          {[
            { key: "Documents submitted", done: true },
            { key: "Under review", done: driverVerification !== "none" },
            { key: "Approved", done: driverVerification === "approved" },
          ].map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${s.done ? "bg-success" : "bg-muted-foreground/30"}`} />
              {s.key}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 w-full space-y-2">
        {driverVerification === "approved" ? (
          <Button size="lg" className="h-12 w-full rounded-xl" onClick={() => nav({ to: "/driver" })}>
            Go to dashboard
          </Button>
        ) : (
          <Button size="lg" className="h-12 w-full rounded-xl" onClick={() => setDriverVerification("approved")}>
            Simulate approval
          </Button>
        )}
        <Button variant="outline" className="h-11 w-full rounded-xl" onClick={() => nav({ to: "/customer" })}>
          Browse as customer
        </Button>
      </div>
    </div>
  );
}
