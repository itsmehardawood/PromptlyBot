"use client";

import { useParams } from "next/navigation";
import SystemPromptButton from "@/app/components/SystemPromptButton";

export default function AdminSystemPromptPage() {
  const { locale } = useParams();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">System Prompt</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Configure assistant behavior, tone, and reusable Q&A knowledge from one focused workspace.
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
        <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
          Tip: update prompt instructions first, then manage Q&A so responses stay aligned.
        </div>

        <div className="max-w-sm">
          <SystemPromptButton locale={locale || "ar"} />
        </div>
      </div>
    </section>
  );
}
