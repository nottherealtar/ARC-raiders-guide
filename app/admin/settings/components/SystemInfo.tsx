"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  Database,
  HardDrive,
  Server,
  Users,
  ShoppingCart,
  Handshake,
  BookOpen,
  MapPin,
  Activity,
  Monitor,
} from "lucide-react";

interface SystemInfo {
  database: {
    status: "connected" | "disconnected";
    latency?: number;
  };
  storage: {
    status: "configured" | "not_configured";
    endpoint?: string;
  };
  application: {
    nodeVersion: string;
    environment: string;
  };
  statistics: {
    totalUsers: number;
    totalListings: number;
    totalTrades: number;
    totalGuides: number;
    totalMapMarkers: number;
    totalActivityLogs: number;
  };
  server: {
    uptime: number;
    memoryUsage: {
      heapUsed: number;
      heapTotal: number;
      external: number;
      rss: number;
    };
  };
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} يوم`);
  if (hours > 0) parts.push(`${hours} ساعة`);
  if (minutes > 0) parts.push(`${minutes} دقيقة`);

  return parts.join(" و ") || "أقل من دقيقة";
}

export function SystemInfo() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSystemInfo = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch("/api/admin/system-info");
      const data = await response.json();

      if (data.success) {
        setSystemInfo(data.systemInfo);
        setError(null);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError("فشل في تحميل معلومات النظام");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !systemInfo) {
    return (
      <Card className="border-red-500/30">
        <CardContent className="pt-6 text-center">
          <p className="text-red-500">{error || "فشل في تحميل البيانات"}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fetchSystemInfo()}
          >
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">معلومات النظام</h3>
            <p className="text-sm text-muted-foreground">System Information</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchSystemInfo(true)}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          تحديث
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Database Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              قاعدة البيانات (Database)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  systemInfo.database.status === "connected"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <div>
                <p className="font-medium">
                  {systemInfo.database.status === "connected"
                    ? "متصل (Connected)"
                    : "غير متصل (Disconnected)"}
                </p>
                {systemInfo.database.latency && (
                  <p className="text-sm text-muted-foreground">
                    زمن الاستجابة: {systemInfo.database.latency}ms
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              التخزين (Storage)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  systemInfo.storage.status === "configured"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              />
              <div>
                <p className="font-medium">
                  {systemInfo.storage.status === "configured"
                    ? "مُعد (Configured)"
                    : "غير مُعد (Not Configured)"}
                </p>
                {systemInfo.storage.endpoint && (
                  <p className="text-xs text-muted-foreground break-all">
                    {systemInfo.storage.endpoint}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Server Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="h-4 w-4" />
            معلومات الخادم (Server Info)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">البيئة (Environment)</p>
              <Badge variant="outline" className="mt-1">
                {systemInfo.application.environment}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Node.js</p>
              <p className="font-mono text-sm">{systemInfo.application.nodeVersion}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">وقت التشغيل (Uptime)</p>
              <p className="text-sm">{formatUptime(systemInfo.server.uptime)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">استخدام الذاكرة (Memory)</p>
              <p className="text-sm">
                {systemInfo.server.memoryUsage.heapUsed} MB /{" "}
                {systemInfo.server.memoryUsage.heapTotal} MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            الإحصائيات (Statistics)
          </CardTitle>
          <CardDescription>Database record counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {systemInfo.statistics.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">مستخدمين</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {systemInfo.statistics.totalListings.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">عروض</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Handshake className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {systemInfo.statistics.totalTrades.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">صفقات</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {systemInfo.statistics.totalGuides.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">أدلة</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <MapPin className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {systemInfo.statistics.totalMapMarkers.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">علامات</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Activity className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {systemInfo.statistics.totalActivityLogs.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">سجلات</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
