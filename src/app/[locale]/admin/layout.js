"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  Settings2,
  MessagesSquare,
  MessageSquareText,
  Code2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import AuthLanguageSwitcher from "@/app/components/AuthLanguageSwitcher";

const sidebarItems = [
  { key: "home", label: "Home", href: "home", icon: LayoutGrid },
  { key: "business", label: "Business Service", href: "business-service", icon: Briefcase },
  { key: "admin-panel", label: "Services", href: "admin-panel", icon: Settings2 },
  { key: "chat-history", label: "Chat History", href: "chat-history", icon: MessagesSquare },
  { key: "system", label: "System Prompt", href: "system-prompt", icon: MessageSquareText },
  { key: "script", label: "Script Generator", href: "script-generator", icon: Code2 },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    setIsAuthReady(true);
  }, [locale, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push(`/${locale}/login`);
  };

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-400/30 border-t-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-4 top-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-100 shadow-lg lg:hidden"
      >
        <Menu size={18} />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800 bg-slate-900/95 p-4 backdrop-blur transition-transform duration-200 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <Link href={`/${locale}/admin/home`} className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="PromptlyBot logo" width={34} height={34} priority />
            <div>
              <p className="text-sm font-semibold text-slate-100">PromptlyBot</p>
              <p className="text-xs text-slate-400">Admin Dashboard</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-300 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const target = `/${locale}/admin/${item.href}`;
            const isActive = pathname === target;

            return (
              <Link
                key={item.key}
                href={target}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40"
                    : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                }`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-slate-800 pt-4">
          <div className="mb-4 ">
            <AuthLanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/55 lg:hidden"
        />
      )}

      <main className="min-h-screen p-4 pt-16 lg:ml-72 lg:p-8 lg:pt-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-2xl shadow-cyan-950/30 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
