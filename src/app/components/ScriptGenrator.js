"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/translations";

export default function ScriptGenerator({ locale }) {
  const [userId, setUserId] = useState("");
  const [scriptTag, setScriptTag] = useState("");
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false); // Toggle state

  const t = useTranslation(locale);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.user_id);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);

  const toggleScript = () => {
    if (!showScript) {
      const origin = window.location.origin;
      const script = `<script src="${origin}/api/chatbot-widget?userId=${userId}" async></script>`;
      setScriptTag(script);
      setCopied(false);
    }
    setShowScript(!showScript);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl rounded-2xl border border-slate-700 bg-slate-950/70 p-4 backdrop-blur-md">
      <button
        onClick={toggleScript}
        disabled={!userId}
        className="mb-4 w-full rounded-xl bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 px-4 py-3 text-base font-semibold text-white shadow-md transition duration-300 hover:from-slate-800 hover:to-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {showScript ? t("Close") : t("GenerateScriptTag")}
      </button>

      {!userId && (
        <p className="mb-3 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          User session not found yet. Please log in again if this message persists.
        </p>
      )}

      {showScript && scriptTag && (
        <div className="space-y-4">
          <p className="font-medium text-slate-100">
            {t("Copy and Paste")}:
          </p>
          <textarea
            value={scriptTag}
            readOnly
            rows={5}
            className="w-full resize-none rounded-lg border border-slate-600 bg-slate-900 p-3 text-sm text-slate-100 focus:outline-none"
          />
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={copyToClipboard}
              className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400"
            >
              {copied ? t("Copied") : t("Copy")}
            </button>
            {copied && <span className="text-sm text-emerald-300">Script copied successfully.</span>}
          </div>
        </div>
      )}
    </div>
  );
}
