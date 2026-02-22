'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function ExploreGrid() {
  const { t } = useLanguage();
  const ec = t.explore.categories;

  const categories = [
    { id: 'guides', title: ec.guides.title, href: '/guides', imageUrl: '/images/categories/guides.webp', highlights: ec.guides.highlights },
    { id: 'items', title: ec.items.title, href: '/items', imageUrl: '/images/categories/items.webp', highlights: ec.items.highlights },
    { id: 'arcs', title: ec.arcs.title, href: '/arcs', imageUrl: '/images/categories/arcs.webp', highlights: ec.arcs.highlights },
    { id: 'quests', title: ec.quests.title, href: '/quests', imageUrl: '/images/categories/quests.webp', highlights: ec.quests.highlights },
    { id: 'traders', title: ec.traders.title, href: '/traders', imageUrl: '/images/categories/traders.webp', highlights: ec.traders.highlights },
    { id: 'skill-tree', title: ec.skillTree.title, href: '/skill-tree', imageUrl: '/images/categories/skill-tree.webp', highlights: ec.skillTree.highlights },
    { id: 'loadouts', title: ec.loadouts.title, href: '/loadouts', imageUrl: '/images/categories/loadouts.webp', highlights: ec.loadouts.highlights },
  ];

  const [, setActiveId] = useState(categories[0]?.id);

  return (
    <div className="space-y-6">
      <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl group">
        <Image
          src="/banner/banner.jpg"
          alt="Arc Raiders"
          fill
          className="object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative h-full flex flex-col justify-center px-8 md:px-12 text-right" dir="rtl">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-sm">
              <span className="text-xs md:text-sm font-semibold text-orange-400 uppercase tracking-wider">
                {t.explore.badge}
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-l from-orange-400 via-red-400 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl">
              3RB
            </h1>

            <p className="text-lg md:text-xl text-gray-200 max-w-xl leading-relaxed drop-shadow-lg">
              {t.explore.subtitle}
            </p>

            <div className="flex flex-wrap gap-3 pt-2 justify-end">
              <div className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-sm text-gray-200">{t.explore.tagDatabase}</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-sm text-gray-200">{t.explore.tagMaps}</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-sm text-gray-200">{t.explore.tagCommunity}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="flex flex-wrap items-center gap-2" dir="rtl">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            onMouseEnter={() => setActiveId(category.id)}
            onFocus={() => setActiveId(category.id)}
            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-2 text-xs font-semibold transition-all duration-300 hover:border-orange-500/60 hover:bg-orange-500/10 hover:shadow-[0_0_18px_rgba(249,115,22,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 text-right"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-lg bg-muted/50">
              <Image
                src={category.imageUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="32px"
              />
            </span>
            <span>{category.title}</span>
          </Link>
        ))}
      </div>

    </div>
  );
}
