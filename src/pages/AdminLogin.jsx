import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Shell, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hashPassword, setAdminAuthenticated } from "@/lib/adminAuth";

// Default password is "admin123" — change via Admin Security Settings
const DEFAULT_PASSWORD = "admin123";


export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = new URLSearchParams(location.search).get("from") || "/Admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const inputHash = await hashPassword(password);

    // Try to fetch stored password from DB; fall back to default
    const records = await base44.entities.AdminPassword.list();
    let storedHash = records?.[0]?.password_hash;
    if (!storedHash) {
      storedHash = await hashPassword(DEFAULT_PASSWORD);
    }

    if (inputHash === storedHash) {
      setAdminAuthenticated();
      navigate(from, { replace: true });
    } else {
      setError("Incorrect password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center mx-auto mb-4">
            <Shell className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Access</h1>
          <p className="text-sm text-slate-500 mt-1">Enter your admin password to continue</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 rounded-xl"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-full bg-slate-800 hover:bg-slate-700"
            >
              {loading ? "Checking..." : "Enter Admin"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}