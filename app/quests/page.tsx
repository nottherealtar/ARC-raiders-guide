import { Metadata } from 'next';
import { QuestsDataTable } from './components/QuestsDataTable';

export const metadata: Metadata = {
  title: 'المهام | دليل آرك رايدرز',
  description: 'تصفح جميع المهام في آرك رايدرز. اطلع على أهداف المهام والمكافآت التي ستحصل عليها.',
};

export default function QuestsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            المهام
          </h1>
          <p className="text-muted-foreground">
            تعرف على جميع المهام في اللعبة. كل مهمة لها أهدافها ومكافآتها الخاصة.
          </p>
        </div>

        {/* Quests Data Table */}
        <QuestsDataTable />
      </div>
    </main>
  );
}
