import { prismaClient } from "@/services";

class DietService {
  public cache: Map<string | number, string | number>;
  private isInitialized: boolean;

  constructor() {
    this.cache = new Map();
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;

    const diets = await prismaClient.diet.findMany();
    diets.forEach(diet => {
      this.cache.set(diet.name, diet.id);
    });

    this.isInitialized = true;
  }

  getDietIdByName(name: string) {
    return this.cache.get(name);
  }

  async refresh() {
    this.cache.clear();
    this.isInitialized = false;
    await this.init();
  }

  addToCache(diet: { id: string | number; name: string }) {
    this.cache.set(diet.name, diet.id);
    this.cache.set(diet.id, diet.name);
  }

  removeFromCache(diet: { id: string | number; name: string }) {
    this.cache.delete(diet.name);
    this.cache.delete(diet.id);
  }
}

export const dietService = new DietService(); 