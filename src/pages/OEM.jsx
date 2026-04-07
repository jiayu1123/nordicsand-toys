import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Tag, Package, Puzzle, ClipboardCheck, Truck, ArrowRight, CheckCircle2, Send } from "lucide-react";
import SectionHeading from "../components/shared/SectionHeading";
import { useToast } from "@/components/ui/use-toast";

const DEFAULT_OEM_IMG = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b31b1a5577543294a65bde/087c56c45_generated_c3199ac0.png";
const DEFAULT_SERVICES = [
  { icon: Tag, title: "Custom Logo", desc: "Print or emboss your brand logo on any product." },
  { icon: Palette, title: "Custom Colors", desc: "Choose from our Pantone library or specify your own colors." },
  { icon: Package, title: "Custom Packaging", desc: "Design your own retail-ready packaging, mesh bags, or display boxes." },
  { icon: Puzzle, title: "Custom Toy Sets", desc: "Create unique toy combinations and exclusive sets for your market." },
];
const DEFAULT_PROCESS = [
  { step: "01", title: "Share Your Brief", desc: "Tell us your product idea, target market, and branding needs." },
  { step: "02", title: "Design & Sampling", desc: "We create product designs and physical samples for your approval." },
  { step: "03", title: "Approval & Order", desc: "Review samples, confirm details, and place your production order." },
  { step: "04", title: "Production", desc: "Manufacturing with strict quality control at every stage." },
  { step: "05", title: "Quality Check", desc: "Final QC inspection before packaging and shipping." },
  { step: "06", title: "Delivery", desc: "On-time shipment via sea, air, or express to your destination." },
];
const DEFAULT_MOQ = [
  { label: "Minimum Order (Standard)", value: "500 pcs per SKU" },
  { label: "Minimum Order (Custom)", value: "1,000 pcs per SKU" },
  { label: "Sample Time", value: "7–15 working days" },
  { label: "Production Lead Time", value: "30–45 days" },
  { label: "Payment Terms", value: "T/T, L/C (negotiable)" },
];
const SERVICE_ICONS = [Tag, Palette, Package, Puzzle, ClipboardCheck, Truck];

export default function OEM() {
  const { toast } = useToast();
  const { data: cmsList = [] } = useQuery({
    queryKey: ["oem-settings"],
    queryFn: () => base44.entities.OEMSettings.list(),
    initialData: [],
  });
  const cms = cmsList[0] || {};
  const oemImg = cms.hero_image || DEFAULT_OEM_IMG;
  const heroBadge = cms.hero_badge || "OEM / ODM Services";
  const heroHeading = cms.hero_heading || "Build Your Own Beach Toy Brand";
  const heroText = cms.hero_text || "From custom colors and logos to fully original product designs, we're your complete manufacturing partner. Flexible MOQ, fast sampling, and reliable delivery.";
  const services = (cms.services?.length ? cms.services : DEFAULT_SERVICES).map((s, i) => ({ ...s, icon: SERVICE_ICONS[i % SERVICE_ICONS.length] }));
  const processSteps = cms.process_steps?.length ? cms.process_steps : DEFAULT_PROCESS;
  const moqItems = cms.moq_items?.length ? cms.moq_items : DEFAULT_MOQ;

  const [formData, setFormData] = useState({
    company: "", name: "", email: "", phone: "",
    service: "", quantity: "", message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast({ title: "Inquiry Sent!", description: "Our OEM team will respond within 24 hours." });
      setFormData({ company: "", name: "", email: "", phone: "", service: "", quantity: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={oemImg} alt="OEM Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4">
              {heroBadge}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              {heroHeading}
            </h1>
            <p className="text-white/70 leading-relaxed">
              {heroText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Services"
            title="Custom Manufacturing Solutions"
            subtitle="Everything you need to launch or grow your beach toy brand."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4">
                  <Icon className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="How It Works"
            title="From Idea to Delivery"
            subtitle="Our streamlined process makes custom manufacturing simple and transparent."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl p-6 relative"
              >
                <span className="text-4xl font-bold text-sky-100 absolute top-4 right-5">{step}</span>
                <div className="relative">
                  <h3 className="font-semibold text-slate-800 mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MOQ Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Order Information</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  We offer flexible terms for businesses of all sizes, from emerging brands to established distributors.
                </p>
              </div>
              <div className="space-y-4">
                {moqItems.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-slate-700">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="text-sm font-medium text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 bg-slate-50" id="oem-inquiry">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Get Started"
            title="Submit Your OEM Inquiry"
            subtitle="Tell us about your project and our team will get back to you within 24 hours."
          />
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="mt-10 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Company Name</Label>
                <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Your company" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Contact Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Email</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@company.com" className="rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Phone / WhatsApp</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 8900" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Service Needed</Label>
                <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select service" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom_logo">Custom Logo / Branding</SelectItem>
                    <SelectItem value="custom_color">Custom Colors</SelectItem>
                    <SelectItem value="custom_packaging">Custom Packaging</SelectItem>
                    <SelectItem value="custom_set">Custom Toy Set</SelectItem>
                    <SelectItem value="full_odm">Full ODM (New Design)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-500">Estimated Quantity</Label>
                <Input value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="e.g. 5,000 pcs" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-500">Project Details</Label>
              <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your project, target market, timeline..." className="rounded-xl min-h-[120px]" required />
            </div>
            <Button type="submit" disabled={submitting} className="w-full rounded-full bg-slate-800 hover:bg-slate-700 py-5 gap-2">
              <Send className="w-4 h-4" />
              {submitting ? "Sending..." : "Submit Inquiry"}
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
}