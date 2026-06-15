import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Phone, FileWarning, ShieldAlert, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/customer/support")({
  component: SupportPage,
});

function SupportPage() {
  const items = [
    { Icon: MessageCircle, label: "Chat with support", desc: "Avg reply in 2 min", to: "#" },
    { Icon: Phone, label: "Call support", desc: "24×7 helpline", to: "tel:1800-123-456" },
    { Icon: FileWarning, label: "Raise a complaint", desc: "Tell us what went wrong", to: "#" },
  ];
  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-xl font-bold">How can we help?</h1>
      <p className="text-sm text-muted-foreground mt-1">Our team is here for you, anytime.</p>

      <div className="mt-5 space-y-2">
        {items.map((it) => (
          <a key={it.label} href={it.to} className="card-soft flex items-center gap-3 p-4 transition active:scale-[0.99]">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <it.Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{it.label}</div>
              <div className="text-[11px] text-muted-foreground">{it.desc}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </div>

      <Link to="/customer/sos" className="mt-6 flex items-center gap-3 rounded-2xl bg-destructive p-4 text-destructive-foreground shadow-lg">
        <ShieldAlert className="h-6 w-6" />
        <div className="flex-1">
          <div className="font-display font-bold">SOS Emergency</div>
          <div className="text-[11px] opacity-90">Tap here in case of an emergency</div>
        </div>
        <ChevronRight className="h-5 w-5" />
      </Link>

      <div className="mt-6">
        <h2 className="font-display font-bold mb-2">Frequently asked</h2>
        <div className="space-y-2">
          {[
            "How is the price calculated?",
            "Can I cancel a booking?",
            "Are drivers verified?",
            "How do refunds work?",
          ].map((q) => (
            <div key={q} className="card-soft p-3.5 text-sm flex items-center justify-between">
              {q} <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
