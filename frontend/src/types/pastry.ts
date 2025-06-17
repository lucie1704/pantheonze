export interface Pastry {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subCategory: string;
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
  originalPrice?: number;
  isOnSale: boolean;
  saleEndDate?: Date;
  averageRating: number;
  totalReviews: number;
  availableDays: string[];
  preparationTime: number;
  slug: string;
  isActive: boolean;
  featuredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 