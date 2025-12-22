import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Leave chat (cancel trade)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await params;

    // Get the chat and verify user is a participant
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        OR: [
          { participant1Id: session.user.id },
          { participant2Id: session.user.id },
        ],
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found or unauthorized" },
        { status: 404 }
      );
    }

    // Mark chat as cancelled
    await prisma.chat.update({
      where: { id: chatId },
      data: { status: "CANCELLED" },
    });

    // Fetch updated chat with all relations for Socket.IO broadcast
    const fullChat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participant1: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        participant2: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        listing: {
          include: {
            item: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Emit Socket.IO event to notify both participants
    if (global.io && fullChat) {
      global.io.to(chatId).emit("chat-updated", fullChat);
    }

    return NextResponse.json({
      success: true,
      status: "CANCELLED",
    });
  } catch (error) {
    console.error("Error leaving chat:", error);
    return NextResponse.json(
      { error: "Failed to leave chat" },
      { status: 500 }
    );
  }
}
