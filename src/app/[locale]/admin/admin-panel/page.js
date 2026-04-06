"use client";

import ServicesAdminPanel from "@/app/components/admin/ServicesAdminPanel";

export default function AdminPanelTabPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <p className="mt-1 text-sm text-slate-300">
          Service list, edits, and status controls are available below.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
        <ServicesAdminPanel />
      </div>
    </section>
  );
}
