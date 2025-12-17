import { ItemCard } from './ItemCard';
import { ItemData } from '../types';

// Sample 30 items (you can replace with actual data)
const items: ItemData[] = [
  {
    id: '1',
    name: 'Scrap Metal',
    imageUrl: '/images/items/scrap-metal.jpg',
    classification: 'Recyclable',
    description: 'Common metal scrap found throughout the wasteland',
    stackSize: 100,
    size: 1,
    category: 'Materials',
    weight: 0.5,
    recycleValue: 10
  },
  {
    id: '2',
    name: 'Advanced Circuit',
    imageUrl: '/images/items/advanced-circuit.jpg',
    classification: 'Uncommon',
    description: 'High-tech electronic component',
    stackSize: 50,
    size: 1,
    category: 'Electronics',
    weight: 0.2,
    recycleValue: 50
  },
  {
    id: '3',
    name: 'Energy Cell',
    imageUrl: '/images/items/energy-cell.jpg',
    classification: 'Common',
    description: 'Standard power source for devices',
    stackSize: 20,
    size: 1,
    category: 'Power',
    weight: 0.3,
    recycleValue: 15
  },
  {
    id: '4',
    name: 'Rare Alloy',
    imageUrl: '/images/items/rare-alloy.jpg',
    classification: 'Rare',
    description: 'Valuable metal composite',
    stackSize: 10,
    size: 2,
    category: 'Materials',
    weight: 1.0,
    recycleValue: 200
  },
  {
    id: '5',
    name: 'Med Kit',
    imageUrl: '/images/items/med-kit.jpg',
    classification: 'Common',
    description: 'Basic medical supplies',
    stackSize: 5,
    size: 2,
    category: 'Medical',
    weight: 0.8,
    recycleValue: 25
  },
  {
    id: '6',
    name: 'Security Chip',
    imageUrl: '/images/items/security-chip.jpg',
    classification: 'Uncommon',
    description: 'Access card for secure areas',
    stackSize: 1,
    size: 1,
    category: 'Security',
    weight: 0.1,
    recycleValue: 100
  },
  {
    id: '7',
    name: 'Weapon Parts',
    imageUrl: '/images/items/weapon-parts.jpg',
    classification: 'Common',
    description: 'Spare parts for weapon maintenance',
    stackSize: 25,
    size: 1,
    category: 'Weapons',
    weight: 0.4,
    recycleValue: 20
  },
  {
    id: '8',
    name: 'Data Drive',
    imageUrl: '/images/items/data-drive.jpg',
    classification: 'Rare',
    description: 'Contains valuable information',
    stackSize: 1,
    size: 1,
    category: 'Electronics',
    weight: 0.1,
    recycleValue: 150
  },
  {
    id: '9',
    name: 'Armor Plate',
    imageUrl: '/images/items/armor-plate.jpg',
    classification: 'Uncommon',
    description: 'Protective armor component',
    stackSize: 10,
    size: 3,
    category: 'Armor',
    weight: 2.0,
    recycleValue: 75
  },
  {
    id: '10',
    name: 'Plasma Core',
    imageUrl: '/images/items/plasma-core.jpg',
    classification: 'Rare',
    description: 'High-energy power core',
    stackSize: 5,
    size: 2,
    category: 'Power',
    weight: 1.5,
    recycleValue: 300
  },
  // Duplicating items to reach 30 (replace with unique items later)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 11}`,
    name: `Item ${i + 11}`,
    imageUrl: '/images/items/placeholder.jpg',
    classification: i % 3 === 0 ? 'Rare' : i % 2 === 0 ? 'Uncommon' : 'Common',
    description: `Description for item ${i + 11}`,
    stackSize: 10 + i,
    size: (i % 3) + 1,
    category: ['Materials', 'Electronics', 'Weapons', 'Medical'][i % 4],
    weight: 0.5 + (i * 0.1),
    recycleValue: 10 + (i * 5)
  }))
];

export function ItemsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
