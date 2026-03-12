import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Check, Loader2, ChevronDown, ChevronUp } from "lucide-react";

function ResultImage({ label, url, onApply }) {
  const [applied, setApplied] = useState(false);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
      <img src={url} alt={label} className="w-full aspect-square object-contain bg-white p-2" />
      <div className="px-3 py-2 flex items-center justify-between bg-slate-50 border-t border-slate-100">
        <span className="text-xs text-slate-500 truncate mr-2">{label}</span>
        <Button
          type="button"
          size="sm"
          variant={applied ? "outline" : "default"}
          className="rounded-full text-xs h-7 gap-1 shrink-0"
          onClick={() => { onApply(); setApplied(true); }}
        >
          {applied ? <><Check className="w-3 h-3" /> Applied</> : "Use This"}
        </Button>
      </div>
    </div>
  );
}

export default function AIImageProcessor({ imageUrl, onApplyMain, onApplyGallery }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({ shadow: true, multiSizes: false, lifestyle: true });
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const toggle = (key) => setOptions(o => ({ ...o, [key]: !o[key] }));

  const process = async () => {
    setProcessing(true);
    setResults(null);
    setError(null);
    try {
      const shadowText = options.shadow
        ? "with a subtle soft drop shadow directly beneath the product"
        : "no shadow, pure clean white background";

      const cleanPrompt = `Professional e-commerce product photo. Place this exact product centered on a pure white background. The product fills about 80% of the square frame, perfectly centered. Colors must be accurate and true to the original. Studio lighting, sharp details. ${shadowText}. Square 1:1 aspect ratio, 1200x1200, suitable for e-commerce website.`;

      const [cleanResult, lifestyleResult] = await Promise.all([
        base44.integrations.Core.GenerateImage({ prompt: cleanPrompt, existing_image_urls: [imageUrl] }),
        options.lifestyle
          ? base44.integrations.Core.GenerateImage({
              prompt: `Lifestyle marketing photo featuring children's beach toy. Show happy young children playing at a bright sunny beach with this product. Crystal blue ocean, golden sand, warm summer light, vibrant joyful atmosphere. Wide angle marketing shot. Professional lifestyle photography.`,
              existing_image_urls: [imageUrl]
            })
          : null
      ]);

      const out = { clean1200: cleanResult.url };

      if (options.multiSizes) {
        const small = await base44.integrations.Core.GenerateImage({
          prompt: `${cleanPrompt} 800x800 version.`,
          existing_image_urls: [imageUrl]
        });
        out.clean800 = small.url;
      }

      if (lifestyleResult) out.lifestyle = lifestyleResult.url;

      setResults(out);
    } catch (e) {
      setError("Processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!imageUrl) return null;

  return (
    <div className="mt-3 border border-violet-200 rounded-xl overflow-hidden">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-semibold text-violet-700">AI Image Processing</span>
          <span className="text-xs text-violet-400 font-normal">· Remove background, white background, lifestyle image</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4 text-violet-400" />}
      </button>

      {open && (
        <div className="p-4 bg-white space-y-4">
          {/* Options */}
          <div className="space-y-2.5">
            {[
              { key: "shadow", label: "Add soft shadow under product" },
              { key: "multiSizes", label: "Generate multiple sizes (1200×1200 + 800×800)" },
              { key: "lifestyle", label: "Generate lifestyle image (beach scene)" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="text-xs text-slate-600 cursor-pointer">{label}</Label>
                <Switch checked={options[key]} onCheckedChange={() => toggle(key)} />
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={process}
            disabled={processing}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 gap-2"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {processing ? "Processing with AI…" : "Process Image with AI"}
          </Button>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          {/* Results */}
          {results && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Generated Images — click "Use This" to apply</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultImage label="White BG · 1200×1200" url={results.clean1200} onApply={() => onApplyMain(results.clean1200)} />
                {results.clean800 && (
                  <ResultImage label="White BG · 800×800" url={results.clean800} onApply={() => onApplyMain(results.clean800)} />
                )}
                {results.lifestyle && (
                  <ResultImage label="Lifestyle Image" url={results.lifestyle} onApply={() => onApplyGallery(results.lifestyle)} />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}