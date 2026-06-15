import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, Home, Calendar, LifeBuoy, Wallet, ChevronDown, User } from "lucide-react";
import { useApp, type Role } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function AppHeader({ title }: { title?: string }) {
  const { user, role, setRole, driverVerification } = useApp();
  const nav = useNavigate();

  const switchRole = (r: Role) => {
    setRole(r);
    if (r === "driver") {
      if (driverVerification === "approved") nav({ to: "/driver" });
      else if (driverVerification === "pending") nav({ to: "/driver/pending" });
      else nav({ to: "/driver/register" });
    } else {
      nav({ to: "/customer" });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/85 px-4 py-3 backdrop-blur border-b border-border">
      <Avatar className="h-9 w-9 ring-2 ring-primary/20">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback className="bg-primary-soft text-primary text-sm font-semibold">
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-center">
        <div className="font-display text-lg font-extrabold tracking-tight">
          Drive<span className="text-primary">Mate</span>
        </div>
        {title && <div className="text-[11px] text-muted-foreground -mt-0.5">{title}</div>}
      </div>
      <Link to="/customer/notifications" className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
          {role === "customer" ? "Customer" : "Driver"}
          <ChevronDown className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Switch role</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => switchRole("customer")}>
            <User className="h-4 w-4" /> Customer {role === "customer" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchRole("driver")}>
            <Wallet className="h-4 w-4" /> Driver {role === "driver" && "✓"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => nav({ to: "/" })} className="text-destructive">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export function BottomNav() {
  const { role } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items =
    role === "customer"
      ? [
          { to: "/customer", icon: Home, label: "Home" },
          { to: "/customer/bookings", icon: Calendar, label: "Bookings" },
          { to: "/customer/notifications", icon: Bell, label: "Alerts" },
          { to: "/customer/support", icon: LifeBuoy, label: "Support" },
        ]
      : [
          { to: "/driver", icon: Home, label: "Home" },
          { to: "/driver/bookings", icon: Calendar, label: "Trips" },
          { to: "/driver/earnings", icon: Wallet, label: "Earnings" },
          { to: "/driver/notifications", icon: Bell, label: "Alerts" },
        ];

  return (
    <nav className="sticky bottom-0 z-30 grid grid-cols-4 border-t border-border bg-card/95 backdrop-blur">
      {items.map((it) => {
        const active = pathname === it.to;
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? "stroke-[2.4]" : ""}`} />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MapPlaceholder({ caption, eta }: { caption?: string; eta?: string }) {
  return (
    <div className="relative h-56 overflow-hidden rounded-2xl border border-border">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.92 0.04 220), oklch(0.88 0.05 250)), repeating-linear-gradient(45deg, transparent 0 18px, oklch(0 0 0 / 0.04) 18px 19px)",
          backgroundBlendMode: "overlay",
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 240" preserveAspectRatio="none">
        <path d="M0 180 Q 100 120 200 150 T 400 90" stroke="oklch(0.55 0.21 258)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="2 8" />
      </svg>
      <div className="absolute left-6 top-10 flex items-center gap-1">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg">🚗</span>
        <Badge variant="secondary" className="shadow">Driver</Badge>
      </div>
      <div className="absolute bottom-8 right-6 flex items-center gap-1">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-card text-foreground text-xs font-bold shadow-lg ring-2 ring-primary">📍</span>
        <Badge className="shadow">You</Badge>
      </div>
      {eta && (
        <div className="absolute right-3 top-3 rounded-full bg-card/90 px-3 py-1 text-xs font-semibold shadow-md">
          ETA {eta}
        </div>
      )}
      {caption && (
        <div className="absolute bottom-3 left-3 rounded-full bg-card/90 px-3 py-1 text-[11px] text-muted-foreground shadow">
          {caption}
        </div>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    requested: "bg-warning/15 text-warning-foreground",
    accepted: "bg-primary/10 text-primary",
    enroute: "bg-primary/10 text-primary",
    arrived: "bg-primary/10 text-primary",
    started: "bg-success/15 text-success",
    completed: "bg-success/15 text-success",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
}
