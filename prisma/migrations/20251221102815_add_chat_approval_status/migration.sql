-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "participant1Approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "participant2Approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ChatStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "Chat_status_idx" ON "Chat"("status");
