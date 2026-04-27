"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatbotWidget from "@/app/components/chatbot_widget";

export default function ChatbotEmbedClient() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = searchParams.get("userId");
    setUserId(id);
  }, [searchParams]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !userId) {
    return null;
  }

  return (
    <ChatbotWidget
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      propUserId={userId}
      locale="en"
    />
  );
}
