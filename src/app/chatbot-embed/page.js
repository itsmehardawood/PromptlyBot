import { Suspense } from "react";
import ChatbotEmbedClient from "./chatbot-embed-client";

export default function ChatbotEmbedPage() {
  return (
    <Suspense fallback={null}>
      <ChatbotEmbedClient />
    </Suspense>
  );
}
