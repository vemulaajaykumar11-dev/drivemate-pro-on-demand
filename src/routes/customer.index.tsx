import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, servicePricing, type ServiceType } from "@/lib/store";
import { Clock, Sun, Calendar, CalendarRange, ChevronRight, Sparkles } from "lucide-react";
import { StatusPill } from "@/components/app-chrome";

export const Route = createFileRoute("/customer/")({
  component: CustomerHome,
});

const services: { key: ServiceType; icon: React.ElementType; gradient: string }[] = [
  { key: "hourly", icon: Clock, gradient: "from-sky-500 to-blue-600" },
  { key: "daily", icon: Sun, gradient: "from-amber-400 to-orange-500" },
  { key: "weekly", icon: Calendar, gradient: "from-emerald-500 to-teal-600" },
  { key: "monthly", icon: CalendarRange, gradient: "from-violet-500 to-purple-600" },
];

function CustomerHome() {
  const { user, bookings } = useApp();
  const recent = bookings.slice(0, 3);

  return (
    <div className="px-4 pt-4">
      <div className="gradient-primary mb-5 overflow-hidden rounded-2xl p-5">
        <div className="text-xs opacity-80">Hi {user?.name?.split(" ")[0] || "there"} 👋</div>
        <div className="mt-1 font-display text-xl font-bold leading-tight">Where would you like to go today?</div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] opacity-90">
          <Sparkles className="h-3.5 w-3.5" /> Verified drivers · Live tracking · Insured trips
        </div>
      </div>

      <h2 className="mb-3 font-display text-base font-bold">Book a driver</h2>
      <div className="grid grid-cols-2 gap-3">
        {services.map((s) => {
          const meta = servicePricing[s.key];
          const Icon = s.icon;
          return (
            <Link
              key={s.key}
              to="/customer/book/$service"
              params={{ service: s.key }}
              className="card-soft group flex flex-col gap-2 p-4 transition active:scale-[0.98]"
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-sm font-bold">{meta.label}</div>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{meta.desc}</div>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-primary">From ₹{meta.perUnit}</span>
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">Book</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-base font-bold">Recent bookings</h2>
        <Link to="/customer/bookings" className="text-xs font-semibold text-primary">View all</Link>
      </div>
      <div className="mt-3 space-y-2.5">
        {recent.length === 0 && (
          <div className="card-soft p-6 text-center text-sm text-muted-foreground">No bookings yet</div>
        )}
        {recent.map((b) => (
          <Link
            key={b.id}
            to="/customer/track/$id"
            params={{ id: b.id }}
            className="card-soft flex items-center gap-3 p-3.5 transition active:scale-[0.99]"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
              {b.service === "hourly" ? <Clock className="h-5 w-5" /> :
                b.service === "daily" ? <Sun className="h-5 w-5" /> :
                b.service === "weekly" ? <Calendar className="h-5 w-5" /> : <CalendarRange className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{servicePricing[b.service].label}</span>
                <StatusPill status={b.status} />
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{b.id} · {b.date}</div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
