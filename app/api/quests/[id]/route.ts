import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quest = await prisma.quest.findUnique({
      where: { id },
      include: {
        rewards: {
          select: {
            id: true,
            quantity: true,
            itemId: true,
          },
        },
      },
    });

    if (!quest) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quest not found',
        },
        { status: 404 }
      );
    }

    // Fetch item details for rewards
    const itemIds = quest.rewards.map(r => r.itemId);
    const items = await prisma.item.findMany({
      where: {
        id: {
          in: itemIds,
        },
      },
      select: {
        id: true,
        name: true,
        icon: true,
        rarity: true,
        item_type: true,
        description: true,
        value: true,
      },
    });

    // Map items to rewards
    const itemsMap = new Map(items.map(item => [item.id, item]));
    const rewardsWithItems = quest.rewards.map(reward => ({
      ...reward,
      item: itemsMap.get(reward.itemId) || null,
    }));

    const questWithItems = {
      ...quest,
      rewards: rewardsWithItems,
    };

    return NextResponse.json({
      success: true,
      data: questWithItems,
    });
  } catch (error) {
    console.error('Error fetching quest:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quest',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
