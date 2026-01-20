"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, Globe, ToggleLeft, Shield, Monitor } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { GeneralSettings } from "./components/GeneralSettings";
import { FeatureToggles } from "./components/FeatureToggles";
import { SecuritySettings } from "./components/SecuritySettings";
import { SystemInfo } from "./components/SystemInfo";

interface Setting {
  id: string;
  key: string;
  value: string;
  valueType: string;
  category: string;
  label: string;
  labelAr: string;
  description?: string;
  descriptionAr?: string;
}

interface SettingsData {
  GENERAL: Setting[];
  FEATURES: Setting[];
  SECURITY: Setting[];
  SYSTEM: Setting[];
}

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإعدادات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-lg">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
            الإعدادات
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Site Settings
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" dir="rtl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">عام</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2">
            <ToggleLeft className="h-4 w-4" />
            <span className="hidden sm:inline">الميزات</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">الأمان</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">النظام</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          {settings?.GENERAL && (
            <GeneralSettings
              settings={settings.GENERAL}
              onUpdate={fetchSettings}
            />
          )}
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          {settings?.FEATURES && (
            <FeatureToggles
              settings={settings.FEATURES}
              onUpdate={fetchSettings}
            />
          )}
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          {settings?.SECURITY && (
            <SecuritySettings
              settings={settings.SECURITY}
              onUpdate={fetchSettings}
            />
          )}
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <SystemInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
