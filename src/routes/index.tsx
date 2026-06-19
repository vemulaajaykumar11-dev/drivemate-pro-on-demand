import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Car, User as UserIcon, Wallet, ChevronRight, ShieldCheck, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DriveMate — Professional Drivers On Demand" },
      { name: "description", content: "Hire verified professional drivers for your vehicle by the hour, day, week, or month." },
      { property: "og:title", content: "DriveMate — Professional Drivers On Demand" },
      { property: "og:description", content: "Hire verified professional drivers for your vehicle by the hour, day, week, or month." },
    ],
  }),
  component: AuthFlow,
});

type Step = "splash" | "login" | "otp" | "profile" | "role";

function AuthFlow() {
  const { authed, user, role, driverVerification } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("splash");
  const [phoneE164, setPhoneE164] = useState("");

  useEffect(() => {
    if (step !== "splash") return;
    if (authed) {
      // If profile name is missing, force them through profile + role setup.
      if (!user?.name) {
        setStep("profile");
        return;
      }
      if (role === "driver") {
        if (driverVerification === "approved") nav({ to: "/driver" });
        else if (driverVerification === "pending") nav({ to: "/driver/pending" });
        else nav({ to: "/driver/register" });
      } else {
        nav({ to: "/customer" });
      }
      return;
    }
    const t = setTimeout(() => setStep("login"), 1400);
    return () => clearTimeout(t);
  }, [authed, user, role, driverVerification, nav, step]);

  if (step === "splash") return <Splash />;
  if (step === "login")
    return <Login onSent={(p) => { setPhoneE164(p); setStep("otp"); }} />;
  if (step === "otp")
    return <Otp phone={phoneE164} onBack={() => setStep("login")} onVerified={() => setStep("profile")} />;
  if (step === "profile") return <Profile onNext={() => setStep("role")} />;
  return <RoleSelect />;
}

function Splash() {
  return (
    <div className="gradient-primary flex min-h-[100dvh] flex-col items-center justify-center px-8 text-center">
      <div className="mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/15 backdrop-blur ring-1 ring-white/30">
        <Car className="h-10 w-10" />
      </div>
      <h1 className="font-display text-4xl font-extrabold tracking-tight">DriveMate</h1>
      <p className="mt-2 text-sm opacity-90">Professional Drivers On Demand</p>
      <div className="mt-10 flex gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:120ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:240ms]" />
      </div>
    </div>
  );
}

function Login({ onSent }: { onSent: (phoneE164: string) => void }) {
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const digits = phone.replace(/\D/g, "");
  const valid = digits.length >= 10;

  const sendOtp = async () => {
    setSending(true);
    const phoneE164 = "+91" + digits;
    const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164 });
    setSending(false);
    if (error) {
      toast.error(error.message || "Could not send OTP");
      return;
    }
    toast.success("OTP sent");
    onSent(phoneE164);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pt-16 pb-10">
      <div className="mb-10">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <Car className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Welcome to DriveMate</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in with your mobile number to continue</p>
      </div>
      <Label htmlFor="phone" className="mb-2">Mobile Number</Label>
      <div className="flex gap-2">
        <div className="grid w-16 place-items-center rounded-md border border-input bg-card text-sm font-medium">+91</div>
        <Input id="phone" inputMode="numeric" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1" />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">We'll send a 6-digit OTP to verify your number.</p>
      <div className="flex-1" />
      <Button disabled={!valid || sending} size="lg" className="h-12 rounded-xl text-base" onClick={sendOtp}>
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
      </Button>
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        By continuing, you agree to our <span className="text-primary">Terms</span> and <span className="text-primary">Privacy Policy</span>.
      </p>
    </div>
  );
}

function Otp({ phone, onVerified, onBack }: { phone: string; onVerified: () => void; onBack: () => void }) {
  const [val, setVal] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const verify = async () => {
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: val, type: "sms" });
    setVerifying(false);
    if (error) {
      toast.error(error.message || "Invalid OTP");
      return;
    }
    onVerified();
  };

  const resend = async () => {
    setResending(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setResending(false);
    if (error) toast.error(error.message);
    else toast.success("OTP resent");
  };

  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pt-16 pb-10">
      <h1 className="font-display text-2xl font-bold">Verify OTP</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the 6-digit code we sent to <span className="font-medium text-foreground">{phone}</span>.
      </p>
      <div className="mt-10 flex justify-center">
        <InputOTP maxLength={6} value={val} onChange={setVal}>
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="h-12 w-11 text-lg" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="mt-6 flex justify-center gap-4 text-xs">
        <button className="text-muted-foreground" onClick={onBack}>Change number</button>
        <button className="text-primary disabled:opacity-50" disabled={resending} onClick={resend}>
          {resending ? "Resending…" : "Resend code"}
        </button>
      </div>
      <div className="flex-1" />
      <Button disabled={val.length < 6 || verifying} size="lg" className="h-12 rounded-xl text-base" onClick={verify}>
        {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
      </Button>
    </div>
  );
}

function Profile({ onNext }: { onNext: () => void }) {
  const { completeProfile, user } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pt-12 pb-10">
      <h1 className="font-display text-2xl font-bold">Complete your profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Tell us a bit about yourself.</p>
      <div className="mt-8 flex justify-center">
        <div className="relative">
          <Avatar className="h-24 w-24 ring-4 ring-primary-soft">
            <AvatarFallback className="bg-primary-soft text-primary text-2xl font-bold">
              {name?.[0]?.toUpperCase() || "+"}
            </AvatarFallback>
          </Avatar>
          <button className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs shadow-lg">
            📷
          </button>
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div>
          <Label className="mb-2">Full Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Sharma" />
        </div>
        <div>
          <Label className="mb-2">Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
      </div>
      <div className="flex-1" />
      <Button
        disabled={!name || !email}
        size="lg"
        className="h-12 rounded-xl text-base"
        onClick={async () => {
          await completeProfile({ name, email });
          onNext();
        }}
      >
        Continue
      </Button>
    </div>
  );
}

function RoleSelect() {
  const { setRole } = useApp();
  const nav = useNavigate();
  return (
    <div className="flex min-h-[100dvh] flex-col px-6 pt-12 pb-10">
      <h1 className="font-display text-2xl font-bold">How will you use DriveMate?</h1>
      <p className="mt-1 text-sm text-muted-foreground">You can switch anytime from the top-right menu.</p>
      <div className="mt-8 space-y-4">
        <button
          onClick={() => {
            setRole("customer");
            nav({ to: "/customer" });
          }}
          className="card-soft group flex w-full items-center gap-4 p-5 text-left transition hover:border-primary hover:shadow-lg"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <UserIcon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold">Customer</div>
            <div className="text-xs text-muted-foreground">Hire professional drivers for your vehicle</div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </button>
        <button
          onClick={() => {
            setRole("driver");
            nav({ to: "/driver/register" });
          }}
          className="card-soft group flex w-full items-center gap-4 p-5 text-left transition hover:border-primary hover:shadow-lg"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Wallet className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="font-display text-lg font-bold">Driver</div>
            <div className="text-xs text-muted-foreground">Earn money by driving customer vehicles</div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </button>
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-2xl bg-primary-soft p-3 text-xs text-primary">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        All drivers are background-verified with valid licenses.
      </div>
    </div>
  );
}
