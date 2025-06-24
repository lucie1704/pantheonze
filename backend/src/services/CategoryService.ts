import { prismaClient } from "@/services";

class CategoryService {
  constructor() {
    this.cache = new Map();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    const categories = await prismaClient.category.findMany();
    categories.forEach(cat => {
      this.cache.set(cat.name, cat.id);
      this.cache.set(cat.id, cat.name); // Reverse lookup aussi
    });

    this.isInitialized = true;
    console.log(`Cache initialized with ${categories.length} categories`);
  }

  getCategoryIdByName(name) {
    return this.cache.get(name);
  }

  getCategoryNameById(id) {
    return this.cache.get(id);
  }

  async refresh() {
    this.cache.clear();
    this.isInitialized = false;
    await this.init();
  }

  // Méthodes pour maintenir le cache
  addToCache(category) {
    this.cache.set(category.name, category.id);
    this.cache.set(category.id, category.name);
  }

  removeFromCache(category) {
    this.cache.delete(category.name);
    this.cache.delete(category.id);
  }
}

export const categoryService = new CategoryService();
