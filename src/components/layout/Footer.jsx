import React from "react";
import { Link } from "react-router-dom";
import { Shell, Mail, Phone, MapPin } from "lucide-react";
import { useHomeSettings } from "../shared/useHomeSettings";

export default function Footer() {
  const { cms } = useHomeSettings();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center">
                <Shell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Shoreplay</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{cms.footer_description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Products</h4>
            <div className="space-y-2.5">
              {(cms.footer_product_links || []).map((item, i) => (
                <Link key={i} to={item.link || "/Products"} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Company</h4>
            <div className="space-y-2.5">
              {(cms.footer_company_links || []).map((item, i) => (
                <Link key={i} to={item.link || "/"} className="block text-sm text-slate-400 hover:text-white transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Contact Us</h4>
            <div className="space-y-3">
              {cms.footer_email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-400">{cms.footer_email}</span>
                </div>
              )}
              {cms.footer_phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-400">{cms.footer_phone}</span>
                </div>
              )}
              {cms.footer_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-400">{cms.footer_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            {cms.footer_copyright} · <Link to="/Admin" className="hover:text-slate-300 transition-colors">Admin</Link>
          </p>
          <div className="flex gap-6">
            {(cms.footer_certifications || []).map((cert, i) => (
              <span key={i} className="text-xs text-slate-500">{cert}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}