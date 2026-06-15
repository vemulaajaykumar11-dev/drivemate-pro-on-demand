import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Share2, CheckCircle2, Users } from "lucide-react";

export const Route = createFileRoute("/customer/refer")({
  component: ReferPage,
});

function ReferPage() {
  const code = "DRIVE250";
  const [copied, setCopied] = useState(false);
  const link = `https://drivemate.app/r/${code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share({
          title: "Join DriveMate",
          text: `Use my code ${code} on DriveMate and get ₹250 off your first trip.`,
          url: link,
        });
      } catch {}
    } else {
      copy();
    }
  };

  return (
    <div className="px-4 pt-4 space-y-5">
      <div
        className="rounded-2xl p-5 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #0F62FE, #5B8DEF)" }}
      >
        <Gift className="h-8 w-8" />
        <div className="mt-3 font-display text-2xl font-extrabold leading-tight">
          Give ₹250, Get ₹250
        </div>
        <div className="mt-1 text-sm opacity-90">
          Invite friends to DriveMate. They get ₹250 off their first booking and you earn ₹250 in wallet credit.
        </div>
      </div>

      <div className="card-soft p-4">
        <div className="text-xs text-muted-foreground">Your referral code</div>
        <div className="mt-1 flex items-center justify-between">
          <div className="font-display text-2xl font-extrabold tracking-widest text-primary">{code}</div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
          >
            {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <Button size="lg" className="h-12 w-full rounded-xl" onClick={share}>
        <Share2 className="h-4 w-4 mr-1" /> Share with friends
      </Button>

      <div className="card-soft p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-primary" />
          <div className="font-semibold text-sm">Your referrals</div>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { name: "Riya Kapoor", status: "Joined · ₹250 credited", time: "2d ago" },
            { name: "Karan Mehta", status: "Joined · ₹250 credited", time: "1w ago" },
            { name: "Anjali Singh", status: "Invite pending", time: "Today" },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between border-b border-border last:border-0 pb-2 last:pb-0">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">{r.status}</div>
              </div>
              <div className="text-[11px] text-muted-foreground">{r.time}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-primary-soft p-3 text-xs text-primary font-semibold flex items-center justify-between">
          Wallet credit earned <span>₹500</span>
        </div>
      </div>
    </div>
  );
}
