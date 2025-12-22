import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { listingId } = await params;

    if (!listingId) {
      return NextResponse.json({ error: 'معرف القائمة مطلوب' }, { status: 400 });
    }

    // Check if user has an active chat for this listing
    const existingChat = await prisma.chat.findFirst({
      where: {
        listingId,
        status: 'ACTIVE',
        OR: [
          { participant1Id: session.user.id },
          { participant2Id: session.user.id },
        ],
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      hasActiveChat: !!existingChat,
      chatId: existingChat?.id || null
    });
  } catch (error) {
    console.error('Error checking chat:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
