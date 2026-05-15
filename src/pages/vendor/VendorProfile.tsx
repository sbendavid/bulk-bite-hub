import { VendorLayout } from "@/components/VendorLayout";
import { TopBar } from "@/components/TopBar";
import { useVendorStore, vendorStore } from "@/data/vendorMock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const VendorProfile = () => {
  const profile = useVendorStore((s) => s.getProfile());
  const [form, setForm] = useState({
    name: profile.name, tagline: profile.tagline, cuisine: profile.cuisine,
    description: profile.description, email: profile.email, phone: profile.phone, address: profile.address,
    minOrder: profile.minOrder, prepTime: profile.prepTime, image: profile.image,
    bankName: profile.payout.bankName ?? "", accountName: profile.payout.accountName ?? "", accountNumber: profile.payout.accountNumber ?? "",
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    vendorStore.updateProfile({
      name: form.name, tagline: form.tagline, cuisine: form.cuisine, description: form.description,
      email: form.email, phone: form.phone, address: form.address,
      minOrder: Number(form.minOrder), prepTime: form.prepTime, image: form.image,
      payout: { bankName: form.bankName, accountName: form.accountName, accountNumber: form.accountNumber },
    });
    toast.success("Profile saved");
  };

  return (
    <VendorLayout>
      <TopBar title="Profile" />
      <main className="container max-w-2xl pb-12 space-y-4">
        <form onSubmit={save} className="bg-card rounded-2xl shadow-card p-5 space-y-4">
          <h2 className="font-display font-bold text-lg">Storefront</h2>
          <div className="flex items-center gap-4">
            <img src={form.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1"><Label>Cover image URL</Label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          </div>
          <div><Label>Vendor name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
          <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Cuisine</Label><Input value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} /></div>
            <div><Label>Prep time</Label><Input value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="2-4 hrs" /></div>
            <div><Label>Min servings</Label><Input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} /></div>
          </div>

          <h2 className="font-display font-bold text-lg pt-2 border-t border-border">Contact</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          </div>
          <div><Label>Pickup address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>

          <h2 className="font-display font-bold text-lg pt-2 border-t border-border">Payout</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Bank name</Label><Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} /></div>
            <div><Label>Account number</Label><Input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} /></div>
          </div>
          <div><Label>Account name</Label><Input value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} /></div>

          <Button type="submit" className="w-full">Save changes</Button>
        </form>
      </main>
    </VendorLayout>
  );
};

export default VendorProfile;
