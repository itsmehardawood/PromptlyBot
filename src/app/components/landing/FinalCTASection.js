import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="flex min-h-screen items-center bg-white px-6 pb-20 pt-10">
      <div className="mx-auto max-w-6xl bg-cyan-900 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-600/20 via-slate-900 to-slate-900 p-8 md:p-12">
        <h2 className="max-w-3xl text-3xl font-bold text-white md:text-4xl">
          Ready to launch your AI chatbot and capture more leads?
        </h2>
        <p className="mt-3 max-w-2xl text-slate-200">
          Build your PromptlyBot in minutes and start responding to visitors around the clock.
        </p>

        <div className="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
          <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-300" /> No-code setup for non-technical teams</p>
          <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-cyan-300" /> Plug-and-play website integration</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/en/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Start free
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/en/login"
            className="rounded-lg border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-200"
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
}
