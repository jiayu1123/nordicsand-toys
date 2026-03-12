import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Star } from "lucide-react";
import { format } from "date-fns";

const statusStyles = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-100",
  draft: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function NewsTable({ articles, onEdit }) {
  const qc = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.News.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["news-admin"] }),
  });

  if (!articles.length) {
    return (
      <div className="py-20 text-center text-slate-400">
        <p className="text-3xl mb-3">📰</p>
        <p className="text-sm">No articles yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-50 text-xs text-slate-400 uppercase tracking-wider">
            <th className="text-left px-4 py-3 font-medium">Article</th>
            <th className="text-left px-4 py-3 font-medium">Category</th>
            <th className="text-left px-4 py-3 font-medium">Author</th>
            <th className="text-left px-4 py-3 font-medium">Date</th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {articles.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {a.cover_image ? (
                    <img src={a.cover_image} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 flex-shrink-0">📰</div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      {a.is_featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      <span className="font-medium text-slate-800 line-clamp-1">{a.title}</span>
                    </div>
                    {a.subtitle && <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{a.subtitle}</p>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500">{a.category}</td>
              <td className="px-4 py-3 text-slate-500">{a.author || "—"}</td>
              <td className="px-4 py-3 text-slate-400 text-xs">
                {a.publish_date ? format(new Date(a.publish_date), "MMM d, yyyy") : "—"}
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className={`text-xs capitalize rounded-full px-2.5 ${statusStyles[a.status] || ""}`}>
                  {a.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => onEdit(a)}>
                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-red-50"
                    onClick={() => { if (confirm("Delete this article?")) deleteMutation.mutate(a.id); }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}