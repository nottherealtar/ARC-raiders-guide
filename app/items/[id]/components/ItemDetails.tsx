'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CommentSection } from './CommentSection';

type Item = {
  id: string;
  name: string;
  description: string;
  item_type: string | null;
  icon: string | null;
  rarity: string | null;
  value: number;
  weight: number;
  flavor_text: string;
  stat_block: any;
  subcategory: string | null;
  workbench: string | null;
  loot_area: string | null;
  locations: string[];
  _count: {
    comments: number;
  };
};

const getRarityColor = (rarity: string | null) => {
  switch (rarity) {
    case 'COMMON':
      return 'bg-gray-500';
    case 'UNCOMMON':
      return 'bg-green-500';
    case 'RARE':
      return 'bg-blue-500';
    case 'EPIC':
      return 'bg-purple-500';
    case 'LEGENDARY':
      return 'bg-orange-500';
    default:
      return 'bg-muted';
  }
};

const formatEnumValue = (value: string | null) => {
  if (!value) return 'غير محدد';
  return value
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
};

interface ItemDetailsProps {
  itemId: string;
}

export function ItemDetails({ itemId }: ItemDetailsProps) {
  const router = useRouter();
  const [item, setItem] = React.useState<Item | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/items/${itemId}`);
        const result = await response.json();

        if (!result.success) {
          setError(true);
          return;
        }

        setItem(result.data);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">لم يتم العثور على العنصر</p>
        <Button asChild>
          <Link href="/items">العودة إلى العناصر</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button and Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/items" className="hover:text-foreground">
            العناصر
          </Link>
          <ArrowRight className="h-4 w-4 rotate-180" />
          <span className="text-foreground">{item.name}</span>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/items">
            <ArrowLeft className="h-4 w-4 ml-2" />
            العودة إلى القائمة
          </Link>
        </Button>
      </div>

      {/* Item Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Item Icon */}
            <div className="relative w-32 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden mx-auto md:mx-0">
              {item.icon ? (
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  لا توجد أيقونة
                </div>
              )}
            </div>

            {/* Item Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {item.rarity && (
                    <Badge className={getRarityColor(item.rarity)}>
                      {formatEnumValue(item.rarity)}
                    </Badge>
                  )}
                  {item.item_type && (
                    <Badge variant="outline">
                      {formatEnumValue(item.item_type)}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">{item.name}</CardTitle>
              </div>

              <p className="text-muted-foreground">{item.description}</p>

              {item.flavor_text && (
                <p className="text-sm italic text-muted-foreground border-r-2 border-primary pr-3">
                  {item.flavor_text}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">القيمة</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الوزن</p>
              <p className="text-lg font-semibold">{item.weight}</p>
            </div>
            {item.workbench && (
              <div>
                <p className="text-sm text-muted-foreground">طاولة العمل</p>
                <p className="text-lg font-semibold">{formatEnumValue(item.workbench)}</p>
              </div>
            )}
            {item.loot_area && (
              <div>
                <p className="text-sm text-muted-foreground">منطقة الغنائم</p>
                <p className="text-lg font-semibold">{formatEnumValue(item.loot_area)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      {item.locations && item.locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>المواقع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {item.locations.map((location, index) => (
                <Badge key={index} variant="secondary">
                  {location}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comment Section */}
      <Card>
        <CardHeader>
          <CardTitle>التعليقات ({item._count.comments})</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentSection itemId={item.id} />
        </CardContent>
      </Card>
    </div>
  );
}
