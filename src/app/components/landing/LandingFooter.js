import Link from "next/link";
import { BadgeCheck, Mail } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-400 md:flex-row">
        <p>PromptlyBot © 2026. All rights reserved.</p>
        <div className="flex items-center gap-5 text-slate-300">
          <span className="hidden items-center gap-1 md:inline-flex">
            <BadgeCheck size={14} className="text-cyan-300" />
            Trusted by service teams
          </span>
          <span className="hidden items-center gap-1 md:inline-flex">
            <Mail size={14} className="text-cyan-300" />
            support@promptlybot.ai
          </span>
          <Link href="/en/login" className="transition hover:text-slate-100">
            Login
          </Link>
          <Link href="/en/signup" className="transition hover:text-slate-100">
            Signup
          </Link>
          <a href="#features" className="transition hover:text-slate-100">
            Features
          </a>
        </div>
      </div>
    </footer>
  );
}
