import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import NewsTable from "../NewsTable";
import NewsForm from "../NewsForm";

const CATEGORIES = ["All", "Company News", "New Collection", "Manufacturing", "Safety", "Trade Shows", "Press"];
const STATUSES = ["All", "published", "draft"];

export default function StoriesPanel() {
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["news-admin"],
    queryFn: () => base44.entities.News.list("-publish_date"),
    initialData: [],
  });

  const filtered = useMemo(() => {
    let result = articles;
    if (categoryFilter !== "All") result = result.filter((a) => a.category === categoryFilter);
    if (statusFilter !== "All") result = result.filter((a) => a.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title?.toLowerCase().includes(q) || a.author?.toLowerCase().includes(q));
    }
    return result;
  }, [articles, categoryFilter, statusFilter, search]);

  const openAdd = () => { setEditingArticle(null); setShowForm(true); };
  const openEdit = (a) => { setEditingArticle(a); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingArticle(null); };

  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;
  const featured = articles.filter((a) => a.is_featured).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Stories / Blog</h2>
          <p className="text-sm text-slate-400">Manage company updates, factory news, and articles</p>
        </div>
        <Button onClick={openAdd} size="sm" className="rounded-full bg-slate-800 hover:bg-slate-700 gap-1.5 text-xs px-4">
          <Plus className="w-3.5 h-3.5" /> New Story
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Stories", value: articles.length, color: "text-slate-800" },
          { label: "Published", value: published, color: "text-emerald-600" },
          { label: "Drafts", value: drafts, color: "text-amber-600" },
          { label: "Featured", value: featured, color: "text-sky-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or author..." className="pl-10 rounded-xl border-slate-200 h-9 text-sm" />
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
              <p className="text-xs text-slate-400">{filtered.length} of {articles.length} stories</p>
            </div>
            <NewsTable articles={filtered} onEdit={openEdit} />
          </>
        )}
      </div>

      {showForm && <NewsForm article={editingArticle} onClose={closeForm} />}
    </div>
  );
}