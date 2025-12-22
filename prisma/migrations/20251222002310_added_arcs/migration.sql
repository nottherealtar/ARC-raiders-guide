-- CreateTable
CREATE TABLE "Arc" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArcLoot" (
    "id" TEXT NOT NULL,
    "arcId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArcLoot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Arc_name_idx" ON "Arc"("name");

-- CreateIndex
CREATE INDEX "ArcLoot_arcId_idx" ON "ArcLoot"("arcId");

-- CreateIndex
CREATE INDEX "ArcLoot_itemId_idx" ON "ArcLoot"("itemId");

-- AddForeignKey
ALTER TABLE "ArcLoot" ADD CONSTRAINT "ArcLoot_arcId_fkey" FOREIGN KEY ("arcId") REFERENCES "Arc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArcLoot" ADD CONSTRAINT "ArcLoot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
