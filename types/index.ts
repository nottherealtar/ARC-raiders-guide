// Item interface
export interface Item {
  id: string;
  name: string;
  description: string | null;
  item_type: string | null;
  icon?: string;
  rarity?: string;
  value?: number;
  stat_block?: Record<string, number | string>;
  flavor_text?: string | null;
  subcategory?: string | null;
  created_at?: string;
  updated_at?: string;
  locations?: string[];
  sources?: any;
}

// ARC interface
export interface Arc {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

// Quest interface
export interface Quest {
  id: string;
  name: string;
  objectives: string[];
  xp?: number;
  rewards: QuestReward[];
  created_at?: string;
  updated_at?: string;
}

export interface QuestReward {
  item: {
    id: string;
    icon?: string;
    name: string;
    rarity?: string;
  };
  quantity: string;
}

// Trader Item interface
export interface TraderItem {
  id: string;
  icon?: string;
  name: string;
  value?: number;
  rarity?: string;
  item_type?: string;
  description?: string;
  trader_price?: number;
}

// Trader interface
export interface Trader {
  id: string;
  name: string;
  description?: string;
  image?: string;
  items: TraderItem[];
}

// Guide interface
export interface Guide {
  id: string;
  title: string;
  description?: string;
  image?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
}

// Map interface
export interface GameMap {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

// Event interface
export interface GameEvent {
  id: string;
  name: string;
  location?: string;
  end_time: string;
  status: 'active' | 'upcoming' | 'ended';
}

// Pagination interface
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Search result interface
export interface SearchResult {
  items: Item[];
  quests: Quest[];
  guides: Guide[];
}

// Favorite interface
export interface Favorite {
  id: string;
  type: 'item' | 'quest' | 'arc' | 'guide' | 'page';
  name: string;
  url: string;
}

// User interface
export interface User {
  id: string;
  username: string;
  avatar?: string;
  embark_id?: string;
}

// Listing interface for marketplace
export interface Listing {
  id: string;
  user: User;
  type: 'WTS' | 'WTB';
  item: Item;
  quantity: number;
  price_type: 'seeds' | 'barter' | 'open';
  price?: number;
  barter_items?: Item[];
  created_at: string;
  status: 'active' | 'closed' | 'completed';
}

// Needed items list interface
export interface NeededItemsList {
  id: string;
  name: string;
  items: NeededItem[];
  is_default?: boolean;
}

export interface NeededItem {
  item: Item;
  needed: number;
  collected: number;
}
