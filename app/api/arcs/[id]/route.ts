import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const arc = await prisma.arc.findUnique({
      where: { id },
      include: {
        loot: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                icon: true,
                rarity: true,
                item_type: true,
                value: true,
              },
            },
          },
          orderBy: {
            item: {
              rarity: 'desc',
            },
          },
        },
      },
    });

    if (!arc) {
      return NextResponse.json(
        {
          success: false,
          error: 'ARC not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: arc,
    });
  } catch (error) {
    console.error('Error fetching ARC:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ARC',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
