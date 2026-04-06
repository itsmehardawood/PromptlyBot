import { redirect } from "next/navigation";

export default function LegacyAdminPanelPage({ params }) {
  redirect(`/${params.locale}/admin/admin-panel`);
}
