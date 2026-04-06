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

  console.log("ChatbotWidget rendered with isOpen:", isOpen);
  
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
      console.log('API Response:', res);


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
        <div className="fixed bottom-4 right-4 z-50 text-black" id="chatbot-widget-container">
          <div className="relative mb-2 mr-4">
            <div className="flex flex-col h-[500px] max-w-full w-full sm:max-w-xl bg-white shadow-md rounded-2xl overflow-hidden">
              <div className="p-4 bg-teal-600 text-white relative">
              <h1 className="text-xl font-bold">{t("chatbotTitle")}</h1>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                ✖
              </button>
            </div>

            {showPreChatForm ? (
              <form
                onSubmit={handleStartChat}
                className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50"
              >
                <h2 className="text-lg font-semibold text-center">
                  {t("startChat")}
                </h2>
                <input
                  type="text"
                  placeholder={t("fullName")}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                <input
                  type="email"
                  placeholder={t("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                <input
                  type="tel"
                  placeholder={t("phoneNumber")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl w-full"
                >
                  {t("start")}
                </button>
              </form>
            ) : (
              <>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        {t("chatWelcomeMessage")}
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
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === "user"
                              ? "bg-teal-500 text-white rounded-br-none"
                              : msg.isError
                              ? "bg-red-100 text-red-800 rounded-bl-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-gray-200"
                >
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("askAnything")}
                      className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 text-black focus:ring-teal-500"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !message.trim()}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
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
            <div
              onClick={() => onOpen && onOpen()}
              className="bg-teal-600 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg cursor-pointer hover:bg-teal-700 transition-colors"
            >
            <span className="text-2xl">💬</span>
          </div>
        </div>
      )}
    </>
  );
}
