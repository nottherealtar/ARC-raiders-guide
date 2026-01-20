"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from "date-fns";
import { ar } from "date-fns/locale";
import { Eye, Activity } from "lucide-react";
import { getActivityTypeStyle } from "@/lib/utils/chart-formatters";
import * as LucideIcons from "lucide-react";

interface User {
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
  user: User | null;
  targetUser: User | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  created_at: string;
}

interface ActivityLogTableProps {
  logs: ActivityLog[];
  onViewDetails: (log: ActivityLog) => void;
}

export function ActivityLogTable({ logs, onViewDetails }: ActivityLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>لا توجد نشاطات مطابقة للفلاتر المحددة</p>
        <p className="text-sm">No activities match the selected filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">النوع</TableHead>
            <TableHead>المستخدم</TableHead>
            <TableHead>النشاط</TableHead>
            <TableHead>المستهدف</TableHead>
            <TableHead>التاريخ</TableHead>
            <TableHead className="w-[80px]">تفاصيل</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const style = getActivityTypeStyle(log.type);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const IconComponent = (LucideIcons as any)[style.icon] || Activity;
            const displayName =
              log.user?.username || log.user?.name || log.user?.email || "النظام";

            return (
              <TableRow key={log.id}>
                {/* Type Icon */}
                <TableCell>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.bgColor}`}
                  >
                    <IconComponent
                      className="h-5 w-5"
                      style={{ color: style.color }}
                    />
                  </div>
                </TableCell>

                {/* User */}
                <TableCell>
                  {log.user ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={log.user.image || ""} />
                        <AvatarFallback className="text-xs">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{displayName}</span>
                        {log.user.role === "ADMIN" && (
                          <Badge variant="destructive" className="text-xs w-fit">
                            مشرف
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">النظام (System)</span>
                  )}
                </TableCell>

                {/* Activity */}
                <TableCell>
                  <div className="flex flex-col max-w-[300px]">
                    <span className="text-sm font-medium truncate">
                      {log.actionAr}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {log.action}
                    </span>
                  </div>
                </TableCell>

                {/* Target User */}
                <TableCell>
                  {log.targetUser ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={log.targetUser.image || ""} />
                        <AvatarFallback className="text-xs">
                          {(log.targetUser.username || log.targetUser.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {log.targetUser.username || log.targetUser.name}
                      </span>
                    </div>
                  ) : log.relatedEntityType ? (
                    <span className="text-xs text-muted-foreground">
                      {log.relatedEntityType}: {log.relatedEntityId?.slice(0, 8)}...
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>

                {/* Date */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDistanceToNow(new Date(log.created_at), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), "yyyy/MM/dd HH:mm")}
                    </span>
                  </div>
                </TableCell>

                {/* Details Button */}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(log)}
                    title="عرض التفاصيل"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
