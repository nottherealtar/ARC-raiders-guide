import { prisma } from "@/lib/prisma";
import { SettingCategory, SiteSetting } from "@/lib/generated/prisma/client";
import { defaultSettings } from "@/lib/data/default-settings";

/**
 * Get a single setting by key
 */
export async function getSetting(key: string): Promise<SiteSetting | null> {
  return prisma.siteSetting.findUnique({
    where: { key },
  });
}

/**
 * Get setting value with type conversion
 */
export async function getSettingValue<T = string>(
  key: string,
  defaultValue?: T
): Promise<T> {
  const setting = await getSetting(key);

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
 * Get all settings grouped by category
 */
export async function getSettingsByCategory(
  category: SettingCategory
): Promise<SiteSetting[]> {
  return prisma.siteSetting.findMany({
    where: { category },
    orderBy: { key: "asc" },
  });
}

/**
 * Get all settings grouped by category
 */
export async function getAllSettings(): Promise<
  Record<SettingCategory, SiteSetting[]>
> {
  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });

  const grouped: Record<SettingCategory, SiteSetting[]> = {
    GENERAL: [],
    FEATURES: [],
    SECURITY: [],
    SYSTEM: [],
  };

  settings.forEach((setting) => {
    if (grouped[setting.category]) {
      grouped[setting.category].push(setting);
    }
  });

  return grouped;
}

/**
 * Update a single setting
 */
export async function updateSetting(
  key: string,
  value: string
): Promise<SiteSetting | null> {
  const existing = await getSetting(key);

  if (!existing) {
    return null;
  }

  return prisma.siteSetting.update({
    where: { key },
    data: {
      value,
      updated_at: new Date(),
    },
  });
}

/**
 * Update multiple settings at once
 */
export async function updateSettings(
  settings: Array<{ key: string; value: string }>
): Promise<void> {
  await prisma.$transaction(
    settings.map(({ key, value }) =>
      prisma.siteSetting.update({
        where: { key },
        data: {
          value,
          updated_at: new Date(),
        },
      })
    )
  );
}

/**
 * Initialize default settings (only creates missing ones)
 */
export async function initializeDefaultSettings(): Promise<{
  created: number;
  existing: number;
}> {
  let created = 0;
  let existing = 0;

  for (const setting of defaultSettings) {
    const existingSetting = await prisma.siteSetting.findUnique({
      where: { key: setting.key },
    });

    if (!existingSetting) {
      await prisma.siteSetting.create({
        data: {
          key: setting.key,
          value: setting.value,
          valueType: setting.valueType,
          category: setting.category,
          label: setting.label,
          labelAr: setting.labelAr,
          description: setting.description,
          descriptionAr: setting.descriptionAr,
        },
      });
      created++;
    } else {
      existing++;
    }
  }

  return { created, existing };
}

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(featureKey: string): Promise<boolean> {
  return getSettingValue<boolean>(featureKey, true);
}

/**
 * Check if maintenance mode is enabled
 */
export async function isMaintenanceMode(): Promise<boolean> {
  return getSettingValue<boolean>("maintenance_mode", false);
}

/**
 * Get maintenance message
 */
export async function getMaintenanceMessage(): Promise<string> {
  return getSettingValue<string>(
    "maintenance_message",
    "الموقع تحت الصيانة، سنعود قريباً"
  );
}
