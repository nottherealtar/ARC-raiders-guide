import { Metadata } from 'next';
import { ItemsDataTable } from './components/ItemsDataTable';

export const metadata: Metadata = {
  title: 'العناصر | دليل آرك رايدرز',
  description: 'تصفح جميع العناصر في آرك رايدرز. ابحث، صفي حسب النوع والندرة، واعرض معلومات العناصر التفصيلية.',
};

export default function ItemsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            العناصر
          </h1>
          <p className="text-muted-foreground">
            تصفح وابحث عن جميع العناصر في آرك رايدرز. صفي حسب النوع والندرة والمزيد.
          </p>
        </div>

        {/* Items Data Table */}
        <ItemsDataTable />
      </div>
    </main>
  );
}
