import Link from "next/link";
import { CheckCircle2, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-16 md:pt-24">
      <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            No-code AI chatbot builder
          </p>

          <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Turn website visitors into booked clients automatically.
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-slate-300">
            PromptlyBot helps service providers launch a smart, multilingual chatbot in minutes. No coding,
            no developer handoff, no complex setup.
          </p>

          <div className="grid max-w-xl gap-2 text-sm text-slate-200 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2">
              <CheckCircle2 size={16} className="text-cyan-300" />
              Instant setup workflow
            </div>
            <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2">
              <ShieldCheck size={16} className="text-cyan-300" />
              Secure dashboard access
            </div>
            <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2">
              <MessageSquare size={16} className="text-cyan-300" />
              Lead-focused conversations
            </div>
            <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 px-3 py-2">
              <Zap size={16} className="text-cyan-300" />
              Publish in one script
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/en/signup"
              className="rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Create chatbot now
            </Link>
            <Link
              href="/en/login"
              className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:text-white"
            >
              Open dashboard
            </Link>
          </div>

          <p className="text-sm text-slate-400">Set up in under 10 minutes.</p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/50">
          <div className="mb-4 rounded-lg border border-slate-700 bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-cyan-300">Live chat preview</p>
            <p className="mt-3 text-sm text-slate-200">Hi! What services do you offer?</p>
            <p className="mt-2 rounded-lg bg-slate-800 p-3 text-sm text-slate-100">
              We provide branding, social media strategy, and content packages. Want to see pricing?
            </p>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
              <p className="text-xl font-bold text-cyan-300">24/7</p>
              <p className="text-xs text-slate-400">Response coverage</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
              <p className="text-xl font-bold text-cyan-300">3x</p>
              <p className="text-xs text-slate-400">Faster qualification</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
              <p className="text-xl font-bold text-cyan-300">10m</p>
              <p className="text-xs text-slate-400">Average launch time</p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">Multilingual responses</div>
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">FAQ trained answers</div>
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">One-line embed script</div>
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-3">Lead-ready conversations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
