import { redirect } from "next/navigation";

export default function AdminIndexPage({ params }) {
  redirect(`/${params.locale}/admin/home`);
}
