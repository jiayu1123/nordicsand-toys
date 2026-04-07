import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CheckCircle2, Lock } from "lucide-react";
import { hashPassword } from "@/lib/adminAuth";

const DEFAULT_PASSWORD = "admin123";

export default function SecurityPanel() {
  const qc = useQueryClient();
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
      return records?.length > 0
        ? base44.entities.AdminPassword.update(records[0].id, { password_hash: hash })
        : base44.entities.AdminPassword.create({ password_hash: hash });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-password"] });
      setSaved(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = async () => {
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) { setError("All fields are required."); return; }
    if (newPassword !== confirmPassword) { setError("New passwords do not match."); return; }
    if (newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
    const currentHash = await hashPassword(currentPassword);
    const storedHash = records?.[0]?.password_hash || (await hashPassword(DEFAULT_PASSWORD));
    if (currentHash !== storedHash) { setError("Current password is incorrect."); return; }
    const newHash = await hashPassword(newPassword);
    mutation.mutate({ hash: newHash });
  };

  return (
    <div className="space-y-8 max-w-md">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Security Settings</h2>
        <p className="text-sm text-slate-400">Change the admin login password</p>
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-slate-700">Change Password</h3>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Current Password</Label>
          <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="rounded-xl text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">New Password</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" className="rounded-xl text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-500">Confirm New Password</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className="rounded-xl text-sm" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex items-center gap-3 pt-1">
          {saved && <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle2 className="w-4 h-4" />Password updated!</span>}
          <Button onClick={handleSave} disabled={mutation.isPending} className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 ml-auto">
            <Save className="w-4 h-4" />{mutation.isPending ? "Saving…" : "Save Password"}
          </Button>
        </div>
      </section>
    </div>
  );
}