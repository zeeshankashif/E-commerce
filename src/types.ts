export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  sizes: number[];
  category: string;
  colors: string[];
}

export interface CartItem {
  product: Product;
  selectedSize: number;
  selectedColor: string;
  quantity: number;
}

export type CategoryFilter = 'all' | 'Running' | 'Streetwear' | 'Training';

export interface UserState {
  isAuthenticated: boolean;
  email: string | null;
}
