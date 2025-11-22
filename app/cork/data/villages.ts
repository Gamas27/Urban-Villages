export interface Village {
  id: string;
  name: string;
  country: string;
  wineType: string; // Resource type - can be any community asset
  color: string;
  gradient: string;
  members: number;
  treasury: number; // CORK tokens for this demo village
  emoji: string;
}

/**
 * VILLAGES - Demo implementation for Cork Collective
 * 
 * Urban Villages Vision:
 * Each village can tokenize different resources based on their community needs:
 * - Cork Collective: Wine bottles → CORK tokens
 * - Future examples: Solar panels → SOLAR tokens, Co-working spaces → WORK tokens, etc.
 * 
 * This demo showcases the wine community use case across European cities.
 */
export const VILLAGES: Village[] = [
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    wineType: 'Orange Wine',
    color: '#FF6B35',
    gradient: 'from-orange-400 to-orange-600',
    members: 47,
    treasury: 2500,
    emoji: '🍊',
  },
  {
    id: 'porto',
    name: 'Porto',
    country: 'Portugal',
    wineType: 'Port Wine',
    color: '#8B0000',
    gradient: 'from-red-700 to-red-900',
    members: 32,
    treasury: 1800,
    emoji: '🍷',
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Germany',
    wineType: 'Riesling',
    color: '#FFD700',
    gradient: 'from-yellow-400 to-yellow-600',
    members: 28,
    treasury: 1200,
    emoji: '🍋',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    wineType: 'Champagne',
    color: '#FF1493',
    gradient: 'from-pink-400 to-pink-600',
    members: 52,
    treasury: 3200,
    emoji: '🥂',
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    wineType: 'Cava',
    color: '#FF4500',
    gradient: 'from-orange-500 to-red-600',
    members: 38,
    treasury: 1950,
    emoji: '🌶️',
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    wineType: 'Chianti',
    color: '#800020',
    gradient: 'from-red-800 to-purple-900',
    members: 44,
    treasury: 2400,
    emoji: '🍇',
  },
];

export function getVillageById(id: string): Village | undefined {
  return VILLAGES.find(v => v.id === id);
}