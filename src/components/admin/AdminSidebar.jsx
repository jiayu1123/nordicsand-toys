import React from "react";
import { Link } from "react-router-dom";
import { Shell, Home, Package, Info, Wrench, BookOpen, Mail, Shield, LogOut, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAdminAuthenticated } from "@/lib/adminAuth";

const NAV = [
  { id: "products", label: "Products", icon: Package },
  { id: "home", label: "Home Page", icon: Home },
  { id: "about", label: "About Us", icon: Info },
  { id: "oem", label: "OEM/ODM", icon: Wrench },
  { id: "stories", label: "Stories / Blog", icon: BookOpen },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
];

export default function AdminSidebar({ active, onChange, onLogout }) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-100 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center">
          <Shell className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-800">HXToys Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left",
              active === id
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 pb-4 space-y-0.5 border-t border-slate-100 pt-3">
        <Link to="/Home" target="_blank" className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
          <ExternalLink className="w-4 h-4 shrink-0" />
          View Website
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}