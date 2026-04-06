"use client";

import { useParams } from "next/navigation";
import ScriptGenerator from "@/app/components/ScriptGenrator";

export default function AdminScriptGeneratorPage() {
  const { locale } = useParams();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Script Generator</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Generate your one-line embed script and paste it inside your website head section.
        </p>
      </div>

      <div className="max-w-4xl rounded-xl border border-slate-700 bg-slate-900/70 p-5">
        <div className="mb-4 rounded-lg border border-slate-600 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
          Copy the script exactly as generated to ensure your chatbot initializes correctly.
        </div>
        <ScriptGenerator locale={locale || "ar"} />
      </div>
    </section>
  );
}
