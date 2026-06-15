import { createFileRoute } from "@tanstack/react-router";
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/driver/earnings")({
  component: Earnings,
});

const txns = [
  { id: "T01", title: "Trip DM-2049", date: "Jun 14 · 9:00 AM", amount: 1199, kind: "in" as const },
  { id: "T02", title: "Payout to bank", date: "Jun 13", amount: 5000, kind: "out" as const },
  { id: "T03", title: "Trip DM-2042", date: "Jun 12 · 5:30 PM", amount: 449, kind: "in" as const },
  { id: "T04", title: "Trip DM-2038", date: "Jun 11 · 10:00 AM", amount: 899, kind: "in" as const },
  { id: "T05", title: "Bonus: 5-star week", date: "Jun 10", amount: 250, kind: "in" as const },
];

function Earnings() {
  return (
    <div className="px-4 pt-4">
      <div className="gradient-primary overflow-hidden rounded-2xl p-5">
        <div className="text-xs opacity-80">Total balance</div>
        <div className="font-display text-4xl font-extrabold mt-1">₹32,180</div>
        <div className="mt-2 flex items-center gap-1 text-[11px] opacity-90">
          <TrendingUp className="h-3.5 w-3.5" /> +22% vs last month
        </div>
        <Button variant="secondary" className="mt-4 rounded-xl">
          <Wallet className="h-4 w-4" /> Withdraw to bank
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Today", v: "₹1,240" },
          { label: "Week", v: "₹8,540" },
          { label: "Month", v: "₹32,180" },
        ].map((s) => (
          <div key={s.label} className="card-soft p-3 text-center">
            <div className="text-[10px] text-muted-foreground uppercase">{s.label}</div>
            <div className="font-display font-extrabold mt-1">{s.v}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-6 mb-3 font-display text-base font-bold">Transactions</h2>
      <div className="space-y-2">
        {txns.map((t) => (
          <div key={t.id} className="card-soft flex items-center gap-3 p-3.5">
            <div className={`grid h-9 w-9 place-items-center rounded-xl ${t.kind === "in" ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive"}`}>
              {t.kind === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="text-[11px] text-muted-foreground">{t.date}</div>
            </div>
            <div className={`text-sm font-bold ${t.kind === "in" ? "text-success" : "text-destructive"}`}>
              {t.kind === "in" ? "+" : "−"}₹{t.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
