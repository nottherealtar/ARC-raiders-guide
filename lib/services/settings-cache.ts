import { prisma } from "@/lib/prisma";
import { SiteSetting } from "@/lib/generated/prisma/client";

// Cache settings in memory with TTL
interface CacheEntry {
  value: SiteSetting | null;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

/**
 * Get a setting from cache or database
 */
export async function getCachedSetting(key: string): Promise<SiteSetting | null> {
  const now = Date.now();
  const cached = cache.get(key);

  // Return cached value if not expired
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  // Fetch from database
  const setting = await prisma.siteSetting.findUnique({
    where: { key },
  });

  // Store in cache
  cache.set(key, {
    value: setting,
    expiresAt: now + CACHE_TTL_MS,
  });

  return setting;
}

/**
 * Get a cached setting value with type conversion
 */
export async function getCachedSettingValue<T = string>(
  key: string,
  defaultValue?: T
): Promise<T> {
  const setting = await getCachedSetting(key);

  if (!setting) {
    return defaultValue as T;
  }

  switch (setting.valueType) {
    case "BOOLEAN":
      return (setting.value === "true") as T;
    case "NUMBER":
      return parseFloat(setting.value) as T;
    case "JSON":
      try {
        return JSON.parse(setting.value) as T;
      } catch {
        return defaultValue as T;
      }
    default:
      return setting.value as T;
  }
}

/**
 * Invalidate a specific cache entry
 */
export function invalidateSettingCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate all cache entries
 */
export function invalidateAllSettingsCache(): void {
  cache.clear();
}

/**
 * Check if maintenance mode is enabled (cached)
 */
export async function isMaintenanceModeCached(): Promise<boolean> {
  return getCachedSettingValue<boolean>("maintenance_mode", false);
}

/**
 * Check if a feature is enabled (cached)
 */
export async function isFeatureEnabledCached(featureKey: string): Promise<boolean> {
  return getCachedSettingValue<boolean>(featureKey, true);
}

/**
 * Get maintenance message (cached)
 */
export async function getMaintenanceMessageCached(): Promise<string> {
  return getCachedSettingValue<string>(
    "maintenance_message",
    "الموقع تحت الصيانة، سنعود قريباً"
  );
}
