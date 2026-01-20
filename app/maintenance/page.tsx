import { Wrench, Home } from "lucide-react";
import Link from "next/link";
import { getMaintenanceMessage } from "@/lib/services/settings-service";

export default async function MaintenancePage() {
  const message = await getMaintenanceMessage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-2xl">
            <Wrench className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            الموقع تحت الصيانة
          </h1>
          <p className="text-lg text-muted-foreground">
            Site Under Maintenance
          </p>
        </div>

        {/* Message */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
          <p className="text-lg text-foreground leading-relaxed">{message}</p>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            نعمل على تحسين الموقع لتقديم تجربة أفضل. شكراً لصبركم.
          </p>
          <p className="text-xs text-muted-foreground">
            We are working to improve the site for a better experience. Thank you
            for your patience.
          </p>
        </div>

        {/* Back to Home Link (for when maintenance is disabled) */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <Home className="h-4 w-4" />
          <span>العودة للرئيسية</span>
          <span className="text-muted-foreground">(Back to Home)</span>
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}
