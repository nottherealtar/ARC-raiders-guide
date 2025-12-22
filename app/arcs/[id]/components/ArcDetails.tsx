'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ArcLoot = {
  id: string;
  item: {
    id: string;
    name: string;
    description: string;
    icon: string | null;
    rarity: string | null;
    item_type: string | null;
    value: number;
  };
};

type Arc = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  image: string | null;
  loot: ArcLoot[];
};

const getRarityColor = (rarity: string | null) => {
  switch (rarity) {
    case 'COMMON':
      return 'text-gray-500';
    case 'UNCOMMON':
      return 'text-green-500';
    case 'RARE':
      return 'text-blue-500';
    case 'EPIC':
      return 'text-purple-500';
    case 'LEGENDARY':
      return 'text-orange-500';
    default:
      return 'text-muted-foreground';
  }
};

const getRarityBorder = (rarity: string | null) => {
  switch (rarity) {
    case 'COMMON':
      return 'border-gray-500/20';
    case 'UNCOMMON':
      return 'border-green-500/20';
    case 'RARE':
      return 'border-blue-500/20';
    case 'EPIC':
      return 'border-purple-500/20';
    case 'LEGENDARY':
      return 'border-orange-500/20';
    default:
      return 'border-muted';
  }
};

const formatEnumValue = (value: string | null) => {
  if (!value) return '-';
  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

export function ArcDetails({ arcId }: { arcId: string }) {
  const [arc, setArc] = React.useState<Arc | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchArc() {
      try {
        const response = await fetch(`/api/arcs/${arcId}`);
        const result = await response.json();

        if (result.success) {
          setArc(result.data);
        } else {
          setError(result.error || 'Failed to load ARC');
        }
      } catch (err) {
        setError('Failed to load ARC');
        console.error('Error fetching ARC:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArc();
  }, [arcId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !arc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive mb-4">{error || 'وحدة ARC غير موجودة'}</p>
        <Button asChild variant="outline">
          <Link href="/arcs">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى القائمة
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/arcs">
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة إلى القائمة
        </Link>
      </Button>

      {/* ARC Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
              {arc.image ? (
                <Image
                  src={arc.image}
                  alt={arc.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : arc.icon ? (
                <Image
                  src={arc.icon}
                  alt={arc.name}
                  fill
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  لا توجد صورة
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{arc.name}</CardTitle>
            <CardDescription>وحدة ARC</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                الوصف
              </h3>
              <p className="text-foreground leading-relaxed">{arc.description}</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="text-sm">
                  يسقط {arc.loot.length} عنصر عند التدمير
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loot Table */}
      <Card>
        <CardHeader>
          <CardTitle>المواد التي يسقطها</CardTitle>
          <CardDescription>
            المواد التي يمكن الحصول عليها عند تدمير هذه الوحدة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {arc.loot.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد مواد مسجلة لهذه الوحدة
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {arc.loot.map((lootItem) => (
                <Link
                  key={lootItem.id}
                  href={`/items/${lootItem.item.id}`}
                  className={`group relative bg-card border ${getRarityBorder(
                    lootItem.item.rarity
                  )} rounded-lg p-4 hover:shadow-md transition-all`}
                >
                  <div className="flex items-start gap-3">
                    {/* Item Icon */}
                    <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded overflow-hidden">
                      {lootItem.item.icon ? (
                        <Image
                          src={lootItem.item.icon}
                          alt={lootItem.item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          ?
                        </div>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                        {lootItem.item.name}
                      </h4>
                      <p
                        className={`text-xs font-medium ${getRarityColor(
                          lootItem.item.rarity
                        )}`}
                      >
                        {formatEnumValue(lootItem.item.rarity)}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {formatEnumValue(lootItem.item.item_type)}
                      </p>
                    </div>
                  </div>

                  {/* Value Badge */}
                  {lootItem.item.value > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        القيمة: {lootItem.item.value}
                      </span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
