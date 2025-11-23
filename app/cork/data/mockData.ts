export interface Wine {
  id: string;
  name: string;
  vineyard: string;
  vintage: string;
  village: string;
  price: number;
  corkReward: number;
  available: number;
  total: number;
  description: string;
  imageBlobId?: string;
  imageUrl: string; // Fallback for demo
}

export interface Post {
  id: string;
  author: string;
  namespace: string;
  village: string;
  text: string;
  imageBlobId?: string;
  imageUrl?: string;
  timestamp: number;
  corkEarned: number;
  likes: number;
  comments: number;
  type?: 'regular' | 'gift-bottle' | 'send-tokens' | 'purchase';
  activityData?: {
    recipient?: string;
    amount?: number;
    bottleName?: string;
    bottleImage?: string;
  };
  profilePicBlobId?: string;
}

export interface User {
  namespace: string;
  username: string;
  village: string;
  profilePicBlobId?: string;
  profilePicUrl: string;
  corkBalance: number;
  bottlesOwned: number;
  joinedAt: number;
  following: number;
  followers: number;
}

export const MOCK_WINES: Wine[] = [
  {
    id: 'lisbon-orange-1',
    name: 'Laranja do Sol 2023',
    vineyard: 'Quinta do Vale',
    vintage: '2023',
    village: 'lisbon',
    price: 45,
    corkReward: 100,
    available: 23,
    total: 50,
    description: 'Natural orange wine from Alentejo. Skin contact for 14 days.',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=600&fit=crop',
  },
  {
    id: 'porto-port-1',
    name: 'Vintage Port 2020',
    vineyard: 'Casa do Douro',
    vintage: '2020',
    village: 'porto',
    price: 85,
    corkReward: 200,
    available: 8,
    total: 25,
    description: 'Classic Porto vintage. Perfect for aging 20+ years.',
    imageUrl: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?w=400&h=600&fit=crop',
  },
  {
    id: 'berlin-riesling-1',
    name: 'Mosel Riesling 2022',
    vineyard: 'Weingut Berg',
    vintage: '2022',
    village: 'berlin',
    price: 38,
    corkReward: 80,
    available: 34,
    total: 50,
    description: 'Crisp and mineral. Perfect summer wine.',
    imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=600&fit=crop',
  },
  {
    id: 'paris-champagne-1',
    name: 'Blanc de Blancs NV',
    vineyard: 'Maison Dubois',
    vintage: 'NV',
    village: 'paris',
    price: 120,
    corkReward: 300,
    available: 12,
    total: 30,
    description: '100% Chardonnay. Elegant bubbles.',
    imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=600&fit=crop',
  },
  {
    id: 'barcelona-cava-1',
    name: 'Gran Reserva 2019',
    vineyard: 'Bodega Catalana',
    vintage: '2019',
    village: 'barcelona',
    price: 52,
    corkReward: 120,
    available: 19,
    total: 40,
    description: 'Traditional method. 36 months on lees.',
    imageUrl: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&h=600&fit=crop',
  },
  {
    id: 'rome-chianti-1',
    name: 'Chianti Classico 2021',
    vineyard: 'Fattoria Toscana',
    vintage: '2021',
    village: 'rome',
    price: 42,
    corkReward: 95,
    available: 27,
    total: 50,
    description: 'Sangiovese with hints of cherry and tobacco.',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=600&fit=crop',
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Maria',
    namespace: 'maria.lisbon',
    village: 'lisbon',
    text: 'Just opened Bottle #47! This orange wine is absolutely stunning 🍊✨',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    corkEarned: 10,
    likes: 23,
    comments: 5,
    type: 'regular',
  },
  {
    id: '1.5',
    author: 'João',
    namespace: 'joao.porto',
    village: 'porto',
    text: '🎁 Gifted a special bottle to celebrate their birthday!',
    timestamp: Date.now() - 1000 * 60 * 25, // 25 mins ago
    corkEarned: 0,
    likes: 18,
    comments: 3,
    type: 'gift-bottle',
    activityData: {
      recipient: 'maria.lisbon',
      bottleName: '2021 Amphora Orange',
      bottleImage: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=200',
    },
  },
  {
    id: '2',
    author: 'Pedro',
    namespace: 'pedro.porto',
    village: 'porto',
    text: 'Visiting the Douro Valley today. The vineyards are breathtaking! 🍷',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    corkEarned: 15,
    likes: 38,
    comments: 8,
    type: 'regular',
  },
  {
    id: '2.5',
    author: 'Sophie',
    namespace: 'sophie.paris',
    village: 'paris',
    text: '✨ Sent some CORK tokens to support village initiatives',
    timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
    corkEarned: 0,
    likes: 12,
    comments: 2,
    type: 'send-tokens',
    activityData: {
      recipient: 'carlos.lisbon',
      amount: 100,
    },
  },
  {
    id: '3',
    author: 'Sophie',
    namespace: 'sophie.berlin',
    village: 'berlin',
    text: 'Berlin Cork Collective meetup tonight! Who\'s coming? 🎉',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    corkEarned: 20,
    likes: 45,
    comments: 12,
    type: 'regular',
  },
  {
    id: '3.5',
    author: 'Carlos',
    namespace: 'carlos.lisbon',
    village: 'lisbon',
    text: '🛍️ Just purchased a rare bottle from the village shop!',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=400&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 150, // 2.5 hours ago
    corkEarned: 280,
    likes: 31,
    comments: 6,
    type: 'purchase',
    activityData: {
      bottleName: '2023 Orange Skin Contact',
      bottleImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200',
    },
  },
  {
    id: '4',
    author: 'Amélie',
    namespace: 'amelie.paris',
    village: 'paris',
    text: 'Celebrating Bottle #100 with champagne! 🥂 Thank you Cork Collective!',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    corkEarned: 25,
    likes: 67,
    comments: 15,
    type: 'regular',
  },
  {
    id: '5',
    author: 'Carlos',
    namespace: 'carlos.barcelona',
    village: 'barcelona',
    text: 'Just minted my first NFT bottle! The provenance feature is incredible 🔥',
    timestamp: Date.now() - 1000 * 60 * 240, // 4 hours ago
    corkEarned: 30,
    likes: 52,
    comments: 9,
    type: 'regular',
  },
  {
    id: '6',
    author: 'Giovanni',
    namespace: 'giovanni.rome',
    village: 'rome',
    text: 'Chianti Classico pairs perfectly with pasta! What\'s your favorite pairing? 🍝',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 300, // 5 hours ago
    corkEarned: 12,
    likes: 41,
    comments: 18,
    type: 'regular',
  },
];

export const MOCK_USER: User = {
  namespace: 'maria.lisbon',
  username: 'maria',
  village: 'lisbon',
  profilePicUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  corkBalance: 1247,
  bottlesOwned: 12,
  joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
  following: 34,
  followers: 52,
};

export function getWinesByVillage(villageId: string): Wine[] {
  return MOCK_WINES.filter(w => w.village === villageId);
}