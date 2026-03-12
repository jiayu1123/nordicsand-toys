import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import ImageUploader from "./ImageUploader";

const CATEGORIES = ["Company News", "New Collection", "Manufacturing", "Safety", "Trade Shows", "Press"];

const empty = {
  title: "", subtitle: "", cover_image: "", gallery_images: [],
  content: "", category: "Company News", publish_date: "", author: "",
  tags: [], is_featured: false, status: "draft",
};

export default function NewsForm({ article, onClose }) {
  const [form, setForm] = useState(article || empty);
  const [tagsInput, setTagsInput] = useState((article?.tags || []).join(", "));
  const qc = useQueryClient();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data) =>
      article ? base44.entities.News.update(article.id, data) : base44.entities.News.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["news-admin"] }); onClose(); },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    mutation.mutate({ ...form, tags });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{article ? "Edit Article" : "New Article"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Article title" required />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Short teaser or subtitle" />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="rounded-xl border-slate-200 h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="rounded-xl border-slate-200 h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Author + Publish Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Author</Label>
              <Input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" />
            </div>
            <div className="space-y-1.5">
              <Label>Publish Date</Label>
              <Input type="date" value={form.publish_date} onChange={(e) => set("publish_date", e.target.value)} />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label>Tags <span className="text-slate-400 text-xs">(comma separated)</span></Label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="e.g. summer, beach, collection" />
          </div>

          {/* Cover Image */}
          <div className="space-y-1.5">
            <Label>Cover Image</Label>
            <ImageUploader value={form.cover_image} onChange={(url) => set("cover_image", url)} />
          </div>

          {/* Gallery Images */}
          <div className="space-y-1.5">
            <Label>Gallery Images</Label>
            <div className="flex flex-wrap gap-3">
              {(form.gallery_images || []).map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
                  <img src={url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => set("gallery_images", form.gallery_images.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✕</button>
                </div>
              ))}
              <ImageUploader value="" onChange={(url) => set("gallery_images", [...(form.gallery_images || []), url])} compact />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <Label>Content</Label>
            <div className="border border-slate-200 rounded-xl overflow-hidden min-h-[240px]">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(v) => set("content", v)}
                className="h-48"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-700">Featured Article</p>
              <p className="text-xs text-slate-400">Pin this article to the top of the news page</p>
            </div>
            <Switch checked={!!form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-5">Cancel</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending} className="rounded-full bg-slate-800 hover:bg-slate-700 px-6 gap-2">
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {article ? "Save Changes" : "Publish Article"}
          </Button>
        </div>
      </div>
    </div>
  );
}