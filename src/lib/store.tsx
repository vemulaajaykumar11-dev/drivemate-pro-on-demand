import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "customer" | "driver";
export type ServiceType = "hourly" | "daily" | "weekly" | "monthly";
export type BookingStatus =
  | "requested"
  | "accepted"
  | "enroute"
  | "arrived"
  | "started"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  service: ServiceType;
  pickup: string;
  date: string;
  startTime: string;
  duration: string;
  notes?: string;
  price: number;
  status: BookingStatus;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  rated?: boolean;
  createdAt: number;
}

export interface AppUser {
  name: string;
  phone: string;
  email: string;
  avatar?: string;
}

export type DriverVerification = "none" | "pending" | "approved" | "rejected";
export type DriverStatus = "online" | "busy" | "offline";

interface AppState {
  authed: boolean;
  user: AppUser | null;
  role: Role;
  driverVerification: DriverVerification;
  driverStatus: DriverStatus;
  bookings: Booking[];
  pendingDriverRequests: Booking[];
  notifications: { id: string; title: string; body: string; time: string; role: Role }[];
}

const LOCAL_KEY = "drivemate-local-v1"; // prototype-only data (bookings, notifications)

const seedBookings: Booking[] = [
  {
    id: "DM-2049",
    service: "daily",
    pickup: "MG Road, Bengaluru",
    date: "2026-06-14",
    startTime: "09:00",
    duration: "Full Day (8h)",
    price: 1499,
    status: "completed",
    driverName: "Rohit Sharma",
    driverPhone: "+91 98765 43210",
    driverRating: 4.8,
    rated: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "DM-2051",
    service: "hourly",
    pickup: "Indiranagar Metro",
    date: "2026-06-15",
    startTime: "18:30",
    duration: "3 Hours",
    price: 599,
    status: "accepted",
    driverName: "Amit Verma",
    driverPhone: "+91 99887 77665",
    driverRating: 4.9,
    createdAt: Date.now() - 3600000,
  },
];

const seedDriverRequests: Booking[] = [
  {
    id: "DM-2060",
    service: "hourly",
    pickup: "Koramangala 5th Block",
    date: "2026-06-15",
    startTime: "20:00",
    duration: "2 Hours",
    price: 449,
    status: "requested",
    driverName: "",
    driverPhone: "",
    driverRating: 0,
    createdAt: Date.now(),
  },
  {
    id: "DM-2061",
    service: "daily",
    pickup: "HSR Layout Sector 2",
    date: "2026-06-16",
    startTime: "08:00",
    duration: "Half Day (4h)",
    price: 899,
    status: "requested",
    driverName: "",
    driverPhone: "",
    driverRating: 0,
    createdAt: Date.now(),
  },
];

const initialState: AppState = {
  authed: false,
  user: null,
  role: "customer",
  driverVerification: "none",
  driverStatus: "offline",
  bookings: seedBookings,
  pendingDriverRequests: seedDriverRequests,
  notifications: [
    { id: "n1", title: "Driver Arrived", body: "Amit is waiting at your pickup", time: "2m ago", role: "customer" },
    { id: "n2", title: "Payment Success", body: "₹1,499 paid for DM-2049", time: "1d ago", role: "customer" },
    { id: "n3", title: "New Booking Request", body: "Hourly trip, ₹449 est.", time: "Just now", role: "driver" },
    { id: "n4", title: "Earnings Credited", body: "₹1,200 added to wallet", time: "3h ago", role: "driver" },
  ],
};

interface Ctx extends AppState {
  set: (patch: Partial<AppState>) => void;
  completeProfile: (u: { name: string; email: string }) => Promise<void>;
  setRole: (r: Role) => Promise<void>;
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  setDriverVerification: (v: DriverVerification) => void;
  setDriverStatus: (s: DriverStatus) => void;
  logout: () => Promise<void>;
}

const AppCtx = createContext<Ctx | null>(null);

type ProfileRow = {
  name: string | null;
  phone: string | null;
  avatar_url: string | null;
  mode: Role;
  driver_verification: DriverVerification;
};

