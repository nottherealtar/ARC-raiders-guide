import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    // Extract weight from stat_block if it exists
    const statBlock = item.stat_block as any;
    const weight = statBlock?.weight || 0;

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        weight,
      },
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch item',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
