"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/translations";
import { apiUrl } from "@/lib/api";

export default function ChatbotWidget({ locale, isOpen, onClose, propUserId, onOpen }) {
  const [sessionId, setSessionId] = useState(""); // New state for session ID
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPreChatForm, setShowPreChatForm] = useState(true);
  const [userId, setUserId] = useState(propUserId || "");

  // console.log("ChatbotWidget rendered with isOpen:", isOpen);
  
  // UseEffect to set userId from localStorage token if propUserId is not passed
  useEffect(() => {
    if (propUserId) return; // Don't run if userId is passed as a prop

    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUserId(decoded.user_id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [propUserId]);

  const messagesEndRef = useRef(null);
  const t = useTranslation(locale);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("access_token")
          ? { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
          : {}),
        },
        body: JSON.stringify({
          user_id: userId,
          query: message,
          session_id: sessionId, // Include session ID in the request
        }),
      });
      // console.log('API Response:', res);


      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || t("chatError"));

      const responseMessage = formatChatbotResponse(data.response);

      setMessages((prev) => [
        ...prev,
        { text: responseMessage, sender: "bot" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        { text: err.message || t("chatError"), sender: "bot", isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatChatbotResponse = (response) => {
    return response.split("\n").map((line, index) => (
      <p key={index} className="whitespace-pre-line">
        {line}
      </p>
    ));
  };

  const handleStartChat = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(apiUrl("/chat/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone_number: phoneNumber,
          user_id: userId, // ✅ ADD THIS

        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.detail || "Failed to start chat session");

      setSessionId(data.session_id);
      localStorage.setItem("session_id", data.session_id);
      setShowPreChatForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-4 right-2 sm:right-4 z-50 text-slate-100" id="chatbot-widget-container">
          <div className="relative mb-2 w-[calc(100vw-1rem)] max-w-md sm:mr-4 sm:w-[calc(100vw-2rem)]">
            <div className="flex flex-col h-[500px] w-full bg-slate-950 border border-slate-700 shadow-2xl shadow-slate-950/50 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-4 relative">
                <div>
                  <h1 className="text-lg font-semibold text-slate-100">{t("chatbotTitle")}</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Always here to help</p>
                </div>

              {/* Minimize and Close buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-200 transition"
                  title="Minimize"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setMessages([]);
                    setShowPreChatForm(true);
                    setFullName("");
                    setEmail("");
                    setPhoneNumber("");
                    setSessionId("");
                    onClose();
                  }}
                  className="text-slate-400 hover:text-slate-200 transition"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {showPreChatForm ? (
              <form
                onSubmit={handleStartChat}
                className="flex-1 p-8 space-y-4 overflow-y-auto bg-slate-950 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-100 text-center mb-2">
                    {t("startChat")}
                  </h2>
                  <p className="text-xs text-slate-400 text-center mb-5">
                    Share your details to get started
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-2">
                        {t("fullName")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("fullName")}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-2">
                        {t("email")}
                      </label>
                      <input
                        type="email"
                        placeholder={t("email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-2">
                        {t("phoneNumber")}
                      </label>
                      <input
                        type="tel"
                        placeholder={t("phoneNumber")}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md shadow-cyan-950/30 transition duration-200"
                >
                  {t("start")}
                </button>
              </form>
            ) : (
              <>
                <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 space-y-4">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="mb-3 text-3xl">💬</div>
                        <p className="text-sm text-slate-400">{t("chatWelcomeMessage")}</p>
                      </div>
                    </div>
                  )}

                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-5 ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none"
                            : msg.isError
                            ? "bg-rose-500/20 text-rose-200 border border-rose-500/30 rounded-bl-none"
                            : "bg-slate-800 text-slate-100 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-lg rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="border-t border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("askAnything")}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition disabled:opacity-50"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !message.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-md shadow-cyan-950/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("send")}
                    </button>
                  </div>
                </form>
              </>
            )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={() => onOpen && onOpen()}
              className="group inline-flex items-center gap-2 rounded-full bg-cyan-600 px-6 py-3 text-white shadow-lg shadow-cyan-950/40 transition-all duration-300 hover:bg-cyan-500 hover:shadow-cyan-950/50"
              aria-label={t("chatbotTitle")}
              title={t("chatbotTitle")}
            >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg transition-transform duration-300 group-hover:scale-105">
              💬
            </span>
            <span className="text-sm font-semibold tracking-wide">Chat now</span>
          </button>
        </div>
      )}
    </>
  );
}
