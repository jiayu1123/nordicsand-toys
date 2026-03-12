import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeading from "../components/shared/SectionHeading";
import { format } from "date-fns";

function formatDate(d) {
  if (!d) return null;
  try { return format(new Date(d), "MMMM d, yyyy"); } catch { return null; }
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function ArticleDetail({ article, related }) {
  return (
    <div className="min-h-screen bg-white">
      {article.cover_image && (
        <div className="w-full h-72 md:h-[480px] overflow-hidden">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link to="/Stories" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> All Stories
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="rounded-full text-xs text-sky-600 border-sky-200 bg-sky-50">
              <Tag className="w-3 h-3 mr-1" />{article.category}
            </Badge>
            {article.publish_date && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3 h-3" /> {formatDate(article.publish_date)}
              </span>
            )}
            {article.author && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <User className="w-3 h-3" /> {article.author}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-3">{article.title}</h1>
          {article.subtitle && <p className="text-lg text-slate-500 leading-relaxed mb-8">{article.subtitle}</p>}

          {article.content ? (
            <div
              className="prose prose-slate max-w-none prose-img:rounded-2xl prose-headings:font-bold prose-a:text-sky-600"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-slate-400 italic">No content yet.</p>
          )}

          {article.gallery_images?.length > 0 && (
            <div className="mt-12">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {article.gallery_images.map((img, i) => (
                  <motion.img
                    key={i} src={img} alt=""
                    className="rounded-xl object-cover aspect-square w-full hover:opacity-90 transition-opacity cursor-zoom-in"
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  />
                ))}
              </div>
            </div>
          )}

          {article.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full text-xs text-slate-500 border-slate-200">{tag}</Badge>
              ))}
            </div>
          )}
        </motion.div>

        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Related Stories</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((rel) => (
                <Link key={rel.id} to={`/Stories?article=${rel.id}`} className="group flex gap-4 bg-slate-50 rounded-2xl p-4 hover:bg-sky-50 transition-colors">
                  {rel.cover_image && (
                    <img src={rel.cover_image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs text-sky-600 font-semibold mb-1">{rel.category}</p>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-sky-700 line-clamp-2 transition-colors">{rel.title}</p>
                    {rel.publish_date && <p className="text-xs text-slate-400 mt-1">{formatDate(rel.publish_date)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link to="/Stories">
            <span className="inline-flex items-center gap-2 text-sm text-sky-600 font-medium hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to all stories
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StoryCard({ article, index }) {
  const excerpt = stripHtml(article.content).slice(0, 120) + (article.content?.length > 120 ? "…" : "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
    >
      <Link to={`/Stories?article=${article.id}`} className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-sky-100 transition-all duration-300 h-full">
        <div className="aspect-[16/10] overflow-hidden bg-slate-50">
          {article.cover_image ? (
            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{article.category}</span>
            {article.publish_date && (
              <>
                <span className="text-slate-200">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" /> {formatDate(article.publish_date)}
                </span>
              </>
            )}
          </div>
          <h3 className="font-bold text-slate-800 leading-snug mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          {excerpt && <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{excerpt}</p>}
          <div className="mt-4 inline-flex items-center gap-1 text-xs text-sky-600 font-semibold">
            Read story <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Stories() {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("article");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["news-public"],
    queryFn: () => base44.entities.News.filter({ status: "published" }, "-publish_date"),
    initialData: [],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (articleId) {
    const article = articles.find((a) => a.id === articleId);
    if (!article) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-400">
        <p className="text-4xl">📭</p>
        <p>Article not found.</p>
        <Link to="/Stories" className="text-sky-600 text-sm hover:underline">← Back to Stories</Link>
      </div>
    );
    const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 4);
    return <ArticleDetail article={article} related={related} />;
  }

  const featured = articles.filter((a) => a.is_featured);
  const rest = articles.filter((a) => !a.is_featured);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading badge="Stories" title="Stories from Shoreplay" subtitle="Company updates, factory news, partnerships, and social impact activities." />

        {articles.length === 0 && (
          <div className="mt-24 text-center text-slate-400">
            <p className="text-5xl mb-4">📰</p>
            <p className="text-sm">No stories published yet. Check back soon!</p>
          </div>
        )}

        {featured.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {featured.slice(0, 2).map((art, i) => (
              <motion.div key={art.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/Stories?article=${art.id}`} className="group block relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100">
                  {art.cover_image && <img src={art.cover_image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="inline-block text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">{art.category}</span>
                    <h2 className="text-xl font-bold text-white mb-1 group-hover:text-sky-200 transition-colors line-clamp-2">{art.title}</h2>
                    {art.publish_date && <p className="text-xs text-white/60">{formatDate(art.publish_date)}</p>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((art, i) => <StoryCard key={art.id} article={art} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}