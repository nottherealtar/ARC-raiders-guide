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

    // Search filter (searches name and description)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.arc.count({ where });

    // Fetch ARCs with their loot items
    const arcs = await prisma.arc.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        image: true,
        created_at: true,
        updated_at: true,
        loot: {
          select: {
            id: true,
            item: {
              select: {
                id: true,
                name: true,
                icon: true,
                rarity: true,
                item_type: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: arcs,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching ARCs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ARCs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
