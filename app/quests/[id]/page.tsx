import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { QuestDetails } from './components/QuestDetails';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/quests/${id}`,
      { cache: 'no-store' }
    );
    const result = await response.json();

    if (result.success && result.data) {
      return {
        title: `${result.data.name} | دليل آرك رايدرز`,
        description: result.data.objectives.join('. '),
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'مهمة | دليل آرك رايدرز',
    description: 'معلومات تفصيلية عن المهمة',
  };
}

export default async function QuestDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <QuestDetails questId={id} />
      </div>
    </main>
  );
}
