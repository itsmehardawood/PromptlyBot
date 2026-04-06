"use client";

import { useParams, useRouter } from "next/navigation";
import BusinessServiceForm from "@/app/components/admin/BusinessServiceForm";

export default function AdminBusinessServicePage() {
  const router = useRouter();
  const { locale } = useParams();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Business Service</h1>
        <p className="mt-1 text-sm text-slate-300">
          Manage your business services inside this panel.
        </p>
      </div>

      <BusinessServiceForm
        locale={locale || "ar"}
        compact
        onDone={() => router.push(`/${locale}/admin/home`)}
      />
    </section>
  );
}
