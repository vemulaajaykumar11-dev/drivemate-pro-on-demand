import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/driver/verification")({
  component: VerificationPage,
});

const checks = [
  { label: "Aadhaar verified", note: "Identity matched with government records" },
  { label: "Driving License verified", note: "DL-KA-0420190001234 · Valid till 2031" },
  { label: "Background check cleared", note: "No criminal records found" },
  { label: "Selfie & liveness match", note: "Face match 98.7%" },
  { label: "Address proof verified", note: "Bengaluru, Karnataka" },
  { label: "Bank account linked", note: "HDFC •••• 4421" },
];

function VerificationPage() {
  return (
    <div className="px-4 pt-4 space-y-4">
      <h1 className="font-display text-lg font-bold">Verification Status</h1>

      <div
        className="rounded-2xl p-5 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30">
            <BadgeCheck className="h-7 w-7" />
          </span>
          <div>
            <div className="font-display text-xl font-extrabold">Approved</div>
            <div className="text-xs opacity-90">You're a verified DriveMate professional</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-white/10 p-3">
            <div className="opacity-80">Verified on</div>
            <div className="font-semibold mt-0.5">12 Jun 2026</div>
          </div>
          <div className="rounded-xl bg-white/10 p-3">
            <div className="opacity-80">Valid till</div>
            <div className="font-semibold mt-0.5">12 Jun 2027</div>
          </div>
        </div>
      </div>

      <div className="card-soft divide-y divide-border">
        {checks.map((c) => (
          <div key={c.label} className="flex items-start gap-3 p-3.5">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold">{c.label}</div>
              <div className="text-[11px] text-muted-foreground">{c.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
