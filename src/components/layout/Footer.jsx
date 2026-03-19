import React from "react";
import { Link } from "react-router-dom";
import { Shell, Mail, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function Footer() {
  const { data: contactList } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: () => base44.entities.ContactSettings.list(),
  });
  const contact = contactList?.[0] || {};

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
            <p className="text-slate-400 text-sm leading-relaxed">
              Designing and manufacturing premium children's beach toys with Nordic-inspired aesthetics. Safe, sustainable, and joyful.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Products</h4>
            <div className="space-y-2.5">
              {["Beach Bucket Sets", "Sand Molds", "Water Play Toys", "Beach Tools", "Play Sets"].map((cat) => (
                <Link key={cat} to="/Products" className="block text-sm text-slate-400 hover:text-white transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link to="/About" className="block text-sm text-slate-400 hover:text-white transition-colors">About Us</Link>
              <Link to="/OEM" className="block text-sm text-slate-400 hover:text-white transition-colors">OEM / ODM</Link>
              <Link to="/Contact" className="block text-sm text-slate-400 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Contact Us</h4>
            <div className="space-y-3">
              {contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-400">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-400">{contact.phone}</span>
                </div>
              )}
              {contact.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-400">{contact.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2026 Shoreplay. All rights reserved. · <Link to="/Admin" className="hover:text-slate-300 transition-colors">Admin</Link></p>
          <div className="flex gap-6">
            <span className="text-xs text-slate-500">CE Certified</span>
            <span className="text-xs text-slate-500">EN-71 Compliant</span>
            <span className="text-xs text-slate-500">BPA Free</span>
          </div>
        </div>
      </div>
    </footer>
  );
}