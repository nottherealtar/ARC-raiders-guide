import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ActivityLogsList } from "./ActivityLogsList";

export default async function AdminActivityLogsPage() {
  const session = await auth();

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return <ActivityLogsList />;
}
