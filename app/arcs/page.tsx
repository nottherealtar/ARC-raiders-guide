import { Metadata } from 'next';
import { ArcsDataTable } from './components/ArcsDataTable';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';
import { PageHeader } from '@/components/common/PageHeader';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'ARC Units - ARC Units Database',
  description: 'Browse all ARC units in the game. View detailed information about each unit and materials obtained when destroyed.',
  alternates: {
    canonical: `${baseUrl}/arcs`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/arcs`,
    title: 'ARC Units - ARC Units Database',
    description: 'Browse all ARC units in ARC Raiders. View detailed information about each unit and materials dropped.',
    siteName: '3RB',
    images: [
      {
        url: `${baseUrl}/og-arcs.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Units Database',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARC Units - ARC Units Database',
    description: 'Browse all ARC units in ARC Raiders. View detailed information.',
    images: [`${baseUrl}/og-arcs.jpg`],
  },
  keywords: ['ARC Raiders', 'ARC units', 'enemies', 'game guide', '3RB', 'bosses'],
};

export default function ArcsPage() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'Home', url: '/' },
          { name: 'ARC Units', url: '/arcs' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        <PageHeader section="arcs" titleKey="title" descriptionKey="description" />
        <ArcsDataTable />
      </div>
    </main>
  );
}
