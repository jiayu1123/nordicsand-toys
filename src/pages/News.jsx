import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SectionHeading from "../components/shared/SectionHeading";
import { format } from "date-fns";

function ArticleDetail({ article }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link to="/News" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 text-xs text-sky-600 font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" /> {article.category}
            </span>
            {article.publish_date && (
              <>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" /> {format(new Date(article.publish_date), "MMMM d, yyyy")}
                </span>
              </>
            )}
            {article.author && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-400">{article.author}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-2">{article.title}</h1>
          {article.subtitle && <p className="text-lg text-slate-500 mb-6">{article.subtitle}</p>}

          {article.cover_image && (
            <img src={article.cover_image} alt={article.title} className="w-full rounded-2xl object-cover aspect-video mb-8 shadow-lg" />
          )}

          {article.content ? (
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <p className="text-slate-400 italic">No content yet.</p>
          )}

          {article.gallery_images?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {article.gallery_images.map((img, i) => (
                  <img key={i} src={img} className="rounded-xl object-cover aspect-square" />
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

          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link to="/Contact">
              <Button className="rounded-full bg-slate-800 hover:bg-slate-700 text-white gap-2 px-7 py-5 text-sm">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function News() {
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("article");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["news-public"],
    queryFn: () => base44.entities.News.filter({ status: "published" }, "-publish_date"),
    initialData: [],
  });

  const article = articleId ? articles.find((a) => a.id === articleId) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (article) return <ArticleDetail article={article} />;

  const featured = articles.filter((a) => a.is_featured);
  const rest = articles.filter((a) => !a.is_featured);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading badge="Latest News" title="Stories from Shoreplay" subtitle="Updates on new collections, manufacturing insights, and industry news." />

        {articles.length === 0 && (
          <div className="mt-20 text-center text-slate-400">
            <p className="text-4xl mb-3">📰</p>
            <p>No articles published yet. Check back soon!</p>
          </div>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mt-12 space-y-4">
            {featured.map((art) => (
              <motion.div key={art.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Link to={`/News?article=${art.id}`} className="group flex flex-col md:flex-row bg-gradient-to-br from-sky-50 to-cyan-50 rounded-3xl overflow-hidden border border-sky-100 hover:shadow-xl transition-all duration-300">
                  {art.cover_image && (
                    <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
                      <img src={art.cover_image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="flex-1 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{art.category}</span>
                      {art.publish_date && <span className="text-xs text-slate-400">{format(new Date(art.publish_date), "MMM d, yyyy")}</span>}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">{art.title}</h2>
                    {art.subtitle && <p className="text-slate-500 text-sm leading-relaxed mb-4">{art.subtitle}</p>}
                    <div className="inline-flex items-center gap-1 text-sm text-sky-600 font-medium">Read more <ArrowRight className="w-4 h-4" /></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((art, i) => (
              <motion.div key={art.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to={`/News?article=${art.id}`} className="group block bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-sky-100 transition-all duration-300 h-full">
                  <div className="aspect-video overflow-hidden bg-slate-50">
                    {art.cover_image ? (
                      <img src={art.cover_image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{art.category}</span>
                      {art.publish_date && <><span className="text-slate-300">·</span><span className="text-xs text-slate-400">{format(new Date(art.publish_date), "MMM d, yyyy")}</span></>}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 group-hover:text-sky-600 transition-colors">{art.title}</h3>
                    {art.subtitle && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{art.subtitle}</p>}
                    <div className="mt-4 flex items-center gap-1 text-xs text-sky-600 font-medium">Read more <ArrowRight className="w-3 h-3" /></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}