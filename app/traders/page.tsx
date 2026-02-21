import { Metadata } from 'next';
import { Traders } from '../features/traders';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';
import { PageHeader } from '@/components/common/PageHeader';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Traders - ARC Raiders Traders',
  description: 'Browse items available from all traders in ARC Raiders. Find the best deals from Apollo, Celeste, Lance, Shani, and Tian Wen.',
  alternates: {
    canonical: `${baseUrl}/traders`,
  },
  openGraph: {
    type: 'website',
    url: `${baseUrl}/traders`,
    title: 'Traders - ARC Raiders Traders',
    description: 'Browse items available from all traders in ARC Raiders. Find the best equipment and supplies.',
    siteName: '3RB',
    images: [
      {
        url: `${baseUrl}/og-traders.jpg`,
        width: 1200,
        height: 630,
        alt: 'ARC Raiders Traders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Traders - ARC Raiders Traders',
    description: 'Browse items available from all traders in ARC Raiders.',
    images: [`${baseUrl}/og-traders.jpg`],
  },
  keywords: ['ARC Raiders', 'traders', 'Apollo', 'Celeste', 'Lance', 'Shani', 'Tian Wen', '3RB'],
};

export default function TradersPage() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [
          { name: 'Home', url: '/' },
          { name: 'Traders', url: '/traders' },
        ])}
      />
      <div className="container mx-auto px-4 py-8">
        <PageHeader section="traders" titleKey="title" descriptionKey="description" />
        <Traders />
      </div>
    </main>
  );
}
