import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/customer/gst")({
  component: GstPage,
});

function GstPage() {
  const [saved, setSaved] = useState(false);
  const [gstin, setGstin] = useState("");
  const [legal, setLegal] = useState("");
  const [addr, setAddr] = useState("");

  return (
    <div className="px-4 pt-4 space-y-4">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-lg font-bold">GST Details</h1>
          <p className="text-xs text-muted-foreground">Add GST to claim input tax credit on invoices.</p>
        </div>
      </div>

      <div className="card-soft p-4 space-y-3">
        <div>
          <Label className="mb-2">GSTIN</Label>
          <Input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="29ABCDE1234F1Z5" maxLength={15} />
        </div>
        <div>
          <Label className="mb-2">Legal business name</Label>
          <Input value={legal} onChange={(e) => setLegal(e.target.value)} placeholder="Acme Pvt Ltd" />
        </div>
        <div>
          <Label className="mb-2">Registered address</Label>
          <Input value={addr} onChange={(e) => setAddr(e.target.value)} placeholder="Building, Street, City, PIN" />
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-success text-sm">
          <CheckCircle2 className="h-4 w-4" /> GST details saved. Future invoices will reflect this GSTIN.
        </div>
      )}

      <Button
        size="lg"
        className="h-12 w-full rounded-xl"
        disabled={gstin.length < 15 || !legal || !addr}
        onClick={() => setSaved(true)}
      >
        Save GST Details
      </Button>
    </div>
  );
}
