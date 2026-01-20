"use client";

import { useState } from "react";
import { SkillTreeCanvas } from "@/app/features/skill-tree/components/SkillTreeCanvas";
import { SelectedSkillsSection } from "@/app/features/skill-tree/components/SelectedSkillsSection";
import { AllSkillsSection } from "@/app/features/skill-tree/components/AllSkillsSection";
import { useSkillTree } from "@/hooks/useSkillTree";

export default function SkillTreePage() {
  const {
    skillLevels,
    expeditionPoints,
    availablePoints,
    totalPointsUsed,
    pointsByCategory,
    getSkillLevel,
    canLearnSkill,
    addPoint,
    removePoint,
    resetTree,
    setExpeditionPoints,
    selectedSkills,
    totalLevel,
    generateShareUrl,
  } = useSkillTree();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">شجرة المهارات</h1>
            <p className="text-muted-foreground">
              قم ببناء وتخصيص شجرة المهارات الخاصة بك
            </p>
          </div>
        </div>
      </div>

      {/* Skill Tree Canvas */}
      <div className="space-y-8">
        <SkillTreeCanvas
          skillLevels={skillLevels}
          expeditionPoints={expeditionPoints}
          availablePoints={availablePoints}
          totalPointsUsed={totalPointsUsed}
          pointsByCategory={pointsByCategory}
          getSkillLevel={getSkillLevel}
          canLearnSkill={canLearnSkill}
          addPoint={addPoint}
          removePoint={removePoint}
          resetTree={resetTree}
          setExpeditionPoints={setExpeditionPoints}
          generateShareUrl={generateShareUrl}
        />

        {/* Selected Skills Section */}
        <SelectedSkillsSection
          selectedSkills={selectedSkills}
          getSkillLevel={getSkillLevel}
          totalLevel={totalLevel}
        />

        {/* All Available Skills Section */}
        <AllSkillsSection />
      </div>
    </div>
  );
}
