'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function HomeMapsHeading() {
  const { t } = useLanguage();
  return <h2 className="text-2xl md:text-3xl font-bold">{t.home.mapsTitle}</h2>;
}

export function HomeItemsSection() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl md:text-3xl font-bold">{t.home.itemsTitle}</h2>
      <Link href="/items" className="text-sm hover:underline transition-colors">
        {t.home.viewAllItems}
      </Link>
    </div>
  );
}

export function HomeNewsSection() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl md:text-3xl font-bold">{t.home.newsTitle}</h2>
      <Link href="/blogs" className="text-sm hover:underline transition-colors">
        {t.home.viewAllArticles}
      </Link>
    </div>
  );
}
