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
      const script = `<script src="https://chatbot.neurovisesolutions.com/${locale}/api/chatbot-widget?userId=${userId}" async></script>`;
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
    <div className="max-w-2xl mx-auto  rounded-3xl backdrop-blur-md ">
      <button
        onClick={toggleScript}
        className="w-full py-2 px-19 mb-6 text-lg font-semibold text-white bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 hover:from-slate-800 hover:to-teal-900 rounded-xl transition duration-300 shadow-md"
      >
        {showScript ? t("Close") : t("GenerateScriptTag")}
      </button>

      {showScript && scriptTag && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-white font-medium">
            {t("Copy and Paste")}:
          </p>
          <textarea
            value={scriptTag}
            readOnly
            rows={5}
            className="w-full bg-gray-800 text-white text-sm p-3 rounded-lg border border-white/20 resize-none focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            {copied ? t("Copied") : t("Copy")}
          </button>
        </div>
      )}
    </div>
  );
}
