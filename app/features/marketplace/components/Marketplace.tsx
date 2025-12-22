"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, AlertCircle, Filter } from "lucide-react";
import Link from "next/link";
import { CreateListingDialog } from "./CreateListingDialog";
import { ListingCard } from "./ListingCard";

interface MarketplaceProps {
  session: Session | null;
  userProfile: {
    discord_username: string | null;
    embark_id: string | null;
  } | null;
}

export interface Listing {
  id: string;
  type: "WTS" | "WTB";
  status: string;
  quantity: number;
  paymentType: "SEEDS" | "ITEMS" | "OPEN_OFFERS";
  seedsAmount: number | null;
  description: string;
  created_at: string;
  item: {
    id: string;
    name: string;
    icon: string | null;
    rarity: string | null;
    item_type: string | null;
  };
  user: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
    embark_id: string | null;
    discord_username: string | null;
    createdAt: string;
    averageRating: number;
    totalRatings: number;
    honestTradesCount: number;
  };
  paymentItems: Array<{
    id: string;
    quantity: number;
    item: {
      id: string;
      name: string;
      icon: string | null;
      rarity: string | null;
    };
  }>;
}

export function Marketplace({ session, userProfile }: MarketplaceProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Filter states
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [itemTypeFilter, setItemTypeFilter] = useState<string>("all");

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/marketplace/listings");
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings based on selected filters
  const filteredListings = listings.filter((listing) => {
    if (rarityFilter !== "all" && listing.item.rarity !== rarityFilter) return false;
    if (paymentFilter !== "all" && listing.paymentType !== paymentFilter) return false;
    if (itemTypeFilter !== "all" && listing.item.item_type !== itemTypeFilter) return false;
    return true;
  });

  const wtsListings = filteredListings.filter((listing) => listing.type === "WTS");
  const wtbListings = filteredListings.filter((listing) => listing.type === "WTB");

  const handleListingCreated = () => {
    fetchListings();
    setCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  const needsProfileSetup = session?.user && (!userProfile?.discord_username || !userProfile?.embark_id);

  return (
    <div className="space-y-6">
      {needsProfileSetup && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-semibold text-red-600 dark:text-red-500">
                  يجب إكمال ملفك الشخصي
                </h3>
                <p className="text-sm text-red-600 dark:text-red-500">
                  يجب إضافة معرف Discord و Embark ID في{" "}
                  <Link href="/profile" className="underline font-bold">
                    ملفك الشخصي
                  </Link>{" "}
                  قبل إنشاء قائمة في السوق.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header with filters and create button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />

          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-[150px] h-9 bg-card/50 border-border/50">
              <SelectValue placeholder="الندرة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الندرات</SelectItem>
              <SelectItem value="LEGENDARY">أسطوري</SelectItem>
              <SelectItem value="EPIC">ملحمي</SelectItem>
              <SelectItem value="RARE">نادر</SelectItem>
              <SelectItem value="UNCOMMON">غير عادي</SelectItem>
              <SelectItem value="COMMON">عادي</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[150px] h-9 bg-card/50 border-border/50">
              <SelectValue placeholder="الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الطرق</SelectItem>
              <SelectItem value="SEEDS">بذور</SelectItem>
              <SelectItem value="ITEMS">عناصر</SelectItem>
              <SelectItem value="OPEN_OFFERS">عروض مفتوحة</SelectItem>
            </SelectContent>
          </Select>

          <Select value={itemTypeFilter} onValueChange={setItemTypeFilter}>
            <SelectTrigger className="w-[150px] h-9 bg-card/50 border-border/50">
              <SelectValue placeholder="نوع العنصر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              <SelectItem value="weapon">سلاح</SelectItem>
              <SelectItem value="armor">درع</SelectItem>
              <SelectItem value="consumable">مستهلك</SelectItem>
              <SelectItem value="resource">مورد</SelectItem>
            </SelectContent>
          </Select>

          {(rarityFilter !== "all" || paymentFilter !== "all" || itemTypeFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setRarityFilter("all");
                setPaymentFilter("all");
                setItemTypeFilter("all");
              }}
              className="h-9 text-xs"
            >
              إعادة تعيين
            </Button>
          )}
        </div>

        {session?.user && (
          <Button
            onClick={() => setCreateDialogOpen(true)}
            disabled={needsProfileSetup}
            className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 ml-2" />
            إنشاء قائمة
          </Button>
        )}
      </div>

      {/* Two-column layout like MetaForge */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WTS (Want to Sell) Column */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/30">
            <h2 className="text-lg font-semibold text-green-400">
              للبيع (WTS)
            </h2>
            <span className="text-sm text-muted-foreground">
              {wtsListings.length} عرض
            </span>
          </div>
          {wtsListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/60 text-sm">
              لا توجد عروض للبيع
            </div>
          ) : (
            <div className="space-y-3">
              {wtsListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  currentUserId={session?.user?.id}
                  onUpdate={fetchListings}
                />
              ))}
            </div>
          )}
        </div>

        {/* WTB (Want to Buy) Column */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/30">
            <h2 className="text-lg font-semibold text-blue-400">
              للشراء (WTB)
            </h2>
            <span className="text-sm text-muted-foreground">
              {wtbListings.length} طلب
            </span>
          </div>
          {wtbListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground/60 text-sm">
              لا توجد طلبات شراء
            </div>
          ) : (
            <div className="space-y-3">
              {wtbListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  currentUserId={session?.user?.id}
                  onUpdate={fetchListings}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {session?.user && (
        <CreateListingDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={handleListingCreated}
        />
      )}
    </div>
  );
}
