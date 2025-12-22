import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArcDetails } from './components/ArcDetails';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/arcs/${id}`,
      { cache: 'no-store' }
    );
    const result = await response.json();

    if (result.success && result.data) {
      return {
        title: `${result.data.name} | دليل آرك رايدرز`,
        description: result.data.description,
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'وحدة ARC | دليل آرك رايدرز',
    description: 'معلومات تفصيلية عن وحدة ARC',
  };
}

export default async function ArcDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ArcDetails arcId={id} />
      </div>
    </main>
  );
}
