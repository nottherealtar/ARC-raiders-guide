-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objectives" TEXT[],
    "xp" INTEGER NOT NULL DEFAULT 0,
    "granted_items" JSONB NOT NULL DEFAULT '[]',
    "locations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "marker_category" TEXT,
    "image" TEXT,
    "guide_links" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "required_items" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestReward" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quest_name_idx" ON "Quest"("name");

-- CreateIndex
CREATE INDEX "QuestReward_questId_idx" ON "QuestReward"("questId");

-- CreateIndex
CREATE INDEX "QuestReward_itemId_idx" ON "QuestReward"("itemId");

-- AddForeignKey
ALTER TABLE "QuestReward" ADD CONSTRAINT "QuestReward_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
