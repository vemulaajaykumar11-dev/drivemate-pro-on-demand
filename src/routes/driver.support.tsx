import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone, FileWarning, ChevronRight, LifeBuoy } from "lucide-react";

export const Route = createFileRoute("/driver/support")({
  component: DriverSupport,
});

function DriverSupport() {
  const items = [
    { Icon: MessageCircle, label: "Chat with driver support", desc: "Avg reply in 2 min", to: "#" },
    { Icon: Phone, label: "Call partner helpline", desc: "24×7 · 1800-456-789", to: "tel:1800456789" },
    { Icon: FileWarning, label: "Report an incident", desc: "Accidents, disputes, safety", to: "#" },
  ];
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <LifeBuoy className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold">Help & Support</h1>
          <p className="text-xs text-muted-foreground">We're here for you, anytime.</p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {items.map((it) => (
          <a key={it.label} href={it.to} className="card-soft flex items-center gap-3 p-4 active:scale-[0.99] transition">
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

      <div className="mt-6">
        <h2 className="font-display font-bold mb-2">Driver FAQs</h2>
        <div className="space-y-2">
          {[
            "How are my earnings calculated?",
            "When will I get my payout?",
            "What if a customer cancels?",
            "How do I update my documents?",
            "How do ratings affect my account?",
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
