import { ClipboardList, FileQuestion, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Configure your bot",
    description: "Add your business details, tone, and objectives in a guided form.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Add FAQs and service info",
    description: "Train the assistant with the exact questions clients keep asking.",
    icon: FileQuestion,
  },
  {
    step: "03",
    title: "Generate script and publish",
    description: "Paste one line into your site and start engaging visitors instantly.",
    icon: Rocket,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="flex min-h-screen items-center bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 md:p-10">
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">How PromptlyBot works</h2>
        <p className="mt-3 max-w-2xl text-slate-600">From setup to live chatbot in three straightforward steps.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
            <article key={item.step} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-3 inline-flex rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-cyan-700">
                <Icon size={18} />
              </div>
              <p className="text-xs font-semibold tracking-[0.2em] text-cyan-700">STEP {item.step}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
            );
          })}
        </div>

        <div id="results" className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">What you get after setup</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
            <p>Live assistant ready on your website</p>
            <p>Structured answers for common client questions</p>
            <p>Consistent communication tone per brand</p>
            <p>Actionable conversations that qualify leads</p>
          </div>
        </div>
      </div>
    </section>
  );
}
