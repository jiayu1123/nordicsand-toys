import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAdminAuthenticated } from "@/lib/adminAuth";
import AdminSidebar from "../components/admin/AdminSidebar";
import ProductsPanel from "../components/admin/panels/ProductsPanel";
import HomePanel from "../components/admin/panels/HomePanel";
import AboutPanel from "../components/admin/panels/AboutPanel";
import OEMPanel from "../components/admin/panels/OEMPanel";
import StoriesPanel from "../components/admin/panels/StoriesPanel";
import ContactPanel from "../components/admin/panels/ContactPanel";
import SecurityPanel from "../components/admin/panels/SecurityPanel";

const PANELS = {
  products: ProductsPanel,
  home: HomePanel,
  about: AboutPanel,
  oem: OEMPanel,
  stories: StoriesPanel,
  contact: ContactPanel,
  security: SecurityPanel,
};

export default function Admin() {
  const navigate = useNavigate();
  const [active, setActive] = useState("products");

  const handleLogout = () => {
    clearAdminAuthenticated();
    navigate("/Home");
  };

  const Panel = PANELS[active] || ProductsPanel;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar active={active} onChange={setActive} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Panel />
        </div>
      </main>
    </div>
  );
}