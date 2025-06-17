import pkg from '@prisma/client'
const { PrismaClient } = pkg
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.pastry.deleteMany();

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
    }
  })

  // Créer des pâtisseries
  const pastries = await Promise.all([
    prisma.pastry.create({
      data: {
        name: 'Paris-Brest',
        description: 'Délicieux Paris-Brest garni de crème pralinée',
        price: 24.90,
        images: ['/paris-brest.jpg'],
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
        searchKeywords: ['paris brest', 'praliné', 'pâtisserie française']
      }
    }),
    prisma.pastry.create({
      data: {
        name: 'Éclair au Chocolat',
        description: 'Éclair garni de crème pâtissière au chocolat noir',
        price: 4.50,
        images: ['/eclair-chocolat.jpg'],
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
        searchKeywords: ['éclair', 'chocolat', 'pâtisserie française']
      }
    }),
    prisma.pastry.create({
      data: {
        name: 'Macaron Framboise',
        description: 'Macaron à la framboise fraîche',
        price: 2.20,
        images: ['/macaron-framboise.jpg'],
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
        searchKeywords: ['macaron', 'framboise', 'sans gluten']
      }
    })
  ])

  // Créer une promotion
  await prisma.promotion.create({
    data: {
      code: 'BIENVENUE',
      type: 'PERCENTAGE',
      maxDiscount: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      description: '10% de réduction sur votre première commande',
      usageLimit: 1000,
      isActive: true
    }
  })

  // Ajouter des items au panier de l'utilisateur
  await prisma.cartItem.create({
    data: {
      cart: {
        connect: { userId: user.id }
      },
      pastry: {
        connect: { id: pastries[0].id }
      },
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
      total: pastries[0].price + (pastries[1].price * 2) + 5, // +5€ frais de livraison
      deliveryFee: 5,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || '',
      delivery: {
        address: user.addresses[0],
        phone: user.phone,
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Livraison demain
        instructions: 'Code: 1234'
      },
      paymentMethod: 'CARD',
      estimatedReady: new Date(Date.now() + 2 * 60 * 60 * 1000), // Prêt dans 2h
      items: {
        create: [
          {
            pastryId: pastries[0].id,
            quantity: 1,
            price: pastries[0].price
          },
          {
            pastryId: pastries[1].id,
            quantity: 2,
            price: pastries[1].price
          }
        ]
      }
    }
  })

  console.log('Base de données initialisée avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
