import { VendorLayout } from "@/components/VendorLayout";
import { TopBar } from "@/components/TopBar";
import { useVendorStore, vendorStore } from "@/data/vendorMock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShieldAlert, ShieldQuestion, FileText, Upload, Check } from "lucide-react";

const VendorVerification = () => {
  const profile = useVendorStore((s) => s.getProfile());
  const [docs, setDocs] = useState({
    businessName: profile.documents.businessName ?? profile.name,
    rcNumber: profile.documents.rcNumber ?? "",
    taxId: profile.documents.taxId ?? "",
    idUploaded: profile.documents.idUploaded ?? false,
    certUploaded: profile.documents.certUploaded ?? false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docs.businessName.trim() || !docs.rcNumber.trim() || !docs.idUploaded || !docs.certUploaded) {
      toast.error("Please fill all fields and upload required documents");
      return;
    }
    vendorStore.submitVerification(docs);
    toast.success("Submitted for review — we'll get back within 24 hours");
  };

  const status = profile.verification;
  const banner =
    status === "verified" ? { icon: ShieldCheck, label: "You are verified", desc: "Your storefront is live and trusted.", cls: "gradient-warm text-primary-foreground" }
    : status === "pending" ? { icon: ShieldQuestion, label: "Under review", desc: "Our team is reviewing your documents (avg 24 hrs).", cls: "bg-warning/15 text-foreground" }
    : status === "rejected" ? { icon: ShieldAlert, label: "Verification rejected", desc: "Please re-submit with corrected documents.", cls: "bg-destructive/15 text-foreground" }
    : { icon: ShieldAlert, label: "Get verified", desc: "Verified vendors appear higher and earn more orders.", cls: "gradient-cool text-primary-foreground" };
  const BIcon = banner.icon;

  return (
    <VendorLayout>
      <TopBar title="Verification" />
      <main className="container max-w-2xl pb-12 space-y-4">
        <section className={`rounded-2xl p-5 ${banner.cls} shadow-card`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/25 flex items-center justify-center"><BIcon className="h-5 w-5" /></div>
            <div>
              <div className="font-display font-bold text-lg">{banner.label}</div>
              <div className="text-sm opacity-90">{banner.desc}</div>
            </div>
          </div>
        </section>

        <form onSubmit={submit} className="bg-card rounded-2xl shadow-card p-5 space-y-4">
          <h2 className="font-display font-bold text-lg flex items-center gap-2"><FileText className="h-4 w-4" /> Business details</h2>
          <div><Label>Registered business name</Label><Input value={docs.businessName} onChange={(e) => setDocs({ ...docs, businessName: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>RC / CAC number</Label><Input value={docs.rcNumber} onChange={(e) => setDocs({ ...docs, rcNumber: e.target.value })} placeholder="RC1234567" /></div>
            <div><Label>Tax ID (optional)</Label><Input value={docs.taxId} onChange={(e) => setDocs({ ...docs, taxId: e.target.value })} placeholder="TIN-…" /></div>
          </div>

          <div className="space-y-2">
            <Label>Owner ID (passport / driver's license)</Label>
            <UploadBox done={docs.idUploaded} onClick={() => setDocs({ ...docs, idUploaded: !docs.idUploaded })} label="Upload ID" />
          </div>
          <div className="space-y-2">
            <Label>Food safety / kitchen certification</Label>
            <UploadBox done={docs.certUploaded} onClick={() => setDocs({ ...docs, certUploaded: !docs.certUploaded })} label="Upload certificate" />
          </div>

          <Button type="submit" className="w-full" disabled={status === "pending"}>
            {status === "pending" ? "Submitted — awaiting review" : status === "verified" ? "Re-submit documents" : "Submit for verification"}
          </Button>
        </form>
      </main>
    </VendorLayout>
  );
};

function UploadBox({ done, onClick, label }: { done: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full border-2 border-dashed rounded-2xl p-4 flex items-center gap-3 transition-colors ${done ? "border-success bg-success/5" : "border-border hover:border-primary"}`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${done ? "bg-success/15 text-success" : "bg-muted"}`}>
        {done ? <Check className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
      </div>
      <div className="text-left flex-1">
        <div className="font-semibold text-sm">{done ? "Document uploaded" : label}</div>
        <div className="text-xs text-muted-foreground">{done ? "Click to remove" : "PDF, JPG or PNG — up to 10 MB"}</div>
      </div>
    </button>
  );
}

export default VendorVerification;
