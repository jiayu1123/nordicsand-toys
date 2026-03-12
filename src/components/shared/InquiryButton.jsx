import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function InquiryButton({ productName, className = "" }) {
  return (
    <Link to={`/Contact${productName ? `?product=${encodeURIComponent(productName)}` : ""}`}>
      <Button
        className={`rounded-full bg-slate-800 hover:bg-slate-700 text-white gap-2 px-6 py-5 text-sm ${className}`}
      >
        <MessageCircle className="w-4 h-4" />
        Inquire Now
      </Button>
    </Link>
  );
}