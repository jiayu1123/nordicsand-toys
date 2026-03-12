import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Shell } from "lucide-react";
import { Link } from "react-router-dom";
import NewsTable from "../components/admin/NewsTable";
import NewsForm from "../components/admin/NewsForm";

const CATEGORIES = ["All", "Company News", "New Collection", "Manufacturing", "Safety", "Trade Shows", "Press"];
const STATUSES = ["All", "published", "draft"];

export default function AdminStories() {
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
              <Link to="/Admin" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Product Admin</Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-800">Stories Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/News">
                <Button variant="ghost" size="sm" className="rounded-full text-slate-500 text-xs">View Stories ↗</Button>
              </Link>
              <Button onClick={openAdd} size="sm" className="rounded-full bg-slate-800 hover:bg-slate-700 gap-1.5 text-xs px-4">
                <Plus className="w-3.5 h-3.5" /> New Story
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Stories & Updates</h1>
          <p className="text-sm text-slate-400 mt-1">Manage company updates, factory news, partnerships, and social impact activities</p>
        </div>

        {/* Stats */}
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

        {/* Filters */}
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-xs text-slate-400">{filtered.length} of {articles.length} stories</p>
              </div>
              <NewsTable articles={filtered} onEdit={openEdit} />
            </>
          )}
        </div>
      </div>

      {showForm && <NewsForm article={editingArticle} onClose={closeForm} />}
    </div>
  );
}