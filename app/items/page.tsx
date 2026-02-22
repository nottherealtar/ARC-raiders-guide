import { Metadata } from 'next';
import { ItemsDataTable } from './components/ItemsDataTable';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';
import { PageHeader } from '@/components/common/PageHeader';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Items - ARC Raiders Items Database',
  description: 'Browse and search all items in ARC Raiders. Filter by type, rarity, and view detailed item information.',
  alternates: {
    canonical: `${baseUrl}/items`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/items`,
    title: 'Items - ARC Raiders Items Database',
    description: 'Browse all items in ARC Raiders. Search, filter by type and rarity, and view detailed item information.',
    siteName: '3RB',
    images: [
      {
        url: `${baseUrl}/og-items.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Items Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Items - ARC Raiders Items Database',
    description: 'Browse all items in ARC Raiders. Search, filter by type and rarity.',
    images: [`${baseUrl}/og-items.jpg`],
  },
  keywords: ['ARC Raiders', 'items', 'weapons', 'equipment', 'database', 'game items', '3RB'],
};

export default function ItemsPage() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'Home', url: '/' },
          { name: 'Items', url: '/items' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        <PageHeader section="items" titleKey="title" descriptionKey="description" />
        <ItemsDataTable />
      </div>
    </main>
  );
}
