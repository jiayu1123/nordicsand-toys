import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Shell, Save, CheckCircle2, LogOut, Lock } from "lucide-react";
import { hashPassword, clearAdminAuthenticated } from "@/lib/adminAuth";

const DEFAULT_PASSWORD = "admin123";

export default function AdminSecuritySettings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const { data: records } = useQuery({
    queryKey: ["admin-password"],
    queryFn: () => base44.entities.AdminPassword.list(),
  });

  const mutation = useMutation({
    mutationFn: async ({ hash }) => {
      if (records?.length > 0) {
        return base44.entities.AdminPassword.update(records[0].id, { password_hash: hash });
      } else {
        return base44.entities.AdminPassword.create({ password_hash: hash });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-password"] });
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = async () => {
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    const currentHash = await hashPassword(currentPassword);
    const storedHash = records?.[0]?.password_hash || (await hashPassword(DEFAULT_PASSWORD));
    if (currentHash !== storedHash) {
      setError("Current password is incorrect.");
      return;
    }

    const newHash = await hashPassword(newPassword);
    mutation.mutate({ hash: newHash });
  };

  const handleLogout = () => {
    clearAdminAuthenticated();
    navigate("/Home");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/Home" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center">
                  <Shell className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Shoreplay</span>
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-sm font-semibold text-slate-800">Security Settings</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/Admin"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Product Admin ↗</Button></Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-full text-xs text-red-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Security</h1>
          <p className="text-sm text-slate-400 mt-1">Change the shared admin password for all admin pages</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5 max-w-md">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-700">Change Password</h2>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="rounded-xl text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="rounded-xl text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-500">Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="rounded-xl text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Password updated!
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 ml-auto"
            >
              <Save className="w-4 h-4" />
              {mutation.isPending ? "Saving..." : "Save Password"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-md">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">Session</h2>
          <p className="text-sm text-slate-400 mb-4">End your current admin session and return to the public site.</p>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="rounded-full text-red-500 border-red-200 hover:bg-red-50 gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}