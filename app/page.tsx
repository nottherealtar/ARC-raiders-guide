import { ExploreRaiders } from './features/explore-raiders';
import { Maps } from './features/maps';
import { Items } from './features/items';

export default function Home() {
  return (
    <main className="min-h-screen">
      <ExploreRaiders />
      <Maps />
      <Items />
    </main>
  );
}
