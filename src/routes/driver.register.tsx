import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Upload, Camera, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/driver/register")({
  component: DriverRegister,
});

function DriverRegister() {
  const nav = useNavigate();
  const { setDriverVerification, user } = useApp();
  const [step, setStep] = useState(1);
  const total = 4;

  return (
    <div className="flex min-h-[100dvh] flex-col px-5 pt-6 pb-8">
      <header className="flex items-center gap-3 mb-4">
        <button onClick={() => (step === 1 ? nav({ to: "/" }) : setStep(step - 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="font-display text-lg font-bold">Driver registration</div>
          <div className="text-[11px] text-muted-foreground">Step {step} of {total}</div>
        </div>
      </header>

      <div className="mb-5 flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      <div className="flex-1 space-y-4">
        {step === 1 && (
          <>
            <h2 className="font-display text-xl font-bold">Personal details</h2>
            <div>
              <Label className="mb-2">Full name</Label>
              <Input defaultValue={user?.name} placeholder="Full name as on Aadhaar" />
            </div>
            <div>
              <Label className="mb-2">Mobile number</Label>
              <Input defaultValue={user?.phone} />
            </div>
            <div>
              <Label className="mb-2">Address</Label>
              <Textarea placeholder="Current address" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-display text-xl font-bold">Documents</h2>
            <div>
              <Label className="mb-2">Aadhaar number</Label>
              <Input placeholder="1234 5678 9012" />
            </div>
            <div>
              <Label className="mb-2">Driving license number</Label>
              <Input placeholder="DL-XX-XXXXXXX" />
            </div>
            <UploadBox label="Upload Aadhaar image" />
            <UploadBox label="Upload License image" />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-display text-xl font-bold">Experience</h2>
            <div>
              <Label className="mb-2">Years of driving experience</Label>
              <Input type="number" placeholder="e.g. 5" />
            </div>
            <div>
              <Label className="mb-2">Languages spoken</Label>
              <div className="flex flex-wrap gap-2">
                {["English", "Hindi", "Kannada", "Tamil", "Telugu", "Marathi"].map((l) => (
                  <button key={l} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary">
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2">Vehicle types you can drive</Label>
              <div className="flex flex-wrap gap-2">
                {["Hatchback", "Sedan", "SUV", "Manual", "Automatic"].map((l) => (
                  <button key={l} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary">
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-display text-xl font-bold">Selfie verification</h2>
            <p className="text-sm text-muted-foreground">Take a clear, well-lit selfie. Make sure your face is fully visible.</p>
            <div className="mt-4 grid place-items-center rounded-3xl border-2 border-dashed border-border bg-muted/40 p-12">
              <Camera className="h-12 w-12 text-muted-foreground" />
              <Button variant="outline" className="mt-4 rounded-xl">Take selfie</Button>
            </div>
            <div className="flex items-start gap-2 rounded-2xl bg-primary-soft p-3 text-xs text-primary">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              Your selfie is compared with your Aadhaar photo for verification.
            </div>
          </>
        )}
      </div>

      <Button
        size="lg"
        className="h-12 rounded-xl text-base mt-4"
        onClick={() => {
          if (step < total) setStep(step + 1);
          else {
            setDriverVerification("pending");
            nav({ to: "/driver/pending" });
          }
        }}
      >
        {step < total ? "Continue" : "Submit for verification"}
      </Button>
    </div>
  );
}

function UploadBox({ label }: { label: string }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-4 text-left hover:border-primary">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-card text-primary">
        <Upload className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-[11px] text-muted-foreground">PNG, JPG up to 5 MB</div>
      </div>
    </button>
  );
}
