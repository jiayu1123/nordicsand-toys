import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionHeading from "../components/shared/SectionHeading";
import ProductCard from "../components/products/ProductCard";
import CategoryFilter from "../components/products/CategoryFilter";

export default function Products() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.filter({ status: "active" }),
    initialData: [],
  });

  const filteredProducts = useMemo(() => {
    // Deduplicate by id first
    const seen = new Set();
    let result = products.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    if (selectedCategory !== "All") {
      if (selectedCategory === "New Arrivals") {
        result = result.filter((p) => p.is_new);
      } else {
        result = result.filter((p) => p.category === selectedCategory);
      }
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q)
      );
    }

    if (ageFilter !== "all") {
      result = result.filter((p) => p.age_group === ageFilter);
    }

    if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [products, selectedCategory, search, ageFilter, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-sky-50 via-cyan-50 to-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Product Catalog"
            title="Our Beach Toy Collection"
            subtitle="Browse our full range of premium children's beach toys. Designed with Nordic minimalism and built for endless fun."
          />
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-full border-slate-200 h-10 text-sm"
                />
              </div>
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger className="w-36 rounded-full border-slate-200 h-10 text-sm">
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="0-2">0–2 years</SelectItem>
                  <SelectItem value="3-4">3–4 years</SelectItem>
                  <SelectItem value="5-6">5–6 years</SelectItem>
                  <SelectItem value="3-6">3–6 years</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 rounded-full border-slate-200 h-10 text-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-slate-400 mb-6">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🏖️</span>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No products found</h3>
              <p className="text-sm text-slate-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}