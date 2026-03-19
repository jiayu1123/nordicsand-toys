import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Shell, Save } from "lucide-react";
import { toast } from "sonner";

const DEFAULT = {
  section_title: "Get in Touch",
  email: "info@shoreplay.com",
  phone: "+86 123 456 7890",
  whatsapp: "+861234567890",
  address: "Shantou, Guangdong, China 515000",
  working_hours: "Mon–Fri, 9:00 AM – 6:00 PM (GMT+8)",
  wholesale_email: "wholesale@shoreplay.com",
  wholesale_title: "For Wholesale Inquiries",
  wholesale_text: "Looking for bulk orders or OEM services? Our dedicated B2B team is ready to assist with custom quotes and flexible terms.",
};

function Field({ label, field, value, onChange, textarea, placeholder }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-500">{label}</Label>
      {textarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={placeholder}
          className="rounded-xl text-sm"
          rows={3}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          placeholder={placeholder}
          className="rounded-xl text-sm"
        />
      )}
    </div>
  );
}

export default function AdminContactSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(DEFAULT);
  const initialized = useRef(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: () => base44.entities.ContactSettings.list(),
  });

  useEffect(() => {
    if (!initialized.current && settings?.length > 0) {
      initialized.current = true;
      setForm({ ...DEFAULT, ...settings[0] });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const { id, created_date, updated_date, created_by, ...payload } = data;
      if (settings?.length > 0) {
        return base44.entities.ContactSettings.update(settings[0].id, payload);
      } else {
        return base44.entities.ContactSettings.create(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-settings"] });
      toast({ title: "Saved!", description: "Contact settings updated." });
    },
  });

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

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
              <span className="text-sm font-semibold text-slate-800">Contact Settings</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/Admin"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Product Admin ↗</Button></Link>
              <Link to="/AdminStories"><Button variant="ghost" size="sm" className="rounded-full text-xs text-slate-500">Stories Admin ↗</Button></Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contact Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage contact information displayed on the Contact page</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Contact Information</h2>
              <Field label="Section Title" field="section_title" value={form.section_title} onChange={handleChange} placeholder="Get in Touch" />
              <Field label="Email" field="email" value={form.email} onChange={handleChange} placeholder="info@shoreplay.com" />
              <Field label="Phone" field="phone" value={form.phone} onChange={handleChange} placeholder="+86 123 456 7890" />
              <Field label="WhatsApp (with country code, no spaces or +)" field="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="861234567890" />
              <Field label="Address" field="address" value={form.address} onChange={handleChange} placeholder="City, Province, Country" />
              <Field label="Working Hours" field="working_hours" value={form.working_hours} onChange={handleChange} placeholder="Mon–Fri, 9:00 AM – 6:00 PM (GMT+8)" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
              <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-3">Wholesale / B2B Card</h2>
              <Field label="Card Title" field="wholesale_title" value={form.wholesale_title} onChange={handleChange} placeholder="For Wholesale Inquiries" />
              <Field label="Card Text" field="wholesale_text" value={form.wholesale_text} onChange={handleChange} placeholder="Description..." textarea />
              <Field label="Wholesale Email" field="wholesale_email" value={form.wholesale_email} onChange={handleChange} placeholder="wholesale@shoreplay.com" />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => mutation.mutate(form)}
                disabled={mutation.isPending}
                className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}