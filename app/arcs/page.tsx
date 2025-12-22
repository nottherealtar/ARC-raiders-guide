import { Metadata } from 'next';
import { ArcsDataTable } from './components/ArcsDataTable';

export const metadata: Metadata = {
  title: 'الـ ARCs | دليل آرك رايدرز',
  description: 'تصفح جميع وحدات ARC في اللعبة. اطلع على معلومات تفصيلية عن كل وحدة والمواد التي تحصل عليها عند تدميرها.',
};

export default function ArcsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            وحدات ARC
          </h1>
          <p className="text-muted-foreground">
            تعرف على جميع وحدات ARC في اللعبة. كل وحدة لها خصائصها الفريدة والمواد التي تسقطها عند التدمير.
          </p>
        </div>

        {/* ARCs Data Table */}
        <ArcsDataTable />
      </div>
    </main>
  );
}
