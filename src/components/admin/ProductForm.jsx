import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ImageUploader from "./ImageUploader";
import AIImageProcessor from "./AIImageProcessor";

const DEFAULT_CATEGORIES = ["Beach Bucket Sets", "Sand Molds", "Water Play Toys", "Beach Tools", "Play Sets", "New Arrivals"];
const AGE_GROUPS = ["0-2", "3-4", "5-6", "3-6", "All Ages"];

function useCategories() {
  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sp_custom_categories") || "[]"); } catch { return []; }
  });
  const all = [...new Set([...DEFAULT_CATEGORIES, ...custom])];
  const add = (cat) => {
    const next = [...new Set([...custom, cat])];
    setCustom(next);
    localStorage.setItem("sp_custom_categories", JSON.stringify(next));
  };
  return { categories: all, addCategory: add };
}
const FEATURE_OPTIONS = ["BPA Free", "CE Certified", "EN-71", "Eco-Friendly", "Non-Toxic", "Recyclable", "ASTM Certified"];
const STATUSES = ["active", "draft", "archived"];

const emptyProduct = {
  name: "", subtitle: "", sku: "", category: "", collection: "", age_group: "",
  main_image: "", gallery_images: [], description: "",
  highlights: [], material: "", dimensions: "", pieces_included: "",
  packaging_type: "", packaging_dimensions: "", weight: "",
  features: [], is_featured: false, is_new: false, sort_order: 0, status: "active"
};

export default function ProductForm({ product, onClose }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState(product ? { ...emptyProduct, ...product } : emptyProduct);
  const [newHighlight, setNewHighlight] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const { categories, addCategory } = useCategories();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        ...form,
        pieces_included: form.pieces_included ? Number(form.pieces_included) : undefined,
        sort_order: form.sort_order ? Number(form.sort_order) : 0,
      };
      if (isEdit) return base44.entities.Product.update(product.id, data);
      return base44.entities.Product.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: isEdit ? "Product updated!" : "Product created!", description: form.name });
      onClose();
    },
  });

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    set("highlights", [...(form.highlights || []), newHighlight.trim()]);
    setNewHighlight("");
  };

  const removeHighlight = (i) => set("highlights", form.highlights.filter((_, idx) => idx !== i));

  const toggleFeature = (feat) => {
    const curr = form.features || [];
    set("features", curr.includes(feat) ? curr.filter((f) => f !== feat) : [...curr, feat]);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-semibold text-slate-800">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          className="flex-1 p-6 space-y-7"
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
        >
          {/* Images */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Images</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Main Product Image</Label>
                <ImageUploader value={form.main_image} onChange={(v) => set("main_image", v)} label="main image" />
                <AIImageProcessor
                  imageUrl={form.main_image}
                  onApplyMain={(url) => set("main_image", url)}
                  onApplyGallery={(url) => set("gallery_images", [...(form.gallery_images || []), url])}
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Gallery Images</Label>
                <ImageUploader value={form.gallery_images} onChange={(v) => set("gallery_images", v)} multiple />
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs text-slate-500">Product Name *</Label>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Ocean Explorer Bucket Set" className="rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">SKU *</Label>
                  <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="SP-BS-001" className="rounded-xl font-mono" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Status</Label>
                  <Select value={form.status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs text-slate-500">Subtitle</Label>
                  <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Short tagline or subtitle" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Description</Label>
                <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Full product description..." className="rounded-xl min-h-[100px]" />
              </div>
            </div>
          </section>

          {/* Classification */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Classification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Category *</Label>
                {!showNewCategory ? (
                  <div className="flex gap-2">
                    <Select value={form.category} onValueChange={(v) => set("category", v)}>
                      <SelectTrigger className="rounded-xl flex-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" className="rounded-xl px-3 shrink-0 text-xs gap-1" onClick={() => setShowNewCategory(true)}>
                      <Plus className="w-3.5 h-3.5" /> New
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      autoFocus
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name..."
                      className="rounded-xl flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault();
                          if (newCategory.trim()) { addCategory(newCategory.trim()); set("category", newCategory.trim()); setNewCategory(""); setShowNewCategory(false); }
                        }
                        if (e.key === "Escape") { setShowNewCategory(false); setNewCategory(""); }
                      }}
                    />
                    <Button type="button" className="rounded-xl px-3 shrink-0 bg-slate-800 hover:bg-slate-700 text-xs" onClick={() => {
                      if (newCategory.trim()) { addCategory(newCategory.trim()); set("category", newCategory.trim()); setNewCategory(""); setShowNewCategory(false); }
                    }}>Add</Button>
                    <Button type="button" variant="outline" className="rounded-xl px-3 shrink-0" onClick={() => { setShowNewCategory(false); setNewCategory(""); }}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
                {form.category && <p className="text-xs text-slate-400 mt-1">Selected: <span className="font-medium text-slate-600">{form.category}</span></p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Age Group</Label>
                <Select value={form.age_group} onValueChange={(v) => set("age_group", v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select age" /></SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((a) => <SelectItem key={a} value={a}>{a} years</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Collection / Series</Label>
                <Input value={form.collection} onChange={(e) => set("collection", e.target.value)} placeholder="e.g. Nordic Shore" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} placeholder="0" className="rounded-xl" />
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <div className="flex items-center gap-2.5">
                <Switch id="featured" checked={!!form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
                <Label htmlFor="featured" className="text-sm text-slate-600 cursor-pointer">Featured / Best Seller</Label>
              </div>
              <div className="flex items-center gap-2.5">
                <Switch id="new" checked={!!form.is_new} onCheckedChange={(v) => set("is_new", v)} />
                <Label htmlFor="new" className="text-sm text-slate-600 cursor-pointer">New Arrival</Label>
              </div>
            </div>
          </section>

          {/* Highlights */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Highlights</h3>
            <div className="space-y-2">
              {(form.highlights || []).map((h, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                  <span className="flex-1 text-sm text-slate-700">{h}</span>
                  <button type="button" onClick={() => removeHighlight(i)} className="text-slate-400 hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
                  placeholder="Add highlight and press Enter..."
                  className="rounded-xl text-sm"
                />
                <Button type="button" variant="outline" onClick={addHighlight} className="rounded-xl px-3 shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Specifications */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-slate-500">Material</Label>
                <Input value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="e.g. PP & ABS Plastic (BPA-Free)" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Dimensions</Label>
                <Input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="e.g. 22 × 22 × 20 cm" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Pieces Included</Label>
                <Input type="number" value={form.pieces_included} onChange={(e) => set("pieces_included", e.target.value)} placeholder="e.g. 8" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Weight</Label>
                <Input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="e.g. 380g" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Packaging Type</Label>
                <Input value={form.packaging_type} onChange={(e) => set("packaging_type", e.target.value)} placeholder="e.g. Mesh Bag, Color Box" className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-slate-500">Packaging Dimensions</Label>
                <Input value={form.packaging_dimensions} onChange={(e) => set("packaging_dimensions", e.target.value)} placeholder="e.g. 25 × 25 × 22 cm" className="rounded-xl" />
              </div>
            </div>
          </section>

          {/* Features / Certifications */}
          <section>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Features & Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {FEATURE_OPTIONS.map((feat) => (
                <button
                  key={feat}
                  type="button"
                  onClick={() => toggleFeature(feat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    (form.features || []).includes(feat)
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-white text-slate-500 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {feat}
                </button>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 -mx-6 -mb-6 px-6 py-4 flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="rounded-full flex-1 bg-slate-800 hover:bg-slate-700 gap-2">
              <Save className="w-4 h-4" />
              {mutation.isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}