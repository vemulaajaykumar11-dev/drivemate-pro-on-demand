import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

const STORAGE_KEY = "drivemate-state-v1";

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
  login: (phone: string) => void;
  completeProfile: (u: AppUser) => void;
  setRole: (r: Role) => void;
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  setDriverVerification: (v: DriverVerification) => void;
  setDriverStatus: (s: DriverStatus) => void;
  logout: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === "undefined") return initialState;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...initialState, ...JSON.parse(raw) };
    } catch {}
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const set = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }));

  const ctx: Ctx = {
    ...state,
    set,
    login: (phone) => set({ user: { name: state.user?.name ?? "", phone, email: state.user?.email ?? "" } }),
    completeProfile: (u) => set({ authed: true, user: u }),
    setRole: (role) => set({ role }),
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
    setDriverVerification: (v) => set({ driverVerification: v }),
    setDriverStatus: (s) => set({ driverStatus: s }),
    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(initialState);
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
