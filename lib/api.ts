import { Item, Arc, Quest, Trader, Guide, GameMap, GameEvent } from '@/types';

const API_BASE = 'https://api.metaforge.app';

// Items API
export async function fetchItems(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  rarity?: string;
  type?: string;
  minValue?: number;
  maxValue?: number;
}): Promise<{ data: Item[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
  if (params?.search) searchParams.set('search', params.search);
  if (params?.rarity) searchParams.set('rarity', params.rarity);
  if (params?.type) searchParams.set('type', params.type);
  if (params?.minValue) searchParams.set('minValue', params.minValue.toString());
  if (params?.maxValue) searchParams.set('maxValue', params.maxValue.toString());

  const response = await fetch(`${API_BASE}/api/items?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
}

export async function fetchItem(id: string): Promise<Item> {
  const response = await fetch(`${API_BASE}/api/items/${id}`);
  if (!response.ok) throw new Error('Failed to fetch item');
  return response.json();
}

// ARCs API
export async function fetchArcs(): Promise<Arc[]> {
  const response = await fetch(`${API_BASE}/api/arcs`);
  if (!response.ok) throw new Error('Failed to fetch arcs');
  return response.json();
}

export async function fetchArc(id: string): Promise<Arc> {
  const response = await fetch(`${API_BASE}/api/arcs/${id}`);
  if (!response.ok) throw new Error('Failed to fetch arc');
  return response.json();
}

// Quests API
export async function fetchQuests(params?: {
  page?: number;
  search?: string;
}): Promise<{ data: Quest[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.search) searchParams.set('search', params.search);

  const response = await fetch(`${API_BASE}/api/quests?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch quests');
  return response.json();
}

export async function fetchQuest(id: string): Promise<Quest> {
  const response = await fetch(`${API_BASE}/api/quests/${id}`);
  if (!response.ok) throw new Error('Failed to fetch quest');
  return response.json();
}

// Traders API
export async function fetchTraders(): Promise<Trader[]> {
  const response = await fetch(`${API_BASE}/api/traders`);
  if (!response.ok) throw new Error('Failed to fetch traders');
  return response.json();
}

export async function fetchTrader(name: string): Promise<Trader> {
  const response = await fetch(`${API_BASE}/api/traders/${name}`);
  if (!response.ok) throw new Error('Failed to fetch trader');
  return response.json();
}

// Guides API
export async function fetchGuides(page: number = 1): Promise<{ data: Guide[]; total: number }> {
  const response = await fetch(`${API_BASE}/api/guides?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch guides');
  return response.json();
}

export async function fetchGuide(slug: string): Promise<Guide> {
  const response = await fetch(`${API_BASE}/api/guides/${slug}`);
  if (!response.ok) throw new Error('Failed to fetch guide');
  return response.json();
}

// Global Search API
export async function globalSearch(query: string): Promise<{
  items: Item[];
  quests: Quest[];
  guides: Guide[];
}> {
  if (query.length < 3) return { items: [], quests: [], guides: [] };

  const [itemsRes, questsRes, guidesRes] = await Promise.all([
    fetch(`${API_BASE}/api/items?search=${encodeURIComponent(query)}`),
    fetch(`${API_BASE}/api/quests?search=${encodeURIComponent(query)}`),
    fetch(`${API_BASE}/api/guides?search=${encodeURIComponent(query)}`),
  ]);

  const items = itemsRes.ok ? (await itemsRes.json()).data || [] : [];
  const quests = questsRes.ok ? (await questsRes.json()).data || [] : [];
  const guides = guidesRes.ok ? (await guidesRes.json()).data || [] : [];

  return { items, quests, guides };
}

// Maps data (static)
export const MAPS: GameMap[] = [
  { id: '1', name: 'Dam Battlegrounds', slug: 'dam', image: 'https://cdn.metaforge.app/arc-raiders/maps/dam.webp' },
  { id: '2', name: 'The Spaceport', slug: 'spaceport', image: 'https://cdn.metaforge.app/arc-raiders/maps/spaceport.webp' },
  { id: '3', name: 'Buried City', slug: 'buried-city', image: 'https://cdn.metaforge.app/arc-raiders/maps/buried-city.webp' },
  { id: '4', name: 'Blue Gate', slug: 'blue-gate', image: 'https://cdn.metaforge.app/arc-raiders/maps/blue-gate.webp' },
  { id: '5', name: 'Stella Montis', slug: 'stella-montis', image: 'https://cdn.metaforge.app/arc-raiders/maps/stella-montis.webp' },
];

// Mock events for demo
export const MOCK_EVENTS: GameEvent[] = [
  { id: '1', name: 'Night Raid', location: 'Blue Gate', end_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: '2', name: 'Uncovered Caches', location: 'Buried City', end_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), status: 'active' },
  { id: '3', name: 'Electromagnetic Storm', location: 'Spaceport', end_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), status: 'upcoming' },
];
