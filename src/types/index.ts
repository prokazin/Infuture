export interface Product {
  id: string;
  name: string;
  price: number;
  memory: string;
  image: string;
  images?: string[];
  description?: string;
  specifications?: Record<string, string>;
  category: string;
  inStock: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  createdAt: Date;
  address?: string;
  phone?: string;
}

export interface User {
  id: string;
  telegramId: string;
  firstName: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  orders: string[];
  favorites: string[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'popular';

export interface FilterState {
  category: string | null;
  search: string;
  sort: SortOption;
}
