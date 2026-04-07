import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
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

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-500">{label}</Label>
      {textarea
        ? <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl text-sm" rows={3} />
        : <Input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="rounded-xl text-sm" />}
    </div>
  );
}

export default function ContactPanel() {
  const qc = useQueryClient();
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
      return settings?.length > 0
        ? base44.entities.ContactSettings.update(settings[0].id, payload)
        : base44.entities.ContactSettings.create(payload);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["contact-settings"] }); toast.success("Contact page saved!"); },
  });

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  if (isLoading) return <div className="py-20 flex justify-center"><div className="w-6 h-6 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Contact Page</h2>
          <p className="text-sm text-slate-400">Edit contact info and wholesale card</p>
        </div>
        <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending} className="rounded-full bg-slate-800 hover:bg-slate-700 gap-2 text-sm">
          <Save className="w-4 h-4" /> {mutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">Contact Information</h3>
        <Field label="Section Title" value={form.section_title} onChange={(v) => set("section_title", v)} />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
        <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
        <Field label="WhatsApp (with country code, no spaces)" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
        <Field label="Address" value={form.address} onChange={(v) => set("address", v)} />
        <Field label="Working Hours" value={form.working_hours} onChange={(v) => set("working_hours", v)} />
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h3 className="font-semibold text-slate-700">Wholesale / B2B Card</h3>
        <Field label="Card Title" value={form.wholesale_title} onChange={(v) => set("wholesale_title", v)} />
        <Field label="Card Text" value={form.wholesale_text} onChange={(v) => set("wholesale_text", v)} textarea />
        <Field label="Wholesale Email" value={form.wholesale_email} onChange={(v) => set("wholesale_email", v)} />
      </section>
    </div>
  );
}