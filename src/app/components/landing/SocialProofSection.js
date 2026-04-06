import { Clock3, Globe, Headset, Link2 } from "lucide-react";

const stats = [
  { value: "10 min", label: "Average setup time", icon: Clock3 },
  { value: "24/7", label: "Automated client responses", icon: Headset },
  { value: "1 line", label: "Website embed script", icon: Link2 },
  { value: "Multi", label: "Language support", icon: Globe },
];

export default function SocialProofSection() {
  return (
    <section className="flex min-h-screen items-center border-y border-slate-200 bg-white px-6 py-12">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Performance Snapshot</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Built for fast deployment and measurable engagement
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
            Teams choose PromptlyBot for immediate launch speed, consistent response quality, and scalable client conversations.
          </p>
        </div>

        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
              <div className="mb-2 flex justify-center text-cyan-700">
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-cyan-700">{item.value}</p>
              <p className="mt-1 text-sm text-slate-600">{item.label}</p>
            </div>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Lead-Ready Conversations</h3>
            <p className="mt-2 text-sm text-slate-600">Capture visitor intent early and route high-value inquiries faster.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Reliable Brand Tone</h3>
            <p className="mt-2 text-sm text-slate-600">Keep replies aligned with your service style through prompt controls.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Simple Maintenance</h3>
            <p className="mt-2 text-sm text-slate-600">Update FAQs, services, and behavior without developer dependency.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
