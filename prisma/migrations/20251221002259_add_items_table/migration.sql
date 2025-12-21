-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "WeaponCategory" AS ENUM ('ASSAULT_RIFLE', 'BATTLE_RIFLE', 'LIGHT_MACHINE_GUN', 'PISTOL', 'SHOTGUN', 'SMG', 'SNIPER_RIFLE', 'SPECIAL_WEAPON');

-- CreateEnum
CREATE TYPE "CoinType" AS ENUM ('COIN', 'RAIDER_TOKEN');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('ADVANCED_MATERIAL', 'AMMUNITION', 'AUGMENT', 'BASIC_MATERIAL', 'BLUEPRINT', 'CONSUMABLE', 'COSMETIC', 'GADGET', 'KEY', 'MATERIAL', 'MEDICAL', 'MISC', 'MODIFICATION', 'MODS', 'NATURE', 'QUEST_ITEM', 'QUICK_USE', 'RECYCLABLE', 'REFINED_MATERIAL', 'REFINEMENT', 'SHIELD', 'THROWABLE', 'TOPSIDE_MATERIAL', 'TRINKET', 'WEAPON');

-- CreateEnum
CREATE TYPE "Workbench" AS ENUM ('SCRAPPY', 'GUNSMITH', 'GEAR_BENCH', 'MEDICAL_LAB', 'EXPLOSIVES_STATION', 'UTILITY_STATION', 'REFINER');

-- CreateEnum
CREATE TYPE "LootArea" AS ENUM ('ARC', 'COMMERCIAL', 'MEDICAL', 'RESIDENTIAL', 'ELECTRICAL', 'TECHNOLOGICAL', 'EXODUS', 'INDUSTRIAL', 'MECHANICAL', 'NATURE', 'OLD_WORLD', 'RAIDER', 'SECURITY');

-- CreateEnum
CREATE TYPE "AmmoType" AS ENUM ('SHOTGUN', 'ENERGY', 'HEAVY', 'LAUNCHER', 'LIGHT', 'MEDIUM');

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "item_type" "ItemType",
    "loadout_slots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "icon" TEXT NOT NULL,
    "rarity" "Rarity",
    "value" INTEGER NOT NULL DEFAULT 0,
    "workbench" "Workbench",
    "stat_block" JSONB NOT NULL DEFAULT '{}',
    "flavor_text" TEXT NOT NULL,
    "subcategory" TEXT,
    "shield_type" TEXT,
    "loot_area" "LootArea",
    "sources" JSONB,
    "ammo_type" "AmmoType",
    "locations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Item_item_type_idx" ON "Item"("item_type");

-- CreateIndex
CREATE INDEX "Item_rarity_idx" ON "Item"("rarity");

-- CreateIndex
CREATE INDEX "Item_workbench_idx" ON "Item"("workbench");

-- CreateIndex
CREATE INDEX "Item_loot_area_idx" ON "Item"("loot_area");
