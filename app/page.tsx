import { ExploreRaiders } from './features/explore-raiders';
import { Maps } from './features/maps';
import { Items } from './features/items';
import { RecentBlogs } from './features/blog';
import { StructuredData, getBreadcrumbSchema } from '@/components/StructuredData';
import { HomeMapsHeading, HomeItemsSection, HomeNewsSection } from './components/HomeHeadings';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Enable ISR - revalidate every 60 seconds for fresh content
export const revalidate = 60;

export default function Home() {
  return (
    <main className="min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(baseUrl, [{ name: 'Home', url: '/' }])}
      />
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero + Categories */}
        <section>
          <ExploreRaiders />
        </section>

        {/* World Explorer */}
        <section>
          <div className="mb-6 space-y-2">
            <HomeMapsHeading />
          </div>
          <Maps />
        </section>

        {/* ARC Raiders Items */}
        <section>
          <HomeItemsSection />
          <Items />
        </section>

        {/* News & Guides */}
        <section>
          <HomeNewsSection />
          <RecentBlogs limit={8} />
        </section>
      </div>
    </main>
  );
}