export function AppProvider({ children }: { children: ReactNode }) {
  // prototype-only data persisted locally; identity comes from Supabase.
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === "undefined") return initialState;
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<AppState>;
        return {
          ...initialState,
          bookings: saved.bookings ?? initialState.bookings,
          pendingDriverRequests: saved.pendingDriverRequests ?? initialState.pendingDriverRequests,
          notifications: saved.notifications ?? initialState.notifications,
        };
      }
    } catch {}
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_KEY,
        JSON.stringify({
          bookings: state.bookings,
          pendingDriverRequests: state.pendingDriverRequests,
          notifications: state.notifications,
        }),
      );
    } catch {}
  }, [state.bookings, state.pendingDriverRequests, state.notifications]);

  // Sync identity from Supabase session + profile row.
  useEffect(() => {
    let cancelled = false;

    const applyProfile = async (userId: string | null, fallbackEmail = "", fallbackPhone = "") => {
      if (!userId) {
        if (!cancelled) {
          setState((s) => ({ ...s, authed: false, user: null, driverVerification: "none", role: "customer" }));
        }
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("name, phone, avatar_url, mode, driver_verification")
        .eq("id", userId)
        .maybeSingle<ProfileRow>();
      if (cancelled) return;
      setState((s) => ({
        ...s,
        authed: true,
        user: {
          name: data?.name ?? "",
          email: fallbackEmail,
          phone: data?.phone ?? fallbackPhone,
          avatar: data?.avatar_url ?? undefined,
        },
        role: data?.mode ?? "customer",
        driverVerification: data?.driver_verification ?? "none",
      }));
    };

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      applyProfile(u?.id ?? null, u?.email ?? "", u?.phone ?? "");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      const u = session?.user;
      applyProfile(u?.id ?? null, u?.email ?? "", u?.phone ?? "");
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const set = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }));

  const ctx: Ctx = {
    ...state,
    set,
    completeProfile: async ({ name, email }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      await supabase
        .from("profiles")
        .upsert({ id: user.id, name, phone: user.phone ?? state.user?.phone ?? null }, { onConflict: "id" });
      setState((s) => ({
        ...s,
        user: { name, email, phone: user.phone ?? s.user?.phone ?? "" },
      }));
    },
    setRole: async (role) => {
      setState((s) => ({ ...s, role }));
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from("profiles").update({ mode: role }).eq("id", user.id);
    },
    addBooking: (b) => setState((s) => ({ ...s, bookings: [b, ...s.bookings] })),
    updateBooking: (id, patch) =>
      setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
    acceptRequest: (id) =>
      setState((s) => {
        const req = s.pendingDriverRequests.find((r) => r.id === id);
        if (!req) return s;
        const accepted: Booking = {
          ...req,
          status: "accepted",
          driverName: s.user?.name || "You",
          driverPhone: s.user?.phone || "",
          driverRating: 4.9,
        };
        return {
          ...s,
          pendingDriverRequests: s.pendingDriverRequests.filter((r) => r.id !== id),
          bookings: [accepted, ...s.bookings],
        };
      }),
    rejectRequest: (id) =>
      setState((s) => ({ ...s, pendingDriverRequests: s.pendingDriverRequests.filter((r) => r.id !== id) })),
    setDriverVerification: (v) => set({ driverVerification: v }), // local UI hint only; DB column is admin-only
    setDriverStatus: (s) => set({ driverStatus: s }),
    logout: async () => {
      await supabase.auth.signOut();
      setState((s) => ({ ...s, authed: false, user: null, driverVerification: "none", role: "customer" }));
    },
  };

  return <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be inside AppProvider");
  return c;
}

export const servicePricing: Record<ServiceType, { label: string; desc: string; perUnit: number; unit: string }> = {
  hourly: { label: "Hourly Driver", desc: "1–4 hours, on-demand", perUnit: 199, unit: "hour" },
  daily: { label: "Daily Driver", desc: "Half day or full day", perUnit: 1499, unit: "day" },
  weekly: { label: "Weekly Driver", desc: "7 days, dedicated", perUnit: 8999, unit: "week" },
  monthly: { label: "Monthly Driver", desc: "30 days, dedicated", perUnit: 29999, unit: "month" },
};
