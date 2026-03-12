import React, { useState, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Loader2, RefreshCw } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";

const CATEGORIES = ["Company News", "New Collection", "Manufacturing", "Safety", "Trade Shows", "Press"];

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link", "image"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "blockquote", "link", "image",
];

function toSlug(title) {
  return title.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const empty = {
  title: "", slug: "", subtitle: "", excerpt: "", cover_image: "", gallery_images: [],
  content: "", category: "Company News", publish_date: "", author: "",
  tags: [], is_featured: false, status: "draft",
};

export default function NewsForm({ article, onClose }) {
  const [form, setForm] = useState(article || empty);
  const [tagsInput, setTagsInput] = useState((article?.tags || []).join(", "));
  const [slugManual, setSlugManual] = useState(!!article?.slug);
  const qc = useQueryClient();

  const set = useCallback((k, v) => setForm((f) => ({ ...f, [k]: v })), []);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    set("title", title);
    if (!slugManual) {
      set("slug", toSlug(title));
    }
  };

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="font-semibold text-slate-800">{article ? "Edit Story" : "New Story"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={handleTitleChange} placeholder="Article title" required />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label className="flex items-center justify-between">
              <span>URL Slug</span>
              {slugManual && (
                <button type="button" onClick={() => { setSlugManual(false); set("slug", toSlug(form.title)); }}
                  className="text-xs text-sky-600 hover:underline flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Auto-generate
                </button>
              )}
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 shrink-0">/stories/</span>
              <Input
                value={form.slug}
                onChange={(e) => { setSlugManual(true); set("slug", e.target.value); }}
                placeholder="my-article-title"
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5">
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Short teaser or subtitle" />
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label>Excerpt <span className="text-slate-400 text-xs">(shown on listing page)</span></Label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="A short summary of this story (2-3 sentences)..."
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
            />
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

          {/* Content - Rich Text Editor */}
          <div className="space-y-1.5">
            <Label>Content</Label>
            <RichTextEditor value={form.content || ""} onChange={(v) => set("content", v)} />
            <p className="text-xs text-slate-400">Supports headings, bold, italic, lists and links.</p>
          </div>

          {/* Featured */}
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-slate-700">Featured Story</p>
              <p className="text-xs text-slate-400">Pin this story to the top of the Stories page</p>
            </div>
            <Switch checked={!!form.is_featured} onCheckedChange={(v) => set("is_featured", v)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-full px-5">Cancel</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending} className="rounded-full bg-slate-800 hover:bg-slate-700 px-6 gap-2">
            {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {article ? "Save Changes" : "Publish Story"}
          </Button>
        </div>
      </div>
    </div>
  );
}