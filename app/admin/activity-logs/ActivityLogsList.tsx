"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Loader2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ActivityLogFilters } from "./components/ActivityLogFilters";
import { ActivityLogTable } from "./components/ActivityLogTable";
import { ActivityLogDetailDialog } from "./components/ActivityLogDetailDialog";

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function ActivityLogsList() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  // Dialog state
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        ...(search && { search }),
        ...(type !== "all" && { type }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/admin/activity-logs?${params}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.activityLogs);
        setPagination(data.pagination);
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تحميل سجل النشاطات",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل سجل النشاطات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, search, type, startDate, endDate]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(type !== "all" && { type }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/admin/activity-logs/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `activity-logs-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "تم التصدير",
          description: "تم تصدير سجل النشاطات بنجاح",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  const clearFilters = () => {
    setSearch("");
    setType("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
              سجل النشاطات
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Activity Logs
            </p>
          </div>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span>تصدير (Export)</span>
        </Button>
      </div>

      {/* Filters */}
      <ActivityLogFilters
        search={search}
        type={type}
        startDate={startDate}
        endDate={endDate}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onTypeChange={(value) => {
          setType(value);
          setPage(1);
        }}
        onStartDateChange={(value) => {
          setStartDate(value);
          setPage(1);
        }}
        onEndDateChange={(value) => {
          setEndDate(value);
          setPage(1);
        }}
        onClear={clearFilters}
      />

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>النشاطات</CardTitle>
          <CardDescription>
            {pagination && `${pagination.total} نشاط مسجل`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <ActivityLogTable logs={logs} onViewDetails={handleViewDetails} />

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    السابق
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    صفحة {page} من {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    التالي
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <ActivityLogDetailDialog
        log={selectedLog}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}
