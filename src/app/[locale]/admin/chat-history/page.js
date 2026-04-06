"use client";

import ChatHistory from "@/app/components/chathistory";

export default function AdminChatHistoryPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Chat History</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Review all chatbot sessions and user conversations.
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
        <div className="mb-4 rounded-lg border border-slate-600 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
          Sessions are sorted from newest to oldest. Open any card to inspect full conversation details.
        </div>
        <ChatHistory />
      </div>
    </section>
  );
}
