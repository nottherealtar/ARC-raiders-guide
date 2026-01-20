import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SettingsPage } from "./SettingsPage";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <SettingsPage />;
}
