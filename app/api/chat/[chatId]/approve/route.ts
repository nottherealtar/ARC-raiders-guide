import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Approve trade completion
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

    // Determine which participant is approving
    const isParticipant1 = chat.participant1Id === session.user.id;
    const updateData = isParticipant1
      ? { participant1Approved: true }
      : { participant2Approved: true };

    // Update approval status
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: updateData,
    });

    // Check if both participants have approved
    const bothApproved =
      (isParticipant1 && updatedChat.participant2Approved) ||
      (!isParticipant1 && updatedChat.participant1Approved);

    // If both approved, mark chat as completed
    if (bothApproved) {
      await prisma.chat.update({
        where: { id: chatId },
        data: { status: "COMPLETED" },
      });
    }

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
      participant1Approved: updatedChat.participant1Approved,
      participant2Approved: updatedChat.participant2Approved,
      status: bothApproved ? "COMPLETED" : updatedChat.status,
    });
  } catch (error) {
    console.error("Error approving trade:", error);
    return NextResponse.json(
      { error: "Failed to approve trade" },
      { status: 500 }
    );
  }
}
