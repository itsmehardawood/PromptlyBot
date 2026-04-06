import {
  Bot,
  Cable,
  FileText,
  Languages,
  Settings,
  Wrench,
} from "lucide-react";

const features = [
  {
    title: "No-code setup",
    description: "Define your business details, voice, and FAQs from a simple form.",
    icon: FileText,
  },
  {
    title: "Smart FAQ handling",
    description: "Your bot answers common client questions 24/7 with consistent tone.",
    icon: Bot,
  },
  {
    title: "Quick website embed",
    description: "Copy one script and paste it into your site head section.",
    icon: Cable,
  },
  {
    title: "Multilingual support",
    description: "Help clients in multiple languages from one unified dashboard.",
    icon: Languages,
  },
  {
    title: "Editable system prompts",
    description: "Fine-tune assistant behavior whenever your business changes.",
    icon: Settings,
  },
  {
    title: "Business-focused",
    description: "Designed for agencies, consultants, clinics, and local services.",
    icon: Wrench,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="flex min-h-screen items-center px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Everything needed to launch fast</h2>
          <p className="mt-4 text-slate-300">
            Essential tools to create, refine, and deploy your chatbot without technical overhead.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
            <article key={feature.title} className="rounded-xl border border-slate-700 bg-slate-900/70 p-5">
              <div className="mb-3 inline-flex rounded-lg border border-cyan-500/40 bg-cyan-500/10 p-2 text-cyan-300">
                <Icon size={18} />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{feature.description}</p>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
