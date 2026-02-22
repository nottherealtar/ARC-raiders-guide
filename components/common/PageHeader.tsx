'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  titleKey: string;
  descriptionKey?: string;
  section: 'items' | 'arcs' | 'traders';
}

export function PageHeader({ titleKey, descriptionKey, section }: PageHeaderProps) {
  const { t } = useLanguage();
  const sectionTranslations = t[section] as Record<string, string>;
  const title = sectionTranslations[titleKey] ?? titleKey;
  const description = descriptionKey ? (sectionTranslations[descriptionKey] ?? '') : undefined;

  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
