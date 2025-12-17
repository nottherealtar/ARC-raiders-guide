import { HeroBanner } from './HeroBanner';
import { ExploreGrid } from './ExploreGrid';

export function ExploreRaiders() {
  return (
    <section className="w-full py-8 md:py-12" aria-label="Explore Arc Raiders">
      <div className="container mx-auto px-4 md:px-6">
        {/* Hero Banner */}
        <div className="mb-3 md:mb-4">
          <HeroBanner />
        </div>

        {/* Grid of Cards */}
        <ExploreGrid />
      </div>
    </section>
  );
}
