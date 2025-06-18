import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

const PASTRIES_IMAGES = {
  parisBrest: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=800&h=600&fit=crop',
  eclair: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=800&h=600&fit=crop',
}

async function main() {
  // Clean existing data
  console.log('🧹 Nettoyage de la base de données...')

  // Supprimer dans l'ordre pour respecter les relations
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.promotion.deleteMany()
  await prisma.pastry.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Base de données nettoyée')

  // Créer un utilisateur de test
  const hashedPassword = await hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'John Doe',
      phone: '+33612345678',
      addresses: ['123 Rue de la Pâtisserie, 75001 Paris'],
      preferences: {
        favoriteCategories: ['Gâteaux', 'Viennoiseries'],
        dietaryRestrictions: ['Sans gluten']
      },
      cart: {
        create: {
          updatedAt: new Date()
        }
      }
    },
    include: {
      cart: true
    }
  })

  // Créer des pâtisseries avec images Unsplash
  const pastries = await Promise.all([
    prisma.pastry.create({
      data: {
        name: 'Paris-Brest',
        description: 'Délicieux Paris-Brest garni de crème pralinée',
        price: 24.90,
        images: [PASTRIES_IMAGES.parisBrest],
        category: 'Gâteaux',
        subCategory: 'Classiques',
        tags: ['Populaire', 'Traditionnel'],
        ingredients: ['Pâte à choux', 'Crème pralinée', 'Amandes effilées'],
        nutrition: {
          calories: 385,
          protein: 7.5,
          carbs: 42.3,
          fat: 21.8,
          allergens: ['fruits à coque', 'gluten', 'œufs', 'lait']
        },
        stockCount: 10,
        availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        preparationTime: 20,
        slug: 'paris-brest',
        searchKeywords: ['paris brest', 'praliné', 'pâtisserie française'],
      }
    }),
    prisma.pastry.create({
      data: {
        name: 'Éclair au Chocolat',
        description: 'Éclair garni de crème pâtissière au chocolat noir',
        price: 4.50,
        images: [PASTRIES_IMAGES.eclair],
        category: 'Éclairs',
        tags: ['Classique', 'Chocolat'],
        ingredients: ['Pâte à choux', 'Crème pâtissière au chocolat', 'Glaçage chocolat'],
        nutrition: {
          calories: 265,
          protein: 5.2,
          carbs: 28.4,
          fat: 15.6,
          allergens: ['gluten', 'œufs', 'lait']
        },
        stockCount: 25,
        availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        preparationTime: 15,
        slug: 'eclair-chocolat',
        searchKeywords: ['éclair', 'chocolat', 'pâtisserie française'],
      }
    }),
    prisma.pastry.create({
      data: {
        name: 'Macaron Framboise',
        description: 'Macaron à la framboise fraîche',
        price: 2.20,
        images: [],
        category: 'Macarons',
        tags: ['Fruit rouge', 'Sans gluten'],
        ingredients: ['Poudre d\'amande', 'Blanc d\'œuf', 'Framboise'],
        nutrition: {
          calories: 120,
          protein: 3.2,
          carbs: 18.5,
          fat: 6.8,
          allergens: ['fruits à coque', 'œufs']
        },
        stockCount: 50,
        availableDays: ['Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
        preparationTime: 10,
        slug: 'macaron-framboise',
        searchKeywords: ['macaron', 'framboise', 'sans gluten'],
      }
    })
  ])

  // Créer une promotion
  await prisma.promotion.create({
    data: {
      title: 'Bienvenue !',
      description: '10% de réduction sur votre première commande',
      type: 'PERCENTAGE',
      discountValue: 10,
      minimumOrder: 0,
      maxUses: 1000,
      usedCount: 0,
      pastryIds: [pastries[0].id, pastries[1].id],
      categories: ['Gâteaux', 'Éclairs'],
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      code: 'BIENVENUE',
      isActive: true
    }
  })

  // Ajouter des items au panier de l'utilisateur
  if (!user.cart) {
    throw new Error('Cart not created for user')
  }

  await prisma.cartItem.create({
    data: {
      cartId: user.cart.id,
      pastryId: pastries[0].id,
      quantity: 1,
      price: pastries[0].price,
      addedAt: new Date()
    }
  })

  // Créer une commande de test
  await prisma.order.create({
    data: {
      userId: user.id,
      subtotal: pastries[0].price + (pastries[1].price * 2),
      taxAmount: 0,
      deliveryFee: 5,
      discount: 0,
      total: pastries[0].price + (pastries[1].price * 2) + 5,
      status: 'PENDING',
      delivery: {
        address: user.addresses[0],
        phone: user.phone,
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        instructions: 'Code: 1234'
      },
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || '',
      paymentMethod: 'CARD',
      paymentStatus: 'PENDING',
      estimatedReady: new Date(Date.now() + 2 * 60 * 60 * 1000),
      items: {
        create: [
          {
            pastryId: pastries[0].id,
            quantity: 1,
            price: pastries[0].price,
            name: pastries[0].name
          },
          {
            pastryId: pastries[1].id,
            quantity: 2,
            price: pastries[1].price,
            name: pastries[1].name
          }
        ]
      }
    }
  })

  console.log('✅ Base de données initialisée avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })