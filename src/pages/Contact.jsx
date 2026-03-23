import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import SectionHeading from "../components/shared/SectionHeading";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const DEFAULTS = {
  section_title: "Get in Touch",
  email: "info@shoreplay.com",
  phone: "+86 123 456 7890",
  whatsapp: "861234567890",
  address: "Shantou, Guangdong, China 515000",
  working_hours: "Mon–Fri, 9:00 AM – 6:00 PM (GMT+8)",
  wholesale_email: "wholesale@shoreplay.com",
  wholesale_title: "For Wholesale Inquiries",
  wholesale_text: "Looking for bulk orders or OEM services? Our dedicated B2B team is ready to assist with custom quotes and flexible terms.",
};

export default function Contact() {

  const urlParams = new URLSearchParams(window.location.search);
  const productRef = urlParams.get("product") || "";

  const { data: settingsArr = [] } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: () => base44.entities.ContactSettings.list(),
  });
  const s = settingsArr.length > 0 ? { ...DEFAULTS, ...settingsArr[0] } : DEFAULTS;

  const [formData, setFormData] = useState({
    name: "", email: "", company: "", phone: "",
    subject: productRef ? `Inquiry about: ${productRef}` : "",
    message: productRef ? `I'm interested in ${productRef}. Please send me more information including pricing, MOQ, and lead time.` : ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: "jiayuzou1123@gmail.com",
        subject: `[HXToys Inquiry] ${formData.subject} — from ${formData.name}`,
        body: `New contact form submission from HXToys website.\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || "N/A"}\nCompany: ${formData.company || "N/A"}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`,
      });
      toast.success("Message Sent! We'll respond within 24 hours.");
      setFormData({ name: "", email: "", company: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: s.phone, href: `https://wa.me/${s.whatsapp}` },
    { icon: MapPin, label: "Address", value: s.address },
    { icon: Clock, label: "Working Hours", value: s.working_hours },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-sky-50 via-cyan-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Contact Us"
            title="Let's Start a Conversation"
            subtitle="Whether you're a retailer, distributor, or brand looking for a manufacturing partner, we're here to help."
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">{s.section_title}</h3>
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <Icon className="w-4.5 h-4.5 text-sky-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm text-slate-700 hover:text-sky-500 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-slate-700">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                <h4 className="font-semibold mb-2">{s.wholesale_title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{s.wholesale_text}</p>
                <a href={`mailto:${s.wholesale_email}`} className="inline-block mt-3 text-sm text-sky-400 hover:text-sky-300 transition-colors">
                  {s.wholesale_email} →
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-5"
              >
                <h3 className="text-lg font-semibold text-slate-800">Send Us a Message</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Your Name *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Email *</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@company.com" className="rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Company</Label>
                    <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Company name" className="rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Phone / WhatsApp</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 8900" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Subject *</Label>
                  <Input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="How can we help?" className="rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500">Message *</Label>
                  <Textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us about your needs, products you're interested in, quantity, timeline..." className="rounded-xl min-h-[140px]" required />
                </div>
                <Button type="submit" disabled={submitting} className="w-full rounded-full bg-slate-800 hover:bg-slate-700 py-5 gap-2">
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
                <p className="text-xs text-slate-400 text-center">
                  We typically respond within 24 hours during business days.
                </p>
              </motion.form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}