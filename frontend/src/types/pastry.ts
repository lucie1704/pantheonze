export interface Pastry {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  diet?: string;
  tags: string[];
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  inStock: boolean;
  stockCount: number;
  isOnSale: boolean;
  averageRating: number;
  totalReviews: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 