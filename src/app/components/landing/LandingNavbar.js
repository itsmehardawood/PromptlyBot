import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="PromptlyBot logo" width={36} height={36} priority />
          <span className="text-lg font-semibold tracking-wide text-white">PromptlyBot</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">Features</a>
          <a href="#how-it-works" className="transition hover:text-white">How it works</a>
          <a href="#results" className="transition hover:text-white">Results</a>
          <a href="#faq" className="transition hover:text-white">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200 lg:inline-flex">
            <Sparkles size={14} />
            AI-ready setup
          </span>
          <Link
            href="/en/login"
            className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-300 hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/en/signup"
            className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
