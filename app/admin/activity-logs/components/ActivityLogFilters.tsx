"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Calendar } from "lucide-react";

// Activity type labels in Arabic and English
const activityTypes = [
  { value: "all", labelAr: "جميع الأنواع", labelEn: "All Types" },
  { value: "USER_REGISTERED", labelAr: "تسجيل مستخدم", labelEn: "User Registered" },
  { value: "USER_LOGIN", labelAr: "تسجيل دخول", labelEn: "User Login" },
  { value: "USER_BANNED", labelAr: "حظر مستخدم", labelEn: "User Banned" },
  { value: "USER_UNBANNED", labelAr: "إلغاء حظر", labelEn: "User Unbanned" },
  { value: "LISTING_CREATED", labelAr: "إنشاء عرض", labelEn: "Listing Created" },
  { value: "LISTING_UPDATED", labelAr: "تحديث عرض", labelEn: "Listing Updated" },
  { value: "LISTING_DELETED", labelAr: "حذف عرض", labelEn: "Listing Deleted" },
  { value: "TRADE_COMPLETED", labelAr: "إتمام صفقة", labelEn: "Trade Completed" },
  { value: "CHAT_STARTED", labelAr: "بدء محادثة", labelEn: "Chat Started" },
  { value: "GUIDE_CREATED", labelAr: "إنشاء دليل", labelEn: "Guide Created" },
  { value: "GUIDE_UPDATED", labelAr: "تحديث دليل", labelEn: "Guide Updated" },
  { value: "GUIDE_DELETED", labelAr: "حذف دليل", labelEn: "Guide Deleted" },
  { value: "MAP_MARKER_ADDED", labelAr: "إضافة علامة", labelEn: "Marker Added" },
  { value: "MAP_MARKER_DELETED", labelAr: "حذف علامة", labelEn: "Marker Deleted" },
  { value: "ITEM_CREATED", labelAr: "إنشاء عنصر", labelEn: "Item Created" },
  { value: "ITEM_UPDATED", labelAr: "تحديث عنصر", labelEn: "Item Updated" },
  { value: "ADMIN_ACTION", labelAr: "إجراء إداري", labelEn: "Admin Action" },
  { value: "SYSTEM_EVENT", labelAr: "حدث نظام", labelEn: "System Event" },
];

interface ActivityLogFiltersProps {
  search: string;
  type: string;
  startDate: string;
  endDate: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export function ActivityLogFilters({
  search,
  type,
  startDate,
  endDate,
  onSearchChange,
  onTypeChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: ActivityLogFiltersProps) {
  const hasFilters = search || type !== "all" || startDate || endDate;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث في النشاطات أو المستخدمين..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
        </div>
        {hasFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={onClear}
            title="مسح الفلاتر"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Activity Type Filter */}
        <div className="flex-1 min-w-[180px]">
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="نوع النشاط" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((activityType) => (
                <SelectItem key={activityType.value} value={activityType.value}>
                  <div className="flex flex-col">
                    <span>{activityType.labelAr}</span>
                    <span className="text-xs text-muted-foreground">
                      {activityType.labelEn}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date Filter */}
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="pr-10"
              placeholder="من تاريخ"
            />
          </div>
        </div>

        {/* End Date Filter */}
        <div className="flex-1 min-w-[150px]">
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="pr-10"
              placeholder="إلى تاريخ"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
