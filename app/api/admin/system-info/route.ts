import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

/**
 * GET /api/admin/system-info
 * Get system information and status
 */
export async function GET() {
  try {
    const session = await auth();

    // Check if user is admin
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check database connectivity and latency
    let dbStatus: SystemInfo["database"] = { status: "disconnected" };
    try {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;
      dbStatus = { status: "connected", latency };
    } catch {
      dbStatus = { status: "disconnected" };
    }

    // Check storage configuration
    const storageStatus: SystemInfo["storage"] = {
      status: process.env.MINIO_ENDPOINT ? "configured" : "not_configured",
      endpoint: process.env.NEXT_PUBLIC_MINIO_ENDPOINT || undefined,
    };

    // Get application info
    const applicationInfo: SystemInfo["application"] = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
    };

    // Get statistics
    const [
      totalUsers,
      totalListings,
      totalTrades,
      totalGuides,
      totalMapMarkers,
      totalActivityLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.trade.count(),
      prisma.guide.count(),
      prisma.mapMarker.count(),
      prisma.activityLog.count(),
    ]);

    const statistics: SystemInfo["statistics"] = {
      totalUsers,
      totalListings,
      totalTrades,
      totalGuides,
      totalMapMarkers,
      totalActivityLogs,
    };

    // Get server info
    const memoryUsage = process.memoryUsage();
    const serverInfo: SystemInfo["server"] = {
      uptime: process.uptime(),
      memoryUsage: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
      },
    };

    const systemInfo: SystemInfo = {
      database: dbStatus,
      storage: storageStatus,
      application: applicationInfo,
      statistics,
      server: serverInfo,
    };

    return NextResponse.json({
      success: true,
      systemInfo,
    });
  } catch (error) {
    console.error("Error fetching system info:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch system info" },
      { status: 500 }
    );
  }
}
