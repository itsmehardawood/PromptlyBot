"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ChatbotWidget from "@/app/components/chatbot_widget";
import { Sparkles, Bot, ShieldCheck } from "lucide-react";

export default function AdminHomePage() {
  const { locale } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
      <div className="absolute inset-0 opacity-30">
        <Image src="/images/newimg.jpg" alt="Dashboard background" fill className="object-cover" priority />
      </div>
      <div className="absolute inset-0 bg-slate-950/80" />

      <section className="relative z-10 p-6 lg:p-10">
        <div className="mb-8 flex items-center gap-4">
          <Image src="/images/logo.png" width={50} height={50} alt="PromptlyBot logo" />
          <div>
            <h1 className="text-2xl font-bold text-white lg:text-3xl">Welcome to your Admin Home</h1>
            <p className="text-sm text-slate-300">Use the sidebar to switch between management sections.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <Sparkles className="mb-3 text-cyan-300" size={20} />
            <h2 className="text-base font-semibold text-white">Fast Setup</h2>
            <p className="mt-1 text-sm text-slate-300">Manage services, prompts, and scripts from one place.</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <Bot className="mb-3 text-cyan-300" size={20} />
            <h2 className="text-base font-semibold text-white">Chat Preview</h2>
            <p className="mt-1 text-sm text-slate-300">Test the assistant responses instantly from this dashboard.</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <ShieldCheck className="mb-3 text-cyan-300" size={20} />
            <h2 className="text-base font-semibold text-white">Secure Access</h2>
            <p className="mt-1 text-sm text-slate-300">Your admin area remains protected with login validation.</p>
          </article>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={() => setIsChatOpen((prev) => !prev)}
            className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {isChatOpen ? "Close Chat Preview" : "Open Chat Preview"}
          </button>
        </div>
      </section>

      {isChatOpen && (
        <ChatbotWidget
          locale={locale || "ar"}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}
