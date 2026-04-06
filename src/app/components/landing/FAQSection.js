"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp, MessageCircleMore } from "lucide-react";

const faqs = [
  {
    question: "Do I need coding experience to use PromptlyBot?",
    answer: "No. The setup flow is designed for non-technical users and includes guided fields.",
  },
  {
    question: "Can I update responses later?",
    answer: "Yes. You can edit your business information, FAQ answers, and system prompts anytime.",
  },
  {
    question: "How do I add the chatbot to my website?",
    answer: "PromptlyBot generates a one-line script tag that you paste into your site head section.",
  },
  {
    question: "Is this suitable for small businesses?",
    answer: "Absolutely. PromptlyBot is built for service providers, local businesses, and growing teams.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="flex min-h-screen items-center px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
            <CircleHelp size={14} className="text-cyan-300" />
            FAQ
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <article key={faq.question} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="flex w-full items-center justify-between gap-3 text-left"
                aria-expanded={openIndex === index}
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
                  <MessageCircleMore size={16} className="text-cyan-300" />
                  {faq.question}
                </h3>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-cyan-300 transition ${openIndex === index ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              {openIndex === index && (
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{faq.answer}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
