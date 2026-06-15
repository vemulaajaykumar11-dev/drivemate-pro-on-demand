import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LogOut, Calendar, PhoneCall, FileText, Gift, Wallet, Star, BadgeCheck, LifeBuoy } from "lucide-react";
import { useApp, type Role } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Item = {
  to?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

export function ProfileScreen({ role }: { role: Role }) {
  const { user, logout } = useApp();
  const nav = useNavigate();

  const items: Item[] =
    role === "customer"
      ? [
          { to: "/customer/bookings", label: "My Bookings", icon: Calendar },
          { to: "/customer/sos", label: "Emergency Contacts", icon: PhoneCall },
          { to: "/customer/support", label: "GST Details", icon: FileText },
          { to: "/customer/support", label: "Refer & Earn", icon: Gift },
        ]
      : [
          { to: "/driver/bookings", label: "My Trips", icon: Calendar },
          { to: "/driver/earnings", label: "Earnings & Wallet", icon: Wallet },
          { to: "/driver/notifications", label: "Ratings & Reviews", icon: Star },
          { to: "/driver/notifications", label: "Verification Status", icon: BadgeCheck },
          { to: "/driver/notifications", label: "Help & Support", icon: LifeBuoy },
        ];

  const initial = (user?.name?.trim()?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <div className="app-shell space-y-5 p-4">
      <h1 className="text-lg font-semibold">My Profile</h1>

      <div
        className="rounded-2xl p-5 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg, #1f2937, #0b1220)" }}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-white/15">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-white/15 text-white text-lg font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">
              {user?.name || "Guest User"}
            </div>
            <div className="text-xs text-white/80">{user?.phone || "+91 00000 00000"}</div>
            <div className="truncate text-xs text-white/70">{user?.email || "guest@drivemate.app"}</div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {items.map((it, i) => {
          const Icon = it.icon;
          const inner = (
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="flex-1 text-sm font-medium">{it.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          );
          return (
            <div key={i} className={i > 0 ? "border-t border-border" : ""}>
              {it.to ? (
                <Link to={it.to} className="block hover:bg-muted/50">
                  {inner}
                </Link>
              ) : (
                <button type="button" onClick={it.onClick} className="block w-full text-left hover:bg-muted/50">
                  {inner}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          logout();
          nav({ to: "/" });
        }}
        className="flex w-full items-center gap-3 rounded-2xl border border-destructive/30 bg-card px-4 py-3.5 text-destructive hover:bg-destructive/5"
      >
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/10">
          <LogOut className="h-4.5 w-4.5" />
        </span>
        <span className="flex-1 text-left text-sm font-semibold">Logout</span>
      </button>

      <div className="pb-2 text-center text-[11px] text-muted-foreground">DriveMate · v1.0.0</div>
    </div>
  );
}
