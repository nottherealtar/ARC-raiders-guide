import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Search parameter
    const search = searchParams.get('search') || '';

    // Build where clause
    const where: any = {};

    // Search filter (searches name and objectives)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { objectives: { hasSome: [search] } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.quest.count({ where });

    // Fetch quests with their rewards
    const quests = await prisma.quest.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        objectives: true,
        xp: true,
        granted_items: true,
        locations: true,
        marker_category: true,
        image: true,
        guide_links: true,
        required_items: true,
        created_at: true,
        updated_at: true,
        rewards: {
          select: {
            id: true,
            quantity: true,
            itemId: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: quests,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quests',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
