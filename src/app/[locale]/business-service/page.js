import { redirect } from "next/navigation";

export default function LegacyBusinessServicePage({ params }) {
  redirect(`/${params.locale}/admin/business-service`);
}
