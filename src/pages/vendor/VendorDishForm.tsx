import { useNavigate, useParams } from "react-router-dom";
import { VendorLayout } from "@/components/VendorLayout";
import { TopBar } from "@/components/TopBar";
import { useVendorStore, vendorStore } from "@/data/vendorMock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import jollof from "@/assets/dish-jollof.jpg";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  description: z.string().trim().min(5, "Add a short description").max(400),
  pricePerHead: z.number().min(100, "Price must be at least ₦100").max(1_000_000),
  minQty: z.number().int().min(1).max(1000),
  step: z.number().int().min(1).max(100),
  image: z.string().url().or(z.string().min(1)),
  tags: z.array(z.string()).max(8),
});

const VendorDishForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const nav = useNavigate();
  const existing = useVendorStore((s) => s.getDishes().find((d) => d.id === id));

  const [form, setForm] = useState({
    name: "", description: "", pricePerHead: 2500, minQty: 10, step: 5, image: jollof, tags: "Bestseller",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name, description: existing.description, pricePerHead: existing.pricePerHead,
        minQty: existing.minQty, step: existing.step, image: existing.image, tags: existing.tags.join(", "),
      });
    }
  }, [existing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const parsed = schema.safeParse({ ...form, tags });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (isNew) {
      vendorStore.addDish(parsed.data as any);
      toast.success("Dish added");
    } else if (existing) {
      vendorStore.updateDish(existing.id, parsed.data as any);
      toast.success("Dish updated");
    }
    nav("/vendor-portal/dishes");
  };

  return (
    <VendorLayout>
      <TopBar showBack title={isNew ? "New dish" : "Edit dish"} />
      <main className="container max-w-2xl pb-12">
        <form onSubmit={submit} className="bg-card rounded-2xl shadow-card p-5 space-y-4">
          <div className="flex items-center gap-4">
            <img src={form.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
              <p className="text-[11px] text-muted-foreground mt-1">Paste a hosted image URL.</p>
            </div>
          </div>
          <div>
            <Label>Dish name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Jollof Rice & Chicken" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's in this dish?" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><Label>Price / head (₦)</Label><Input type="number" min={100} value={form.pricePerHead} onChange={(e) => setForm({ ...form, pricePerHead: Number(e.target.value) })} /></div>
            <div><Label>Min servings</Label><Input type="number" min={1} value={form.minQty} onChange={(e) => setForm({ ...form, minQty: Number(e.target.value) })} /></div>
            <div><Label>Step</Label><Input type="number" min={1} value={form.step} onChange={(e) => setForm({ ...form, step: Number(e.target.value) })} /></div>
          </div>
          <div>
            <Label>Tags <span className="text-muted-foreground font-normal">(comma separated)</span></Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Spicy, Bestseller" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">{isNew ? "Add dish" : "Save changes"}</Button>
            <Button type="button" variant="outline" onClick={() => nav("/vendor-portal/dishes")}>Cancel</Button>
          </div>
        </form>
      </main>
    </VendorLayout>
  );
};

export default VendorDishForm;
