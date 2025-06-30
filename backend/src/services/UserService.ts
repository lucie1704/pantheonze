import { prismaClient } from './PrismaService'

export class UserService {
  async getUserDietaryPreferences(userId: string): Promise<{ id: string; name: string }[]> {
    const userDiets = await prismaClient.userDiet.findMany({
      where: { userId },
      include: {
        diet: {
          select: { id: true, name: true }
        }
      }
    })
    
    return userDiets.map((ud: any) => ud.diet)
  }

  async updateUserDietaryPreferences(userId: string, dietIds: string[]): Promise<{ id: string; name: string }[]> {
    // Supprimer toutes les préférences existantes
    await prismaClient.userDiet.deleteMany({
      where: { userId }
    })

    // Ajouter les nouvelles préférences
    if (dietIds.length > 0) {
      await prismaClient.userDiet.createMany({
        data: dietIds.map(dietId => ({
          userId,
          dietId
        }))
      })
    }

    return this.getUserDietaryPreferences(userId)
  }

  async addDietaryPreference(userId: string, dietId: string): Promise<{ id: string; name: string }[]> {
    // Vérifier si la préférence existe déjà
    const existing = await prismaClient.userDiet.findUnique({
      where: {
        userId_dietId: {
          userId,
          dietId
        }
      }
    })

    if (!existing) {
      await prismaClient.userDiet.create({
        data: {
          userId,
          dietId
        }
      })
    }

    return this.getUserDietaryPreferences(userId)
  }

  async removeDietaryPreference(userId: string, dietId: string): Promise<{ id: string; name: string }[]> {
    await prismaClient.userDiet.deleteMany({
      where: {
        userId,
        dietId
      }
    })

    return this.getUserDietaryPreferences(userId)
  }

  async getAvailableDiets(): Promise<{ id: string; name: string }[]> {
    return prismaClient.diet.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  }
} 