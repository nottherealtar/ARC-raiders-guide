"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Save, ToggleLeft, ShoppingCart, MessageSquare, BookOpen, Map, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Setting {
  id: string;
  key: string;
  value: string;
  valueType: string;
  label: string;
  labelAr: string;
  description?: string;
  descriptionAr?: string;
}

interface FeatureTogglesProps {
  settings: Setting[];
  onUpdate: () => void;
}

const featureIcons: Record<string, React.ReactNode> = {
  enable_marketplace: <ShoppingCart className="h-5 w-5" />,
  enable_chat: <MessageSquare className="h-5 w-5" />,
  enable_guides: <BookOpen className="h-5 w-5" />,
  enable_maps: <Map className="h-5 w-5" />,
  enable_registration: <UserPlus className="h-5 w-5" />,
};

export function FeatureToggles({ settings, onUpdate }: FeatureTogglesProps) {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    settings.forEach((s) => {
      initial[s.key] = s.value;
    });
    return initial;
  });
  const { toast } = useToast();

  const handleToggle = (key: string, checked: boolean) => {
    setValues({ ...values, [key]: String(checked) });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: Object.entries(values).map(([key, value]) => ({
            key,
            value,
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "تم الحفظ",
          description: "تم حفظ إعدادات الميزات بنجاح",
        });
        onUpdate();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ToggleLeft className="h-5 w-5" />
            <div className="flex flex-col">
              <span>تفعيل الميزات</span>
              <span className="text-sm font-normal text-muted-foreground">
                Feature Toggles
              </span>
            </div>
          </CardTitle>
          <CardDescription>
            Enable or disable site features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((setting) => {
              const isEnabled = values[setting.key] === "true";
              const icon = featureIcons[setting.key] || <ToggleLeft className="h-5 w-5" />;

              return (
                <div
                  key={setting.key}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    isEnabled ? "border-primary/30 bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isEnabled
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {icon}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-medium">{setting.labelAr}</p>
                      <p className="text-sm text-muted-foreground">
                        {setting.label}
                      </p>
                      {setting.descriptionAr && (
                        <p className="text-xs text-muted-foreground">
                          {setting.descriptionAr}
                        </p>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) =>
                      handleToggle(setting.key, checked)
                    }
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>حفظ الإعدادات (Save)</span>
        </Button>
      </div>
    </div>
  );
}
