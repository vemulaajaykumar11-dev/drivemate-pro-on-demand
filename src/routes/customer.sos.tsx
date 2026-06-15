import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Megaphone, ChevronLeft, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/customer/sos")({
  component: SosPage,
});

function SosPage() {
  const nav = useNavigate();
  return (
    <div className="flex min-h-[100dvh] flex-col bg-destructive text-destructive-foreground">
      <header className="flex items-center gap-3 px-3 py-3">
        <button onClick={() => nav({ to: "/customer" })} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="font-display text-base font-bold">SOS Emergency</div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white/15 ring-4 ring-white/20 animate-pulse">
          <ShieldAlert className="h-14 w-14" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-extrabold">Are you in danger?</h1>
        <p className="mt-2 text-sm opacity-90">Tap any option below — we'll act immediately.</p>
      </div>
      <div className="space-y-3 p-6">
        <Button size="lg" variant="secondary" className="h-14 w-full rounded-xl text-base font-bold">
          <Phone className="h-5 w-5" /> Call emergency contact
        </Button>
        <Button size="lg" variant="secondary" className="h-14 w-full rounded-xl text-base font-bold">
          <MapPin className="h-5 w-5" /> Share live location
        </Button>
        <Button size="lg" variant="secondary" className="h-14 w-full rounded-xl text-base font-bold">
          <Megaphone className="h-5 w-5" /> Alert support team
        </Button>
      </div>
    </div>
  );
}
