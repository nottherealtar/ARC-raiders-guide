'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Trophy,
  Target,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type QuestReward = {
  id: string;
  quantity: number;
  itemId: string;
  item: {
    id: string;
    name: string;
    icon: string | null;
    rarity: string | null;
    item_type: string | null;
    description: string;
    value: number;
  } | null;
};

type Quest = {
  id: string;
  name: string;
  objectives: string[];
  xp: number;
  granted_items: any;
  locations: any;
  marker_category: string | null;
  image: string | null;
  guide_links: any;
  required_items: any;
  rewards: QuestReward[];
};

export function QuestDetails({ questId }: { questId: string }) {
  const [quest, setQuest] = React.useState<Quest | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchQuest() {
      try {
        const response = await fetch(`/api/quests/${questId}`);
        const result = await response.json();

        if (result.success) {
          setQuest(result.data);
        } else {
          setError(result.error || 'Failed to load quest');
        }
      } catch (err) {
        setError('Failed to load quest');
        console.error('Error fetching quest:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuest();
  }, [questId]);

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

  if (error || !quest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive mb-4">{error || 'المهمة غير موجودة'}</p>
        <Button asChild variant="outline">
          <Link href="/quests">
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى القائمة
          </Link>
        </Button>
      </div>
    );
  }

  const grantedItems = Array.isArray(quest.granted_items)
    ? quest.granted_items
    : [];
  const locations = Array.isArray(quest.locations) ? quest.locations : [];
  const guideLinks = Array.isArray(quest.guide_links) ? quest.guide_links : [];
  const requiredItems = Array.isArray(quest.required_items)
    ? quest.required_items
    : [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm">
        <Link href="/quests">
          <ArrowRight className="ml-2 h-4 w-4" />
          العودة إلى القائمة
        </Link>
      </Button>

      {/* Quest Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <Card>
          <CardContent className="p-6">
            <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
              {quest.image ? (
                <Image
                  src={quest.image}
                  alt={quest.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <Target className="w-16 h-16" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{quest.name}</CardTitle>
            <CardDescription>مهمة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* XP Reward */}
            <div className="flex items-center gap-2 text-amber-500">
              <Trophy className="h-5 w-5" />
              <span className="text-lg font-semibold">
                {quest.xp.toLocaleString()} نقطة خبرة
              </span>
            </div>

            {/* Marker Category */}
            {quest.marker_category && (
              <div>
                <Badge variant="secondary">{quest.marker_category}</Badge>
              </div>
            )}

            {/* Stats */}
            <div className="pt-4 border-t grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">
                  {quest.objectives.length} أهداف
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                <span className="text-sm">
                  {quest.rewards.length} مكافآت
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            الأهداف
          </CardTitle>
          <CardDescription>المهام المطلوب إنجازها لإتمام هذه المهمة</CardDescription>
        </CardHeader>
        <CardContent>
          {quest.objectives.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              لا توجد أهداف مسجلة
            </div>
          ) : (
            <ul className="space-y-2">
              {quest.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{objective}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Locations */}
      {locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              المواقع
            </CardTitle>
            <CardDescription>الأماكن ذات الصلة بهذه المهمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {locations.map((location: any, index: number) => (
                <Badge key={index} variant="outline">
                  {typeof location === 'string' ? location : location.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required Items */}
      {requiredItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>العناصر المطلوبة</CardTitle>
            <CardDescription>
              العناصر التي تحتاجها لإكمال هذه المهمة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {requiredItems.map((item: any, index: number) => (
                <Badge key={index} variant="secondary">
                  {typeof item === 'string' ? item : item.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>المكافآت</CardTitle>
          <CardDescription>
            المكافآت التي ستحصل عليها عند إتمام هذه المهمة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {quest.rewards.length === 0 && grantedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد مكافآت مسجلة لهذه المهمة
            </div>
          ) : (
            <div className="space-y-4">
              {/* Reward Items */}
              {quest.rewards.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                    عناصر المكافأة
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quest.rewards.map((reward) => {
                      const item = reward.item;
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

                      return (
                        <Link
                          key={reward.id}
                          href={`/items/${reward.itemId}`}
                          className={`group relative bg-card border ${
                            item ? getRarityBorder(item.rarity) : 'border-muted'
                          } rounded-lg p-4 hover:shadow-md transition-all`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Item Icon */}
                            <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded overflow-hidden">
                              {item?.icon ? (
                                <Image
                                  src={item.icon}
                                  alt={item.name}
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
                                {item?.name || reward.itemId}
                              </h4>
                              {item && (
                                <>
                                  <p
                                    className={`text-xs font-medium ${getRarityColor(
                                      item.rarity
                                    )}`}
                                  >
                                    {item.rarity?.replace('_', ' ')}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {item.item_type?.replace('_', ' ')}
                                  </p>
                                </>
                              )}
                              <div className="mt-2 pt-2 border-t">
                                <span className="text-xs font-medium text-primary">
                                  الكمية: {reward.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Granted Items */}
              {grantedItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">
                    عناصر ممنوحة
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {grantedItems.map((item: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {typeof item === 'string' ? item : item.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guide Links */}
      {guideLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              أدلة مفيدة
            </CardTitle>
            <CardDescription>روابط لأدلة ومصادر خارجية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {guideLinks.map((link: any, index: number) => (
                <a
                  key={index}
                  href={typeof link === 'string' ? link : link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>{typeof link === 'string' ? link : link.name}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
