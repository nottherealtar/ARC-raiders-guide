"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Copy,
  User,
  Target,
  Clock,
  Globe,
  Monitor,
  FileJson,
  Activity,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getActivityTypeStyle } from "@/lib/utils/chart-formatters";
import * as LucideIcons from "lucide-react";

interface UserData {
  id: string;
  username: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
}

interface ActivityLog {
  id: string;
  type: string;
  action: string;
  actionAr: string;
  user: UserData | null;
  targetUser: UserData | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  created_at: string;
}

interface ActivityLogDetailDialogProps {
  log: ActivityLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityLogDetailDialog({
  log,
  open,
  onOpenChange,
}: ActivityLogDetailDialogProps) {
  const { toast } = useToast();

  if (!log) return null;

  const style = getActivityTypeStyle(log.type);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[style.icon] || Activity;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: `تم نسخ ${label} إلى الحافظة`,
    });
  };

  const renderUserCard = (user: UserData | null, title: string, titleEn: string) => {
    if (!user) return null;

    const displayName = user.username || user.name || user.email || "مستخدم";

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {title === "المستخدم" ? (
              <User className="h-4 w-4" />
            ) : (
              <Target className="h-4 w-4" />
            )}
            <div className="flex flex-col">
              <span>{title}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {titleEn}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{displayName}</span>
                {user.role === "ADMIN" && (
                  <Badge variant="destructive" className="text-xs">
                    مشرف
                  </Badge>
                )}
              </div>
              {user.email && (
                <p className="text-xs text-muted-foreground">{user.email}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">ID:</span>
            <code className="text-xs bg-muted px-1 rounded">{user.id}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => copyToClipboard(user.id, "معرف المستخدم")}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.bgColor}`}
            >
              <IconComponent className="h-5 w-5" style={{ color: style.color }} />
            </div>
            <div className="flex flex-col">
              <span>تفاصيل النشاط</span>
              <span className="text-sm font-normal text-muted-foreground">
                Activity Details
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Activity Info */}
          <Card>
            <CardContent className="pt-4 space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">النشاط (Activity)</p>
                <p className="text-foreground">{log.actionAr}</p>
                <p className="text-sm text-muted-foreground">{log.action}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{log.type}</Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {format(new Date(log.created_at), "yyyy/MM/dd HH:mm:ss", {
                    locale: ar,
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {renderUserCard(log.user, "المستخدم", "User")}
            {renderUserCard(log.targetUser, "المستهدف", "Target User")}
          </div>

          {/* Related Entity */}
          {log.relatedEntityType && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>الكيان المرتبط</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Related Entity
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">النوع (Type)</p>
                    <p className="text-sm font-medium">{log.relatedEntityType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">المعرف (ID)</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {log.relatedEntityId}
                      </code>
                      {log.relatedEntityId && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() =>
                            copyToClipboard(log.relatedEntityId!, "معرف الكيان")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileJson className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>البيانات الإضافية</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Metadata
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Technical Info */}
          {(log.ipAddress || log.userAgent) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>معلومات تقنية</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Technical Info
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {log.ipAddress && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        عنوان IP (IP Address)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {log.ipAddress}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => copyToClipboard(log.ipAddress!, "عنوان IP")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                {log.userAgent && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        وكيل المستخدم (User Agent)
                      </span>
                    </div>
                    <p className="text-xs bg-muted p-2 rounded break-all">
                      {log.userAgent}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Log ID */}
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
            <span>معرف السجل: {log.id}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => copyToClipboard(log.id, "معرف السجل")}
            >
              <Copy className="h-3 w-3 ml-1" />
              نسخ المعرف
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
