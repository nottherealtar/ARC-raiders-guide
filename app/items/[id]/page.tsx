import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ItemDetails } from './components/ItemDetails';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/items/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        title: 'عنصر غير موجود | دليل آرك رايدرز',
      };
    }

    const result = await response.json();
    const item = result.data;

    return {
      title: `${item.name} | دليل آرك رايدرز`,
      description: item.description,
    };
  } catch (error) {
    return {
      title: 'عنصر غير موجود | دليل آرك رايدرز',
    };
  }
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <ItemDetails itemId={id} />
      </div>
    </main>
  );
}
