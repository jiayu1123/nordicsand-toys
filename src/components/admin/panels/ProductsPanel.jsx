import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import ProductTable from "../ProductTable";
import ProductForm from "../ProductForm";
import AdminStatsBar from "../AdminStatsBar";
import { useCategories } from "../../shared/useCategories";

const STATUSES = ["All", "active", "draft", "archived"];

export default function ProductsPanel() {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const { categories: dynamicCats } = useCategories();
  const CATEGORIES = ["All", ...dynamicCats];

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products-admin"],
    queryFn: () => base44.entities.Product.list("-created_date"),
    initialData: [],
  });

  const filtered = useMemo(() => {
    let result = products;
    if (categoryFilter !== "All") result = result.filter((p) => p.category === categoryFilter);
    if (statusFilter !== "All") result = result.filter((p) => p.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }
    return result;
  }, [products, categoryFilter, statusFilter, search]);

  const openAdd = () => { setEditingProduct(null); setShowForm(true); };
  const openEdit = (p) => { setEditingProduct(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingProduct(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Product Catalog</h2>
          <p className="text-sm text-slate-400">Manage your beach toy product listing</p>
        </div>
        <Button onClick={openAdd} size="sm" className="rounded-full bg-slate-800 hover:bg-slate-700 gap-1.5 text-xs px-4">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </Button>
      </div>

      <AdminStatsBar products={products} />

      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="pl-10 rounded-xl border-slate-200 h-9 text-sm" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44 rounded-xl border-slate-200 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl border-slate-200 h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s === "All" ? "All Status" : s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100">
        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" /></div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-slate-50">
              <p className="text-xs text-slate-400">{filtered.length} of {products.length} products</p>
            </div>
            <ProductTable products={filtered} onEdit={openEdit} />
          </>
        )}
      </div>

      {showForm && <ProductForm product={editingProduct} onClose={closeForm} />}
    </div>
  );
}