import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isMaintenanceMode } from "@/lib/services/settings-service";

interface MaintenanceCheckProps {
  children: React.ReactNode;
}

// Routes that should bypass maintenance check
const bypassRoutes = [
  "/maintenance",
  "/admin",
  "/api",
  "/login",
  "/register",
  "/banned",
  "/unauthorized",
];

export async function MaintenanceCheck({ children }: MaintenanceCheckProps) {
  // Get current pathname from headers
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";

  // Check if current route should bypass maintenance
  const shouldBypass = bypassRoutes.some((route) => pathname.startsWith(route));

  if (shouldBypass) {
    return <>{children}</>;
  }

  // Check if maintenance mode is enabled
  let maintenanceEnabled = false;
  try {
    maintenanceEnabled = await isMaintenanceMode();
  } catch (error) {
    // If we can't check settings (e.g., DB connection issue), don't block
    console.error("Failed to check maintenance mode:", error);
    return <>{children}</>;
  }

  if (maintenanceEnabled) {
    // Get session to check if user is admin
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN";

    // Only redirect non-admin users to maintenance page
    if (!isAdmin) {
      redirect("/maintenance");
    }
  }

  return <>{children}</>;
}
