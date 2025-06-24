import { prismaClient } from "@/services";

class CategoryService {
  public cache: Map<string | number, string | number>;
  private isInitialized: boolean;

  constructor() {
    this.cache = new Map();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    const categories = await prismaClient.category.findMany();
    categories.forEach(cat => {
      this.cache.set(cat.name, cat.id);
    });

    this.isInitialized = true;
    console.log(`Cache initialized with ${categories.length} categories`);
  }

  getCategoryIdByName(name: string) {
    return this.cache.get(name);
  }

  async refresh() {
    this.cache.clear();
    this.isInitialized = false;
    await this.init();
  }

  addToCache(category: { id: string | number; name: string }) {
    this.cache.set(category.name, category.id);
    this.cache.set(category.id, category.name);
  }

  removeFromCache(category: { id: string | number; name: string }) {
    this.cache.delete(category.name);
    this.cache.delete(category.id);
  }
}

export const categoryService = new CategoryService();
