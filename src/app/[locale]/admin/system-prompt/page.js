"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, Zap, BookOpen, Brain, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";
import SystemPromptButton from "@/app/components/SystemPromptButton";

export default function AdminSystemPromptPage() {
  const { locale } = useParams();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "What is a System Prompt?",
      answer:
        "A system prompt defines how your AI assistant behaves, responds, and communicates with users. It sets the tone, guidelines, and constraints for all conversations.",
    },
    {
      question: "How do I write an effective system prompt?",
      answer:
        "Be clear about the role, tone, and constraints. Include specific instructions for handling edge cases. Use the &apos;AI Tailor Prompt&apos; feature to automatically improve your prompt using AI.",
    },
    {
      question: "What&apos;s the difference between System Prompt and Q&A?",
      answer:
        "System Prompt defines overall behavior and personality. Q&A items are specific question-answer pairs that handle common customer questions directly.",
    },
    {
      question: "Can I use AI to improve my prompt?",
      answer:
        "Yes! Click &apos;AI Tailor Prompt&apos; to have OpenAI enhance your prompt with professional structure, clarity, and best practices.",
    },
    {
      question: "How often should I update my system prompt?",
      answer:
        "Review and update quarterly or when you notice the assistant&apos;s responses aren&apos;t meeting expectations. Use analytics to identify improvement areas.",
    },
  ];

  const bestPractices = [
    {
      title: "Define Clear Role & Persona",
      description: "Specify exactly what the assistant is and what it&apos;s responsible for.",
      icon: "🎭",
    },
    {
      title: "Set Tone & Communication Style",
      description: "Be explicit about whether responses should be formal, friendly, technical, etc.",
      icon: "💬",
    },
    {
      title: "Add Safety Guidelines",
      description: "Instruct the assistant how to handle sensitive topics, unknown questions, and edge cases.",
      icon: "🛡️",
    },
    {
      title: "Keep it Concise & Usable",
      description: "Avoid overly long prompts. Focus on the most important behavioral guidelines.",
      icon: "✨",
    },
  ];

  return (
    <section className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-white">System Prompt Management</h1>
        <p className="mt-2 max-w-3xl text-base leading-6 text-slate-300">
          Define your assistant&apos;s personality, behavior, and response guidelines. A well-crafted system prompt ensures consistent, professional, and on-brand interactions with your customers.
        </p>
      </div>

      {/* Quick Start Card */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-slate-900/60 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-cyan-100">Get Started in Minutes</h2>
            </div>
            <p className="mb-4 text-sm text-slate-300">
              Click below to open the System Prompt editor. Write, improve with AI, or manage your Q&A knowledge base all in one place.
            </p>
            <div className="flex gap-3">
              <SystemPromptButton locale={locale || "ar"} />
              <a
                href="#faq"
                className="rounded-lg border border-slate-600 bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="hidden rounded-lg bg-cyan-500/10 p-4 text-cyan-300 lg:block">
            <Brain className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1: Purpose */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 backdrop-blur">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
            <BookOpen className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="mb-2 font-semibold text-slate-100">Define Behavior</h3>
          <p className="text-sm leading-5 text-slate-400">
            Control how your assistant responds, what tone it uses, and how it handles various scenarios.
          </p>
        </div>

        {/* Card 2: Consistency */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 backdrop-blur">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
            <CheckCircle2 className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="mb-2 font-semibold text-slate-100">Ensure Consistency</h3>
          <p className="text-sm leading-5 text-slate-400">
            Every conversation follows your guidelines, maintaining brand voice and quality standards.
          </p>
        </div>

        {/* Card 3: AI Enhancement */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5 backdrop-blur">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20">
            <Lightbulb className="h-5 w-5 text-pink-400" />
          </div>
          <h3 className="mb-2 font-semibold text-slate-100">AI Optimization</h3>
          <p className="text-sm leading-5 text-slate-400">
            Use our AI Tailor feature to automatically improve your prompt with professional best practices.
          </p>
        </div>
      </div>

      {/* Best Practices Section */}
      <div>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-white">Best Practices</h2>
          <p className="mt-1 text-sm text-slate-400">Follow these guidelines to create an effective system prompt</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {bestPractices.map((practice, index) => (
            <div key={index} className="rounded-xl border border-slate-700 bg-slate-950/40 p-5 transition hover:border-slate-600 hover:bg-slate-950/60">
              <div className="mb-3 text-2xl">{practice.icon}</div>
              <h3 className="mb-2 font-semibold text-slate-100">{practice.title}</h3>
              <p className="text-sm leading-5 text-slate-400">{practice.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features Section */}
      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
        <h2 className="mb-5 text-2xl font-bold text-white">Key Features in Editor</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-slate-100">View & Edit Mode</p>
              <p className="text-xs text-slate-400">Switch between professional read-only view and edit mode</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-slate-100">AI Tailor Prompt</p>
              <p className="text-xs text-slate-400">Let OpenAI enhance your prompt automatically</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-slate-100">Q&A Knowledge Base</p>
              <p className="text-xs text-slate-400">Add common questions and answers for faster responses</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-slate-100">Live Publishing</p>
              <p className="text-xs text-slate-400">Changes take effect immediately after saving</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="mt-1 text-sm text-slate-400">Find answers to common questions about system prompts</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border border-slate-700 bg-slate-950/40 overflow-hidden transition hover:border-slate-600">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-900/50"
              >
                <span className="font-medium text-slate-100">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedFaq === index && (
                <div className="border-t border-slate-700 bg-slate-900/30 px-5 py-4">
                  <p className="text-sm leading-6 text-slate-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tip Banner */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-100">Pro Tip: Workflow Order</p>
            <p className="mt-1 text-sm text-amber-200">
              1) Create and refine your system prompt first, 2) Use &quot;AI Tailor Prompt&quot; to optimize it, 3) Then add Q&amp;A items to cover common questions. This ensures consistency across your assistant&apos;s responses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
