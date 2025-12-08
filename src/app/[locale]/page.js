"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/translations";
import Image from "next/image";
import ChatbotWidget from "../components/chatbot_widget";
import WhatsAppButton from "../components/Whatspp";
import ScriptGenerator from "../components/ScriptGenrator";
import Navbar from "../components/Navbar";
import SystemPromptButton from "../components/SystemPromptButton";

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const params = useParams();
  const locale = params?.locale || "ar";
  const t = useTranslation(locale);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push(`/${locale}/login`);
    } else {
      setLoading(false);
    }
  }, [locale, router]);

  const decodeJWT = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  if (loading) return <p>{t("loading")}</p>;

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen flex flex-col items-center justify-start py-24 px-6 text-white">
        {/* Background image */}
        <Image
          src="/images/newimg.jpg"
          alt="Tech background"
          fill
          className="object-cover opacity-20 z-0"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0  bg-slate-900/85 z-10" />

        {/* Main content */}
        <div className="relative z-20 flex flex-col items-center gap-6 w-full max-w-xs">
          <Image
            src="/images/pic.png"
            height={300}
            width={350}
            alt="this is our logo"
            priority
          />

          {/* Floating button to toggle the chat widget */}
          <div
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="fixed bottom-4 right-4 bg-teal-600 text-white p-4 rounded-full shadow-lg cursor-pointer z-50"
          >
            <span className="text-2xl">💬</span>
          </div>

          {isChatOpen && (
            <ChatbotWidget
              locale={locale}
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
          )}

          {/* <WhatsAppButton /> */}

          <button
            onClick={() => router.push(`/${locale}/admin-panel`)}
            className="w-full py-2 px-6 text-lg font-semibold text-white bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 hover:from-slate-800 hover:to-teal-900 rounded-xl transition duration-300 shadow-md"
          >
            {t("AdminPanel")}
          </button>

          <button
            onClick={() => router.push(`/${locale}/business-service`)}
            className="w-full py-2 px-6 text-lg font-semibold text-white bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 hover:from-slate-800 hover:to-teal-900 rounded-xl transition duration-300 shadow-md"
          >
            {t("manageBusiness")}
          </button>

          <SystemPromptButton locale={locale} />

          <ScriptGenerator userId={userId} locale={locale} />
        </div>
      </div>
    </>
  );
}
