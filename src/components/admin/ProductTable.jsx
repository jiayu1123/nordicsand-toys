import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const statusColors = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function ProductTable({ products, onEdit }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Product deleted" });
      setConfirmDelete(null);
    },
  });

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <span className="text-5xl block mb-3">📦</span>
        <p className="font-medium">No products yet</p>
        <p className="text-sm mt-1">Click "Add Product" to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">SKU</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Age</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Flags</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-sky-50 to-cyan-50 shrink-0">
                    {product.main_image ? (
                      <img src={product.main_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🏖️</div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 leading-tight">{product.name}</p>
                    {product.subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[180px]">{product.subtitle}</p>}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 font-mono text-xs text-slate-500">{product.sku}</td>
              <td className="py-3 px-4">
                <span className="text-xs text-slate-600">{product.category || "—"}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-xs text-slate-500">{product.age_group ? `${product.age_group}y` : "—"}</span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1">
                  {product.is_featured && (
                    <span title="Best Seller"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /></span>
                  )}
                  {product.is_new && (
                    <span title="New Arrival"><Sparkles className="w-3.5 h-3.5 text-sky-400" /></span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={`rounded-full text-xs capitalize ${statusColors[product.status] || statusColors.draft}`}>
                  {product.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/ProductDetail?id=${product.id}`} target="_blank">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-sky-500">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700" onClick={() => onEdit(product)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {confirmDelete === product.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="destructive" className="h-7 rounded-lg text-xs px-2" onClick={() => deleteMutation.mutate(product.id)}>
                        Confirm
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs px-2" onClick={() => setConfirmDelete(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500" onClick={() => setConfirmDelete(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}