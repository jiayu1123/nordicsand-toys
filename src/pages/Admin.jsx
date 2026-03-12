import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, SlidersHorizontal, Shell } from "lucide-react";
import { Link } from "react-router-dom";
import ProductTable from "../components/admin/ProductTable";
import ProductForm from "../components/admin/ProductForm";
import AdminStatsBar from "../components/admin/AdminStatsBar";
import { useCategories } from "../components/shared/useCategories";

const STATUSES = ["All", "active", "draft", "archived"];

export default function Admin() {
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
      result = result.filter(
        (p) => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, categoryFilter, statusFilter, search]);

  const openAdd = () => { setEditingProduct(null); setShowForm(true); };
  const openEdit = (p) => { setEditingProduct(p); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingProduct(null); };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link to="/Home" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center">
                  <Shell className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Shoreplay</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-800">Product Admin</span>
            </div>
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <Link to="/AdminStories">
                <Button variant="ghost" size="sm" className="rounded-full text-slate-500 text-xs">Stories Admin ↗</Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/Home">
                <Button variant="ghost" size="sm" className="rounded-full text-slate-500 text-xs">
                  View Website ↗
                </Button>
              </Link>
              <Button onClick={openAdd} size="sm" className="rounded-full bg-slate-800 hover:bg-slate-700 gap-1.5 text-xs px-4">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Product Catalog</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your beach toy product listing</p>
        </div>

        {/* Stats */}
        <AdminStatsBar products={products} />

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or SKU..."
                className="pl-10 rounded-xl border-slate-200 h-9 text-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44 rounded-xl border-slate-200 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 rounded-xl border-slate-200 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s === "All" ? "All Status" : s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {filtered.length} of {products.length} products
                </p>
              </div>
              <ProductTable products={filtered} onEdit={openEdit} />
            </>
          )}
        </div>
      </div>

      {/* Form Drawer */}
      {showForm && (
        <ProductForm product={editingProduct} onClose={closeForm} />
      )}
    </div>
  );
}